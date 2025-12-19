import pytest
from validators import validate_book, validate_member

def test_validate_book_success():
    validate_book("Clean Code", "Robert Martin")

def test_validate_book_empty_title():
    with pytest.raises(ValueError):
        validate_book("   ", "Author")

def test_validate_member_success():
    validate_member("John", "john@test.com")

def test_validate_member_empty_email():
    with pytest.raises(ValueError):
        validate_member("John", "   ")
