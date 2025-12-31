import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import Footer from "../Homepage/components/NavBar/footer.jsx";

export default function FindPatientSearch() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!phoneNumber.trim()) {
            setError("Please enter a phone number");
            return;
        }

        setLoading(true);
        
        try {
            // Check if patient exists
            const response = await fetch(`http://localhost:8080/findpatient/${phoneNumber}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error("Patient not found");
            }
            
            // Patient exists, navigate to their profile
            navigate(`/findpatient/${phoneNumber}`);
        } catch (err) {
            setError("Patient not found with this phone number");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
                        Find Patient
                    </h1>
                    
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter patient's phone number"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Searching..." : "Search Patient"}
                        </button>
                    </form>
                </div>
            </div>

        </>
    );
}
