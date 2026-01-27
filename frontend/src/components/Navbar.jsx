import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">ATS Portal</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        {user?.role === 'employer' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard/employer">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/jobs/create">Post Job</Link>
                                </li>
                            </>
                        )}
                        {user?.role === 'candidate' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard/candidate">My Applications</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Hello, {user.name}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


