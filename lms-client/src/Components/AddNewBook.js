import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../bootstrap.css';
import '../styles/AddMember.css';

const AddNewBook = () => {
  const [formData, setFormData] = useState({
    bookName: '',
    authorName: '',
    registerNumber: '',
    price: '',
    status: 'available'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/api/books/add", formData);
      alert(response.data.message || "✅ Book Added Successfully!");
      handleClear();
    } catch (error) {
      console.error("❌ Error adding book:", error);
  
      if (error.response?.status === 409) {
        alert("❌ Book already exists! Please add a new book.");
      } else {
        alert(`❌ Failed to add book: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const handleClear = () => {
    setFormData({ bookName: '', authorName: '', registerNumber: '', price: '', status: 'available' });
  };

  return (
    <div className='container d-flex justify-content-center mt-4 bg-transparent'>
      <div className='card add-member p-4 shadow-lg '>
        <h2 className='text-center text-primary'>Book Form</h2>
        <form onSubmit={handleSubmit} className='mt-3'>

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

          
          <div className='d-flex justify-content-center mt-4'>
            <button type='submit' className='btn btn-primary-add w-50 me-2'>Add</button>
            {/* <button type='button' className='btn btn-secondary w-50' onClick={handleClear}>Clear</button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBook;
