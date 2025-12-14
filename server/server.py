import grpc
from concurrent import futures
import library_pb2
import library_pb2_grpc
from db import get_connection


class LibraryService(library_pb2_grpc.LibraryServiceServicer):

    def CreateBook(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO books (title, author, isbn) VALUES (%s, %s, %s)",
            (request.title, request.author, request.isbn)
        )

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(
            message="Book created successfully"
        )
    
    def ListBooks(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, title, author FROM books ORDER BY id")
        rows = cur.fetchall()

        books = [
            library_pb2.Book(id=r[0], title=r[1], author=r[2])
            for r in rows
        ]

        cur.close()
        conn.close()

        return library_pb2.BooksResponse(books=books)
    
    def UpdateBook(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE books
            SET title=%s, author=%s
            WHERE id=%s
            """,
            (request.title, request.author, request.id)
        )

        if cur.rowcount == 0:
            context.abort(grpc.StatusCode.NOT_FOUND, "Book not found")

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(message="Book updated successfully")

    def DeleteBook(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM books WHERE id=%s", (request.id,))
        conn.commit()

        cur.close()
        conn.close()

        return library_pb2.MessageResponse(message="Book deleted")


    def CreateMember(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO members (name, email, phone) VALUES (%s, %s, %s)",
            (request.name, request.email, request.phone)
        )

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(
            message="Member created successfully"
        )

    def ListMembers(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, name, email, phone FROM members ORDER BY id")
        rows = cur.fetchall()

        members = [
            library_pb2.Member(
                id=r[0], name=r[1], email=r[2], phone=r[3] or ""
            )
            for r in rows
        ]

        cur.close()
        conn.close()

        return library_pb2.MembersResponse(members=members)
    
    def UpdateMember(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE members
            SET name=%s, email=%s, phone=%s
            WHERE id=%s
            """,
            (request.name, request.email, request.phone, request.id)
        )

        if cur.rowcount == 0:
            context.abort(grpc.StatusCode.NOT_FOUND, "Member not found")

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(message="Member updated successfully")

    def DeleteMember(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("DELETE FROM members WHERE id=%s", (request.id,))
        conn.commit()

        cur.close()
        conn.close()

        return library_pb2.MessageResponse(message="Member deleted")


    def BorrowBook(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT is_available FROM books WHERE id=%s",
            (request.book_id,)
        )
        book = cur.fetchone()

        if not book or not book[0]:
            context.abort(
                grpc.StatusCode.FAILED_PRECONDITION,
                "Book not available"
            )

        cur.execute(
            "INSERT INTO borrowings (book_id, member_id) VALUES (%s, %s)",
            (request.book_id, request.member_id)
        )

        cur.execute(
            "UPDATE books SET is_available=false WHERE id=%s",
            (request.book_id,)
        )

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(
            message="Book borrowed successfully"
        )

    def ReturnBook(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            UPDATE borrowings
            SET returned_at = CURRENT_TIMESTAMP
            WHERE book_id = %s AND returned_at IS NULL
            """,
            (request.book_id,)
        )

        cur.execute(
            "UPDATE books SET is_available=true WHERE id=%s",
            (request.book_id,)
        )

        conn.commit()
        cur.close()
        conn.close()

        return library_pb2.MessageResponse(
            message="Book returned successfully"
        )

    def ListBorrowedBooks(self, request, context):
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT b.id, b.title, b.author
            FROM books b
            JOIN borrowings br ON b.id = br.book_id
            WHERE br.member_id = %s AND br.returned_at IS NULL
            """,
            (request.member_id,)
        )

        rows = cur.fetchall()
        books = []

        for row in rows:
            books.append(
                library_pb2.Book(
                    id=row[0],
                    title=row[1],
                    author=row[2]
                )
            )

        cur.close()
        conn.close()

        return library_pb2.BorrowedBooksResponse(books=books)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    library_pb2_grpc.add_LibraryServiceServicer_to_server(
        LibraryService(), server
    )
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC Server running on port 50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
