import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import APICalls from "../../../services/APICalls.js";


let doctorList = null;
export default function SpecialtiesSlider({setActiveIndex , activeIndex , setDoctorsList}) {

    const specialties = [
        {name: "Dermatology", image: "/images/determolgy%201.png"},
        {name: "internal medicine", image: "/images/internal%20medi%201.png"},
        {name: "Gynecology", image: "/images/gynecology%201.png"},
        {name: "Dentist", image: "/images/Dental%201.png"},
        {name: "Neurology", image: "/images/Neurology%201.png"},
        {name: "Otolaryngology", image: "/images/ota%201.png"},
    ];
    return(
        <Swiper
            className="w-[60vw] h-[180px]  !pt-[20px] "
            modules={[Pagination]}
            spaceBetween={20}
            pagination={{ clickable: true }}
            centeredSlides={false}
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1050:{slidesPerView: 4},
                1450:{slidesPerView: 5},
                1600: { slidesPerView: 6 },
            }}
            onClick={async (swiper) => {

                if (swiper.clickedIndex === activeIndex) {
                    setActiveIndex(null);

                } else {
                    setActiveIndex(swiper.clickedIndex);
                    try{

                        if(doctorList === null) {
                            doctorList = await APICalls.GetDoctorsList();

                        }

                        const selectedSpecialty = specialties[swiper.clickedIndex]?.name?.toLowerCase().trim()
                        const filteredDoctors = doctorList.filter(
                            (doctor) => doctor.specialty?.toLowerCase().trim() === selectedSpecialty
                        );
                        setDoctorsList(filteredDoctors);

                    }
                    catch (error){
                        console.error("Error fetching doctor list:", error);
                    }

                }

            }}
        >
            {specialties.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className={` rounded-2xl w-[170px] h-[114px] flex flex-col justify-center items-center ${activeIndex === index ? 'border-2 border-blue-500 bg-[#322725]' : 'bg-[#F5F5F5]'}`}>
                        <img className="w-auto h-auto" src={item.image}/>
                        <p className="font-[Montserrat Alternates] font-medium text-[#249BF1]">{item.name}</p>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>
    );
}