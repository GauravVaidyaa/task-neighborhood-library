const express = require("express");
const router = express.Router();
const controller = require("../controllers/borrow.controller");

// POST /borrow
router.post("/borrow", controller.borrowBook);

// POST /return
router.post("/return", controller.returnBook);

// GET /borrowed/:memberId
router.get("/borrowed/:memberId", controller.listBorrowedBooks);

module.exports = router;
