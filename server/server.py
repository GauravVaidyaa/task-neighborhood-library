import grpc
from concurrent import futures
import library_pb2
import library_pb2_grpc
from db import get_connection
from logger import logger
from validators import validate_book
from services import BookService, MemberService, BorrowService

class LibraryService(library_pb2_grpc.LibraryServiceServicer):

    def __init__(self):
        self.book_service = BookService()
        self.member_service = MemberService()
        self.borrow_service = BorrowService()

    def CreateBook(self, request, context):
        return self.book_service.CreateBook(request, context)
    
    def ListBooks(self, request, context):
        return self.book_service.ListBooks(request, context)
    
    def UpdateBook(self, request, context):
        return self.book_service.UpdateBook(request, context)

    def DeleteBook(self, request, context):
        return self.book_service.DeleteBook(request, context)

    def CreateMember(self, request, context):
        return self.member_service.CreateMember(request, context)

    def ListMembers(self, request, context):
        return self.member_service.ListMembers(request, context)

    def UpdateMember(self, request, context):
        return self.member_service.UpdateMember(request, context)

    def DeleteMember(self, request, context):
        return self.member_service.DeleteMember(request, context)

    def BorrowBook(self, request, context):
        return self.borrow_service.BorrowBook(request, context)

    def ReturnBook(self, request, context):
        return self.borrow_service.ReturnBook(request, context)

    def ListBorrowedBooks(self, request, context):
        return self.borrow_service.ListBorrowedBooks(request, context)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    library_pb2_grpc.add_LibraryServiceServicer_to_server(
        LibraryService(), server
    )
    server.add_insecure_port("[::]:50051")
    server.start()
    logger.info("gRPC Server running on port 50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
