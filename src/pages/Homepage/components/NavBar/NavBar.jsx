import {Link, useNavigate} from 'react-router-dom';
import {DefaultFemale, DefaultMale, FemalePic, MalePic, user} from "../../../../Constants/constant.jsx";
import Dropdown, {DropdownItem} from "../Dropdown.jsx";
import authService from "../../../../services/authService.js";
import React, {useState, useEffect} from "react";


export default function NavBar(){
    const userData = localStorage.getItem("userData");
    const user = userData ? JSON.parse(userData) : null;
    const [loggedIn,setIsLoggedIn] = useState(false);


    const Navigate = useNavigate();



    useEffect(() => {
        if (user !== null) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    },[]);


    return(
        <div>
            <header className="flex justify-between items-center text-black py-6 px-8 md:px-32">
                <div className="flex items-center">
                <Link to="/" className="text-lg hover:text-blue-500">
                    {/* <img src="https://img.freepik.com/premium-psd/medicare-icon-isolated-transparent-background_1254062-3062.jpg?w=360" /> */}

                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" alt="Logo" className="w-12 h-12 mr-2"  viewBox="0 0 122.88 112.33"><defs></defs><title>medical</title>
                        <path className="cls-1" d="M15.09,8.48a7.6,7.6,0,0,1-1-3.08c-.07-1.7.8-3.11,2.71-4.31A7.9,7.9,0,0,1,18.3.37,5.67,5.67,0,0,1,25.53,8a6,6,0,0,1-5.38,3.64,6.75,6.75,0,0,1-5.06-3.11Z"/>
                        <path className="cls-1" d="M43.57,8.48a7.45,7.45,0,0,0,1-3.08c.07-1.7-.79-3.11-2.71-4.31A7.9,7.9,0,0,0,40.36.37,5.67,5.67,0,0,0,33.13,8a6,6,0,0,0,5.38,3.64,6.75,6.75,0,0,0,5.06-3.11Z"/>
                        <path className="cls-1" d="M102.74,4.26a20.14,20.14,0,0,1,4.92,39.67c0,1.37.09,1.24.15,3.46.11,3.85.23,7.94.23,11.31h0c0,25.13-4.4,53.63-40.84,53.63-13.52,0-23.42-6.48-30.35-15.52-8.17-10.66-12-25-12.73-35.91a35.48,35.48,0,0,1-6.4-6A84.69,84.69,0,0,1,9,42.4a4.62,4.62,0,0,1-.24-4.15l-.43-.83C2.47,26-1.36,13.43.46,8c.85-2.57,2.89-4.26,5.91-5.2A28.32,28.32,0,0,1,16,2a3.2,3.2,0,1,1-.33,6.4,22.39,22.39,0,0,0-7.38.53c-1,.31-1.59.67-1.73,1.09C5.25,13.81,8.83,24.34,14,34.5c.21.42.42.83.64,1.24a4.61,4.61,0,0,1,2.36,2,74.84,74.84,0,0,0,7.7,11.11,29.83,29.83,0,0,0,3.93,3.9l.47,0A25.36,25.36,0,0,0,33,49.24a70.59,70.59,0,0,0,8.13-11.36,4.62,4.62,0,0,1,2.34-2c5.42-10,9.34-20.78,8.54-25-.18-1-1-1.59-2.28-2a24.72,24.72,0,0,0-7.43-.81,3.2,3.2,0,0,1,0-6.4,30.17,30.17,0,0,1,9.47,1.14c3.41,1.15,5.85,3.25,6.54,6.9,1,5.5-3,17.68-8.91,28.7a4.65,4.65,0,0,1-.27,4.19,81.46,81.46,0,0,1-9.26,12.88A32.1,32.1,0,0,1,33.43,61c.69,9.32,4,21.28,10.79,30.15C49.51,98.08,57,103,67.19,103c28.18,0,31.57-23.56,31.57-44.33h0c0-4.35-.1-7.81-.19-11.06-.07-2.2-.13-2.84-.17-3.58a20.14,20.14,0,0,1,4.36-39.8Zm0,7.24a12.9,12.9,0,1,1-12.9,12.9,12.89,12.89,0,0,1,12.9-12.9Z"/>
                        <path className="cls-2" d="M62.52,50.17h8.14a2.77,2.77,0,0,1,2.76,2.76v9.4h9.4a2.77,2.77,0,0,1,2.76,2.76v8.14A2.77,2.77,0,0,1,82.82,76h-9.4v9.39a2.77,2.77,0,0,1-2.76,2.77H62.52a2.78,2.78,0,0,1-2.77-2.77V76H50.36a2.78,2.78,0,0,1-2.77-2.77V65.09a2.78,2.78,0,0,1,2.77-2.77h9.4V52.93a2.77,2.77,0,0,1,2.76-2.76Z"/></svg>

                    </Link>
                </div>
                <nav className="space-x-4  flex flex-row items-center">
                    <Link to="/" className="text-lg hover:text-blue-500 mt-3">Home</Link>

                    {user?.roles[0].name === 'ROLE_DOCTOR' && (
                        <Link to="/dashboard" className="text-lg hover:text-blue-500 mt-3">Dashboard</Link>
                    )}



                    {loggedIn === true ? (<Dropdown trigger={<Link to="/settings" className={`text-lg w-[190px] hover:text-blue-500 flex flex-row items-center space-x-3 `}>

                        <img src={user.imageUrl !=null ? user.imageUrl : user.gender ==="male"?DefaultMale:DefaultFemale} alt={user.gender === "male" ? DefaultMale : DefaultFemale} className="w-[50px] h-[50px]  mb-1 rounded-full ml-3 mt-3 object-cover"/>

                        <div className="flex flex-col ">
                            <p className="leading-4 mt-3 font-[Poppins] ">{user?.username} </p>
                            <p className="font-[Poppins] text-gray-800 text-sm pr-3 max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">{user?.email} </p>
                        </div>

                    </Link>

                    }>
                        {/* <DropdownItem>Reservations</DropdownItem> */}


                        <DropdownItem>
                            <button
                                className="text-lg hover:text-blue-500"
                                onClick={() => {
                                    authService.logout()
                                    setIsLoggedIn(false);
                                    Navigate('/');
                                }}>
                                Logout
                            </button>

                        </DropdownItem>

                        <DropdownItem>

                            <Link to="/settings" className="text-lg hover:text-blue-500">Profile</Link>

                        </DropdownItem>


                    </Dropdown>) : (<></>)}

                    {loggedIn ===false ? (<Link to="/signup">
                        <button className="bg-[#DFDFDF] text-[#373637] w-40 h-11 rounded-lg font-bold pt-1 hover:bg-[rgba(0,0,0,0.2)] transition duration-300 ease-in-out">

                        <span className="inline-flex items-center space-x-2">
                            <svg className="w-5 h-5" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3334 13V11.6667C11.3334 10.9594 11.0525 10.2811 10.5524 9.78105C10.0523 9.28095 9.37399 9 8.66675 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M15.3334 13V11.6667C15.333 11.0758 15.1363 10.5018 14.7743 10.0349C14.4123 9.5679 13.9055 9.23438 13.3334 9.08667M10.6667 1.08667C11.2404 1.23353 11.7488 1.56713 12.1118 2.03487C12.4749 2.50261 12.672 3.07789 12.672 3.67C12.672 4.26211 12.4749 4.83739 12.1118 5.30513C11.7488 5.77287 11.2404 6.10647 10.6667 6.25333M8.66675 3.66667C8.66675 5.13943 7.47284 6.33333 6.00008 6.33333C4.52732 6.33333 3.33341 5.13943 3.33341 3.66667C3.33341 2.19391 4.52732 1 6.00008 1C7.47284 1 8.66675 2.19391 8.66675 3.66667Z" stroke="#8A226F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                            <span className="font-[Poppins]  text-sm" >  Create Account</span>
                        </span>
                        </button>
                    </Link>):(<></>)}

                    {loggedIn === false ? (<Link to="/login">
                        <button className="bg-[#DFDFDF] text-[#373637] w-35 h-11 rounded-lg font-bold pt-1 hover:bg-[rgba(0,0,0,0.2)] transition duration-300 ease-in-out">
                        <span className="inline-flex items-center space-x-2">
                            <svg className="w-5 h-5" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3334 13V11.6667C11.3334 10.9594 11.0525 10.2811 10.5524 9.78105C10.0523 9.28095 9.37399 9 8.66675 9H3.33341C2.62617 9 1.94789 9.28095 1.4478 9.78105C0.9477 10.2811 0.666748 10.9594 0.666748 11.6667V13M15.3334 13V11.6667C15.333 11.0758 15.1363 10.5018 14.7743 10.0349C14.4123 9.5679 13.9055 9.23438 13.3334 9.08667M10.6667 1.08667C11.2404 1.23353 11.7488 1.56713 12.1118 2.03487C12.4749 2.50261 12.672 3.07789 12.672 3.67C12.672 4.26211 12.4749 4.83739 12.1118 5.30513C11.7488 5.77287 11.2404 6.10647 10.6667 6.25333M8.66675 3.66667C8.66675 5.13943 7.47284 6.33333 6.00008 6.33333C4.52732 6.33333 3.33341 5.13943 3.33341 3.66667C3.33341 2.19391 4.52732 1 6.00008 1C7.47284 1 8.66675 2.19391 8.66675 3.66667Z" stroke="#8A226F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                            <span className="font-[Poppins]  text-sm"> Sign in</span>
                        </span>
                        </button>
                    </Link>) :(<></>) }


                </nav>
            </header>
        </div>
    )
}