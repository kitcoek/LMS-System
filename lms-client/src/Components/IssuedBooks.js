import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../bootstrap.css"; 
import  '../styles/IssuedBooks.css';

const IssuedBooks = () => {
  const [prn, setPrn] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [books, setBooks] = useState([{ registerNumber: "", bookName: "", authorName: "" }]);

  const handlePrnBlur = async () => {
    if (!prn.trim()) {
      alert("Please enter a PRN.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/members/getMemberByPrn/${prn}`);
      const student = response.data;
      
      if (!student) {
        alert("Student not found.");
        setName("");
        setYear("");
        setDepartment("");
      } else {
        setName(student.name);
        setYear(student.year);
        setDepartment(student.department);
      }
    } catch (error) {
      alert("Error fetching student details.");
    }
  };

  const handleBookBlur = async (index) => {
    const registerNumber = books[index].registerNumber.trim();
    if (!registerNumber) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/books/getBookByRegisterNumber/${registerNumber}`);
      const book = response.data;
      
      const newBooks = [...books];
      newBooks[index].bookName = book.book_name;
      newBooks[index].authorName = book.author_name;
      setBooks(newBooks);
    } catch (error) {
      alert("Book not found or unavailable.");
    }
  };

  const handleAddBook = () => {
    if (books.length < 3) {
      setBooks([...books, { registerNumber: "", bookName: "", authorName: "" }]);
    } else {
      alert("You can issue a maximum of 3 books.");
    }
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prn || !issuedDate || !dueDate || books.length === 0) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/books/issue", { prn, name, year, department, issuedDate, dueDate, books });
      alert("✅ Books issued successfully.");
      setPrn("");
      setName("");
      setYear("");
      setDepartment("");
      setIssuedDate("");
      setDueDate("");
      setBooks([{ registerNumber: "", bookName: "", authorName: "" }]);
    } catch (error) {
      alert("Error issuing books.");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="card issue-books shadow-lg p-4">
        <h2 className="mb-4 text-primary">Issue Books</h2>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="row g-3">
            <div className="col-12">
              <input
                type="text"
                id="prn"
                className="form-control"
                placeholder="PRN"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                onBlur={handlePrnBlur}
                required
              />
            </div>
            <div className="col-12">
              
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Name"
                value={name}
                readOnly
              />
            </div>
            <div className="col-6">
              
              <input
                type="text"
                id="year"
                className="form-control"
                placeholder="Year"
                value={year}
                readOnly
              />
            </div>
            <div className="col-6">
             
              <input
                type="text"
                id="department"
                className="form-control"
                placeholder="Department"
                value={department}
                readOnly
              />
            </div>
            <div className="col-6">
              <label htmlFor="issuedDate" className="form-label text-gray">Issued Date</label>
              <input
                type="date"
                id="issuedDate"
                className="form-control"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                required
              />
            </div>
            <div className="col-6">
              <label htmlFor="dueDate" className="form-label text-gray">Due Date</label>
              <input
                type="date"
                id="dueDate"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                required
              />
            </div>
          </div>
          <h3 className="mt-4 text-gray">Books</h3>
          <div className="table-scrollable">
            <table className="table  table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Register Number</th>
                  <th>Book Name</th>
                  <th>Author Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={book.registerNumber}
                        onChange={(e) => {
                          const newBooks = [...books];
                          newBooks[index].registerNumber = e.target.value;
                          setBooks(newBooks);
                        }}
                        onBlur={() => handleBookBlur(index)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={book.bookName}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={book.authorName}
                        readOnly
                      />
                    </td>
                    <td>
                      {books.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-return-danger btn-sm"
                          onClick={() => handleRemoveBook(index)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex mt-3 text-start ">
            <button type="button" className="btn btn-add-success" onClick={handleAddBook}>
              + Add Book
            </button>
            <button type="submit" className="btn btn-submit-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuedBooks;