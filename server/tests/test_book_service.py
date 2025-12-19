import grpc
import psycopg2
import pytest
from services.book_service import BookService

class DummyContext:
    def abort(self, code, message):
        raise grpc.RpcError(message)

def test_create_book_duplicate(mocker):
    service = BookService()
    context = DummyContext()

    mock_conn = mocker.Mock()

    mock_cursor = mocker.Mock()
    mock_cursor_ctx = mocker.MagicMock()
    mock_cursor_ctx.__enter__.return_value = mock_cursor
    mock_conn.cursor.return_value = mock_cursor_ctx

    # Mock IntegrityError with pgcode
    error = mocker.Mock(spec=psycopg2.IntegrityError)
    error.pgcode = "23505"
    mock_cursor.execute.side_effect = error

    mocker.patch(
        "services.book_service.get_connection",
        return_value=mock_conn
    )

    request = mocker.Mock(
        title="Book",
        author="Author",
        isbn="123"
    )

    with pytest.raises(grpc.RpcError):
        service.CreateBook(request, context)
