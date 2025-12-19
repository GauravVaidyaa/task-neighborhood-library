from constants import (
    TITLE_REQUIRED,
    AUTHOR_REQUIRED,
    NAME_REQUIRED,
    EMAIL_REQUIRED
)

def is_empty(value: str) -> bool:
    return not value or not value.strip()

def validate_book(title: str, author: str):
    if is_empty(title):
        raise ValueError(TITLE_REQUIRED)
    if is_empty(author):
        raise ValueError(AUTHOR_REQUIRED)

def validate_member(name: str, email: str):
    if is_empty(name):
        raise ValueError(NAME_REQUIRED)
    if is_empty(email):
        raise ValueError(EMAIL_REQUIRED)
