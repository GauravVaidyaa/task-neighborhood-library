CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrowings (
  id SERIAL PRIMARY KEY,
  book_id INT NOT NULL,
  member_id INT NOT NULL,
  borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  returned_at TIMESTAMP
);

-- Foreign Keys (correct on first creation)
ALTER TABLE borrowings
ADD CONSTRAINT fk_borrowings_book
FOREIGN KEY (book_id)
REFERENCES books(id)
ON DELETE RESTRICT;

ALTER TABLE borrowings
ADD CONSTRAINT fk_borrowings_member
FOREIGN KEY (member_id)
REFERENCES members(id)
ON DELETE RESTRICT;

-- Prevent multiple active borrows for same book
CREATE UNIQUE INDEX unique_active_borrow
ON borrowings (book_id)
WHERE returned_at IS NULL;

CREATE UNIQUE INDEX unique_book_title_author
ON books (LOWER(title), LOWER(author));


-- Checks
ALTER TABLE books
ADD CONSTRAINT chk_books_is_available
CHECK (is_available IN (true, false));

-- Indexes
CREATE INDEX idx_books_is_available
ON books (is_available);

CREATE INDEX idx_borrowings_member_id
ON borrowings (member_id);

CREATE INDEX idx_borrowings_book_id
ON borrowings (book_id);
