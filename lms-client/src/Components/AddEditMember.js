import axios from "axios";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../App.css";
// import '../bootstrap.css';
import '../styles/AddMember.css';



const AddEditMember = () => {
  const [formData, setFormData] = useState({
    prn: "",
    name: "",
    email: "",
    department: "",
    address: "",
    division: "",
    phone: "",
    memberFrom: "",
    memberTo: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
      prn: "",
      name: "",
      email: "",
      department: "",
      address: "",
      division: "",
      phone: "",
      memberFrom: "",
      memberTo: "",
      year: "",
    });
  };

  const validateForm = () => {
    const { prn, name, email, department, address, division, phone, memberFrom, memberTo, year } = formData;
    if (![prn, name, email, department, address, division, phone, memberFrom, memberTo, year].every(field => field.trim())) {
      alert("❌ All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await axios.post("http://localhost:5000/api/members/submitMemberInfo", formData);
        alert(response.data.message || "✅ Member added successfully!");
      handleClear();
    } catch (error) {
      console.error("❌ Error adding member:", error);
  
      
      if (error.response?.status === 409) {
        alert("❌ Member already exists. Please create a new member.");
      } else {
        alert(`❌ Failed to add member: ${error.response?.data?.error || error.message}`);
      }
    }
  };
  
  

  // const showDatePicker = (id) => {
  //   document.getElementById(id)?.showPicker();
  // };

  return (
    <div className=" container d-flex justify-content-center mt-4 bg-transparent">
      
      <div className="card add-member shadow-lg p-4">
        <h2 className="text-center mb-4">Member Form</h2>
        <div className="row g-3">
          <div className="col-md-12">
            <input type="text" id="prn" className="form-control"placeholder="PRN" value={formData.prn} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <input type="text" id="name" className="form-control" placeholder="Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <input type="email" id="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="text" id="department" className="form-control" placeholder="Department" value={formData.department} onChange={handleChange} />
          </div>
          
          <div className="col-md-6">
            <input type="text" id="division" className="form-control" placeholder="Division" value={formData.division} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="text" id="year" className="form-control" placeholder="Year" value={formData.year} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="tel" id="phone" className="form-control" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <input type="text" id="address" className="form-control" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label htmlFor="memberFrom" className="form-label">Member From:</label>
              <input 
                type="date" 
                id="memberFrom" 
                className="form-control" 
                value={formData.memberFrom} 
                onChange={handleChange} 
                onClick={(e) => e.target.showPicker && e.target.showPicker()} 
              />

          </div>
          <div className="col-md-6">
          <label htmlFor="memberTo" className="form-label">Member To:</label>
            <input 
              type="date" 
              id="memberTo" 
              className="form-control" 
              value={formData.memberTo} 
              onChange={handleChange} 
              onClick={(e) => e.target.showPicker && e.target.showPicker()} 
            />
          </div>
        </div>
        <div className="d-flex justify-content-center my-4">
          <button className="btn btn-primary-add w-50 me-2" onClick={handleSubmit}>Add</button>
          {/* <button className="btn btn-secondary w-50 me-2" onClick={handleClear}>Clear</button>
           */}
        </div>
      </div>
    </div>
  );
};

export default AddEditMember;
