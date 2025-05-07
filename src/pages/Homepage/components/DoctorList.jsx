
import "../../../index.css";
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

export default function DoctorList({setIsPopupOpen ,setSelectedDoctor , selectedDoctor ,Doctors}) {
    Doctors = JSON.parse(localStorage.getItem("DoctorsList") || "[]");
    const handleDoctorClick = (doctor,index) => {
        setSelectedDoctor({...doctor , index});

        setIsPopupOpen(true);
        console.log(selectedDoctor);
    };


    return(
       Doctors.map((doctor,index) => (
                <div
                key={doctor.doctorId}
                className="w-[543px] h-[182px] bg-[#F5FFFD] border-[#EDEDED] border-1 rounded-xl"
                onClick={() => handleDoctorClick(doctor,index)}
            >
                <div className="grid grid-cols-[180px_363px] ">
                    {/*column 1*/}
                    <div className="">
                        <img src={doctor.gender ==="male"?MalePic[index]:FemalePic[index]} alt="Doctor" className="w-[115px] h-[121px] rounded-full ml-3 mt-2"/>
                        <div className="flex flex-row mt-1 ml-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C11.7667 22 11.5667 21.9333 11.4 21.8C11.2333 21.6667 11.1083 21.4917 11.025 21.275C10.7083 20.3417 10.3083 19.4667 9.825 18.65C9.35833 17.8333 8.7 16.875 7.85 15.775C7 14.675 6.30833 13.625 5.775 12.625C5.25833 11.625 5 10.4167 5 9C5 7.05 5.675 5.4 7.025 4.05C8.39167 2.68333 10.05 2 12 2C13.95 2 15.6 2.68333 16.95 4.05C18.3167 5.4 19 7.05 19 9C19 10.5167 18.7083 11.7833 18.125 12.8C17.5583 13.8 16.9 14.7917 16.15 15.775C15.25 16.975 14.5667 17.975 14.1 18.775C13.65 19.5583 13.275 20.3917 12.975 21.275C12.8917 21.5083 12.7583 21.6917 12.575 21.825C12.4083 21.9417 12.2167 22 12 22ZM12 11.5C12.7 11.5 13.2917 11.2583 13.775 10.775C14.2583 10.2917 14.5 9.7 14.5 9C14.5 8.3 14.2583 7.70833 13.775 7.225C13.2917 6.74167 12.7 6.5 12 6.5C11.3 6.5 10.7083 6.74167 10.225 7.225C9.74167 7.70833 9.5 8.3 9.5 9C9.5 9.7 9.74167 10.2917 10.225 10.775C10.7083 11.2583 11.3 11.5 12 11.5Z" fill="#79747E"/>
                            </svg>
                            <p className="ml-1 text-sm ">
                                {doctor.city}</p>
                        </div>
                        <div className="flex flex-row ml-10 h-[13.5px] overflow-hidden">
                            <p className="text-sm leading-3 ">
                                {doctor.address}</p>
                        </div>

                    </div>
                    {/*column 2*/}
                    <div className="">
                        <div className="flex flex-row justify-between mr-10 mt-4">
                            <p className="font-Montserrat-Alternates">{doctor.fullName.length >19? doctor.username:doctor.fullName}</p>
                            <div className="flex flex-row">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97917 15.8042 5.5875 15.4125C5.19583 15.0208 5 14.55 5 14V6C5 5.45 5.19583 4.97917 5.5875 4.5875C5.97917 4.19583 6.45 4 7 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V14C23 14.55 22.8042 15.0208 22.4125 15.4125C22.0208 15.8042 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1958 12.9792 19.5875 12.5875C19.9792 12.1958 20.45 12 21 12V8C20.45 8 19.9792 7.80417 19.5875 7.4125C19.1958 7.02083 19 6.55 19 6H9C9 6.55 8.80417 7.02083 8.4125 7.4125C8.02083 7.80417 7.55 8 7 8V12C7.55 12 8.02083 12.1958 8.4125 12.5875C8.80417 12.9792 9 13.45 9 14ZM20 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V7H3V18H20V20Z" fill="#79A85F"/>
                                </svg>
                                <p className="ml-1 text-sm leading-5">
                                    {doctor.fees} EGP</p>

                            </div>
                        </div>
                        <div className="flex flex-row mt-2">
                            <Rating rating={doctor.rating}/>
                            <p className="ml-2 text-sm leading-5">
                                {Math.floor(Math.random()*200)} Reviews</p>

                        </div>
                        <div className="flex flex-row mt-2 font-[Poppins] font-medium text-[13px]">
                            {doctor.specialty}
                        </div>
                        <div className="flex flex-row  font[Poppins] text-[13px]">
                            {doctor.specialityDetails}
                        </div>
                        <div className="flex flex-row mt-5 justify-between bg-[rgb(0,156,199,42%)] h-[30px] ml-15 rounded-sm text-[10px] font-medium font-[Poppins] ]">
                            <div className="ml-3 justify-center items-center flex">Availability</div>

                            <div className={doctor.workingDays.includes("SUN") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>SUN</div>
                            <div className={doctor.workingDays.includes("MON") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>MON</div>
                            <div className={doctor.workingDays.includes("TUE") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>TUS</div>
                            <div className={doctor.workingDays.includes("WED") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>WED</div>
                            <div className={doctor.workingDays.includes("THU") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>THU</div>
                            <div className={doctor.workingDays.includes("FRI") ?"text-black justify-center items-center flex":"text-white justify-center items-center flex"}>FRI</div>
                            <div className={doctor.workingDays.includes("SAT") ?"text-black mr-3 justify-center items-center flex":"text-white mr-3 justify-center items-center flex"}>SAT</div>

                        </div>

                    </div>

                </div>
            </div>))

    );
}