import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function FindPatient() {
    const { phoneOrSSN } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        if (!phoneOrSSN) return;
        fetch(`http://localhost:8080/findpatient/${phoneOrSSN}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setPatient(data);
            })
            .catch(() => setPatient(null));
    }, [phoneOrSSN]);

    return (
        <div>
            {patient && (<div className="max-w-5xl mx-auto my-10 bg-white p-6 md:p-10 rounded-xl shadow-lg text-gray-800">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Medication Profile Report</h1>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Patient Information</h2>
                    <p><strong>Full Name:</strong> {patient.fullName}</p>
                    <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Phone number:</strong> {patient.phoneNumber}</p>
                    <p><strong>SSN:</strong> {patient.nationalId}</p>
                </section>

                <section className="mb-10 overflow-x-auto">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Active Medications</h2>
                    <table className="min-w-full text-sm table-auto border ">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Medication Name</th>
                            <th className="px-4 py-2">Dosage</th>
                            <th className="px-4 py-2">Route</th>
                            <th className="px-4 py-2">Frequency</th>
                            <th className="px-4 py-2">duration</th>
                            <th className="px-4 py-2">Prescribing Physician</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patient.drugHistory.map((med, idx) => (
                            <tr  className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                                {/*{med.map((item, i) => (*/}
                            <td key={idx} className="border px-4 py-2">{med.drugName}</td>
                            <td key={idx} className="border px-4 py-2">{med.dosage}</td>
                            <td key={idx} className="border px-4 py-2">{med.route}</td>
                            <td key={idx} className="border px-4 py-2">{med.frequency}</td>
                            <td key={idx} className="border px-4 py-2">{med.duration}</td>
                            <td key={idx} className="border px-4 py-2">{med.prescribingPhysician}</td>
                            {/*))}*/}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section className="mb-10 overflow-x-auto">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Allergies</h2>
                    <table className="min-w-full text-sm table-auto border ">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Allergen</th>
                            <th className="px-4 py-2">Reaction</th>
                            <th className="px-4 py-2">Severity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patient.allergy.map((allergy, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                                <td key={idx} className="border px-4 py-2">{allergy.allergy}</td>
                                <td key={idx} className="border px-4 py-2">{allergy.reaction}</td>
                                <td key={idx} className="border px-4 py-2">{allergy.severity}</td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>



                <section className="mb-10">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Chronic Diseases</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {patient.chronicDiseases.map((disease,index)=><li>{disease.name}</li>)}

                    </ul>
                </section>

                <section className="mb-10 overflow-x-auto">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Physician Contacts</h2>
                    <table className="min-w-full text-sm table-auto border ">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Physician Name</th>
                            <th className="px-4 py-2">Specialty</th>
                            <th className="px-4 py-2">Contact Number</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            ['Dr. Alice Monroe', 'Endocrinologist', '(555) 123-4567'],
                            ['Dr. Robert Smith', 'Cardiologist', '(555) 234-5678'],
                            ['Dr. Emily Clark', 'Pulmonologist', '(555) 345-6789']
                        ].map((physician, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                                {physician.map((item, i) => (
                                    <td key={i} className="border px-4 py-2">{item}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Emergency Contact</h2>
                    <p><strong>Name:</strong> Jane Doe</p>
                    <p><strong>Relationship:</strong> Spouse</p>
                    <p><strong>Phone:</strong> (555) 987-6543</p>
                </section>
            </div>)}
        </div>


        // <div>{patient.fullName}</div>
    );
}