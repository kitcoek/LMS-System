import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; 
// import '../bootstrap.css'
import '../App.css';
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [bookStatus, setBookStatus] = useState({ issued: 0, returned: 0, available: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/books/status")
      .then(response => {
        setBookStatus(response.data);
      })
      .catch(error => console.error("Error fetching book status:", error));
  }, []);

  const chartData = {
    labels: ["Issued", "Returned", "Available"],
    datasets: [
      {
        data: [bookStatus.issued, bookStatus.returned, bookStatus.available],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Library Dashboard</h1>

      
      <div className="chart-container mb-5">
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>

      
      <div className="quick-access">
        <h2>Quick Access</h2>
        <div className="row ">
          <div className="col-6 col-md-6 d-flex justify-content-center mb-4">
            <a href="/add-edit-member" className="text-center">
              <img src="student_symbol.png" alt="Student Info" className="img-fluid mb-2" style={{ maxWidth: "100px" }} />
              <p>Members</p>
            </a>
          </div>
          <div className="col-6 col-md-6 d-flex justify-content-center mb-4">
            <a href="/add-book" className="text-center">
              <img src="book.jpg" alt="Add Book" className="img-fluid mb-2" style={{ maxWidth: "100px" }} />
              <p>Books</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
