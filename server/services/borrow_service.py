import grpc
import psycopg2
from psycopg2 import errors
import library_pb2
from db import get_connection
from logger import logger
from constants import (
    BOOK_BORROWED,
    BOOK_RETURNED,
    BOOK_NOT_AVAILABLE,
    BOOK_NOT_BORROWED,
    BOOK_NOT_FOUND,
    ERR_INTERNAL,
    BOOK_BORROWED_ERROR,
    BOOK_RETURNED_FAILED,
    BOOK_BORROWED_FAILED,
    BOOK_RETURNED_ERROR,
    BOOK_BORROWED_LIST_ERROR,
    BOOK_BORROWED_LIST_FAILED,
    BOOK_ALREADY_BORROWED,
    PG_DUPLICATE_KEY_VALUE,
    INTEGRITY_LOG_ERROR
)


class BorrowService:

    def BorrowBook(self, request, context):
        logger.info(
            f"BorrowBook called | book_id={request.book_id}, member_id={request.member_id}"
        )

        conn = None
        try:
            conn = get_connection()
            conn.autocommit = False

            with conn.cursor() as cur:
                # Ensure book exists & lock row
                cur.execute(
                    "SELECT id FROM books WHERE id=%s FOR UPDATE",
                    (request.book_id,)
                )
                if not cur.fetchone():
                    context.abort(
                        grpc.StatusCode.NOT_FOUND,
                        BOOK_NOT_FOUND
                    )

                # Try insert (DB enforces single active borrow)
                cur.execute(
                    """
                    INSERT INTO borrowings (book_id, member_id)
                    VALUES (%s, %s)
                    """,
                    (request.book_id, request.member_id)
                )

                cur.execute(
                    "UPDATE books SET is_available=false WHERE id=%s",
                    (request.book_id,)
                )

            conn.commit()
            return library_pb2.MessageResponse(message=BOOK_BORROWED)

        except psycopg2.IntegrityError as e:
            if conn:
                conn.rollback()

            if e.pgcode == PG_DUPLICATE_KEY_VALUE:
                context.abort(
                    grpc.StatusCode.FAILED_PRECONDITION,
                    BOOK_ALREADY_BORROWED
                )

            logger.error(INTEGRITY_LOG_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                ERR_INTERNAL)

        except grpc.RpcError:
            if conn:
                conn.rollback()
            raise

        except Exception:
            if conn:
                conn.rollback()

            logger.error(BOOK_BORROWED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_BORROWED_FAILED
            )

        finally:
            if conn:
                conn.close()

    def ReturnBook(self, request, context):
        logger.info(
            f"ReturnBook called | book_id={request.book_id}"
        )

        conn = None
        try:
            conn = get_connection()
            conn.autocommit = False

            with conn.cursor() as cur:
                # Mark borrowing as returned
                cur.execute(
                    """
                    UPDATE borrowings
                    SET returned_at = CURRENT_TIMESTAMP
                    WHERE book_id = %s
                      AND returned_at IS NULL
                    """,
                    (request.book_id,)
                )

                if cur.rowcount == 0:
                    context.abort(
                        grpc.StatusCode.FAILED_PRECONDITION,
                        BOOK_NOT_BORROWED
                    )

                # Mark book available again
                cur.execute(
                    """
                    UPDATE books
                    SET is_available = true
                    WHERE id = %s
                    """,
                    (request.book_id,)
                )

            conn.commit()
            logger.info(BOOK_RETURNED)

            return library_pb2.MessageResponse(
                message=BOOK_RETURNED
            )

        except grpc.RpcError:
            raise

        except Exception:
            if conn:
                conn.rollback()
            logger.error(BOOK_RETURNED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_RETURNED_FAILED
            )

        finally:
            if conn:
                conn.close()

    def ListBorrowedBooks(self, request, context):
        logger.info(
            f"ListBorrowedBooks called | member_id={request.member_id}"
        )

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT b.id, b.title, b.author
                    FROM books b
                    JOIN borrowings br ON b.id = br.book_id
                    WHERE br.member_id = %s
                      AND br.returned_at IS NULL
                    """,
                    (request.member_id,)
                )

                rows = cur.fetchall()

            books = [
                library_pb2.Book(
                    id=row[0],
                    title=row[1],
                    author=row[2]
                )
                for row in rows
            ]

            return library_pb2.BorrowedBooksResponse(
                books=books
            )

        except Exception:
            logger.error(BOOK_BORROWED_LIST_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_BORROWED_LIST_FAILED
            )

        finally:
            if conn:
                conn.close()
