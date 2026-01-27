import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);

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
            
            // Fetch interviews separately and handle errors gracefully
            try {
                const interviewsRes = await api.get('interviews/');
                setInterviews(interviewsRes.data);
            } catch (interviewError) {
                console.warn('Could not fetch interviews:', interviewError);
                setInterviews([]); // Set empty array if fetch fails
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Candidate Dashboard</h2>

            <div className="mb-5">
                <h3>My Applications</h3>
                {applications.length === 0 ? <p>No applications yet.</p> : (
                    <table className="table">
                        <thead>
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
                                        <td>{app.job_title}</td>
                                        <td>{new Date(app.application_date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge bg-${getStatusColor(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            {interview ? (
                                                <div className="small">
                                                    <div><strong>Date:</strong> {new Date(interview.date).toLocaleString()}</div>
                                                    <div><strong>Mode:</strong> {interview.mode}</div>
                                                    {interview.meeting_link && (
                                                        <div>
                                                            <strong>Link:</strong> <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer">{interview.meeting_link}</a>
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

            <div>
                <h3>Available Jobs</h3>
                <div className="list-group">
                    {jobs.map(job => (
                        <Link to={`/jobs/${job.id}`} key={job.id} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{job.title}</h5>
                                <small>{job.location}</small>
                            </div>
                            <p className="mb-1">{job.skills}</p>
                        </Link>
                    ))}
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

