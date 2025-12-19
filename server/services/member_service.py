import psycopg2
import grpc
import library_pb2
from db import get_connection
from logger import logger
from validators import validate_member
from constants import (
    MEMBER_CREATED,
    MEMBER_UPDATED,
    MEMBER_DELETED,
    MEMBER_NOT_FOUND,
    ERR_INTERNAL,
    MEMBER_CREATED_ERROR,
    MEMBER_CREATED_FAILED,
    MEMBER_LIST_LOG_MSG,
    MEMBER_LIST_ERROR,
    MEMBER_LIST_FAILED,
    MEMBER_UPDATED_ERROR,
    MEMBER_UPDATED_FAILED,
    MEMBER_DELETED_ERROR,
    MEMBER_DELETED_FAILED,
    MEMBER_ACTIVE_BORROWED,
    MEMBER_ALREADY_EXISTS,
    PG_DUPLICATE_KEY_VALUE
)

class MemberService:

    def CreateMember(self, request, context):
        logger.info(
            f"CreateMember called | name='{request.name}' email='{request.email}'"
        )

        try:
            validate_member(request.name, request.email)
        except ValueError as e:
            logger.warning(f"CreateMember validation failed: {e}")
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, str(e))

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO members (name, email, phone)
                    VALUES (%s, %s, %s)
                    """,
                    (
                        request.name.strip(),
                        request.email.strip(),
                        request.phone.strip() if request.phone else None,
                    )
                )

            conn.commit()
            logger.info(MEMBER_CREATED)

            return library_pb2.MessageResponse(
                message=MEMBER_CREATED
            )

        except psycopg2.IntegrityError as e:
            if conn:
                conn.rollback()

            # Duplicate email
            if e.pgcode == PG_DUPLICATE_KEY_VALUE:
                context.abort(
                    grpc.StatusCode.ALREADY_EXISTS,
                    MEMBER_ALREADY_EXISTS
                )

            logger.error(MEMBER_CREATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                ERR_INTERNAL
            )

        except Exception:
            if conn:
                conn.rollback()
            logger.error(MEMBER_CREATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                MEMBER_CREATED_FAILED
            )

        finally:
            if conn:
                conn.close()

    def ListMembers(self, request, context):
        logger.info(MEMBER_LIST_LOG_MSG)

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, name, email, phone FROM members ORDER BY id"
                )
                rows = cur.fetchall()

            members = [
                library_pb2.Member(
                    id=r[0],
                    name=r[1],
                    email=r[2],
                    phone=r[3] or ""
                )
                for r in rows
            ]

            return library_pb2.MembersResponse(members=members)

        except Exception:
            logger.error(MEMBER_LIST_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                MEMBER_LIST_FAILED
            )

        finally:
            if conn:
                conn.close()

    def UpdateMember(self, request, context):
        logger.info(f"UpdateMember called | id={request.id}")

        try:
            validate_member(request.name, request.email)
        except ValueError as e:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, str(e))

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE members
                    SET name=%s, email=%s, phone=%s
                    WHERE id=%s
                    """,
                    (
                        request.name.strip(),
                        request.email.strip(),
                        request.phone.strip() if request.phone else None,
                        request.id,
                    )
                )

                if cur.rowcount == 0:
                    context.abort(
                        grpc.StatusCode.NOT_FOUND,
                        MEMBER_NOT_FOUND
                    )

            conn.commit()
            logger.info(MEMBER_UPDATED)

            return library_pb2.MessageResponse(
                message=MEMBER_UPDATED
            )

        except grpc.RpcError:
            raise

        except Exception:
            logger.error(MEMBER_UPDATED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                MEMBER_UPDATED_FAILED
            )

        finally:
            if conn:
                conn.close()

    def DeleteMember(self, request, context):
        logger.info(f"DeleteMember called | id={request.id}")

        conn = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                # Check active borrowings
                cur.execute(
                    """
                    SELECT 1
                    FROM borrowings
                    WHERE member_id = %s
                    AND returned_at IS NULL
                    """,
                    (request.id,)
                )

                if cur.fetchone():
                    context.abort(
                        grpc.StatusCode.FAILED_PRECONDITION,
                        MEMBER_ACTIVE_BORROWED
                    )

                cur.execute(
                    "DELETE FROM members WHERE id=%s",
                    (request.id,)
                )

                if cur.rowcount == 0:
                    context.abort(
                        grpc.StatusCode.NOT_FOUND,
                        MEMBER_NOT_FOUND
                    )

            conn.commit()
            logger.info(MEMBER_DELETED)

            return library_pb2.MessageResponse(
                message=MEMBER_DELETED
            )

        except grpc.RpcError:
            raise

        except Exception:
            logger.error(MEMBER_DELETED_ERROR, exc_info=True)
            context.abort(
                grpc.StatusCode.INTERNAL,
                MEMBER_DELETED_FAILED
            )

        finally:
            if conn:
                conn.close()
