import SearchBar from "./search bar.jsx";
import LocationFilter from "./Location Filter.jsx";
import {useState} from "react";

export default function DefaultContent() {
    const [formData, setFormData] = useState({
        text: '',
        location: ''
    });
    const handlechange = (e) => {};
    return (
        <div className="flex flex-col items-start justify-start w-full h-full">
            <p className="pl-[8%] text-3xl md:text-5xl font-normal tracking-tight  OutlineText text-[#3C63C7] pt-10">Find the right doctor</p>
            <p className="pl-[8%] text-3xl md:text-5xl font-normal tracking-tight OutlineText  text-[#3C63C7]">Right at your fingertips</p>
            <p className="pl-[8%] text-lg md:text-xl font-normal  pt-12  text-[#9C9C9C]">We care gives you the  tools and information you need to</p>

            {/*Table begins*/}
            {/*First Section*/}
            <div className="flex ml-[8%] items-center mt-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#C4006A"/>
                    <path d="M42.6667 45L32.1667 34.5C31.3333 35.1667 30.375 35.6944 29.2917 36.0833C28.2083 36.4722 27.0556 36.6667 25.8333 36.6667C22.8056 36.6667 20.2431 35.6181 18.1458 33.5208C16.0486 31.4236 15 28.8611 15 25.8333C15 22.8056 16.0486 20.2431 18.1458 18.1458C20.2431 16.0486 22.8056 15 25.8333 15C28.8611 15 31.4236 16.0486 33.5208 18.1458C35.6181 20.2431 36.6667 22.8056 36.6667 25.8333C36.6667 27.0556 36.4722 28.2083 36.0833 29.2917C35.6944 30.375 35.1667 31.3333 34.5 32.1667L45 42.6667L42.6667 45ZM25.8333 33.3333C27.9167 33.3333 29.6875 32.6042 31.1458 31.1458C32.6042 29.6875 33.3333 27.9167 33.3333 25.8333C33.3333 23.75 32.6042 21.9792 31.1458 20.5208C29.6875 19.0625 27.9167 18.3333 25.8333 18.3333C23.75 18.3333 21.9792 19.0625 20.5208 20.5208C19.0625 21.9792 18.3333 23.75 18.3333 25.8333C18.3333 27.9167 19.0625 29.6875 20.5208 31.1458C21.9792 32.6042 23.75 33.3333 25.8333 33.3333Z" fill="#F3BAFB"/>
                </svg>
                <p className="ml-[20px] text-lg md:text-xl text-[#3C63C7]">Search nearest Clinic</p>
            </div>
            <div className="flex ml-[calc(9%+10px)] mt-2 items-start">
                <svg width="2" height="100" viewBox="0 0 2 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2" height="100" fill="#D9D9D9"/>
                </svg>
                <p className="ml-[50px] w-[500px] text-[#9C9C9C] text-lg md:text-xl "> Find doctors and clinics based on the  factors
                    that matter most to you.</p>
            </div>

            {/*Second Section*/}
            <div className="flex ml-[8%] items-center mt-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#EFE8AC"/>
                    <path d="M46 48V44C46 41.8783 45.1571 39.8434 43.6569 38.3431C42.1566 36.8429 40.1217 36 38 36H22C19.8783 36 17.8434 36.8429 16.3431 38.3431C14.8429 39.8434 14 41.8783 14 44V48M38 20C38 24.4183 34.4183 28 30 28C25.5817 28 22 24.4183 22 20C22 15.5817 25.5817 12 30 12C34.4183 12 38 15.5817 38 20Z" stroke="#8A226F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <p className="ml-[20px] text-lg md:text-xl text-[#3C63C7]">Appointment with the best doctor</p>
            </div>
            <div className="flex ml-[calc(9%+10px)] mt-2 items-start">
                <svg width="2" height="100" viewBox="0 0 2 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2" height="100" fill="#D9D9D9"/>
                </svg>
                <p className="ml-[50px] w-[500px] text-[#9C9C9C] text-lg md:text-xl "> Convenient schedule your appointment by phone
                    or online when available.</p>
            </div>

            {/*Third Section*/}
            <div className="flex ml-[8%] items-center mt-2">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#DBFFE7"/>
                    <path d="M45.5833 38.2V43.2C45.5853 43.6641 45.4878 44.1236 45.2972 44.5489C45.1066 44.9742 44.827 45.3559 44.4765 45.6697C44.1259 45.9835 43.712 46.2224 43.2613 46.3711C42.8106 46.5198 42.333 46.5751 41.8592 46.5333C36.6023 45.976 31.5528 44.2235 27.1162 41.4166C22.9886 38.8577 19.4891 35.4436 16.8662 31.4166C13.9791 27.0686 12.1824 22.1183 11.6217 16.9666C11.579 16.5057 11.6351 16.0412 11.7865 15.6027C11.9379 15.1641 12.1813 14.7611 12.501 14.4193C12.8208 14.0775 13.2101 13.8045 13.644 13.6175C14.0779 13.4305 14.5469 13.3337 15.0212 13.3333H20.1462C20.9753 13.3253 21.779 13.6118 22.4077 14.1392C23.0363 14.6666 23.4469 15.399 23.5629 16.2C23.7792 17.8001 24.1804 19.3712 24.7587 20.8833C24.9886 21.4798 25.0383 22.1281 24.9021 22.7514C24.7658 23.3747 24.4493 23.9468 23.99 24.4L21.8204 26.5166C24.2523 30.6892 27.7935 34.144 32.0704 36.5166L34.24 34.4C34.7045 33.9519 35.2909 33.643 35.9297 33.5101C36.5686 33.3772 37.2331 33.4257 37.8446 33.65C39.3945 34.2142 41.0049 34.6056 42.645 34.8166C43.4748 34.9308 44.2327 35.3386 44.7745 35.9624C45.3162 36.5863 45.6041 37.3826 45.5833 38.2Z" stroke="#00C437" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p className="ml-[20px] text-lg md:text-xl text-[#3C63C7]">Get consultant</p>
            </div>
            <div className="flex ml-[calc(9%+10px)] mt-2 items-start">
                <p className="ml-[50px] w-[500px] text-[#9C9C9C] text-lg md:text-xl "> Learn what you need to know and which questions
                    to ask your doctor.</p>
            </div>

            <div className="absolute right-[8vw] flex flex-col  ">
                <img  src="/images/doctor%201.png"/>
                <div className="w-[360px] h-[223px] bg-[#F0F0F0] rounded-2xl ml-[30px flex flex-col ">
                    <p className="text-[Montserrat Alternates] text-[#6D6D6D] text-xl flex justify-center pt-[30px]">find the best doctor you need</p>
                    <div className="pt-[16px] pl-[20px]">
                        <SearchBar text="Search Doctor , Clinic" Input={formData.text} change={handlechange()} width="320px"/>
                    </div>
                    <div className="pt-[16px] pl-[20px]">
                        <LocationFilter location="Set your location" width="320px" />
                    </div>


                </div>
            </div>


        </div>
    );
}