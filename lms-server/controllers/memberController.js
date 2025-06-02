const db = require("../config/db");

// Fetch Member by PRN
const getMemberByPrn = (req, res) => {
  const { prn } = req.params;

  if (!prn) {
    return res.status(400).json({ error: "❌ PRN is required" });
  }

  const getMemberQuery = "SELECT * FROM students WHERE prn = ?";
  db.query(getMemberQuery, [prn], (err, result) => {
    if (err) {
      console.error("❌ Error fetching member:", err);
      return res.status(500).json({ error: "Failed to fetch member." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Member not found." });
    }
    const member = result[0];
    res.json(member);
  });
};

// Save (Update Member Info)
const saveMemberInfo = (req, res) => {
  const { prn } = req.params;
  const { name, email, department, address, division, phone, memberFrom, memberTo, year } = req.body;

  if (!prn) return res.status(400).json({ error: "❌ PRN is required" });

  const updateQuery = `
    UPDATE students 
    SET name = ?, email = ?, department = ?, address = ?, \`div\` = ?, phone = ?, member_from = ?, member_to = ?, year = ?
    WHERE prn = ?`;

  db.query(
    updateQuery,
    [name, email, department, address, division, phone, memberFrom, memberTo, year, prn],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err.message);
        return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: "❌ Member not found" });
      res.json({ message: "✅ Member updated successfully" });
    }
  );
};

// Fetch all students
const getAllMembers = (req, res) => {
  db.query("SELECT prn, name, year, department FROM students", (err, result) => {
    if (err) {
      console.error("Error fetching members:", err);
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
};

// Delete a Member
const deleteMemberInfo = (req, res) => {
  const { prn } = req.params;

  if (!prn) return res.status(400).json({ error: "❌ PRN is required" });

  db.query("DELETE FROM students WHERE prn = ?", [prn], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err.message);
      return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "❌ Member not found" });
    res.json({ message: "✅ Member deleted successfully" });
  });
};


// Submit Member Info (Insert new student)
const submitMemberInfo = (req, res) => {
  const { prn, name, email, department, address, division, phone, memberFrom, memberTo, year } = req.body;

  if ([prn, name, email, department, address, division, phone, memberFrom, memberTo, year].some((field) => !field.trim())) {
    return res.status(400).json({ error: "❌ All fields are required" });
  }

  const insertQuery = `
    INSERT INTO students (prn, name, email, department, address, \`div\`, phone, member_from, member_to, year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertQuery, [prn, name, email, department, address, division, phone, memberFrom, memberTo, year], (err) => {
    if (err) {
      console.error("🔥 Database Error:", err); 
      
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "❌ Member already exists. Please create a new member." });
      }

      
      return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
    }

    res.status(201).json({ message: "✅ Member added successfully" });
  });
};



// Fetch Member Info & Issued Books
const getMemberInfo = (req, res) => {
  const { prn } = req.query;

  if (!prn) {
    return res.status(400).json({ error: "❌ PRN is required" });
  }

  const memberQuery = "SELECT * FROM students WHERE prn = ?";
  const issuedBooksQuery = `
    SELECT issued_books.*, books.status 
    FROM issued_books 
    JOIN books ON issued_books.register_number = books.register_number
    WHERE issued_books.prn = ?`;

  db.query(memberQuery, [prn], (err, memberResult) => {
    if (err) {
      console.error("❌ Database Error in member query:", err.message);
      return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
    }
    if (memberResult.length === 0) {
      return res.status(404).json({ message: "❌ Member not found" });
    }

    db.query(issuedBooksQuery, [prn], (err, booksResult) => {
      if (err) {
        console.error("❌ Database Error in issued books query:", err.message);
        return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
      }
      res.json({ member: memberResult[0], issued_books: booksResult });
    });
  });
};

// Check if Email Already Exists
const checkEmail = (req, res) => {
  const { email } = req.params;

  const query = "SELECT * FROM students WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("❌ Error checking email:", err);
      return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
    }
    return res.json({ exists: result.length > 0 });
  });
};

module.exports = {
  getMemberInfo,
  submitMemberInfo,
  saveMemberInfo,
  deleteMemberInfo,
  getMemberByPrn,
  getAllMembers,
  checkEmail,
};