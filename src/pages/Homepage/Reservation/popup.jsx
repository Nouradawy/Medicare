import Calender from "./Calender.jsx";
import React, { useState } from 'react';
import Login from "../../Login.jsx";
import APICalls from "../../../services/APICalls.js";
import {FemalePic, MalePic} from "../../../Constants/constant.jsx";

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

export default function Mypopup({selectedDoctor , setSelectedDoctor , setIsPopupOpen , setDoctorsList}) {
    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedDoctor(null);
    };

    const [formData, setFormData] = useState({
        status: 'Pending',
        doctorId: selectedDoctor.doctorId,
        date: '',
        duration: 30,
        visitPurpose: '',
        createdAt:new Date().toISOString(),
        queueNumber:null,

    });

    const [submittedData, setSubmittedData] = useState([]);
    const [LoginForm , setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const Review = JSON.parse(localStorage.getItem("DoctorReviews"))
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmittedData((prevData) => [...prevData, formData]);

        try{
            await APICalls.CreatAppointment(formData);
            const updatedDoctors = await APICalls.GetDoctorsList();
            setDoctorsList(updatedDoctors);

            setFormData({date: '', visitPurpose: '', createdAt: '', queueNumber: null,}); // Reset form

                closePopup();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);

        }

    };
    return(
        <>
            {LoginForm ===false || localStorage.getItem("authToken") !=null ? (<div className="fixed inset-0 bg-[rgba(64,64,64,61%)] flex justify-center items-center z-10">
                    <div className="bg-white rounded-xl py-4 pr-1 ">
                        <div className="p-4 md:p-6 rounded-xl w-[90vw] max-w-250  md:w-[60vw] bg-white max-h-[90vh] overflow-y-auto ">
                            <div className="flex flex-col md:flex-row items-center  ">
                                <img
                                    src={selectedDoctor.gender === "male" ? MalePic[selectedDoctor.index] : FemalePic[selectedDoctor.index]}
                                    alt="Doctor"
                                    className="w-[30vw] md:w-[12vw] max-w-37.5 h-auto rounded-full mx-5 md:ml-3 mt-2"/>
                                <div>

                                    <div className={'flex-row flex justify-between max-w-195 w-[45vw]'}>

                                        <div className={"flex-col flex"}>
                                            <h2 className="text-lg md:text-xl  font-Montserrat-Alternates text-center md:text-left">
                                                {selectedDoctor.fullName}
                                            </h2>
                                            <div className="flex flex-row items-center">

                                                <p className="font-[Poppins] font-medium text-sm md:text-[13px] leading-6 md:leading-8 mt-2 md:mt-0 md:ml-0 text-center md:text-left">
                                                    {selectedDoctor.specialty}
                                                </p>
                                                <p className="font-[Poppins] text-sm md:text-[13px] leading-6 md:leading-8 mt-2 md:mt-0 md:ml-5 text-center md:text-left">
                                                    {selectedDoctor.specialityDetails}
                                                </p>

                                            </div>
                                        </div>

                                        <div
                                            className=" flex items-center justify-center md:justify-end gap-3 bg-gray-50  px-4 py-2 rounded-full border border-gray-100 w-60 h-10  ">
                                            <div className="flex items-center text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-icons-round scale-90 w-4">
                                                {i < Math.floor(selectedDoctor.rating) ? "star" : (i < selectedDoctor.rating ? "star_half" : "star_border")}
                                            </span>
                                                ))}
                                            </div>
                                            <div className="h-4 w-px bg-gray-300 "></div>
                                            <span className="text-sm font-semibold ">{selectedDoctor.rating}</span>
                                            <span className="text-xs text-gray-500 ">({Review.length} Reviews)</span>
                                        </div>
                                    </div>


                                    <p className="ml-0  font-[Poppins] text-sm md:text-[13px] leading-6 md:leading-7 mt-4 md:mt-0 text-center md:text-left md:w-[40vw] max-w-190 ">
                                        bio
                                        :{selectedDoctor.bio === null ? ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lobortis lorem. Praesent interdum justo ut purus tempor tincidunt. Morbi ut ultrices magna, et efficitur justo. Ut auctor pulvinar odio quis fringilla.") : (selectedDoctor.bio)}
                                    </p>


                                    <div
                                        className="inline-flex flex-col md:flex-row items-center mt-1 bg-gray-100 px-3  rounded-xl ">
                                        <span className="material-icons-round text-gray-400">location_on</span>

                                        <div className="flex flex-col items-center md:items-start mt-1 md:ml-2">
                                            <p className="text-sm text-center md:text-left">
                                                {selectedDoctor.city}
                                            </p>
                                            <p className="text-sm text-center md:text-left">
                                                {selectedDoctor.address}
                                            </p>
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <div className="mb-10 pb-8 border-b border-gray-200  "> </div>

                            <form onSubmit={handleSubmit}>
                                <Calender
                                    onDaySelect={(dateTime, id) =>
                                        setFormData((prev) => ({...prev, date: dateTime, queueNumber: id}))
                                    }
                                    Doctor={selectedDoctor}
                                />

                                {(localStorage.getItem("authToken") != null) ? (
                                    <div className="flex flex-col md:flex-row w-full  justify-between  items-center pr-15 ">
                                        <label className="flex flex-col">
                                            <span
                                                className="mb-1 md:ml-10 mt-5">Patient Complaint / Reason for visit</span>
                                            <textarea
                                                className="border border-gray-300 rounded-lg p-2 md:ml-10 max-w-[550px] md:w-[25vw] h-[100px] md:h-[100px] resize-none"
                                                placeholder="Describe your symptoms or reason for the visit"
                                                name="visitPurpose"
                                                onChange={handleChange}
                                                value={formData.visitPurpose}
                                                required
                                            /></label>
                                        <p className="inline-flex flex-row  items-end rounded-lg mt-20 bg-gray-100 border border-gray-200 p-2  font-medium text-gray-400  ">
                                            TOTAL FEES&nbsp;
                                            <span className="material-icons-round text-green-600">payments </span>
                                            <span  className="font-bold text-black"> &nbsp; {selectedDoctor.fees} EGP</span>
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
                                        <div
                                            className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 my-5">
                                            <button type="submit"
                                                    className="flex flex-row bg-[#C6FFA7] px-4 py-2 justify-center items-center rounded-lg w-full md:w-auto"
                                                    disabled={loading}
                                            >
                                                {loading && (
                                                    <svg className="animate-spin h-5 w-5 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                    </svg>
                                                )}
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
                                        <div
                                            className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 my-1">


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
                            <div className="mb-10 pb-8 border-b border-gray-200  "> </div>
                            <div className="mb-10 pb-8  ">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        Patient Feedback
                                        <span className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold border border-yellow-200">
                                        4.8 Rating
                                    </span>
                                    </h3>
                                    <button className="text-sm font-semibold text-primary hover:text-emerald-700 transition flex items-center gap-1 group">
                                        View all 95 reviews
                                        <span className="material-icons-round text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                                <div className="flex-col ">
                                    {Review.map((review, index) => (
                                        <div
                                            key={index}
                                            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 mt-4"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        alt={review.name || "Patient"}
                                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                        src={review.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_HuUaHLem-708lyJRRXJGYIvspItRFOaxC_tA8-T-g4Q89W9jQtlzQb6JDhm4fqj0X6U40mUvMSU-o60QMbmoKFqMnyAe8CpFJYbCi4TZCNg71zNIXaBd-I6RMgHpq4RaHwFQb3QH_SKXxQwdEF3jdN7GthkjvYGAMuBdnuhD-Sb0wbOM5OA_0WJgSIX8k46BS7yA8PczAw7bY5m5aZIyKhzExA86HKeamHi7ViiofjVrWnwTLtGywtyR7swcMj_l2jWaa5ERlrI"}
                                                    />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">{review.name || "Anonymous"}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="flex text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} className="material-icons-round text-[14px]">
                                                                        {i < Math.round(review.rating) ? "star" : "star_border"}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-400 font-medium">{review.date || ""}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed italic relative pl-3 border-l-2 border-primary/30">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    ):(
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