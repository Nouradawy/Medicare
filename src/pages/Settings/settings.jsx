import React, {useState} from "react";
import {City, MalePic} from "../../Constants/constant.jsx";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import APICalls from "../../services/APICalls.js";

export default function Settings() {

    const user = JSON.parse(localStorage.getItem("userData"));

    const [Index, setIndex] = useState(0);

return(
    <>
        <NavBar/>
        <div className="flex flex-row  justify-center space-x-10">
            <div className="flex-col bg-white border-gray-200  rounded-lg pt-5 ">
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

                <SidebarItem setIndex={setIndex} Index={2} currentIndex={Index}>
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
                <SidebarItem setIndex={setIndex} Index={3} currentIndex={Index}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px"
                         viewBox="0 -960 960 960"
                         width="24px"
                         fill="#000000">
                        <path d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                    <p>Reservations</p>

                </SidebarItem>


            </div>

            <div className="flex-col w-[60vw] bg-white border-gray-200 border-1  rounded-lg p-10">
                    {Index === 0 ?
                        (<ProfileSettings user={user}/>) : (
                            Index === 1 ? ("") : (
                                Index === 2 ? (<MedicalHistory user={user} />) : (Index === 3 ? (<Reservations user={user} />) : (""))
                            )
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
                    setIndex(Index);
                    console.log(Index);
                }}
                className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
                {children}
            </button>
        </div>


    )
}

function ProfileSettings({user}) {
    let [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setformData] = useState({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        cityId: user.city.cityId,
        age: user.age,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value
        });
    };
    return(
        <form onSubmit={
            async (e) => {
                e.preventDefault();
                setError(null);
                try{
                    const result = await APICalls.UpdateUser(formData);
                    setResponse(result);

                } catch (error) {
                    setError(error.message);
                }

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
                });
            }
        }>
            <div className="flex-row">
                <img src={MalePic[Math.floor(Math.random() * 7)]} alt="profile" className="w-40  rounded-full"/>
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
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">Username</label>
                        <input type="text"
                               id="username"
                               name="username"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               value={formData.username}
                               onChange={handleChange}
                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
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
                <button
                    type="submit"
                    className="bg-blue-50"
                > Save</button>
            </div>
            {response && <p className="text-green-500">{response.message}</p>}
            {error && <p className="text-red-500">{error}</p>}

        </form>
        )

}

