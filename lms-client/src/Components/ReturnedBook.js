import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
// import "../App.css";
import '../styles/ReturnedBook.css';

const ReturnedBook = () => {
    const [prn, setPrn] = useState('');
    const [memberInfo, setMemberInfo] = useState(null);
    const [bookList, setBookList] = useState([]);
    const [returnMessage, setReturnMessage] = useState('');

    const fetchMemberInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/members/getMemberInfo?prn=${prn}`);
            if (!response.data.member) {
                alert("❌ Member not found!");
                return;
            }
            setMemberInfo(response.data.member);
            setBookList(response.data.issued_books || []);
        } catch (error) {
            console.error("Error fetching member info", error);
            alert("❌ Error fetching member info. Please check the console.");
        }
    };

    const returnBook = async (bookId, registerNumber) => {
        try {
            const response = await axios.post('http://localhost:5000/api/books/return', { prn, registerNumber });
            setReturnMessage(response.data.message);
            setBookList(prevList => prevList.filter(book => book.id !== bookId));
        } catch (error) {
            console.error("Error returning book", error);
            setReturnMessage(error.response?.data?.error || 'Error returning book');
        }
    };

    const clearForm = () => {
        setPrn('');
        setMemberInfo(null);
        setBookList([]);
        setReturnMessage('');
    };

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <div className="card returned-books mb-4 ">
                <h2 className="mb-4 text-center">Returned Books</h2> 
                <div className="row justify-content-center mb-3"> 
                    <div className="col-8 d-flex justify-content-center align-items-center p-3"> 
                        <div className="input-group"> 
                            <input
                                type="text" 
                                className="form-control returned-input"
                                placeholder="Enter PRN" 
                                value={prn} 
                                onChange={(e) => setPrn(e.target.value)}
                            />
                            <button className="btn btn-fetch-unique ms-2" onClick={fetchMemberInfo}>Fetch Info</button> 
                        </div>
                    </div>
                </div>

                {memberInfo && (
                    <div className="mt-4 p-2border rounded member-details-container"> 
                        <h3>Member Details</h3>
                        <div className="table-responsive member-details-table">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr><td className="text-gray"><strong>Name</strong></td><td>{memberInfo.name}</td></tr>
                                    <tr><td className="text-gray"><strong>PRN</strong></td><td>{memberInfo.prn}</td></tr>
                                    <tr><td className="text-gray"><strong>Department</strong></td><td>{memberInfo.department}</td></tr>
                                    <tr><td className="text-gray"><strong>Year</strong></td><td>{memberInfo.year}</td></tr>
                                    <tr><td className="text-gray"><strong>Address</strong></td><td>{memberInfo.address}</td></tr>
                                    <tr><td className="text-gray"><strong>Phone</strong></td><td>{memberInfo.phone}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {bookList.length > 0 && (
                            <>
                                <h3 className="mt-3">Issued Books</h3>
                                <div className="table-scrollable">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Name</th>
                                                <th>Author</th>
                                                <th>Accession No</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookList.map(book => (
                                                <tr key={book.id}>
                                                    <td>{book.book_name}</td>
                                                    <td>{book.author_name}</td>
                                                    <td>{book.register_number}</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-return-unique"
                                                            onClick={() => returnBook(book.id, book.register_number)}
                                                        >
                                                            Return
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="mt-3 text-start"> 
                    <button className="btn btn-clear-unique" onClick={clearForm}>Clear</button>
                </div>

                {returnMessage && <div className="alert alert-info mt-3">{returnMessage}</div>}
            </div>
        </div>
    );
};

export default ReturnedBook;