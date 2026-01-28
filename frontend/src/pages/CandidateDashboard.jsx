// import React, { useEffect, useState } from 'react';
// import api from '../api/axios';
// import { Link } from 'react-router-dom';

// const CandidateDashboard = () => {
//     const [jobs, setJobs] = useState([]);
//     const [applications, setApplications] = useState([]);
//     const [interviews, setInterviews] = useState([]);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             const [jobsRes, appsRes] = await Promise.all([
//                 api.get('jobs/'),
//                 api.get('applications/')
//             ]);
//             setJobs(jobsRes.data);
//             setApplications(appsRes.data);
            
//             // Fetch interviews separately and handle errors gracefully
//             try {
//                 const interviewsRes = await api.get('interviews/');
//                 setInterviews(interviewsRes.data);
//             } catch (interviewError) {
//                 console.warn('Could not fetch interviews:', interviewError);
//                 setInterviews([]); // Set empty array if fetch fails
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     return (
//         <div>
//             <h2 className="mb-4">Candidate Dashboard</h2>

//             <div className="mb-5">
//                 <h3>My Applications</h3>
//                 {applications.length === 0 ? <p>No applications yet.</p> : (
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>Job Title</th>
//                                 <th>Date</th>
//                                 <th>Status</th>
//                                 <th>Interview Details</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {applications.map(app => {
//                                 const interview = interviews.find(int => int.application_id === app.id || int.application === app.id);
//                                 return (
//                                     <tr key={app.id}>
//                                         <td>{app.job_title}</td>
//                                         <td>{new Date(app.application_date).toLocaleDateString()}</td>
//                                         <td>
//                                             <span className={`badge bg-${getStatusColor(app.status)}`}>
//                                                 {app.status.replace('_', ' ')}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             {interview ? (
//                                                 <div className="small">
//                                                     <div><strong>Date:</strong> {new Date(interview.date).toLocaleString()}</div>
//                                                     <div><strong>Mode:</strong> {interview.mode}</div>
//                                                     {interview.meeting_link && (
//                                                         <div>
//                                                             <strong>Link:</strong> <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-muted">-</span>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             <div>
//                 <h3>Available Jobs</h3>
//                 <div className="list-group">
//                     {jobs.map(job => (
//                         <Link to={`/jobs/${job.id}`} key={job.id} className="list-group-item list-group-item-action">
//                             <div className="d-flex w-100 justify-content-between">
//                                 <h5 className="mb-1">{job.title}</h5>
//                                 <small>{job.location}</small>
//                             </div>
//                             <p className="mb-1">{job.skills}</p>
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'applied': return 'primary';
//         case 'shortlisted': return 'info';
//         case 'interview_scheduled': return 'warning';
//         case 'selected': return 'success';
//         case 'rejected': return 'danger';
//         default: return 'secondary';
//     }
// };

// export default CandidateDashboard;


import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    
    // 1. Search State
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('jobs/'),
                api.get('applications/')
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            
            try {
                const interviewsRes = await api.get('interviews/');
                setInterviews(interviewsRes.data);
            } catch (interviewError) {
                console.warn('Could not fetch interviews:', interviewError);
                setInterviews([]); 
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // 2. Filter Logic
    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Candidate Dashboard</h2>

            {/* My Applications Table - உங்கள் பழைய ஸ்டைல் */}
            <div className="mb-5">
                <h3>My Applications</h3>
                {applications.length === 0 ? <p>No applications yet.</p> : (
                    <table className="table border mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>Job Title</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Interview Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => {
                                const interview = interviews.find(int => int.application_id === app.id || int.application === app.id);
                                return (
                                    <tr key={app.id}>
                                        <td className="fw-bold">{app.job_title}</td>
                                        <td>{new Date(app.application_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge bg-${getStatusColor(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            {interview ? (
                                                <div className="small p-2 bg-light rounded">
                                                    <div><strong>Date:</strong> {new Date(interview.date).toLocaleString()}</div>
                                                    <div><strong>Mode:</strong> {interview.mode}</div>
                                                    {interview.meeting_link && (
                                                        <div>
                                                            <strong>Link:</strong> <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">Join Interview</a>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Available Jobs Section with Search Bar */}
            <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Available Jobs</h3>
                    {/* 3. இதோ அந்த Search Bar - அலைன்மென்ட் சரியாக இருக்கும் */}
                    <div style={{ maxWidth: '300px', width: '100%' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search jobs, skills..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="list-group">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <Link to={`/jobs/${job.id}`} key={job.id} className="list-group-item list-group-item-action p-3 mb-2 border rounded">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1 text-primary">{job.title}</h5>
                                    <small className="text-muted">📍 {job.location}</small>
                                </div>
                                <p className="mb-1 small text-secondary">{job.skills}</p>
                                <small className="text-primary fw-bold">View Details & Apply →</small>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center py-4 text-muted border rounded">No jobs found matching "{searchTerm}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'applied': return 'primary';
        case 'shortlisted': return 'info';
        case 'interview_scheduled': return 'warning';
        case 'selected': return 'success';
        case 'rejected': return 'danger';
        default: return 'secondary';
    }
};

export default CandidateDashboard;