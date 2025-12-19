export const MESSAGES = {
    COMMON: {
      SUCCESS : "success",
      ERROR: "error",
      REQUIRED: "This field is required",
      INVALID_INPUT: "Invalid input",
      FAILED_TO_LOAD_DATA: "Failed to load data",
      SOMETHING_WENT_WRONG: "Something went wrong. Please try again",
    },
  
    MEMBER: {
      NAME_REQUIRED: "Name is required",
      NAME_INVALID: "Name can contain only letters and spaces",
  
      EMAIL_REQUIRED: "Email is required",
      EMAIL_INVALID: "Please enter a valid email address",

      NAME_AND_EMAIL_REQUIRED: "Name and Email are required",
  
      PHONE_INVALID: "Phone number must contain only digits (10–15)",
  
      CREATED_SUCCESS: "Member created successfully",
      UPDATED_SUCCESS: "Member updated successfully",
      DELETE_SUCCESS: "Member deleted successfully",
      ALREADY_EXISTS: "Member already exists",
      FAILED_TO_LOAD_MEMBERS: "Failed to load members",
      FAILED_TO_CREATE_MEMBER: "Failed to create member",
      FAILED_TO_UPDATE_MEMBER: "Failed to update member",
      CANNOT_DELETE_MEMBER: "Cannot delete member"
    },
  
    BOOK: {
      TITLE_REQUIRED: "Title is required",
      AUTHOR_REQUIRED: "Author is required",
      TITLE_AND_AUTHOR_REQUIRED: "Title and Author are required",
      TITLE_NAME_INVALID: "Title can contain only letters and spaces",
      AUTHOR_NAME_INVALID: "Author name can contain only letters and spaces",
      TITLE_INVALID: "Title cannot be empty or whitespace",
      AUTHOR_INVALID: "Author cannot be empty or whitespace",
      CREATED_SUCCESS: "Book created successfully",
      FAILED_TO_ADD: "Failed to add book",
      FAILED_TO_LOAD_BOOKS: "Failed to load books",
      UPDATED_SUCCESS: "Book updated successfully",
      FAILED_TO_UPDATE: "Failed to update book",
      DELETE_SUCCESS: "Book deleted successfully",
      FAILED_TO_DELETE_BOOK: "Failed to delete book",
      ALREADY_EXISTS: "Book already exists",
    },
  
    BORROW: {
      MEMBER_REQUIRED: "Member is required",
      BOOK_REQUIRED: "Book is required",
      MEMBER_AND_BOOK_SELECTION_REQUIRED: "Member and Book selection is required",
  
      BORROW_SUCCESS: "Book borrowed successfully",
      RETURN_SUCCESS: "Book returned successfully",
    
      
      FAILED_TO_LOAD_BORROWED_BOOKS: "Failed to load borrowed books",
      FAILED_TO_RETURN_BOOK: "Failed to return book",
      FAILED_BORROW: "Borrow failed",
      FAILED_RETURN: "Return failed",
      BOOK_NOT_AVAILABLE: "Book is not available",
      BOOK_ALREADY_BORROWED: "Book already borrowed",
      BOOK_NOT_BORROWED: "Book is not currently borrowed",
      BOOK_SELECTION_REQUIRED: "Book selection is required"
    },
  };
  