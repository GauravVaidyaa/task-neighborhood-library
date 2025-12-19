import sys
import os

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
)

import grpc
import library_pb2
import library_pb2_grpc

def test_borrow_flow():
    channel = grpc.insecure_channel("localhost:50051")
    stub = library_pb2_grpc.LibraryServiceStub(channel)

    # Create member
    stub.CreateMember(
        library_pb2.CreateMemberRequest(
            name="Test User",
            email="test@integration.com",
            phone="123"
        )
    )


    # Create book
    stub.CreateBook(
        library_pb2.CreateBookRequest(
            title="Integration Book",
            author="Tester",
            isbn="INT-123"
        )
    )


    # Borrow book
    response = stub.BorrowBook(
        library_pb2.BorrowBookRequest(
            book_id=1,
            member_id=1
        )
    )

    assert "borrowed" in response.message.lower()
