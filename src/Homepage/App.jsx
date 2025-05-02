import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Home.jsx';
import Example from './components/Calender.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Example />} />
        </Routes>
    );
}