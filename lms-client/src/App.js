import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddEditMember from "./Components/AddEditMember";
import AddNewBook from "./Components/AddNewBook";
import Home from "./Components/Home";
import IssuedBooks from "./Components/IssuedBooks";
import NavBar from "./Components/Navbar";
import ReturnedBook from "./Components/ReturnedBook";
import StudentBookTables from "./Components/StudentBookTables";
import EditMember from "./Components/EditMember";
import EditBook from "./Components/EditBook";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";
// import "./bootstrap.css";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddNewBook />} />
        <Route path="/issued-books" element={<IssuedBooks />} />
        <Route path="/add-edit-member" element={<AddEditMember />} />
        <Route path="/returned-book" element={<ReturnedBook />} />
        <Route path="/student-book-tables" element={<StudentBookTables />} />
        <Route path="/edit-student/:prn" element={<EditMember />} />
        <Route path="/edit-book/:registerNumber" element={<EditBook />} />
        
      </Routes>
    </Router>
  );
};

export default App;