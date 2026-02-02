import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Home.jsx';
import SignupPage from '../SignupPage.jsx';
import AdminRoute from '../../components/auth/AdminRoute.jsx';
import DoctorRoute from '../../components/auth/DoctorRoute.jsx';
import Settings from "../Settings/settings.jsx";
import WebSocketComponent from "../../services/WebSocket.jsx";
import FindPatient from "../FindPatient/FindPatient.jsx";
import FindPatientSearch from "../FindPatient/FindPatientSearch.jsx";
import AdminDashboard from "../AdminPage/AdminDashboard.jsx";
import DoctorDashboard from "../doctorDashboard/DoctorDashboard.jsx";
import Footer from "./components/NavBar/footer.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import ReservationDetails from "../ReservationDetails.jsx";
import FloatingChat from "../../components/Chat/FloatingChat.jsx";
import LoginForm from "../../components/auth/LoginForm.jsx";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={
                <>
                    <Home />
                    <FloatingChat />
                </>

            } />
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            } />
            <Route path="/dashboard" element={
                <>
                    <NavBar />
                    <DoctorDashboard />
                    <FloatingChat />
                    <Footer />
                </>

            } />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/settings" element={
                <>
                    <NavBar />
                    <Settings />
                    <FloatingChat />
                    <Footer />
                </>

            } />
            <Route path="/doctor" element={<Settings />} />
            <Route path="/websocket" element={<WebSocketComponent />} />

            <Route path="/findpatient/:phoneOrSSN" element={<FindPatient />} />
            <Route path="/findpatient" element={
                <DoctorRoute>
                    <NavBar />
                    <FindPatientSearch />
                    <Footer />
                </DoctorRoute>
            } />
            <Route path="/reservation/:id" element={<ReservationDetails />} />
            <Route path="/login" element={
                <LoginForm />
            } />
        </Routes>

    );
}