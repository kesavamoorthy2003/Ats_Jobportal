import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const JobCreate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    
    const navigate = useNavigate();
    const locationData = useLocation();
    
    const isEditMode = locationData.state && locationData.state.editJob;
    const editJobId = isEditMode ? locationData.state.editJob.id : null;

    useEffect(() => {
        if (isEditMode) {
            const job = locationData.state.editJob;
            setTitle(job.title);
            setDescription(job.description);
            setSkills(job.skills);
            setLocation(job.location);
        }
    }, [isEditMode, locationData.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const jobPayload = { title, description, skills, location };
        
        try {
            if (isEditMode) {
                await api.patch(`jobs/${editJobId}/`, jobPayload);
                alert("Job updated successfully!");
            } else {
                await api.post('jobs/', jobPayload);
                alert("Job posted successfully!");
            }
            navigate('/dashboard/employer');
        } catch (error) {
            console.error('Error saving job', error);
            alert("An error occurred while saving the job.");
        }
    };

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body">
                <h3>{isEditMode ? 'Update Job Posting' : 'Post a New Job'}</h3>
                <hr />
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Job Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Python Full Stack Developer"
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-control" 
                            rows="4" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Describe the role and responsibilities..."
                            required
                        ></textarea>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Required Skills (comma separated)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={skills} 
                            onChange={e => setSkills(e.target.value)} 
                            placeholder="e.g. React, Django, MySQL"
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="e.g. Chennai, India (Remote)"
                            required 
                        />
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {isEditMode ? 'Save Changes' : 'Post Job Now'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/dashboard/employer')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobCreate;
