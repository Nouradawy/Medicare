import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Medical Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.fullName || user?.userName || 'User'}!</h2>
          <p>This is your personal medical dashboard.</p>
        </div>
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Appointments</h3>
            <p>You have no upcoming appointments.</p>
            <button className="card-btn">Schedule Now</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Medical Records</h3>
            <p>Access your medical history.</p>
            <button className="card-btn">View Records</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Prescriptions</h3>
            <p>Manage your prescriptions.</p>
            <button className="card-btn">See All</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Messages</h3>
            <p>Communicate with your healthcare providers.</p>
            <button className="card-btn">Open Inbox</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;