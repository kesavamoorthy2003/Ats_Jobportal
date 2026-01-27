import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';

const EmployerDashboardWithAuth = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    const fetchJobs = async () => {
        try {
            const response = await api.get('jobs/');
            const myJobs = response.data.filter(job => job.employer === user.id);
            setJobs(myJobs);
        } catch (error) {
            console.error(error);
        }
    };

    // 1. Delete Functionality
    const handleDelete = async (e, jobId) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await api.delete(`jobs/${jobId}/`);
                setJobs(jobs.filter(job => job.id !== jobId));
                alert("Job deleted successfully!");
            } catch (error) {
                console.error(error);
                alert("Error deleting job.");
            }
        }
    };

    // 2. Edit Functionality (Sending data to Create Job page)
    const handleEdit = (e, job) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/jobs/create', { state: { editJob: job } });
    };

    return (
         <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Employer Dashboard</h2>
                <Link to="/jobs/create" className="btn btn-success">Post New Job</Link>
            </div>
            
            {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                <div className="list-group">
                    {jobs.map(job => (
                        <Link to={`/jobs/${job.id}`} key={job.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1">{job.title}</h5>
                                <p className="mb-1 text-muted">{job.location}</p>
                                <small>Posted on: {new Date(job.created_at).toLocaleDateString()}</small>
                            </div>
                            
                            {/* Edit மற்றும் Delete பட்டன்கள் */}
                            <div className="btn-group">
                                <button 
                                    className="btn btn-sm btn-warning me-2" 
                                    onClick={(e) => handleEdit(e, job)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={(e) => handleDelete(e, job.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EmployerDashboardWithAuth;
