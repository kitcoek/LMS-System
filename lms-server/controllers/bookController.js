const db = require("../config/db");

// Max books allowed per student
const maxBooksAllowed = 3;

// Add New Book
const addBook = (req, res) => {
  const { bookName, authorName, registerNumber, price, status } = req.body;

  if ([bookName, authorName, registerNumber, price, status].some((field) => !field.trim())) {
    return res.status(400).json({ error: "❌ All fields are required" });
  }

  const insertQuery = `
    INSERT INTO books (book_name, author_name, register_number, price, status)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(insertQuery, [bookName, authorName, registerNumber, price, status], (err) => {
    if (err) {
      console.error("🔥 Database Error:", err);

      
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "❌ Book already exists! Please add a new book." });
      }

      return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
    }

    res.status(201).json({ message: "✅ Book added successfully!" });
  });
};


// Update Book
const updateBook = (req, res) => {
  const { bookName, authorName, registerNumber, price, status } = req.body;
  const parsedRegisterNumber = parseInt(registerNumber);

  if (isNaN(parsedRegisterNumber)) {
    return res.status(400).json({ error: "❌ Invalid Register Number" });
  }

  const updateBookQuery = `UPDATE books SET book_name = ?, author_name = ?, price = ?, status = ? WHERE register_number = ?`;
  db.query(updateBookQuery, [bookName, authorName, price, status, parsedRegisterNumber], (err, result) => {
    if (err) {
      console.error("❌ Error updating book:", err);
      return res.status(500).json({ error: "Failed to update book." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json({ message: "✅ Book updated successfully!" });
  });
};

//  Delete Book
const deleteBook = (req, res) => {
  const registerNumber = parseInt(req.params.registerNumber);
  if (isNaN(registerNumber)) {
    return res.status(400).json({ error: "❌ Invalid Register Number" });
  }

  const deleteBookQuery = "DELETE FROM books WHERE register_number = ?";
  db.query(deleteBookQuery, [registerNumber], (err, result) => {
    if (err) {
      console.error("❌ Error deleting book:", err);
      return res.status(500).json({ error: "Failed to delete book." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json({ message: "✅ Book deleted successfully!" });
  });
};

// Get Book by Register Number
const getBookByRegisterNumber = (req, res) => {
  const registerNumber = parseInt(req.params.registerNumber);
  if (isNaN(registerNumber)) {
    return res.status(400).json({ error: "❌ Invalid Register Number" });
  }

  const getBookQuery = "SELECT * FROM books WHERE register_number = ?";
  db.query(getBookQuery, [registerNumber], (err, result) => {
    if (err) {
      console.error("❌ Error fetching book:", err);
      return res.status(500).json({ error: "Failed to fetch book." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json(result[0]); // Return full book data
  });
};

//  Get All Books
const getAllBooks = (req, res) => {
  const query = "SELECT register_number, book_name, author_name, price, status FROM books";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching books:", err);
      return res.status(500).send(err);
    }
    res.json(result);
  });
};

//  Issue Book with Max Book Limit Validation
const issueBook = (req, res) => {
  const { prn, issuedDate, dueDate, books } = req.body;

  if (!prn || !issuedDate || !dueDate || !books || books.length === 0) {
    return res.status(400).json({ error: "❌ All fields are required, and at least one book must be issued." });
  }

  const checkIssuedCountQuery = "SELECT COUNT(*) AS issuedCount FROM issued_books WHERE prn = ?";
  db.query(checkIssuedCountQuery, [prn], (err, countResults) => {
    if (err) return res.status(500).json({ error: "❌ Error checking issued books count." });

    const issuedCount = countResults[0].issuedCount;
    if (issuedCount + books.length > maxBooksAllowed) {
      return res.status(400).json({ error: `❌ Cannot issue more than ${maxBooksAllowed} books.` });
    }

    const issueBookQueries = books.map((book) => {
      return new Promise((resolve, reject) => {
        const { registerNumber } = book;
        const bookQuery = "SELECT * FROM books WHERE register_number = ? AND status = 'available' LIMIT 1";

        db.query(bookQuery, [registerNumber], (err, bookResults) => {
          if (err) return reject({ status: 500, message: `❌ Error fetching book: ${err.message}` });
          if (bookResults.length === 0) return reject({ status: 400, message: `❌ Book ${registerNumber} not available.` });

          const bookDetails = bookResults[0];
          const insertQuery = "INSERT INTO issued_books (prn, issued_date, due_date, register_number, book_name, author_name) VALUES (?, ?, ?, ?, ?, ?)";

          db.query(insertQuery, [prn, issuedDate, dueDate, bookDetails.register_number, bookDetails.book_name, bookDetails.author_name], (err) => {
            if (err) return reject({ status: 500, message: `❌ Error issuing book: ${err.message}` });

            const updateBookStatus = "UPDATE books SET status = 'issued' WHERE register_number = ?";
            db.query(updateBookStatus, [registerNumber], (err) => {
              if (err) return reject({ status: 500, message: `❌ Error updating status: ${err.message}` });
              resolve();
            });
          });
        });
      });
    });

    Promise.all(issueBookQueries)
      .then(() => res.status(200).json({ message: "✅ Books issued successfully" }))
      .catch((error) => res.status(error.status).json({ error: error.message }));
  });
};

//  Return Book
const returnBook = (req, res) => {
  const { registerNumber, prn } = req.body;
  if (!registerNumber || !prn) {
    return res.status(400).json({ error: "❌ Register Number and PRN are required" });
  }

  const updateBookStatusQuery = "UPDATE books SET status = 'available' WHERE register_number = ?";
  db.query(updateBookStatusQuery, [registerNumber], (err) => {
    if (err) {
      console.error("Error updating book status:", err);
      return res.status(500).json({ error: "❌ Failed to update book status" });
    }
    res.json({ message: "✅ Book returned successfully and status updated to available" });
  });
};

//  Get Book Status Counts
const getBookStatus = (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN status = 'issued' THEN 1 ELSE 0 END) AS issued,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available
    FROM books;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching book status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results[0]);
  });
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getBookByRegisterNumber,
  getAllBooks,
  issueBook,
  returnBook,
  getBookStatus,
};