import grpc
import psycopg2
import pytest
from services.borrow_service import BorrowService

class DummyContext:
    def abort(self, code, message):
        raise grpc.RpcError(message)

def test_borrow_book_already_borrowed(mocker):
    service = BorrowService()
    context = DummyContext()

    mock_conn = mocker.Mock()

    mock_cursor = mocker.Mock()
    mock_cursor.fetchone.return_value = (True,)  # book is available

    mock_cursor_ctx = mocker.MagicMock()
    mock_cursor_ctx.__enter__.return_value = mock_cursor
    mock_cursor_ctx.__exit__.return_value = None

    mock_conn.cursor.return_value = mock_cursor_ctx

    error = mocker.Mock(spec=psycopg2.IntegrityError)
    error.pgcode = "23505"
    mock_cursor.execute.side_effect = error

    mocker.patch(
        "services.borrow_service.get_connection",
        return_value=mock_conn
    )

    request = mocker.Mock(book_id=1, member_id=1)

    with pytest.raises(grpc.RpcError):
        service.BorrowBook(request, context)
