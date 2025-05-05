import Calender from "./Calender.jsx";
import React, { useState } from 'react';
import Login from "../../pages/Login.jsx";
import APICalls from "../../services/APICalls.js";
import {FemalePic, MalePic} from "../../Constants/constant.jsx";

function StarIcon({ isFilled }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-5 w-5 ${isFilled ? 'text-yellow-700' : 'text-gray-400'}`}
        >
            <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
            />
        </svg>
    );
}
function Rating({ rating }) {
    const totalStars = 5;
    return (
        <div className="flex">
            {Array.from({ length: totalStars }, (_, index) => (
                <StarIcon key={index} isFilled={index < rating} />
            ))}
        </div>
    );
}

export default function Mypopup({selectedDoctor , setSelectedDoctor , setIsPopupOpen}) {
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedDoctor(null);
    };

    const [formData, setFormData] = useState({
        status: 'Pending',
        doctorId: 8,
        date: '',
        duration: 30,
        visitPurpose: '',
        createdAt:new Date().toISOString(),

    });

    const [submittedData, setSubmittedData] = useState([]);
    const [LoginForm , setLoginForm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmittedData((prevData) => [...prevData, formData]);
        await APICalls.CreatAppointment(formData)
        setFormData({date: '', visitPurpose: '', createdAt: ''}); // Reset form
    };
    return(
        <>
            {LoginForm ===false || localStorage.getItem("authToken") !=null ? (<div className="fixed inset-0 bg-[rgba(64,64,64,61%)] flex justify-center items-center z-10">
                <div className="p-4 md:p-6 rounded-2xl w-[90vw] md:w-[60vw]" style={{
                    background: "linear-gradient(to bottom, #D8DBAC 20%, #FFFFFF 32%)",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    ...(window.innerWidth < 768 && {
                        background: "linear-gradient(to bottom, #D8DBAC 40%, #FFFFFF 50%)",
                    })
                }}>
                    <div className="flex flex-col md:flex-row items-center md:items-start">
                        <img src={selectedDoctor.gender ==="male"?MalePic[selectedDoctor.index]:FemalePic[selectedDoctor.index]} alt="Doctor" className="w-[30vw] md:w-[12vw] h-auto rounded-full mx-auto md:ml-3 mt-2 max-w-[230px]" />
                        <div className="flex flex-col mt-4 md:mt-0 md:ml-5">
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                                <h2 className="text-lg md:text-xl mb-2 md:mb-4 font-Montserrat-Alternates text-center md:text-left">
                                    {selectedDoctor.fullName}
                                </h2>
                                <p className="font-[Poppins] font-medium text-sm md:text-[13px] leading-6 md:leading-8 mt-2 md:mt-0 md:ml-5 text-center md:text-left">
                                    {selectedDoctor.specialty}
                                </p>
                                <p className="font-[Poppins] text-sm md:text-[13px] leading-6 md:leading-8 mt-2 md:mt-0 md:ml-5 text-center md:text-left">
                                    {selectedDoctor.specialityDetails}
                                </p>
                            </div>
                            <p className="ml-0  font-[Poppins] text-sm md:text-[13px] leading-6 md:leading-8 mt-4 md:mt-0 text-center md:text-left md:w-[40vw] w-[80vw]">
                                bio :{ selectedDoctor.bio ===null ? ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lobortis lorem. Praesent interdum justo ut purus tempor tincidunt. Morbi ut ultrices magna, et efficitur justo. Ut auctor pulvinar odio quis fringilla.") : (selectedDoctor.bio) }
                            </p>
                            <div className="flex flex-col md:flex-row items-center md:items-start mt-4 ">
                                <Rating rating={selectedDoctor.rating} />
                                <p className="ml-0 md:ml-2 text-sm md:text-[13px] leading-5 mt-2 md:mt-0 text-center md:text-left">
                                    {Math.floor(Math.random()*200)} Reviews
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start mt-4 ">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C11.7667 22 11.5667 21.9333 11.4 21.8C11.2333 21.6667 11.1083 21.4917 11.025 21.275C10.7083 20.3417 10.3083 19.4667 9.825 18.65C9.35833 17.8333 8.7 16.875 7.85 15.775C7 14.675 6.30833 13.625 5.775 12.625C5.25833 11.625 5 10.4167 5 9C5 7.05 5.675 5.4 7.025 4.05C8.39167 2.68333 10.05 2 12 2C13.95 2 15.6 2.68333 16.95 4.05C18.3167 5.4 19 7.05 19 9C19 10.5167 18.7083 11.7833 18.125 12.8C17.5583 13.8 16.9 14.7917 16.15 15.775C15.25 16.975 14.5667 17.975 14.1 18.775C13.65 19.5583 13.275 20.3917 12.975 21.275C12.8917 21.5083 12.7583 21.6917 12.575 21.825C12.4083 21.9417 12.2167 22 12 22ZM12 11.5C12.7 11.5 13.2917 11.2583 13.775 10.775C14.2583 10.2917 14.5 9.7 14.5 9C14.5 8.3 14.2583 7.70833 13.775 7.225C13.2917 6.74167 12.7 6.5 12 6.5C11.3 6.5 10.7083 6.74167 10.225 7.225C9.74167 7.70833 9.5 8.3 9.5 9C9.5 9.7 9.74167 10.2917 10.225 10.775C10.7083 11.2583 11.3 11.5 12 11.5Z" fill="#79747E" />
                                </svg>
                                <p className="ml-1 text-sm text-center md:text-left">
                                    {selectedDoctor.city}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start mt-2 md:ml-2">
                                <p className="text-sm text-center md:text-left">
                                    {selectedDoctor.address}
                                </p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Calender
                            onDaySelect={(dateTime) =>
                                setFormData((prev) => ({ ...prev, date: dateTime }))
                            }
                        />

                        {(localStorage.getItem("authToken") != null) ? (<div className="flex flex-col md:flex-row">
                            <label className="flex flex-col">
                                <span className="mb-1 md:ml-10 mt-5">complaint</span>
                                <textarea
                                    className="border border-gray-300 rounded-lg p-2 md:ml-10 w-full md:w-[32vw] h-[100px] md:h-[100px] resize-none"
                                    placeholder="Enter your complaint here"
                                    name="visitPurpose"
                                    onChange={handleChange}
                                    value={formData.visitPurpose}
                                    required
                                /></label>
                            <p className="flex flex-row justify-center items-end rounded-lg text-center md:w-full md:h-[120px] ">
                                Fees&nbsp; <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97917 15.8042 5.5875 15.4125C5.19583 15.0208 5 14.55 5 14V6C5 5.45 5.19583 4.97917 5.5875 4.5875C5.97917 4.19583 6.45 4 7 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V14C23 14.55 22.8042 15.0208 22.4125 15.4125C22.0208 15.8042 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1958 12.9792 19.5875 12.5875C19.9792 12.1958 20.45 12 21 12V8C20.45 8 19.9792 7.80417 19.5875 7.4125C19.1958 7.02083 19 6.55 19 6H9C9 6.55 8.80417 7.02083 8.4125 7.4125C8.02083 7.80417 7.55 8 7 8V12C7.55 12 8.02083 12.1958 8.4125 12.5875C8.80417 12.9792 9 13.45 9 14ZM20 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V7H3V18H20V20Z" fill="#79A85F" />
                            </svg>  {selectedDoctor.fees} EGP
                            </p>
                        </div>) : (
                            <div className="flex flex-row justify-center items-center space-x-5 mt-6">
                                <p>please sign in to continue</p>
                                <button
                                    onClick={() => {
                                        setLoginForm(true);
                                    }}
                                    type="button"
                                    className="flex flex-row bg-blue-50 px-4 py-2 justify-center items-center rounded-lg w-full md:w-auto">
                                    Login
                                </button>
                            </div>

                        )}



                        <div className="flex flex-col items-center md:items-end mt-6">

                            {(localStorage.getItem("authToken") != null) ? (
                                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 my-5">
                                    <button type="submit"
                                            className="flex flex-row bg-[#C6FFA7] px-4 py-2 justify-center items-center rounded-lg w-full md:w-auto">
                                        Confirm Reservation
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                                        onClick={closePopup}
                                    >
                                        Cancel
                                    </button>




                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 my-1">


                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                                        onClick={closePopup}
                                    >
                                        Cancel
                                    </button>




                                </div>
                            )}

                        </div>
                    </form>
                    <h3>Submitted Data:</h3>
                    <ul>
                        {submittedData.map((data, index) => (
                            <li key={index}>
                                {data.date} - {data.visitPurpose} - {data.createdAt}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>):(
                <div className="fixed inset-0 bg-[rgba(64,64,64,61%)] flex flex-col justify-center items-center z-10">
                    <Login setLoginForm={setLoginForm}/>
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                        onClick={closePopup}
                    >
                        Cancel
                    </button>
                </div>

            )}

        </>






    );
}