function MedicalHistory({user}) {
    const [formData , setformData ] = useState({
        allergies: user.allergy,
        chronicDiseases: user.chronicDiseases,
        drugHistories: user.drugHistory,
        medicalHistories: user.medicalHistory
    })
    const handelChange = (e, index, type) => {
        const { name, value } = e.target;

        if (type === "allergies") {
            const updatedAllergies = [...formData.allergies];
            updatedAllergies[index] = { ...updatedAllergies[index], [name]: value };
            setformData({
                ...formData,
                allergies: updatedAllergies,
            });
        } else if (type === "chronicDiseases") {
            const updatedChronicDiseases = [...formData.chronicDiseases];
            updatedChronicDiseases[index] = { ...updatedChronicDiseases[index], [name]: value };
            setformData({
                ...formData,
                chronicDiseases: updatedChronicDiseases,
            });
        } else if(type==="medicalHistories"){
            const updatedMedicalHistories = [...formData.medicalHistories];
            updatedMedicalHistories[index] = { ...updatedMedicalHistories[index], [name]: value };
            setformData({
                ...formData,
                medicalHistories: updatedMedicalHistories,
            });
        } else if(type==="drugHistories"){
            const updatedDrugHistories = [...formData.drugHistories];
            updatedDrugHistories[index] = { ...updatedDrugHistories[index], [name]: value };
            setformData({
                ...formData,
                drugHistories: updatedDrugHistories,
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        await APICalls.AddPatientInfo(formData);
    }

    const addAllergy = () => {
        const updatedAllergies = [...formData.allergies, { allergy: "" , description:"new description" }];
        setformData({ ...formData, allergies: updatedAllergies });
    };

    const addDiseas = () => {
        const updated = [...formData.chronicDiseases, { name: "" , description:"new description" }];
        setformData({ ...formData, chronicDiseases: updated });
    };
    const addDrug = () => {
        const updated = [...formData.drugHistories, { name: "" }];
        setformData({ ...formData, drugHistories: updated });
    };
    const addHistory = () => {
        const updated = [...formData.medicalHistories, { date: "" , description:"new description" }];
        setformData({ ...formData, medicalHistories: updated });
    };

    return(
        <form onSubmit={handleSubmit}>

            <p>Allergies</p>
            <div className="flex flex-row ">
                <p className="border-2 border-gray-500 rounded-tl-lg p-3 bg-blue-50 w-80" > Name</p>
                <p className="border-2 border-gray-500 rounded-tr-lg p-3 bg-blue-50 w-full"> description</p>
            </div>
            {formData.allergies.map((allergy, index) => (
                <div key={index} className="flex flex-row ">

                    <input
                        type="text"
                        id={`allergy-${index}`}
                        name={`allergy`}
                        className=" border-2 border-gray-200  p-3 w-80"
                        value={allergy.allergy}
                        onChange={(e) => handelChange(e,index,"allergies")}
                    />
                    <input
                        type="text"
                        id={`description-${index}`}
                        name={`description`}
                        className=" border-2 border-gray-200  p-3 w-full"
                        value={allergy.description}
                        onChange={(e) => handelChange(e,index , "allergies")}
                    />
                </div>

            ))}

            <button
                type="button"
                onClick={addAllergy}
                className="bg-blue-500 text-white p-3 rounded-lg"
            >Add Allergy</button>


            <p>Chronic disease</p>
            <div className="flex flex-row ">
                <p className="border-2 border-gray-500 rounded-tl-lg p-3 bg-blue-50 w-80" > Name</p>
                <p className="border-2 border-gray-500 rounded-tr-lg p-3 bg-blue-50 w-full"> description</p>
            </div>
            {formData.chronicDiseases.map((Diseases, index) => (
                <div key={index} className="flex flex-row ">

                    <input
                        type="text"
                        id={`DiseaseName-${index}`}
                        name={`name`}
                        className=" border-2 border-gray-200  p-3 w-80"
                        value={Diseases.name}
                        onChange={(e) => handelChange(e,index,"chronicDiseases")}
                    />
                    <input
                        type="text"
                        id={`DiseaseDescription-${index}`}
                        name={`description`}
                        className=" border-2 border-gray-200  p-3 w-full"
                        value={Diseases.description}
                        onChange={(e) => handelChange(e,index,"chronicDiseases")}
                    />


                </div>

            ))}
            <button
                type="button"
                onClick={addDiseas}
                className="bg-blue-500 text-white p-3 rounded-lg"
            >Add Disease </button>

            <p>Drug History</p>
            <div className="flex flex-row ">
                <p className="border-2 border-gray-500 rounded-tl-lg p-3 bg-blue-50 w-80" > Name</p>

            </div>
            {formData.drugHistories.map((drug, index) => (
                <div key={index} className="flex flex-row ">

                    <input
                        type="text"
                        id={`drugName-${index}`}
                        name={`drugName`}
                        className=" border-2 border-gray-200  p-3 w-80"
                        value={drug.drugName}
                        onChange={(e) => handelChange(e,index,"drugHistories")}
                    />
                </div>

            ))}
            <button
                type="button"
                onClick={addDrug}
                className="bg-blue-500 text-white p-3 rounded-lg"
            >Add Drug </button>

            <p>Medical History</p>
            <div className="flex flex-row ">
                <p className="border-2 border-gray-500 rounded-tl-lg p-3 bg-blue-50 w-80" > Date</p>
                <p className="border-2 border-gray-500 rounded-tr-lg p-3 bg-blue-50 w-full"> description</p>
            </div>
            {formData.medicalHistories.map((mh, index) => (
                <div key={index} className="flex flex-row ">

                    <input
                        type="date"
                        id={`date-${index}`}
                        name={`date`}
                        className=" border-2 border-gray-200  p-3 w-80"
                        value={mh.date}
                        onChange={(e) => handelChange(e,index,"medicalHistories")}
                    />
                    <input
                        type="text"
                        id={`mhDescription-${index}`}
                        name={`description`}
                        className=" border-2 border-gray-200  p-3 w-full"
                        value={mh.description}
                        onChange={(e) => handelChange(e,index,"medicalHistories")}
                    />


                </div>

            ))}
            <button
                type="button"
                onClick={addHistory}
                className="bg-blue-500 text-white p-3 rounded-lg"
            >Add History </button>

            <button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded-lg mt-5"
                onClick={() => {
                    console.log(formData);
                }}
            >
            Save Changes
            </button>
        </form>
    )
}

function  Reservations({user}) {
    const doctorList = JSON.parse(localStorage.getItem("DoctorsList"));
    const [reservation , SetReservation] = useState(user.reservations);
    const [formData , setformData ] = useState({
        status:"Canceled",
        id:''
    })
    return(

            <div className="flex flex-col space-y-4">

                <div className="flex flex-col md:flex-row justify-center items-center bg-blue-100 border-blue-300 border-t border-b">
                    <p className="flex-1 text-center md:text-left px-4">Doctor Name</p>
                    <p className="flex-1 text-center">Location</p>
                    <p className="flex-1 text-center">States</p>
                    <p className="flex-1 text-center">Date</p>
                    <p className="flex-1 text-center">Time</p>
                    <p className="w-[20px]"></p>
                </div>

                {
                    reservation !== null ? (reservation.map((res, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row justify-center items-center border-b border-gray-200 pb-2">

                            <div className="flex flex-col flex-1 text-center md:text-left px-4">
                                <p>{doctorList.find(doctor => doctor.doctorId === res.doctorId).fullName}</p>
                                <p>{doctorList.find(doctor => doctor.doctorId === res.doctorId).specialty}</p>
                            </div>

                            <p className="flex-1 text-center">{doctorList.find(doctor => doctor.doctorId === res.doctorId).address}, {doctorList.find(doctor => doctor.doctorId === res.doctorId).city}</p>
                            <p className="flex-1 text-center">{res.status}</p>
                            <p className="flex-1 text-center">{new Date(res.date).toLocaleDateString()}</p>
                            <p className="flex-1 text-center">{new Date(res.date).toLocaleTimeString()}</p>


                            {res.status !== "Canceled" ? (<button
                                type="button"
                                className="bg-red-400 text-white p-2 rounded-lg mt-2 md:mt-0  cursor-pointer "
                                onClick={async () => {
                                    // Handle cancel reservation logic here
                                    if (window.confirm("Are you sure you want to cancel this reservation?")) {
                                        // Call the API to cancel the reservation
                                        setformData({
                                            ...formData,
                                            id: res.id,
                                            status: "Canceled"
                                        });
                                        await APICalls.CancelAppointment({
                                            ...formData,
                                            id: res.id,
                                            status: "Canceled"
                                        });
                                        alert("Reservation canceled successfully.");
                                        await APICalls.GetCurrentUser();
                                        await SetReservation( JSON.parse(localStorage.getItem("userData")).reservations);
                                        alert("Reservation list updated.");
                                        console.log("Cancel reservation for", res);
                                    } else {
                                        alert("Cancellation aborted.");
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.textContent = "cancel Reservation";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.textContent = "x";
                                }}
                            >
                                x
                            </button>):("")}
                        </div>))):(<p> No Reservations found ....</p>)
                }



            </div>
    )
}