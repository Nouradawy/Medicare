import React, {useState,useEffect} from "react";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import APICalls from "../../services/APICalls.js";
import { useNavigate } from 'react-router-dom';
import DoctorCalendar from '../Homepage/components/DoctorCalendar.jsx';
import { Calendar, Clock ,Check , Plus} from 'lucide-react';
import DragDropFile from "../../components/FilePicker/DragDropFile.jsx";


export default function Settings() {
    const fileInputRef = React.useRef();
    const user = JSON.parse(localStorage.getItem("userData"));
    const MainScreenSize = 60;
    const userRole = user.roles[0].name;

    

    const [Index, setIndex] = useState(0); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {

        // Check if a user is logged in
    if (!user) {
        navigate('/login');
      }

      }, []);



return(
    <>
        <NavBar/>
        <div className="flex flex-row  justify-center space-x-10">
            {/*SideBar*/}
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

                  {/* Doctor-specific menu items */}
            {userRole === 'ROLE_DOCTOR' && (
                <>
              
                <SidebarItem setIndex={setIndex} Index={2} currentIndex={Index}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px"
                         viewBox="0 -960 960 960"
                         width="24px"
                         fill="#000000">
                        <path d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                    <p>Reservations</p>

                </SidebarItem>
                </>
             )}
            
            {/* Admin-specific menu items */}
            {userRole === 'ROLE_ADMIN' && (
                        <>
                            <SidebarItem setIndex={setIndex} Index={3} currentIndex={Index}>
                                <svg
                                    height="24px"
                                    width="24px"
                                    fill="#000000"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960">
                                    <path
                                        d="M280-240h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80Zm240-140h240v-60H520v60Zm0 120h160v-60H520v60ZM160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm280-440h80v-200h-80v200Zm40 220Z"/>
                                </svg>
                                <p>Manage Users</p>

                              </SidebarItem>
                        </>
                        )}
            
            {/* Patient-specific menu items */}
            {userRole === 'ROLE_PATIENT' && (
              <>
               <SidebarItem setIndex={setIndex} Index={4} currentIndex={Index}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px"
                         viewBox="0 -960 960 960"
                         width="24px"
                         fill="#000000">
                        <path d="M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                    <p>Reservations</p>

                </SidebarItem>

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
              </>
            )}


            </div>
            {/*MainScreen*/}
            <div className={`flex-col w-[${MainScreenSize.toString()}vw] bg-white border-gray-200 border-1 rounded-lg p-10 ${userRole === 'ROLE_DOCTOR' && Index === 2 ? "w-[80vw]" : "" }`}>
                    {Index === 0 ? (
                        <ProfileSettings user={user} fileInputRef={fileInputRef} screenSize={MainScreenSize} />
                    ) : Index === 1 ? (
                        ""
                    ) : Index === 2 ? (
                        <DoctorAppointments user={user} />
                    ) : Index === 4 ? (
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
                    setIndex(Index);
                    console.log(Index);
                }}
                className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
                {children}
            </button>
        </div>


    )
}

function ProfileSettings({user ,fileInputRef , screenSize}) {
    let [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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
        setLoading(false);
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
                    });
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

                        {/*TODO: adjust default image*/}

                        <img
                            src={user.imageUrl != null ? user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                            alt="profile" className="w-50 h-50 rounded-full object-cover"/>
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
        try{
            await APICalls.AddPatientInfo(formData);
        } finally {
            await APICalls.GetCurrentUser();
        }

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
    const [reservation , SetReservation] = useState(user);
    const [formData , setformData ] = useState({
        status:"Canceled",
        id:''
    });
    useState(async () => {
            await APICalls.PatientReservations();
            await SetReservation( JSON.parse(localStorage.getItem("PatientReservations")));

        }

    );
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
                    reservation.length >0 ? (reservation.map((res, index) => (
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
                                        await APICalls.PatientReservations();
                                        await SetReservation( JSON.parse(localStorage.getItem("PatientReservations")));
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
                        </div>))):(
                    <div className="py-8 text-center text-gray-500">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p>No Reservations Found </p></div>

                    )
                }



            </div>
    )
}


function DoctorAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    revenue: 0,
    todayRemaining: 0,
    rating: 0
  });

  // Fetch all appointments and stats when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
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
      <div className="bg-[#e8e8d4] p-6 rounded-lg shadow-sm mb-6 relative">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Welcome {doctorName}!</h1>
            <p className="text-lg mt-1">you have {stats.todayRemaining} patients remaining today!</p>
            <p className="text-lg">your Todays Rating is <span className="font-bold">{stats.rating}</span></p>
          </div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <img 
              src="/api/placeholder/150/100" 
              alt="Stethoscope" 
              className="opacity-80"
            />
          </div>
        </div>
        <div className="absolute top-4 right-4 text-gray-600">
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-right">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">Total patients</h3>
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
            <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">New patients</h3>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex items-center justify-between bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-bold">Reservations</h2>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {isToday() ? " (Today)" : ""}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredAppointments.length > 0 ? (
                    patientList.map((appointment, index) => {
                    // Find the patient info - if patient isn't in list, use placeholder data
                    const patient = patientList.find(p => p.id === appointment.user.userId) || {
                      fullName: "Patient #" + appointment.patientId,
                      email: "Not available",
                      phone: "Not available"
                    };

                    return (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex-shrink-0 mr-4">
                            <img
                              src="/api/placeholder/48/48"
                              alt="Patient"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{appointment.user.fullName}</h3>
                                <p className="text-sm text-gray-500">
                                  {appointment.status === "New Patient" ? "New Patient" : "Return Visit"}
                                </p>
                              </div>
                              <div className="flex space-x-2">
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
                                      <Check size={14} className="mr-1" /> Dismiss
                                    </button>
                                  </>
                                )}
                                {appointment.status === "Completed" && (
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                                    Completed
                                  </span>
                                )}
                                {appointment.status === "Canceled" && (
                                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                    Canceled
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{new Date(appointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              
                              {index === 0 && isToday() && (
                                <span className="ml-3 bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                                  Next patient in 30min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (

                  <div className="py-8 text-center text-gray-500">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p>No appointments scheduled for {isToday() ? "today" : "this date"}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calendar Component */}
          <div>
            <DoctorCalendar 
              appointments={appointments} 
              onDateSelect={(date) => setSelectedDate(date)} 
            />
          </div>
        </div>

        {/* All Appointments Table */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h2 className="text-xl font-bold">All Patient Appointments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                              <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.email}</div>
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
                          {new Date(appointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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