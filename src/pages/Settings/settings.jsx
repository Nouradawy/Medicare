import React, {useState,useEffect} from "react";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import {Link, useLocation , useNavigate} from 'react-router-dom';
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import APICalls from "../../services/APICalls.js";
import DoctorCalendar from '../doctorDashboard/DoctorCalendar.jsx';
import { Calendar, Clock ,Check , Plus , CirclePlus, Loader2} from 'lucide-react';
import MedicalHistoryReport from "../doctorDashboard/helpers/MedicalHistoryReport.jsx";
import QRCode from "react-qr-code";
import toast, { Toaster } from 'react-hot-toast';
import {subscribeUser, unsubscribeUser} from "../../services/Notification.jsx";
import Reservations from "./Reservations.jsx";
import ProfileSettings from "./ProfileSettings.jsx";



export default function Settings() {
    const fileInputRef = React.useRef();
    const user = JSON.parse(localStorage.getItem("userData"));
    const MainScreenSize = 60;
    const userRole = user.roles[0].name;
    const location = useLocation(); // \[+] access query params



    const [Index, setIndexState] = useState(() => {
        const saved = localStorage.getItem("settings.activeTab");
        return saved !== null ? Number(saved) : 0;
    });

    const setIndex = (next) => {
        setIndexState(next);
        localStorage.setItem("settings.activeTab", String(next));
    };

    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // \[+] read `tab` from URL, fallback to saved
        const params = new URLSearchParams(location.search);
        const tabFromUrl = params.get("tab");
        if (tabFromUrl !== null) {
            const parsed = Number(tabFromUrl);
            if (!Number.isNaN(parsed)) {
                setIndex(parsed);
            }
        } else {
            const saved = localStorage.getItem("settings.activeTab");
            if (saved !== null) setIndexState(Number(saved));
        }

        setLoading(false);
    }, [location.search]);



return(
    <>
        <Toaster position="top-right" />
        <div className="flex flex-row  justify-center space-x-10 @container">
            {/*SideBar*/}
            <div className="flex-col bg-white border-gray-200  rounded-lg pt-5 @max-[800px]:hidden ">
                {/*sidebar Item*/}
                <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index}>

                    <svg
                        height="24px"
                        width="24px"
                        fill="#000000"
                        viewBox="0 -960 960 960"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                    </svg>
                    <p>Profile Settings</p>
                </SidebarItem>

                <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index}>
                    <svg
                        height="24px"
                        width="24px"
                        fill="#000000"
                        viewBox="0 -960 960 960"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                    </svg>
                    <p>Password Settings</p>

                </SidebarItem>


                {userRole === "ROLE_PATIENT"&& (<SidebarItem setIndex={setIndex} Index={4} currentIndex={Index}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px"
                         viewBox="0 -960 960 960"
                         width="24px"
                         fill="#000000">
                        <path
                            d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/>
                    </svg>
                    <p>Reservations</p>

                </SidebarItem>)}

                <SidebarItem setIndex={setIndex} Index={5} currentIndex={Index}>
                                <svg
                                    height="24px"
                                    width="24px"
                                    fill="#000000"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960">
                                    <path
                                        d="M280-240h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80Zm240-140h240v-60H520v60Zm0 120h160v-60H520v60ZM160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm280-440h80v-200h-80v200Zm40 220Z"/>
                                </svg>
                                <p>Medical History</p>

                              </SidebarItem>








            </div>
            {/*MainScreen*/}
            <div className={`flex-col w-[${MainScreenSize.toString()}vw] bg-white border-gray-200 border-1 rounded-lg p-10 ${userRole === 'ROLE_DOCTOR' && Index === 2 ? "w-[80vw]" : "" }`}>
                    {Index === 0 ? (
                        <ProfileSettings user={user} fileInputRef={fileInputRef} screenSize={MainScreenSize} />
                    ) : Index === 1 ? (
                        <ChangePassword user={user} screenSize={MainScreenSize} />
                    )  : Index === 4 ? (
                        <Reservations user={user} />
                    ) : Index === 5 ? (
                        <MedicalHistory user={user} />
                    ) : (
                        <div className="text-red-500">Error: Index does not exist</div>
                    )}
                    </div>
        </div>
    </>
)}

