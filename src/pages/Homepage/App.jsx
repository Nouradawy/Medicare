import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Home.jsx';
import SignupPage from '../SignupPage.jsx';
import Login from '../Login.jsx';
import Dashboard from '../Dashboard.jsx';
import Example from './components/Calender.jsx';
import ProtectedRoute from '../../components/auth/ProtectedRoute.jsx';
import ErrorBoundary from '../../services/ErrorBoundary.jsx';
import Settings from "../Settings/settings.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Example />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/doctor" element={<Settings />} />
            <Route path="/login" element={
                <Login />
            } />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Home />} />
       

        </Routes>
    );
}