import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../bootstrap.css";
import '../styles/AddMember.css';
const EditMember = () => {
  const { prn } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (prn) {
      axios
        .get(`http://localhost:5000/api/members/getMemberByPrn/${prn}`)
        .then((response) => {
          const data = response.data;
          setFormData({
            prn: data.prn || "",
            name: data.name || "",
            email: data.email || "",
            department: data.department || "",
            address: data.address || "",
            division: data.div || "",
            phone: data.phone || "",
            memberFrom: formatDateForInput(data.member_from),
            memberTo: formatDateForInput(data.member_to),
            year: data.year || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching member data:", error);
          setError("Failed to load member data. Please try again.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No member selected for editing.");
    }
  }, [prn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      prn: formData.prn,
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

  const handleUpdate = async () => {
    if (!formData.prn.trim()) {
      alert("❌ PRN is required to update a member.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/members/saveMemberInfo/${formData.prn}`,
        formData
      );
      alert(response.data.message || "✅ Member updated successfully!");
    } catch (error) {
      console.error("Error updating member:", error);
      alert(
        `❌ Failed to update member: ${error.response?.data?.error || error.message}`
      );
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-4">
        <h2>Loading member data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-4">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center mt-4 bg-transparent">
      <div className="card add-member shadow-lg p-4">
        <h2 className="text-center mb-4">Update Member</h2>
        <div className="row g-3">
          <div className="col-md-12">
            <input type="text" id="prn" className="form-control" value={formData.prn} disabled />
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
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
          <button className="btn btn-success" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
