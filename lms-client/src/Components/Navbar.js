import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid">
        <div className="row w-100 align-items-center">
         
          <div className="col-md-4 d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src="/library2.jpg" alt="Library Logo" className="library-logo me-2" style={{ width: "40px", height: "40px" }} />
              <h4 className="m-0">Library Management System</h4>
            </Link>
          </div>

          <div className="col-md-4 text-center">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          
          <div className="col-md-4">
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle text-white" to="#" id="bookDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Book
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/add-book">Add Book</Link></li>
                    <li><Link className="dropdown-item" to="/issued-books">Issued Books</Link></li>
                    <li><Link className="dropdown-item" to="/returned-book">Returned Book</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/add-edit-member">Members</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/student-book-tables">Details</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;