import React, {useState,useEffect} from "react";
import { useLocation , useNavigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Reservations from "./Reservations.jsx";
import ProfileSettings from "./ProfileSettings.jsx";
import ChangePassword from "./ChangePassword.jsx";
import MedicalHistory from "./MedicalHistory&MedicalCard.jsx";



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

