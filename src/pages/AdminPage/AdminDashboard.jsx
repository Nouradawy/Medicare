import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import React, {useEffect, useState} from "react";
import {map} from "framer-motion/m";
import APICalls from "../../services/APICalls.js";

function SidebarItem({children , setIndex, Index , currentIndex , setDoctorsList , setUserList}) {
    const isActive = Index === currentIndex;


    return(
        <div className="flex flex-row items-center gap-3">
            <button
                onClick={async () => {
                    setIndex(Index)
                    if (Index === 0) {
                        await APICalls.GetDoctorsList();
                        const Doctor = JSON.parse(localStorage.getItem("DoctorsList") || "[]");
                        setDoctorsList(Doctor);
                    }
                    if(Index === 1) {
                        await APICalls.GetAllUsers();
                        const Users = JSON.parse(localStorage.getItem("allUsers" || "[]"));
                        setUserList(Users);
                    }


                }}
                className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
                {children}
            </button>
        </div>


    )
}


export default function AdminDashboard () {
    const [Index, setIndex] = useState(0);
    const MainScreenSize = 80;
    const[DoctorsList, setDoctorsList] = useState([]);
    const [UserList , setUserList ] = useState( []);

    // const Doctor = JSON.parse(localStorage.getItem("DoctorsList") || "[]");
    // const Users = JSON.parse(localStorage.getItem("allUsers") || "[]");


    return (
        <>
            <NavBar/>
            <div className="flex flex-row  justify-center space-x-10 @container">
                {/*SideBar*/}
                <div className="flex-col bg-white border-gray-200  rounded-lg pt-5 @max-[800px]:hidden ">
                    {/*sidebar Item*/}
                    <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index} setDoctorsList={setDoctorsList}>

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
                        <p>DoctorsList</p>
                    </SidebarItem>


                    <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index} setUserList={setUserList}>
                        <svg
                            height="24px"
                            width="24px"
                            fill="#000000"
                            viewBox="0 -960 960 960"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                        </svg>
                        <p>PatientList</p>

                    </SidebarItem>


                </div>
                {/*MainScreen*/}
                <div className={`flex-col w-[${MainScreenSize.toString()}vw] bg-white border-gray-200 border-1 rounded-lg p-10 `}>
                    {Index === 0 ? (
                        DoctorsList.map((doc , index)=>(

                            <div key={index}>{doc.fullName}</div>
                        ))
                    ) : Index === 1 ? (
                        UserList.map((doc , index)=>(

                            <div key={index}>{doc.fullName}</div>
                        ))
                    ) : (
                        <div className="text-red-500">Error: Index does not exist</div>
                    )}
                </div>
            </div>
        </>
    )
}
