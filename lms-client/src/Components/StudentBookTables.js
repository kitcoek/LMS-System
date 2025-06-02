import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Details.css";

const StudentBookTables = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, booksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/members/getAllMembers"),
          axios.get("http://localhost:5000/api/books/book"),
        ]);
        setStudents(studentsRes.data || []);
        setBooks(booksRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteStudent = (prn) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      axios
        .delete(`http://localhost:5000/api/members/deleteMemberInfo/${prn}`)
        .then(() => {
          setStudents(students.filter((student) => student.prn !== prn));
          alert("✅ Student deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting student:", err);
          setError("Failed to delete student. Please try again.");
        });
    }
  };

  const handleDeleteBook = (registerNumber) => {
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      axios
        .delete(`http://localhost:5000/api/books/delete/${registerNumber}`)
        .then(() => {
          setBooks(books.filter((book) => book.register_number !== registerNumber));
          alert("✅ Book deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting book:", err);
          setError("Failed to delete book. Please try again.");
        });
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-primary">Loading data...</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4 text-center">Student List</h2>
      <div className="table-scrollable mb-5">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>PRN</th>
              <th>Name</th>
              <th>Year</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.prn}>
                  <td>{index + 1}</td>
                  <td>{student.prn}</td>
                  <td>{student.name}</td>
                  <td>{student.year}</td>
                  <td>{student.department}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link
                        to={`/edit-student/${student.prn}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteStudent(student.prn)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-primary mb-4 text-center">Book List</h2>
      <div className="table-scrollable">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Registration Number</th>
              <th>Name</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book.register_number}>
                  <td>{index + 1}</td>
                  <td>{book.register_number}</td>
                  <td>{book.book_name}</td>
                  <td>{book.author_name}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link
                        to={`/edit-book/${book.register_number}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBook(book.register_number)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentBookTables;