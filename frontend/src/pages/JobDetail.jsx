import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]); // For employer
    const [myApplication, setMyApplication] = useState(null); // For candidate
    const [resume, setResume] = useState(null);
    const [msg, setMsg] = useState('');
    const [showInterviewForm, setShowInterviewForm] = useState({});
    const [interviewData, setInterviewData] = useState({
        date: '',
        time: '',
        mode: 'online',
        meeting_link: ''
    });

    useEffect(() => {
        fetchJob();
        if (user.role === 'employer') {
            fetchApplications();
        } else {
            checkApplicationStatus();
        }
    }, [id, user]);

    const fetchJob = async () => {
        try {
            const res = await api.get(`jobs/${id}/`);
            setJob(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get(`jobs/${id}/applications/`);
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const res = await api.get('applications/');
            const app = res.data.find(a => a.job === parseInt(id));
            if (app) setMyApplication(app);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) {
            setMsg('Please upload a resume');
            return;
        }
        const formData = new FormData();
        formData.append('job', id);
        formData.append('resume', resume);

        try {
            await api.post('applications/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMsg('Applied successfully!');
            checkApplicationStatus();
        } catch (err) {
            setMsg('Error applying. You may have already applied.');
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.patch(`applications/${appId}/update_status/`, { status: newStatus });
            fetchApplications(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    const handleScheduleInterview = async (appId) => {
        try {
            if (!interviewData.date || !interviewData.time) {
                setMsg('Please fill in both date and time');
                return;
            }
            
            const dateTime = new Date(`${interviewData.date}T${interviewData.time}`);
            if (isNaN(dateTime.getTime())) {
                setMsg('Invalid date or time format');
                return;
            }
            
            const payload = {
                application: appId,
                date: dateTime.toISOString(),
                mode: interviewData.mode,
            };
            
            // Only include meeting_link if mode is online and link is provided
            if (interviewData.mode === 'online' && interviewData.meeting_link) {
                payload.meeting_link = interviewData.meeting_link;
            }
            
            console.log('Sending interview payload:', payload);
            const response = await api.post('interviews/', payload);
            console.log('Interview response:', response.data);
            
            setMsg('Interview scheduled successfully! Email sent to candidate.');
            setShowInterviewForm({});
            setInterviewData({ date: '', time: '', mode: 'online', meeting_link: '' });
            fetchApplications();
        } catch (err) {
            console.error('Interview error:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           (err.response?.data && JSON.stringify(err.response.data)) ||
                           err.message;
            setMsg('Error scheduling interview: ' + errorMsg);
        }
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

    if (!job) return <div>Loading...</div>;

    return (
        <div>
            <div className="card mb-4">
                <div className="card-body">
                    <h2>{job.title}</h2>
                    <h6 className="text-muted">{job.employer_name} - {job.location}</h6>
                    <p>{job.description}</p>
                    <p><strong>Skills:</strong> {job.skills}</p>
                </div>
            </div>

            {user.role === 'candidate' && (
                <div className="card">
                    <div className="card-body">
                        {myApplication ? (
                            <div className="alert alert-info">
                                You have applied for this job. Status: <strong>{myApplication.status}</strong>
                            </div>
                        ) : (
                            <form onSubmit={handleApply}>
                                <h4>Apply for this Job</h4>
                                {msg && <div className="alert alert-info">{msg}</div>}
                                <div className="mb-3">
                                    <label>Upload Resume (PDF/DOC)</label>
                                    <input type="file" className="form-control" onChange={e => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" required />
                                </div>
                                <button className="btn btn-primary">Submit Application</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {user.role === 'employer' && job.employer === user.id && (
                <div>
                    <h3>Applications</h3>
                    {applications.length === 0 ? <p>No applications yet.</p> : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Date</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.candidate_name}</td>
                                        <td>{new Date(app.application_date).toLocaleDateString()}</td>
                                        <td>
                                            {app.resume_url ? (
                                                <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Download</a>
                                            ) : (
                                                <span className="text-muted">No resume</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge bg-${getStatusColor(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    value={app.status} 
                                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                                >
                                                    <option value="applied">Applied</option>
                                                    <option value="shortlisted">Shortlisted</option>
                                                    <option value="interview_scheduled">Interview Scheduled</option>
                                                    <option value="selected">Selected</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                {app.status === 'shortlisted' && (
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => setShowInterviewForm({...showInterviewForm, [app.id]: true})}
                                                    >
                                                        Schedule Interview
                                                    </button>
                                                )}
                                            </div>
                                            {showInterviewForm[app.id] && (
                                                <div className="card mt-2 p-3">
                                                    <h6>Schedule Interview</h6>
                                                    <div className="mb-2">
                                                        <label>Date</label>
                                                        <input 
                                                            type="date" 
                                                            className="form-control form-control-sm"
                                                            value={interviewData.date}
                                                            onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label>Time</label>
                                                        <input 
                                                            type="time" 
                                                            className="form-control form-control-sm"
                                                            value={interviewData.time}
                                                            onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label>Mode</label>
                                                        <select 
                                                            className="form-select form-select-sm"
                                                            value={interviewData.mode}
                                                            onChange={(e) => setInterviewData({...interviewData, mode: e.target.value})}
                                                        >
                                                            <option value="online">Online</option>
                                                            <option value="in-person">In-Person</option>
                                                        </select>
                                                    </div>
                                                    {interviewData.mode === 'online' && (
                                                        <div className="mb-2">
                                                            <label>Meeting Link</label>
                                                            <input 
                                                                type="url" 
                                                                className="form-control form-control-sm"
                                                                placeholder="https://meet.google.com/..."
                                                                value={interviewData.meeting_link}
                                                                onChange={(e) => setInterviewData({...interviewData, meeting_link: e.target.value})}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleScheduleInterview(app.id)}
                                                            disabled={!interviewData.date || !interviewData.time}
                                                        >
                                                            Schedule
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => {
                                                                setShowInterviewForm({...showInterviewForm, [app.id]: false});
                                                                setInterviewData({ date: '', time: '', mode: 'online', meeting_link: '' });
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail;

