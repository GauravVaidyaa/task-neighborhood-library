const client = require("../grpc/libraryClient");
const logger = require("../logger");
const { mapGrpcErrorToHttp } = require("../utils/grpcErrorMapper");

/**
 * Borrow Book
 */
exports.borrowBook = async (req, res) => {
  try {
    const response = await client.BorrowBook(req.body);
    return res.json(response);
  } catch (err) {
    logger.error("BorrowBook failed", {
      route: "POST /borrow",
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * Return Book
 */
exports.returnBook = async (req, res) => {
  try {
    const response = await client.ReturnBook(req.body);
    return res.json(response);
  } catch (err) {
    logger.error("ReturnBook failed", {
      route: "POST /return",
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * List Borrowed Books By Member
 */
exports.listBorrowedBooks = async (req, res) => {
  try {
    const response = await client.ListBorrowedBooks({
      member_id: Number(req.params.memberId),
    });

    return res.json(response.books);
  } catch (err) {
    logger.error("ListBorrowedBooks failed", {
      route: "GET /borrowed/:memberId",
      params: req.params,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};
