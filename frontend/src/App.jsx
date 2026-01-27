import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import JobCreate from './pages/JobCreate';
import JobDetail from './pages/JobDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard/employer" 
            element={
              <PrivateRoute roles={['employer']}>
                <EmployerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/jobs/create" 
            element={
              <PrivateRoute roles={['employer']}>
                <JobCreate />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/candidate" 
            element={
              <PrivateRoute roles={['candidate']}>
                <CandidateDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/jobs/:id" 
            element={
              <PrivateRoute roles={['candidate', 'employer']}>
                <JobDetail />
              </PrivateRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


