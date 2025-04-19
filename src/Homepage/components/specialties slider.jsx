import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function SpecialtiesSlider() {
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
        >
            {specialties.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className="bg-[#F5F5F5] rounded-2xl w-[170px] h-[114px] flex flex-col justify-center items-center">
                        <img className="w-auto h-auto" src={item.image}/>
                        <p className="font-[Montserrat Alternates] font-medium text-[#249BF1]">{item.name}</p>
                    </div>

                </SwiperSlide>
            ))}
        </Swiper>
    );
}