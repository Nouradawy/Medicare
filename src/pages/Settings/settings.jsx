import React, {useState,useEffect} from "react";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import APICalls from "../../services/APICalls.js";
import { useNavigate } from 'react-router-dom';
import DoctorCalendar from '../doctorDashboard/DoctorCalendar.jsx';
import { Calendar, Clock ,Check , Plus , CirclePlus, Loader2} from 'lucide-react';
import MedicalHistoryReport from "./MedicalHistoryReport.jsx";
import QRCode from "react-qr-code";
import toast, { Toaster } from 'react-hot-toast';



export default function Settings() {
    const fileInputRef = React.useRef();
    const user = JSON.parse(localStorage.getItem("userData"));
    const MainScreenSize = 60;
    const userRole = user.roles[0].name;



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
        }
        // 3) Ensure we restore the tab on mount
        const saved = localStorage.getItem("settings.activeTab");
        if (saved !== null) {
            setIndexState(Number(saved));
        }
        setLoading(false);
    }, []);



return(
    <>
        <Toaster position="top-right" />
        <NavBar/>
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

function ProfileSettings({user ,fileInputRef , screenSize}) {
    let [response, setResponse] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userImgurl, setUserImgurl] = useState(user?.imageUrl);
    const [formData, setformData] = useState({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        cityId: user.city.cityId,
        age: user.age,
        nationalId: user.nationalId,
        phoneNumber: user.phoneNumber,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value
        });
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        await APICalls.uploadProfilePicture(formData);
        await APICalls.GetCurrentUser();
        user =JSON.parse(localStorage.getItem("userData"));
        setLoading(false);
        setUserImgurl(user?.imageUrl);
    };


    return(
        <form onSubmit={
            async (e) => {
                e.preventDefault();
                setError(null);
                setSaving(true);
                try{
                    const result = await APICalls.UpdateUser(formData);
                    setResponse(result);
                    toast.success('Profile updated successfully!');
                } catch (error) {
                    setError(error.message);
                    toast.error(error.message || 'Failed to update profile');
                    setSaving(false);
                } finally{
                    await APICalls.GetCurrentUser();
                    user = JSON.parse(localStorage.getItem("userData"));
                    setformData( {
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        gender: user.gender,
                        dateOfBirth: user.dateOfBirth,
                        address: user.address,
                        cityId: user.city.cityId,
                        age: user.age,
                        nationalId: user.nationalId,
                        phoneNumber: user.phoneNumber,
                    });
                    setSaving(false);
                }
            }
        }>
            <div className="flex-row">

                <div className="flex flex-row">
                    <div className="relative overflow-hidden rounded-full mb-10">
                        {loading && <div className="absolute rounded-full w-50 h-50 bg-blue-500/30 ">
                            <img src='src/assets/Spinner@1x-1.0s-200px-200px.svg' alt="loading"
                                 className=" w-[130px] h-[130px] ml-9 mt-8 "/>
                        </div>}


                        <img

                            src={userImgurl != null ? userImgurl : (user.gender === "male" ? DefaultMale : DefaultFemale)}
                            alt="user" className="w-50 h-50 rounded-full object-cover"/>
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                onChange={handleFileUpload}
                            />

                            <button
                                onClick={handleButtonClick}
                                type="button"
                                className="absolute rounded-full w-50 h-50 bg-black/20 flex items-center justify-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-100 ">
                                <div className="flex flex-row justify-center space-x-3 text-white"><Plus
                                    className="w-8 h-8"/> <p className="leading-8">Select
                                    image</p></div>
                            </button>
                        </>

                    </div>

                    <div className={`flex flex-col space-y-4`}>
                        <div className={`flex flex-col space-y-2`} style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg ">Username</label>
                            <input type="text"
                                   id="username"
                                   name="username"
                                   className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                   value={formData.username}
                                   onChange={handleChange}
                                   disabled={true}
                            />
                        </div>
                        <div className=" flex flex-col space-y-2" style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg ">Email </label>
                            <input type="text"
                                   id="email"
                                   name="email"
                                   className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                                   placeholder="Email"
                                   value={formData.email}
                                   onChange={handleChange}
                            />

                        </div>
                    </div>
                </div>


            </div>
            
            <div className="flex flex-col space-y-4">
                {/*first block*/}
                <div className=" flex flex-col space-y-2">
                    <label className="text-lg ">Full Name</label>
                    <input type="text"
                           id="fullName"
                           name="fullName"
                           className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                           value={formData.fullName}
                           onChange={handleChange}
                    />
                </div>
                {/*second block*/}


                {/*third block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">Gender</label>
                        <select
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className=" flex flex-col space-y-2 ">
                        <label className="text-lg ">Age </label>
                        <input
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            type="number"
                            id="age"
                            name="age"
                            min="0"
                            max="120"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className=" flex flex-col space-y-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
                {/*forth block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">address</label>
                        <input type="text"
                               id="address"
                               name="address"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="address"
                               value={formData.address}
                               onChange={handleChange}

                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">City</label>
                        <select
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            id="cityId"
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                        >
                            {City.map((city,Index) => (
                                <option key={city} value={Index+1}> {city}</option>
                            ))}
                        </select>
                    </div>



                </div>

                {/*fifth block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">phoneNumber</label>
                        <input type="text"
                               id="phoneNumber"
                               name="phoneNumber"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="phoneNumber"
                               value={formData.phoneNumber}
                               onChange={handleChange}

                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">nationalId</label>
                        <input type="text"
                               id="nationalId"
                               name="nationalId"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="nationalId"
                               value={formData.nationalId}
                               onChange={handleChange}

                        />
                    </div>





                </div>
                <button
                    type="submit"
                    disabled={saving}
                    onClick={()=>{}}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow
                    hover:shadow-md hover:bg-blue-600
                    active:shadow-sm active:translate-y-[1px]
                    transition-all duration-150"
                    aria-pressed="false"
                >
                    {saving && (
                        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    )}

                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>
            {response && <p className="text-green-500">{response.message}</p>}
            {error && <p className="text-red-500">{error}</p>}

        </form>
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

function  Reservations() {
    const [doctorList , SetdoctorList] = useState(JSON.parse(localStorage.getItem("DoctorsList")) || []);
    const [reservation , SetReservation] = useState(JSON.parse(localStorage.getItem("PatientReservations")) || []);
    const [expandedId, setExpandedId] = useState(null);
    const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem("ReservationReviews") || "{}"));

    const [savingId, setSavingId] = useState(null);
    const [formData , setformData ] = useState({
        status:"Canceled",
        id:''
    });

    useEffect(() => {
        const fetchReservations = async () => {
            // Fetch doctor list if not already loaded
            try{
                let doctors = JSON.parse(localStorage.getItem("DoctorsList"));
                if (!doctors || doctors.length === 0) {
                    await APICalls.GetDoctorsList();
                    doctors = JSON.parse(localStorage.getItem("DoctorsList")) || [];
                }
                SetdoctorList(doctors);
                await APICalls.PatientReservations();
                const data = JSON.parse(localStorage.getItem("PatientReservations")) || [];
                SetReservation(data);
            } catch{
                toast.error("Failed to load reservations");
            }

        };
        if(reservation.length === 0 || doctorList.length === 0)
        {
            fetchReservations();
        }

    }, [reservation.length, doctorList.length]);

    const doctorsById = React.useMemo(() => {
        const map = {};
        (doctorList || []).forEach(d => {
            const id = d.id || d.doctorId || d.userId;
            if (id) map[id] = d;
        });
        return map;
    }, [doctorList]);

    const formatDate = (r) => {
        const val = r.date || r.appointmentDate || r.createdAt || r.startTime || r.time;
        if (!val) return "—";
        const d = new Date(val);
        if (isNaN(d)) return String(val);
        return d.toLocaleDateString();
    };

    const formatTime = (r) => {
        const t = r.time || r.appointmentTime;
        if (t) return t;
        const val = r.startTime || r.date || r.appointmentDate;
        if (!val) return "—";
        const d = new Date(val);
        if (isNaN(d)) return "—";
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getDoctorName = (r) => {
        const d = doctorsById[r.doctorId] || doctorsById[r.doctor?.id];
        return r.doctorName || d?.fullName || d?.name || "Doctor";
    };

    const getLocation = (r) => {
        const d = doctorsById[r.doctorId] || doctorsById[r.doctor?.id];
        return r.location || d?.clinic?.address || d?.address || "—";
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const onChangeReviewText = (id, text) => {
        setReviews(prev => ({ ...prev, [id]: { ...(prev[id] || {}), text } }));
    };

    const onChangeReviewRating = (id, rating) => {
        setReviews(prev => ({ ...prev, [id]: { ...(prev[id] || {}), rating } }));
    };

    const saveReview = async (id) => {
        const current = reviews[id] || {};
        if (!current.rating || !current.text?.trim()) {
            toast.error("Please add rating and review text");
            return;
        }try {
            setSavingId(id);
            // TODO: replace with real API call, e.g., APICalls.AddReview({ reservationId: id, ...current })
            const all = JSON.parse(localStorage.getItem("ReservationReviews") || "{}");
            all[id] = { ...current, savedAt: new Date().toISOString() };
            localStorage.setItem("ReservationReviews", JSON.stringify(all));
            toast.success("Review saved");
        } catch {
            toast.error("Failed to save review");
        } finally {
            setSavingId(null);
        }
    };

    const statusBadgeClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "completed") return "bg-green-100 text-green-800";
        if (s === "canceled" || s === "cancelled") return "bg-red-100 text-red-800";
        if (s === "confirmed") return "bg-blue-100 text-blue-800";
        if (s === "pending") return "bg-yellow-400 text-black";
        return "bg-gray-100 text-gray-800";
    };

    const StarRating = ({ value, onChange }) => {
        const stars = [1, 2, 3, 4, 5];
        return (
            <div className="flex items-center gap-1">
                {stars.map(s => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => onChange(s)}
                        className={(value >= s ? "text-yellow-400" : "text-gray-300") + " text-xl leading-none"}
                        aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                        title={`${s} star${s > 1 ? "s" : ""}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };
    return (
        <main className="flex-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Reservations</h2>
                </div>

                <div className="flex flex-col p-6 space-y-6">
                    {(reservation || []).map((r, idx) => {
                        const id = r.id || r.reservationId || idx;
                        const isOpen = expandedId === id;
                        const meds = r.medications || r.drugHistories || [];
                        const report = r.latestReport || r.doctorReport || r.report?.description || r.report || "";
                        const queue = r.queueNumber || "—";
                        const reviewState = reviews[id] || { rating: 0, text: "" };

                        return (
                            <div key={id} className="group bg-white transition-colors duration-150 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div
                                    className={`px-6 py-4 grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-gray-50 ${isOpen ? "border-b-2 border-blue-500" : ""}`}
                                    onClick={() => toggleExpand(id)}
                                >


                                    <div className="col-span-2">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Date</div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            <i className="fa-regular fa-calendar mr-2 text-gray-400"></i>{formatDate(r)}
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Doctor Name</div>
                                        <div className="text-sm text-gray-600 font-semibold">{getDoctorName(r)}</div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Location</div>
                                        <div className="text-sm text-gray-600 truncate">
                                            <i className="fa-solid fa-location-dot mr-1"></i>{getLocation(r)}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Time</div>
                                        <div className="text-sm text-gray-600">{formatTime(r)}</div>
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Status</div>
                                        <span className={`status-badge inline-flex px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(r.status)}`}>
                      {r.status || "—"}
                    </span>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="bg-gray-50 border-blue-100 px-6 py-6 pl-8 animate-fade-in">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex flex-wrap items-baseline gap-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Queue Number:</span>
                                                <span className="text-base font-bold text-gray-900">{queue}</span>
                                            </div>

                                            <div className="flex flex-wrap items-baseline gap-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Latest Doctor Report:</span>
                                                {report ? (
                                                    <a className="text-sm text-blue-600 hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                                                        {typeof report === "string" ? report : "Report"}
                                                    </a>
                                                ) : (
                                                    <span className="text-sm text-gray-500">No report available</span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Medications:</span>
                                                {Array.isArray(meds) && meds.length > 0 ? (
                                                    meds.map((m, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                              {m.drugName ? `${m.drugName}${m.dosage ? ` ${m.dosage}` : ""}` : (typeof m === "string" ? m : "Medication")}
                            </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-500">None</span>
                                                )}
                                            </div>

                                            { r.status ==="Completed" &&  (<div className="pt-1">
                                                <div
                                                    className="text-xs font-bold text-gray-500 uppercase tracking-wide">Review
                                                    Last Visit
                                                </div>
                                                <div
                                                    className="border border-gray-200 rounded p-3 bg-white mt-1 text-sm text-gray-600">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-sm font-medium">Add a review for this
                                                            visit
                                                        </div>
                                                        <StarRating value={reviewState.rating || 0}
                                                                    onChange={(v) => onChangeReviewRating(id, v)}/>
                                                    </div>
                                                    <textarea
                                                        rows={3}
                                                        className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm"
                                                        placeholder="Share feedback about your visit..."
                                                        value={reviewState.text || ""}
                                                        onChange={(e) => onChangeReviewText(id, e.target.value)}
                                                    />
                                                    <div className="mt-2 flex justify-end">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                                                            disabled={savingId === id}
                                                            onClick={() => saveReview(id)}
                                                        >
                                                            {savingId === id ? "Saving..." : "Save Review"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {(!reservation || reservation.length === 0) && (
                        <div className="px-4 py-6 text-sm text-gray-500">No reservations found</div>
                    )}
                </div>
            </div>
        </main>
    );
}


function DoctorAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    revenue: 0,
    todayRemaining: 0,
    rating: 0
  });

  const [ShowPatientInfo , setShowPatientInfo] = useState(false);
  const [appointmentIndex , setAppointmentIndex] = useState(0);
  // Fetch all appointments and stats when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        // Check if the user data is properly loaded
          await APICalls.DoctorReservations();
          const doctorApp = JSON.parse(localStorage.getItem("DoctorReservations"));
          setAppointments(doctorApp);
          calculateStats(doctorApp);
        // if (user && user.doctor && user.doctor.reservations) {
        //   setAppointments(user.doctor.reservations);
        //   calculateStats(user.doctor.reservations);
        // } else {
        //   // If no doctor data, try to get from localStorage
        //
        //   if (userData && userData.doctor && userData.doctor.reservations) {
        //     setAppointments(userData.doctor.reservations);
        //     calculateStats(userData.doctor.reservations);
        //   }
        // }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = (reservations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppointments = reservations.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime() && app.status !== "Canceled";
    });
    
    const todayRemaining = todayAppointments.filter(app => app.status !== "Completed").length;
    
    // Unique patients count
    const uniquePatientIds = [...new Set(reservations.map(app => app.patientId))];
    
    // New patients in the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newPatients = reservations.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= lastMonth;
    }).reduce((unique, app) => {
      if (!unique.includes(app.patientId)) {
        unique.push(app.patientId);
      }
      return unique;
    }, []).length;
    
    // Mock revenue calculation (250 EGP per appointment)
    const revenue = reservations.filter(app => app.status === "Completed").length * 250;
    
    // Mock rating (between 4.0 and 5.0)
    const rating = (4 + Math.random()).toFixed(1);
    
    setStats({
      totalPatients: uniquePatientIds.length,
      newPatients,
      revenue,
      todayRemaining,
      rating
    });
  };

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Call API to update appointment status
      await APICalls.UpdateAppointmentStatus({
        id: appointmentId,
        status: newStatus
      });
      
      // Refresh user data and appointments
      await APICalls.GetCurrentUser();
      const userData = JSON.parse(localStorage.getItem("userData"));
      setAppointments(userData.doctor.reservations);
      calculateStats(userData.doctor.reservations);
      
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return false;
    }
  };

  // Get patient list from localStorage
  const patientList = JSON.parse(localStorage.getItem("DoctorReservations") || "[]");

  // Filter appointments for the selected date
  const getFilteredAppointments = () => {
    const filteredDate = new Date(selectedDate);
    filteredDate.setHours(0, 0, 0, 0);
    
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === filteredDate.getTime();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() && 
           selectedDate.getMonth() === today.getMonth() && 
           selectedDate.getFullYear() === today.getFullYear();
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Get doctor's name from user data
  const doctorName = user?.fullName || "Doctor";

  return (
      <div className="min-h-screen bg-gray-50 pb-10">
          {/* Welcome Banner */}
          <div className="bg-[#e8e8d4] p-4 sm:p-6 rounded-lg shadow-sm mb-6 relative">
              <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Welcome {doctorName}!</h1>
                      <p className="text-base sm:text-lg mt-1">you have {stats.todayRemaining} patients remaining
                          today!</p>
                      <p className="text-base sm:text-lg">your Todays Rating is <span
                          className="font-bold">{stats.rating}</span></p>
                  </div>
                  <div
                      className="relative sm:absolute right-8 top-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 mt-4 sm:mt-0">
                      <img
                          src="/api/placeholder/150/100"
                          alt="Stethoscope"
                          className="opacity-80 w-32 sm:w-auto"
                      />
                  </div>
              </div>
              <div className="absolute top-4 right-4 text-gray-600 hidden sm:block">
                  <p>{new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                  })}</p>
                  <p className="text-right">{new Date().toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                  })}</p>
              </div>
              <div className="block sm:hidden mt-4 text-gray-600">
                  <p>{new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                  })}</p>
                  <p>{new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}</p>
              </div>
          </div>

          <div className="px-2 sm:px-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-7xl mx-auto">
                  <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">Revenue</h3>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-3xl font-bold">{stats.revenue} EGP</p>
                              <p className="text-sm text-gray-500">Per day</p>
                          </div>
                          <div className="flex items-center text-green-500">
                              <span className="text-xs mr-1">↑</span>
                              <span className="text-sm">2%</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">Total
                          patients</h3>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-3xl font-bold">{stats.totalPatients}</p>
                              <p className="text-sm text-gray-500">&nbsp;</p>
                          </div>
                          <div className="flex items-center text-green-500">
                              <span className="text-xs mr-1">↑</span>
                              <span className="text-sm">3%</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">New
                          patients</h3>
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-3xl font-bold">{stats.newPatients}</p>
                              <p className="text-sm text-gray-500">Per month</p>
                          </div>
                          <div className="flex items-center">
                              <span className="text-xs mr-1">&nbsp;</span>
                              <span className="text-sm">&nbsp;</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-[1700px] mx-auto">
                  {/* Today's Appointments */}
                  <div className={`@container ${ShowPatientInfo ? "lg:col-span-3 ":"lg:col-span-4 "} `}>
                      <div className="bg-white rounded-lg shadow overflow-hidden">
                          <div
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 p-4 border-b">
                              <h2 className="text-lg sm:text-xl font-bold">Reservations</h2>
                              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                              <span className="font-medium">
                                  {selectedDate.toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric'
                                  })}
                                  {isToday() ? " (Today)" : ""}
                              </span>
                              </div>
                          </div>
                          <div className="divide-y divide-gray-100">
                              {filteredAppointments.length > 0 ? (
                                  filteredAppointments.map((appointment, index) => {
                                      // Find the patient info - if patient isn't in list, use placeholder data
                                      const patient = patientList.find(p => p.id === appointment.user.userId) || {
                                          fullName: "Patient #" + appointment.patientId,
                                          email: "Not available",
                                          phone: "Not available"
                                      };

                                      return (
                                          <div key={index}
                                               className={`p-4 hover:bg-gray-50 transition-colors ${index === 0 && "bg-[#E7F0EE]/42"}`}>
                                              <div className={`flex items-start ${index ===0 && "h-35"}`}>
                                                  <div className={`flex`}>
                                                      <img
                                                          src={appointment.user.imageUrl != null ? appointment.user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                                                          alt="Patient"
                                                          className="h-22 w-22 rounded-full object-cover z-1 ml-1"
                                                      />
                                                      {index == 0 && <div
                                                          className="w-[50cqw] md:w-[75cqw] bg-[#ABD1DD]/47 rounded-xl z-0 mt-15 absolute px-5 py-7 text-black/70">
                                                          <p className="max-[1700px]:w-[50cqw] overflow-hidden text-ellipsis whitespace-nowrap">{appointment.visitPurpose}</p>
                                                          <button type="button"
                                                                  onClick={()=> {
                                                                          setAppointmentIndex(index);
                                                                          setShowPatientInfo(!ShowPatientInfo);
                                                                      }
                                                          }
                                                                  className="absolute right-0 bottom-0 font-[Poppins] bg-[#FFFFFF]/47 rounded-xl px-4 py-2 mr-2 mb-2 text-xs">More
                                                              Details</button>
                                                      </div>
                                                  }

                                                  </div>
                                                  <div className="flex-grow">
                                                      <div
                                                          className={`flex justify-between items-start  ml-5`}>
                                                          <div className="flex flex-col">
                                                              <div className="flex flex-row">
                                                                  <h3 className="font-medium font-[Poppins]">{appointment.user.fullName}</h3>
                                                                  <p className="text-sm text-gray-500 ml-4">
                                                                      {/*TODO:Add New Patient tages logic*/}
                                                                      {appointment.status === "New Patient" ? "New Patient" : "Return Visit"}
                                                                  </p>

                                                              </div>
                                                              {index !== 0 && (<div
                                                                  className="flex items-center text-sm text-gray-500">
                                                                  <Clock size={14} className="mr-1"/>
                                                                  <span>{new Date(appointment.date).toLocaleTimeString([], {
                                                                      hour: '2-digit',
                                                                      minute: '2-digit'
                                                                  })}</span>
                                                              </div>)}
                                                          </div>
                                                          <div className="flex flex-col space-y-2">
                                                              {/*redesign appointment status should be !==*/}
                                                              {appointment.status !== "Canceled" && appointment.status !== "Completed" && (
                                                                  <>
                                                                      <button
                                                                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm"
                                                                          onClick={() => {
                                                                              // Show details or reschedule logic
                                                                          }}
                                                                      >
                                                                          Reschedule
                                                                      </button>
                                                                      <button
                                                                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-sm flex items-center"
                                                                          onClick={async () => {
                                                                              if (window.confirm("Mark this appointment as completed?")) {
                                                                                  const success = await updateAppointmentStatus(appointment.id, "Completed");
                                                                                  if (success) {
                                                                                      alert("Appointment marked as completed.");
                                                                                  }
                                                                              }
                                                                          }}
                                                                      >
                                                                          <Check size={14} className="mr-1"/> Dismiss
                                                                      </button>

                                                                      {index === 0 && (
                                                                          <div
                                                                              className="flex flex-col bg-orange-100 text-orange-700 px-3 py-0.5 rounded text-xs w-30 mt-5 items-center">
                                                                              <p>Next patient in</p>
                                                                              {/*TODO: add logic to calculate time left*/}
                                                                              <p>30min</p>
                                                                          </div>
                                                                      )}
                                                                  </>
                                                              )}
                                                              {appointment.status === "Completed" && (
                                                                  <span
                                                                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                                                                      Completed
                                                                  </span>
                                                              )}
                                                              {appointment.status === "Canceled" && (
                                                                  <span
                                                                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                                                      Canceled
                                                                  </span>
                                                              )}
                                                          </div>
                                                      </div>


                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })
                              ) : (

                                  <div className="py-8 text-center text-gray-500">
                                      <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400"/>
                                      <p>No appointments scheduled for {isToday() ? "today" : "this date"}.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Calendar Component */}
                  {ShowPatientInfo ===true ?<div className="lg:col-span-3">
                     <MedicalHistoryReport  appointment={filteredAppointments} Index={appointmentIndex} user={user}/>
                  </div> :<div className=" lg:col-span-2">
                      <DoctorCalendar
                          appointments={appointments}
                          onDateSelect={(date) => setSelectedDate(date)}

                      />
                  </div>}

              </div>

              {/* All Appointments Table */}
              <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-100 p-4 border-b">
                      <h2 className="text-lg sm:text-xl font-bold">All Patient Appointments</h2>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                          <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Patient Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Contact
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Time
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                              </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {appointments && appointments.length > 0 ? (
                              appointments.map((appointment, index) => {
                                  // Find the patient info - if patient isn't in list, use placeholder data
                                  const patient = patientList.find(p => p.id === appointment.patientId) || {
                                      fullName: "Patient #" + appointment.patientId,
                                      // TODO: Add email and phone number as contact info
                                      email: "Not available",
                                      phone: "Not available"
                                  };

                                  return (
                                      <tr
                                          key={index}
                                          className={`
                          ${appointment.status === "Canceled" ? "bg-red-50" :
                                              appointment.status === "Completed" ? "bg-green-50" :
                                                  appointment.status === "Confirmed" ? "bg-blue-50" : ""}
                      hover:bg-gray-50
                          `}
                                      >
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="flex items-center">
                                                  <div className="ml-4">
                                                      <div
                                                          className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                                                      <div
                                                          className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="text-sm text-gray-900">{appointment.email}</div>
                                              <div className="text-sm text-gray-500">{patient.phone}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${appointment.status === "Canceled" ? "bg-red-100 text-red-800" :
                              appointment.status === "Completed" ? "bg-green-100 text-green-800" :
                                  "bg-blue-100 text-blue-800"}
                          `}>
                            {appointment.status}
                          </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {new Date(appointment.date).toLocaleDateString()}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {new Date(appointment.date).toLocaleTimeString([], {
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                              })}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                              {appointment.status !== "Canceled" && appointment.status !== "Completed" && (
                                                  <div className="flex space-x-2">
                                                      <button
                                                          className="text-green-600 hover:text-green-900"
                                                          onClick={async () => {
                                                              if (window.confirm("Mark this appointment as completed?")) {
                                                                  const success = await updateAppointmentStatus(appointment.id, "Completed");
                                                                  if (success) {
                                                                      alert("Appointment marked as completed.");
                                                                  }
                                                              }
                                                          }}
                                                      >
                                                          Complete
                                                      </button>
                                                      <button
                                                          className="text-red-600 hover:text-red-900"
                                                          onClick={async () => {
                                                              if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                                                  const success = await updateAppointmentStatus(appointment.id, "Canceled");
                                                                  if (success) {
                                                                      alert("Appointment canceled successfully.");
                                                                  }
                                                              }
                                                          }}
                                                      >
                                                          Cancel
                                                      </button>
                                                  </div>
                                              )}
                                              {appointment.status === "Completed" && (
                                                  <span className="text-green-600">✓ Completed</span>
                                              )}
                                              {appointment.status === "Canceled" && (
                                                  <span className="text-red-600">✗ Canceled</span>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })
                          ) : (
                              <tr>
                                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                      No appointments found. Your scheduled appointments will appear here.
                                  </td>
                              </tr>
                          )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
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
                       <QRCode
                           className="flex mr-6  w-25 h-30 "
                           bgColor='#eff6ff'
                           value="https://www.google.com"/>
                   </div>
                   <p>share</p>


               </div>
               <img
                   src={user.imageUrl != null ? user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                   alt="profile" className="w-20 h-20 rounded-full object-cover "/>

               <div className="flex-col ml-5">
                   <p>ID: {user.nationalId}</p>
                   <p>phone: {user.phoneNumber}</p>
                   <p>E.Contact: {user.phoneNumber}</p>


               </div>


           </div>

           <div className="flex-col ml-5 mt-5">
               <p>Name: {user.fullName}</p>
           </div>

       </div>
       <div className="flex flex-row w-[25vw] justify-center ">
           <div className='has-tooltip mr-2'>
               <span className='tooltip rounded shadow-lg p-2 bg-blue-900 text-white'>Turn Medical Profile ON allows people to view your profile publicly </span>

               Medical Profile
           </div>
           <div>

               <ToggleSwitch checked={enabled} onChange={() => setEnabled(!enabled)}/>
               <span className="ml-2">{enabled ? "On" : "Off"}</span>
           </div>
       </div>
   </div>
}

function ToggleSwitch({checked, onChange}) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-colors relative ">
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform  ${checked?"translate-x-5": "translate-x-0"}`}></div>
            </div>
        </label>
    );
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

            <div className="flex flex-col space-y-4">
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