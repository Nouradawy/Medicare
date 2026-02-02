import React, {useState} from "react";
import APICalls from "../../services/APICalls.js";
import toast from "react-hot-toast";
import {DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import QRCode from "react-qr-code";

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
export default function MedicalHistory({user}) {
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