const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");


router.post("/add", bookController.addBook);
router.put("/update", bookController.updateBook);
router.delete("/delete/:registerNumber", bookController.deleteBook);
router.get("/getBookByRegisterNumber/:registerNumber", bookController.getBookByRegisterNumber);
router.get("/book", bookController.getAllBooks);
router.get("/status", bookController.getBookStatus);
router.post("/issue", bookController.issueBook);
router.post("/return", bookController.returnBook);

module.exports = router;