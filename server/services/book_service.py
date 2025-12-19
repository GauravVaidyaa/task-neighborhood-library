import psycopg2
import grpc
import library_pb2
from db import get_connection
from logger import logger
from validators import validate_book
from constants import (
    BOOK_CREATED,
    BOOK_UPDATED,
    BOOK_DELETED,
    BOOK_NOT_FOUND,
    ERR_INTERNAL,
    BOOK_CREATED_ERROR,
    BOOK_LIST_LOG_MSG,
    BOOK_LIST_ERROR,
    BOOK_LIST_FAILED,
    BOOK_UPDATED_ERROR,
    BOOK_UPDATED_FAILED,
    BOOK_DELETED_ERROR,
    BOOK_DELETED_FAILED,
    BOOK_ALREADY_EXISTS,
    PG_DUPLICATE_KEY_VALUE
)

class BookService:

    def CreateBook(self, request, context):
        logger.info(
            f"CreateBook called | title='{request.title}' author='{request.author}'"
        )

        try:
            validate_book(request.title, request.author)
        except ValueError as e:
            logger.warning(f"CreateBook validation failed: {e}")
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, str(e))

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO books (title, author, isbn) VALUES (%s, %s, %s)",
                    (request.title.strip(), request.author.strip(), request.isbn)
                )

            conn.commit()
            logger.info(BOOK_CREATED)

            return library_pb2.MessageResponse(
                message=BOOK_CREATED
            )
        
        except psycopg2.IntegrityError as e:
            if conn:
                conn.rollback()

            # Duplicate book (ISBN or title+author)
            if e.pgcode == PG_DUPLICATE_KEY_VALUE:
                context.abort(
                    grpc.StatusCode.ALREADY_EXISTS,
                    BOOK_ALREADY_EXISTS
                )

            logger.error(BOOK_CREATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                ERR_INTERNAL
            )

        except Exception:
            if conn:
                conn.rollback()
            logger.error(BOOK_CREATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                ERR_INTERNAL
            )

        finally:
            if conn:
                conn.close()

    def ListBooks(self, request, context):
        logger.info(BOOK_LIST_LOG_MSG)

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, title, author FROM books ORDER BY id"
                )
                rows = cur.fetchall()

            books = [
                library_pb2.Book(
                    id=r[0],
                    title=r[1],
                    author=r[2]
                )
                for r in rows
            ]

            return library_pb2.BooksResponse(books=books)

        except Exception:
            logger.error(BOOK_LIST_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_LIST_FAILED
            )

        finally:
            if conn:
                conn.close()

    def UpdateBook(self, request, context):
        logger.info(f"UpdateBook called | id={request.id}")

        try:
            validate_book(request.title, request.author)
        except ValueError as e:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, str(e))

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE books
                    SET title=%s, author=%s
                    WHERE id=%s
                    """,
                    (request.title.strip(), request.author.strip(), request.id)
                )

                if cur.rowcount == 0:
                    context.abort(
                        grpc.StatusCode.NOT_FOUND,
                        BOOK_NOT_FOUND
                    )

            conn.commit()
            logger.info(BOOK_UPDATED)

            return library_pb2.MessageResponse(
                message=BOOK_UPDATED
            )

        except grpc.RpcError:
            raise

        except Exception:
            logger.error(BOOK_UPDATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_UPDATED_FAILED
            )

        finally:
            if conn:
                conn.close()

    def DeleteBook(self, request, context):
        logger.info(f"DeleteBook called | id={request.id}")

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM books WHERE id=%s",
                    (request.id,)
                )

                if cur.rowcount == 0:
                    context.abort(
                        grpc.StatusCode.NOT_FOUND,
                        BOOK_NOT_FOUND
                    )

            conn.commit()
            logger.info(BOOK_DELETED)

            return library_pb2.MessageResponse(
                message=BOOK_DELETED
            )

        except grpc.RpcError:
            raise

        except Exception:
            logger.error(BOOK_DELETED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                BOOK_DELETED_FAILED
            )

        finally:
            if conn:
                conn.close()
