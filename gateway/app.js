const express = require("express");
const cors = require("cors");
const { mapGrpcErrorToHttp } = require("./utils/grpcErrorMapper");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


// Borrow / Return / Borrowed
app.use("/", require("./routes/borrow.routes"));
app.use("/books", require("./routes/book.routes"));
app.use("/members", require("./routes/member.routes"));

app.use((err, req, res, next) => {
  // gRPC error
  if (err && typeof err.code === "number") {
    const { status, message } = mapGrpcErrorToHttp(err);
    return res.status(status).json({message: message});
  }

  // Fallback
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});


module.exports = app;
