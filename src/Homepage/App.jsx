import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Home.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Example from './components/Calender.jsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Example />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<Login />} />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
       

        </Routes>
    );
}