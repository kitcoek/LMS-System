import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import '../bootstrap.css'
import '../styles/AddMember.css';
const EditBook = () => {
  const { registerNumber } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    bookName: "",
    authorName: "",
    registerNumber: "",
    price: "",
    status: "available",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bookData = location.state?.bookData;
    if (bookData) {
      setFormData({
        bookName: bookData.book_name || "",
        authorName: bookData.author_name || "",
        registerNumber: bookData.register_number || "",
        price: bookData.price || "",
        status: bookData.status || "available",
      });
      setLoading(false);
    } else if (registerNumber) {
      axios
        .get(`http://localhost:5000/api/books/getBookByRegisterNumber/${registerNumber}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            bookName: data.book_name || "",
            authorName: data.author_name || "",
            registerNumber: registerNumber || "",
            price: data.price || "",
            status: data.status || "available",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching book data:", error);
          setError("Failed to load book data. Please try again.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No book selected for editing.");
    }
  }, [registerNumber, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.registerNumber.trim()) {
      alert("❌ Register Number is required to update a book.");
      return;
    }
    try {
      await axios.put("http://localhost:5000/api/books/update", formData);
      alert("✅ Book Updated Successfully!");
    } catch (error) {
      console.error("❌ Error updating book:", error);
      alert(`❌ Failed to update book: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleClear = () => {
    setFormData({
      bookName: "",
      authorName: "",
      registerNumber: formData.registerNumber,
      price: "",
      status: "available",
    });
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-primary">Loading book data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center mt-4 bg-transparent">
      <div className="card add-member shadow-lg p-4 ">
        <h2 className="text-center text-primary mb-4">Update Book</h2>
        <form>
        <div className='row g-3'>
            
            <div className='col-md-12'>
              
              <input type='text'  placeholder='Book Name'className='form-control' name='bookName' id='bookName' value={formData.bookName} onChange={handleChange} required />
            </div>

            
            <div className='col-md-12'>
              
              <input type='text' placeholder='Author Name' className='form-control' name='authorName' id='authorName' value={formData.authorName} onChange={handleChange} required />
            </div>

            
            <div className='col-md-12'>
              
              <input type='text' placeholder='Register Number' className='form-control' name='registerNumber' id='registerNumber' value={formData.registerNumber} onChange={handleChange} required />
            </div>

            
            <div className='col-md-12'>
              
              <input type='number' placeholder='Price' className='form-control' name='price' id='price' value={formData.price} onChange={handleChange} required />
            </div>

           
            <div className='col-md-12'>
              <label htmlFor='status' className='form-label fw-bold text-dark'>Status</label>
              <select name='status' id='status' className='form-select' value={formData.status} onChange={handleChange} required>
                <option value='available'>Available</option>
                <option value='issued'>Issued</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button type="button" className="btn btn-secondary " onClick={handleClear}>Clear</button>
            <button type="button" className="btn btn-success" onClick={handleUpdate}>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