function SidebarItem({children , setIndex, Index , currentIndex}) {
    const isActive = Index === currentIndex;
    return(
        <div className="flex flex-row items-center gap-3">
            <button
                onClick={() => {
                    setIndex(Index)
                }}
                className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
                {children}
            </button>
        </div>


    )
}


function GenericModal({ open, type, value, onChange, onClose, onSave, config }) {
    if (!open || !type) return null;
    const cfg = config[type];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    // Helper: render one input/select with label and placeholder
    const renderField = (f) => {
        const common = {
            name: f.name,
            value: value[f.name] || "",
            onChange,
            required: !!f.required,
            className: "w-full border-2 border-gray-200 rounded-lg p-2",
            placeholder: f.placeholder || ""
        };

        return (
            <div key={f.name}>
                <label className="block text-sm mb-1">{f.label}</label>
                {f.type === "select" ? (
                    <select {...common}>
                        <option value="">Select</option>
                        {(f.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : (
                    <input type={f.type || "text"} {...common} />
                )}
            </div>
        );
    };

    // Layout rules:
    // - fields with group: "single" render as single rows
    // - fields with group: "grid2" render in a 2-column grid
    // - default is "single"
    const singles = (cfg.fields || []).filter((f) => (f.group || "single") === "single");
    const grid2 = (cfg.fields || []).filter((f) => f.group === "grid2");

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-[1001] w-[92vw] max-w-lg rounded-lg bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">{cfg.title}</h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Single-row fields */}
                    {singles.map(renderField)}

                    {/* Two-column grid fields */}
                    {grid2.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {grid2.map(renderField)}
                        </div>
                    )}

                    {/* Optional description/help text */}
                    {cfg.helpText && (
                        <p className="text-xs text-gray-500 mt-1">{cfg.helpText}</p>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function MedicalHistory({user}) {
    const [saving, setSaving] =  useState(false);
    const [formData , setformData ] =  useState({
        allergies: Array.isArray(user?.allergy) ? user.allergy : [],
        chronicDiseases: Array.isArray(user?.chronicDiseases) ? user.chronicDiseases : [],
        drugHistories: Array.isArray(user?.drugHistory) ? user.drugHistory : [],
        medicalHistories: Array.isArray(user?.medicalHistory) ? user.medicalHistory : []
    })

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'drugHistories' | 'allergies' | 'chronicDiseases' | 'medicalHistories'
    const [modalValue, setModalValue] = useState({});

    const MODAL_CONFIG = {
        drugHistories: {
            title: "Add New Medication",
            helpText: "Fill all relevant fields. You can save and add more later.",
            empty: { drugName: "", dosage: "", route: "", frequency: "", duration: "", prescribingPhysician: "" },
            fields: [
                { name: "drugName", label: "Medication Name", type: "text", required: true, placeholder: "e.g., Amoxicillin", group: "single" },
                { name: "dosage", label: "Dosage", type: "text", placeholder: "e.g., 500 mg", group: "grid2" },
                { name: "route", label: "Route", type: "select", options: ["Oral", "IV", "IM", "Topical"], group: "grid2" },
                { name: "frequency", label: "Frequency", type: "text", placeholder: "e.g., 3 times/day", group: "grid2" },
                { name: "duration", label: "Duration", type: "text", placeholder: "e.g., 7 days", group: "grid2" },
                { name: "prescribingPhysician", label: "Prescribing Physician", type: "text", placeholder: "e.g., Dr. Smith", group: "single" }
            ]
        },
        allergies: {
            title: "Add New Allergy",
            helpText: "Specify allergen, reaction, and severity.",
            empty: { allergy: "", reaction: "", severity: "" },
            fields: [
                { name: "allergy", label: "Allergen", type: "text", required: true, placeholder: "e.g., Penicillin", group: "single" },
                { name: "reaction", label: "Reaction", type: "text", placeholder: "e.g., Rash, hives", group: "grid2" },
                { name: "severity", label: "Severity", type: "select", options: ["Mild", "Moderate", "Severe"], group: "grid2" }
            ]
        },
        chronicDiseases: {
            title: "Add Chronic Disease",
            helpText: "Enter the disease name and optional notes.",
            empty: { name: "", notes: "" },
            fields: [
                { name: "name", label: "Disease Name", type: "text", required: true, placeholder: "e.g., Diabetes Mellitus", group: "single" },
                { name: "notes", label: "Notes", type: "text", placeholder: "e.g., Type 2, on Metformin", group: "single" }
            ]
        },
        medicalHistories: {
            title: "Add Medical History",
            helpText: "Add the event date and description.",
            empty: { date: "", description: "" },
            fields: [
                { name: "date", label: "Date", type: "date", required: true, group: "grid2" },
                { name: "description", label: "Description", type: "text", required: true, placeholder: "e.g., Appendectomy", group: "grid2" }
            ]
        }
    };
    const openModal = (type) => {
        const cfg = MODAL_CONFIG[type];
        if (!cfg) return;
        setModalType(type);
        setModalValue(cfg.empty);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setModalValue({});
    };
    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setModalValue((prev) => ({ ...prev, [name]: value }));
    };
    const saveNewItem = () => {
        if (!modalType) return;
        setformData((prev) => ({
            ...prev,
            [modalType]: [...(Array.isArray(prev[modalType]) ? prev[modalType] : []), { ...modalValue }]
        }));
        setModalOpen(false);
        toast.success("Item added (not saved yet)");
    };

    const handelChange = (e, index, type) => {
        const { name, value } = e.target;
        const list = [...(formData[type] || [])];
        list[index] = { ...list[index], [name]: value };
        setformData((prev) => ({ ...prev, [type]: list }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        // Handle form submission logic here
        try{
            await APICalls.AddPatientInfo(formData);
            toast.success('Medical history saved successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to save medical history');
        } finally {
            await APICalls.GetCurrentUser();
            setSaving(false);
        }

    };



    return(

        <div className="flex flex-col">
            <MedicalCard user={user} />
            <form onSubmit={handleSubmit}>
                <section className="mt-10 mb-10  relative group">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Active Medications</h2>
                    <table className="min-w-full text-sm table-auto border">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-2 border">Medication</th>
                            <th className="p-2 border">Dosage</th>
                            <th className="p-2 border">Route</th>
                            <th className="p-2 border">Frequency</th>
                            <th className="p-2 border">Duration</th>
                            <th className="p-2 border">Physician</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(formData.drugHistories || []).map((drug, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : ""}>
                                <td className="p-2 border">
                                    <input
                                        name="drugName"
                                        value={drug.drugName || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                        placeholder="e.g., Amoxicillin"
                                    />
                                </td>
                                <td className="p-2 border">
                                    <input
                                        name="dosage"
                                        value={drug.dosage || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                        placeholder="e.g., 500 mg"
                                    />
                                </td>
                                <td className="p-2 border">
                                    <select
                                        name="route"
                                        value={drug.route || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Oral">Oral</option>
                                        <option value="IV">IV</option>
                                        <option value="IM">IM</option>
                                        <option value="Topical">Topical</option>
                                    </select>
                                </td>
                                <td className="p-2 border">
                                    <input
                                        name="frequency"
                                        value={drug.frequency || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                        placeholder="e.g., 3 times/day"
                                    />
                                </td>
                                <td className="p-2 border">
                                    <input
                                        name="duration"
                                        value={drug.duration || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                        placeholder="e.g., 7 days"
                                    />
                                </td>
                                <td className="p-2 border">
                                    <input
                                        name="prescribingPhysician"
                                        value={drug.prescribingPhysician || ""}
                                        onChange={(e) => handelChange(e, index, "drugHistories")}
                                        className="text-center w-full  p-1"
                                        placeholder="e.g., Dr. Smith"
                                    />
                                </td>
                            </tr>
                        ))}
                        {(!formData.drugHistories || formData.drugHistories.length === 0) && (
                            <tr>
                                <td className="p-3 text-center text-gray-500" colSpan={6}>
                                    No medications yet. Click "Add New Medication".
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>

                <button
                    type="button"
                    onClick={() => openModal("drugHistories")}
                    className=" block ml-auto bg-blue-500  text-white  rounded-xl w-l  p-2 right-0  hover:bg-blue-300 text-sm"
                >
                    Add New Medication

                </button>



                <section className="mb-10 relative group">

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
                        {formData.allergies.map((allergy, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : ''}>

                                <td key={`allergy-${index}`} className="border px-4 py-2"><input
                                    type="text"
                                    id={`allergy-${index}`}
                                    name={`allergy`}
                                    className=""
                                    value={allergy.allergy}
                                    onChange={(e) => handelChange(e, index, "allergies")}
                                /></td>
                                <td key={`reaction-${index}`} className="border px-4 py-2"><input
                                    type="text"
                                    id={`reaction-${index}`}
                                    name={`reaction`}
                                    className=" "
                                    value={allergy.reaction}
                                    onChange={(e) => handelChange(e, index, "allergies")}
                                /></td>
                                <td key={`severity-${index}`} className="border px-4 py-2"><input
                                    type="text"
                                    id={`severity-${index}`}
                                    name={`severity`}
                                    className=""
                                    value={allergy.severity}
                                    onChange={(e) => handelChange(e, index, "allergies")}
                                /></td>


                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
                <button
                    type="button"
                    onClick={() => openModal("allergies")}
                    className=" block ml-auto bg-blue-500  text-white  rounded-xl w-l  p-2 right-0  hover:bg-blue-300 text-sm"
                >
                    Add New Allergy

                </button>

                <section className="flex-col flex mb-10 ">
                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Chronic disease</h2>
                    <div className="flex-row flex space-x-2  flex-wrap gap-6 w-full">
                        {formData.chronicDiseases.map((Diseases, index) => (

                            <input
                                key={`${Diseases.name}-${index}`}
                                type="text"
                                id={`DiseaseName-${index}`}
                                name={`name`}
                                className="bg-blue-500 text-center rounded-lg h-8 w-35"
                                value={Diseases.name}
                                onChange={(e) => handelChange(e, index, "chronicDiseases")}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => openModal("chronicDiseases")}
                            className=" block ml-auto bg-blue-500  text-white  rounded-xl w-l  p-2 right-0  hover:bg-blue-300 text-sm"
                        >
                            Add New disease

                        </button>
                    </div>

                </section>


                <section className="mb-10 relative group">

                    <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-1 mb-4">Medical History</h2>
                    <table className="min-w-full text-sm table-auto border ">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Condition</th>
                            <th className="px-4 py-2">Diagnosis Year</th>

                        </tr>
                        </thead>
                        <tbody>
                        {formData.medicalHistories.map((mh, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-blue-50 ' : ''}>
                                <td key={`mhDescription-${index}`} className=" w-[40vw] text-center py-2"><textarea
                                    type="text"
                                    id={`mhDescription-${index}`}
                                    name={`description`}
                                    className=" w-full ml-5"
                                    value={mh.description}
                                    onChange={(e) => handelChange(e, index, "medicalHistories")}
                                    rows={3}
                                /></td>

                                <td key={`date-${index}`} className=" text-center py-2"><input
                                    type="date"
                                    id={`date-${index}`}
                                    name={`date`}
                                    className="text-center "
                                    value={mh.date}
                                    onChange={(e) => handelChange(e, index, "medicalHistories")}
                                /></td>





                            </tr>
                        ))}
                        </tbody>
                    </table>

                </section>

                <button
                    type="button"
                    onClick={() => openModal("medicalHistories")}
                    className=" block ml-auto bg-blue-500  text-white  rounded-xl w-l  p-2 right-0  hover:bg-blue-300 text-sm"
                >
                    Add New Medical Record

                </button>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-3 rounded-lg mt-5 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={saving}
                    onClick={handleSubmit}
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
            <GenericModal
                open={modalOpen}
                type={modalType}
                value={modalValue}
                onChange={handleModalChange}
                onClose={closeModal}
                onSave={saveNewItem}
                config={MODAL_CONFIG}
            />
        </div>
    );
}

function MedicalCard ({user}){
    const [enabled, setEnabled] = useState(false);
   return <div className="flex flex-row">
       <div className=" w-[550px] h-70 bg-blue-50 flex flex-col rounded-xl">
           <div className="flex flex-rw bg-red-300 rounded-t-xl">
               <img src="src/assets/MedicalSymbol.png" alt="Medical" className="w-16 mx-5  py-2"/>
               <p className="text-3xl justify-center items-center flex">Emergancy Card</p>
           </div>
           <div className="flex-row flex ml-3 mt-5 items-center  relative">
               <div className="flex-col flex h-30 absolute mt-5 right-0">
                   <div className="flex-row flex">
                       <p className="rotate-270 leading-30 font-WDXL-Lubrifont-TC text-3xl">SCAN</p>


                       <Link to={`http://localhost:5173/findpatient/${user.phoneNumber}`}>

                           <QRCode
                               className="flex mr-6  w-25 h-30 "
                               bgColor='#eff6ff'
                               value={`http://localhost:5173/findpatient/${user.phoneNumber}`} />
                       </Link>
                   </div>
                   <div className="flex justify-center">
                       <span className="material-icons-round px-2">water_drop </span> {user.bloodType}
                   </div>

               </div>
               <img
                   src={user.imageUrl != null ? user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                   alt="profile" className="w-20 h-20 rounded-full object-cover "/>

               <div className="flex-col ml-5 w-60 overflow-x-hidden whitespace-nowrap text-ellipsis">
                   <p>{user.fullName}</p>
                   <p>phone: {user.phoneNumber}</p>
                   <p>ID: {user.nationalId}</p>


               </div>


           </div>

           <div className="flex-col ml-5 mt-5">
               <p>Emergency Contact Details</p>
               <p>Name/Relation : {user?.emergencyContact.econtactName}  /  {user?.emergencyContact.econtactRelation}</p>
               <p>PhoneNumber : {user?.emergencyContact.econtactPhone}</p>
           </div>

       </div>
       <div className="flex flex-row w-[25vw] justify-center ">
           <div className='has-tooltip mr-2'>
               <span className='tooltip rounded shadow-lg p-2 bg-blue-900 text-white'>Turn Medical Profile ON allows people to view your profile publicly </span>

               Medical Profile
           </div>
           <div>

               {/*<ToggleSwitch checked={enabled} onChange={() => setEnabled(!enabled)}/>*/}
               {/*<span className="ml-2">{enabled ? "On" : "Off"}</span>*/}
           </div>
       </div>
   </div>
}



// this for chenge pass

function ChangePassword({ user, screenSize }) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validatePasswords = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirmation password don't match");
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters long");
            return false;
        }
        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password");
            return false;
        }
        return true;
    };

    return (
        <form onSubmit={
            async (e) => {
                e.preventDefault();
                setError(null);
                setResponse(null);

                if (!validatePasswords()) {
                    return;
                }

                try {
                    setLoading(true);
                    const passwordData = {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    };

                    const result = await APICalls.changePasswordSecure(passwordData);
                    setResponse(result);
                    toast.success('Password changed successfully!');

                    // Clear form on success
                    setFormData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });

                } catch (error) {
                    setError(error.message);
                    toast.error(error.message || 'Failed to change password');
                } finally {
                    setLoading(false);
                }
            }
        }>
            <div className="flex-row">
                <div className="flex flex-row">
                    <div className="relative overflow-hidden rounded-full mb-10">
                        {/* Profile image section - same as ProfileSettings */}
                        <img
                            src={user.imageUrl != null ? user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                            alt={user.gender === "male" ? DefaultMale : DefaultFemale}
                            className="w-50 h-50 rounded-full object-cover"
                        />
                    </div>

                    <div className={`flex flex-col space-y-4`}>
                        <div className={`flex flex-col space-y-2`} style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg">Username</label>
                            <input
                                type="text"
                                className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                value={user.username}
                                disabled={true}
                            />
                        </div>
                        <div className="flex flex-col space-y-2" style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg">Email</label>
                            <input
                                type="text"
                                className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                value={user.email}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 h-130">
                {/* Current Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Enter your current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* New Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Changing Password...' : 'Change Password'}
                </button>
            </div>

            {response && <p className="text-green-500 mt-4">{response.message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
    );
}