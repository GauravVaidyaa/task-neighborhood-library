const client = require("../grpc/libraryClient");
const logger = require("../logger");
const { mapGrpcErrorToHttp } = require("../utils/grpcErrorMapper");

/**
 * Create Book
 */
exports.createBook = async (req, res) => {
  try {
    const response = await client.CreateBook(req.body);
    return res.status(201).json(response);
  } catch (err) {
    logger.error("CreateBook failed", {
      route: "POST /books",
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * List Books
 */
exports.listBooks = async (req, res) => {
  try {
    const response = await client.ListBooks({});
    return res.json(response.books);
  } catch (err) {
    logger.error("ListBooks failed", {
      route: "GET /books",
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * Update Book
 */
exports.updateBook = async (req, res) => {
  try {
    const response = await client.UpdateBook({
      id: Number(req.params.id),
      ...req.body,
    });

    return res.json(response);
  } catch (err) {
    logger.error("UpdateBook failed", {
      route: "PUT /books/:id",
      params: req.params,
      payload: req.body,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};

/**
 * Delete Book
 */
exports.deleteBook = async (req, res) => {
  try {
    const response = await client.DeleteBook({
      id: Number(req.params.id),
    });

    return res.json(response);
  } catch (err) {
    logger.error("DeleteBook failed", {
      route: "DELETE /books/:id",
      params: req.params,
      grpcCode: err.code,
      message: err.details,
    });

    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({ message: message });
  }
};
