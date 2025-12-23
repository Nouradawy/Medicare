import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Home.jsx';
import SignupPage from '../SignupPage.jsx';
import Login from '../Login.jsx';
import Example from './Reservation/Calender.jsx';
import ProtectedRoute from '../../components/auth/ProtectedRoute.jsx';
import AdminRoute from '../../components/auth/AdminRoute.jsx';
import ErrorBoundary from '../../services/ErrorBoundary.jsx';
import Settings from "../Settings/settings.jsx";
import WebSocketComponent from "../../services/WebSocket.jsx";
import PDFReader from "../Settings/PDFReader.jsx";
import {Notification} from "./components/Notification.jsx";
import FindPatient from "../FindPatient/FindPatient.jsx";
import AdminDashboard from "../AdminPage/AdminDashboard.jsx";
import DoctorDashboard from "../doctorDashboard/DoctorDashboard.jsx";
import Footer from "./components/NavBar/footer.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            } />
            <Route path="/dashboard" element={
                <>
                    <NavBar />
                    <DoctorDashboard />
                    <Footer />
                </>

            } />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/settings" element={
                <>
                    <NavBar />
                    <Settings />
                    <Footer />
                </>

            } />
            <Route path="/doctor" element={<Settings />} />
            <Route path="/websocket" element={<WebSocketComponent />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/findpatient/:phoneOrSSN" element={<FindPatient />} />
            <Route path="/login" element={
                <Login />
            } />
        </Routes>

    );
}