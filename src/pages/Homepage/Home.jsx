import NavBar from './components/NavBar/NavBar.jsx'
import SearchBar from "./components/search bar.jsx";
import LocationFilter from "./components/Location Filter.jsx";
import Mypopup from "./components/popup.jsx";
import  { useState } from 'react';
import SpecialtiesSlider from "./components/specialties slider.jsx";
import DefaultContent from "./components/Default content.jsx";
import DoctorList from "./components/DoctorList.jsx";

export default function Home() {
const [formData, setFormData] = useState({
    text: '',
    location: ''
});
const [activeIndex, setActiveIndex] = useState(null);
const [doctorsList, setDoctorsList] = useState([]);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [selectedDoctor, setSelectedDoctor] = useState(null);
const [suggestions , setSuggestions] = useState([]);
function handlechange (e){
    const value = e.target.value;
    setFormData(prev => ({ ...prev, text: value }));
    const Doctors = JSON.parse(localStorage.getItem('DoctorsList') || '[]');
    const filtered =Doctors.filter(doctor =>
        // console.log('Comparing:' , value.trim().toLowerCase() , 'with' ,doctor.fullName.trim().toLowerCase());
        doctor.fullName &&
        doctor.fullName.toLowerCase().includes(value.trim().toLowerCase())
    );

    setSuggestions(filtered);
}
  return (
      <div className="w-full">
          <div className="w-full h-[800px]  bg-[#4B34DD]">
          <NavBar />
            <div className="pt-2 pl-6
            md:pl-[8%] md:pt-32
            text-[#C0D2FF]  relative z-10">
          <div className="text-3xl md:text-5xl font-normal tracking-tight OutlineText">Feel better about</div>
          <div className="text-3xl md:text-5xl font-normal tracking-tight OutlineText">finding healthcare</div>
            <div className="text-[0.8rem] pt-5 text-[#A7EFFF] font-light
            md:text-2xl md:pt-20 ">At Healthgrades , we take the guesswork out of finding </div>
            <div className="text-[0.8rem] font-light text-[#A7EFFF]
             md:text-2xl">the right doctors , clinic and care for your family. </div>
                <div className="flex space-x-15 pt-20">
                    <div className="w-[260px] h-[60px] bg-[#2C2C2C] rounded-xl flex">
                            <svg width="47" height="43" viewBox="0 0 47 43" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '17px',marginLeft: '20px'}}>
                                <path d="M0 38H47V43H0V38Z" fill="#FFCCFA"/>
                                <path d="M29 26.25V23.75C29 22.4239 28.4732 21.1521 27.5355 20.2145C26.5979 19.2768 25.3261 18.75 24 18.75H15.25C13.9239 18.75 12.6521 19.2768 11.7145 20.2145C10.7768 21.1521 10.25 22.4239 10.25 23.75V26.25M31.5 10L37.75 16.25M37.75 10L31.5 16.25M24.625 8.75C24.625 11.5114 22.3864 13.75 19.625 13.75C16.8636 13.75 14.625 11.5114 14.625 8.75C14.625 5.98858 16.8636 3.75 19.625 3.75C22.3864 3.75 24.625 5.98858 24.625 8.75Z" stroke="#95D2FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        <div className="pl-6 pt-1">
                            <p className="italic font-light text-[#F5F5F5] leading-none font-[Inter] text-[1rem] pt-2 ">Profiles for Every</p>
                            <p className="italic font-light text-[#F5F5F5] font-[Inter] text-[1rem] ">Doctor in Egypt</p>
                        </div>

                        </div>


                    <div className="w-[260px] h-[60px] bg-[#2C2C2C] rounded-xl flex">
                        <svg width="47" height="45" viewBox="0 0 47 45" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '15px' , marginLeft: '20px'}}>
                            <path d="M0 40H47V45H0V40Z" fill="#FFCCFA"/>
                            <path d="M18 22.5L23 18.6875L28 22.5L26.125 16.3125L31.125 12.75H25L23 6.25L21 12.75H14.875L19.875 16.3125L18 22.5ZM23 27.5C21.2708 27.5 19.6458 27.1719 18.125 26.5156C16.6042 25.8594 15.2812 24.9688 14.1562 23.8438C13.0312 22.7188 12.1406 21.3958 11.4844 19.875C10.8281 18.3542 10.5 16.7292 10.5 15C10.5 13.2708 10.8281 11.6458 11.4844 10.125C12.1406 8.60417 13.0312 7.28125 14.1562 6.15625C15.2812 5.03125 16.6042 4.14063 18.125 3.48438C19.6458 2.82812 21.2708 2.5 23 2.5C24.7292 2.5 26.3542 2.82812 27.875 3.48438C29.3958 4.14063 30.7188 5.03125 31.8438 6.15625C32.9688 7.28125 33.8594 8.60417 34.5156 10.125C35.1719 11.6458 35.5 13.2708 35.5 15C35.5 16.7292 35.1719 18.3542 34.5156 19.875C33.8594 21.3958 32.9688 22.7188 31.8438 23.8438C30.7188 24.9688 29.3958 25.8594 27.875 26.5156C26.3542 27.1719 24.7292 27.5 23 27.5Z" fill="#95D2FF"/>
                        </svg>

                        <div className="pl-6 pt-1">
                            <p className="italic font-light text-[#F5F5F5] leading-none font-[Inter] text-[1rem] pt-2 ">More than 10 Million</p>
                            <p className="italic font-light text-[#F5F5F5]  font-[Inter] text-[1rem] ">patient Ratings</p>
                        </div>

                    </div>
                </div>
                </div>
          <img src="/images/Main%20doc.png" alt="Hero" className="absolute top-[40] right-4
          md:top-25 md:right-[5%] w-1/2 md:w-3xl
          object-contain z-0" />
          </div>

          <div className={` grid grid-cols-7 gap-[4vw] w-[72.9vw] ${suggestions.length < 4 && suggestions.length !==0? "h-[144px]" : "h-[110px]"}
              bg-[#F5F5F5] absolute top-[calc(800px-50px)]
              left-[27vw] transform -translate-x-[13.54vw]
              rounded-2xl items-start justify-center pt-6`}>
             <div className="pl-10 col-span-3">
                 <SearchBar text="Search Doctor , Clinic" Input={formData.text} change={handlechange} width="28vw"/>
                 <div className="flex flex-row space-x-3 mt-3">

                     { suggestions.length < 4 &&(suggestions.map((suggetion) =>
                         <button
                             type="button"
                             onClick={()=>
                             setFormData(prev=>({...prev,text:suggetion.fullName}))
                             }
                             className="bg-white rounded-lg px-2 py-1 text-[#4A498C] hover:bg-blue-500">
                             {suggetion.fullName}
                         </button>
                     ))}

                 </div>
             </div>

              <div className="col-span-3 pl-5">
                  <LocationFilter location="Set your location" width="28vw" />
              </div>
              <svg width="56" height="59" viewBox="0 0 56 59" fill="none" xmlns="http://www.w3.org/2000/svg" className="col-span-1">
                  <path d="M0 10C0 4.47715 4.47715 0 10 0H46C51.5229 0 56 4.47715 56 10V49C56 54.5228 51.5229 59 46 59H10C4.47715 59 0 54.5228 0 49V10Z" fill="#4A498C"/>
                  <path d="M37.625 40.5L32.7312 35.425M35.375 28.8333C35.375 33.988 31.3456 38.1667 26.375 38.1667C21.4044 38.1667 17.375 33.988 17.375 28.8333C17.375 23.6787 21.4044 19.5 26.375 19.5C31.3456 19.5 35.375 23.6787 35.375 28.8333Z" stroke="#EBFFEE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

          </div>
          <div className="font-[Montserrat Alternates] pt-30 pl-[14vw] text-[#525252] font-medium text-xl">Specialties</div>
          <SpecialtiesSlider setActiveIndex={setActiveIndex} activeIndex={activeIndex} setDoctorsList={setDoctorsList} />
          {
              isPopupOpen?
              <Mypopup selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} setIsPopupOpen={setIsPopupOpen}/>:<div></div>}
          {
              activeIndex == null ? (
                  <DefaultContent />
              ) : (
                  <>
                      {
                          doctorsList.length > 0 ? ( <div className="justify-center items-center grid grid-cols-[600px_600px] gap-10 pt-20">
                          <DoctorList
                              setIsPopupOpen={setIsPopupOpen}
                              selectedDoctor={selectedDoctor}
                              setSelectedDoctor={setSelectedDoctor}
                              Doctors={doctorsList} // Pass the filtered doctors list
                          />
                      </div>) : (<div className="flex space-x-8 justify-center items-center  w-full h-40">
                          <div className="loader"> </div>
                          <p> We are trying to contact servers </p>

                      </div>)}
                  </>


              )
          }




      </div>

  )
}

