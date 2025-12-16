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
            <header className="flex justify-between items-center text-black py-6 px-8 md:px-39">
                <div className="flex items-center">
                <Link to="/" className="text-lg hover:text-blue-500">
                    {/* <img src="https://img.freepik.com/premium-psd/medicare-icon-isolated-transparent-background_1254062-3062.jpg?w=360" /> */}

                    <img src={"src/assets/medicare Logo.png"} className="w-50"/>

                    </Link>
                </div>
                <nav className="space-x-4  flex flex-row items-center">
                    <Link to="/" className="text-lg hover:text-blue-500 mt-3">Home</Link>

                    {user?.roles[0].name === 'ROLE_DOCTOR' && (
                        <Link to="/dashboard" className="text-lg hover:text-blue-500 mt-3">Dashboard</Link>
                    )}

                    {user?.roles[0].name === 'ROLE_ADMIN' && (
                        <Link to="/admin" className="text-lg hover:text-blue-500 mt-3">Admin Panel</Link>
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