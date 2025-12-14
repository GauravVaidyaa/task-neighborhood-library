const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* -------- Load Proto -------- */
const PROTO_PATH = "/proto/library.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const libraryProto =
  grpc.loadPackageDefinition(packageDefinition).library;

/* -------- gRPC Client -------- */
const client = new libraryProto.LibraryService(
  "grpc-server:50051",
  grpc.credentials.createInsecure()
);

/* -------- REST APIs -------- */

// Create Book
app.post("/books", (req, res) => {
  client.CreateBook(req.body, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// List Books
app.get("/books", (req, res) => {
  client.ListBooks({}, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response.books);
  });
});

// Update Book
app.put("/books/:id", (req, res) => {
  client.UpdateBook(
    {
      id: Number(req.params.id),
      title: req.body.title,
      author: req.body.author,
    },
    (err, response) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(response);
    }
  );
});

// Delete Book
app.delete("/books/:id", (req, res) => {
  client.DeleteBook({ id: Number(req.params.id) }, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// Create Member
app.post("/members", (req, res) => {
  client.CreateMember(req.body, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// List Members
app.get("/members", (req, res) => {
  client.ListMembers({}, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response.members);
  });
});

// Update Member
app.put("/members/:id", (req, res) => {
  client.UpdateMember(
    {
      id: Number(req.params.id),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    (err, response) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(response);
    }
  );
});

// Delete Member
app.delete("/members/:id", (req, res) => {
  client.DeleteMember({ id: Number(req.params.id) }, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// Borrow Book
app.post("/borrow", (req, res) => {
  client.BorrowBook(req.body, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// Return Book
app.post("/return", (req, res) => {
  client.ReturnBook(req.body, (err, response) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(response);
  });
});

// List Borrowed Books
app.get("/borrowed/:memberId", (req, res) => {
  client.ListBorrowedBooks(
    { member_id: Number(req.params.memberId) },
    (err, response) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(response);
    }
  );
});

/* -------- Start Server -------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node API Gateway running on port ${PORT}`);
});
