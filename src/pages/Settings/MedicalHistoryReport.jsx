import {DefaultFemale, DefaultMale, ImageConfig} from "../../Constants/constant.jsx";
import {ChevronRight , ChevronDown , Send} from "lucide-react";
import React, {useEffect, useState} from "react";
import DragDropFile from "../../components/FilePicker/DragDropFile.jsx";
import { Document, Page } from 'react-pdf';
import PDFReader from "./PDFReader.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import APICalls from "../../services/APICalls.js";
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';


export default function MedicalHistoryReport({appointment , Index , user , setUser}) {
    const currentAppointment = appointment[Index];

    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const [PDFurl , setPDFurl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        ReportText:"",
        PatientIssue:appointment[Index].visitPurpose,
    })

    useEffect(() => {
        if (currentAppointment) {
            setFormData(prev => ({ ...prev, PatientIssue: currentAppointment.visitPurpose }));
        }
    }, [currentAppointment]);

    // --- CONDITIONAL RETURN IS SAFE AFTER ALL HOOKS ---
    // If there's no appointment data, we can't render the report.
    if (!currentAppointment) {
        // This returns nothing, preventing the component from rendering and crashing.
        return null;
    }

    return(
       <>
           {
               showPDF ===true?  (
                   <PDFReader close={setShowPDF} url={PDFurl}/>
               ): (<div className="bg-white h-full rounded-lg shadow p-6 flex flex-col">
                   <div className="flex flex-row">
                       <img src={appointment[Index].user.imageUrl != null ? appointment[Index].user.imageUrl : appointment[Index].user.gender === "male" ? DefaultMale : DefaultFemale}
                            className="h-22 w-22 rounded-full object-cover" alt=""/>
                       <div className="flex-col">
                           <p> Name: {appointment[Index].user.fullName}</p>
                           <p> Gender: {appointment[Index].user.gender}</p>
                           <p> Age: {appointment[Index].user.age}</p>
                           <p> Age: {appointment[Index].user.dateOfBirth}</p>
                       </div>

                   </div>
                       {/*First Dropdown*/}
                   <button
                       type="button"
                       className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                       onClick={() => dropdownIndex!==0 ?setDropdownIndex(0) : setDropdownIndex(null)}>
                       <div className={`${dropdownIndex === 0 ? "rotate-90":"" } duration-300 transition-all ease-in-out`}> <ChevronRight /> </div>
                       VISIT REPORT
                   </button>

                   <div className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-y-auto @container ${dropdownIndex === 0 ? "max-h-200" : "max-h-0"}`}>

                       <div className="flex flex-row">
                           <div className=""><DragDropFile fileList={fileList} setFileList={setFileList} /></div>

                       </div>
                       <div className="flex flex-row">
                           <textarea
                               className="border-2 border-gray-200 rounded-lg w-[80cqw] resize-none "
                               value={formData.ReportText}
                               onChange={(e) => setFormData({...formData, ReportText: e.target.value})}
                               placeholder="Enter your report here"
                           ></textarea>

                           <button
                               type="button"
                               className="bg-amber-300 rounded-lg py-2 px-4 ml-2"
                               onClick={async () => {
                                   const data = new FormData();
                                   data.append('ReportText', formData.ReportText);
                                   data.append('PatientIssue', formData.PatientIssue);
                                   fileList.forEach(file => data.append('file', file));
                                   await APICalls.uploadDocument(data, appointment[Index].patientId);
                                   setFileList([]);
                                   setFormData({...formData, ReportText:""});

                                   const updatedUser = await APICalls.GetCurrentUser();
                                   setUser(updatedUser);
                               }}
                           >
                               <div className="flex-row flex"> Upload <Send/></div>
                           </button>


                       </div>
                       {user.doctor.preVisits.slice().reverse().map((visit, index) => (
                           <div className="flex flex-row" key={index}>
                               <div className="flex-col w-full px-4 pt-4">
                                   <div className="flex-row flex items-center w-full justify-between">
                                       <p className="text-sm font-medium ml-2">{formatDate(visit.date)}</p>
                                       <div className="w-[55cqw] h-[2px] bg-gray-300/40"></div>
                               </div>
                                   <div className="flex-row flex w-full justify-between items-center mt-2">
                                       <p className="text-sm ml-2">{visit.reportText}</p>
                                       <div className="flex-col flex overflow-y-auto h-[100px] w-[20cqw] border-l-2 border-gray-400 items-center ">
                                           {visit.reportFiles.map((file, index) => (
                                               <button key={index}
                                               type="button"
                                               className="justify-center items-center flex-col flex "
                                               onClick={()=>{
                                                   setPDFurl(file.toString());
                                                   setShowPDF(true);
                                               }}
                                               >

                                                   <img className="object-contain w-10"
                                                       src={ImageConfig[file.split('.').pop()] || ImageConfig['default']}
                                                       alt=""/>
                                                   <span
                                                       className="text-[11px] w-15 ">{file.split('/')[1]}
                                       </span></button>
                                           ))}
                                       </div>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
                       {/*Second Dropdown*/}
                   <button
                       type="button"
                       className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                       onClick={() => dropdownIndex!==1 ?setDropdownIndex(1) : setDropdownIndex(null)}>
                       <div className={`${dropdownIndex === 1 ? "rotate-90":"" } duration-300 transition-all ease-in-out`}> <ChevronRight /> </div>
                       MEDICAL HISTORY
                   </button>
                   <div className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 1 ? "max-h-200" : "max-h-0"}`}>
                       <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                               <thead className="bg-gray-50">
                               <tr>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                       Date
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                       Description
                                   </th>
                               </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200 ">
                               {currentAppointment.user.medicalHistories.map((history, index) => (
                                   <tr className="hover:bg-gray-50">
                                       <td className="px-6 py-4 whitespace-nowrap">{history.date}</td>
                                       <td className="px-6 py-4">{history.description}</td>
                                   </tr>
                               ))}



                               </tbody>
                           </table>
                       </div>
                   </div>
                       {/*Third Dropdown*/}
                       <button
                           type="button"
                           className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                           onClick={() => dropdownIndex!==2 ?setDropdownIndex(2) : setDropdownIndex(null)}>
                           <div className={`${dropdownIndex === 2 ? "rotate-90":"" } duration-300 transition-all ease-in-out`}> <ChevronRight /> </div>
                           CHRONIC DISEASE
                       </button>
                       <div className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 2 ? "max-h-200" : "max-h-0"}`}>
                           <div className="overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                   <thead className="bg-gray-50">
                                   <tr>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Name
                                       </th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Description
                                       </th>
                                   </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200 ">
                                   {currentAppointment.user.chronicDiseases
                                       .map((disease, index) => (
                                       <tr className="hover:bg-gray-50">
                                           <td className="px-6 py-4 whitespace-nowrap">{disease.name}</td>
                                           <td className="px-6 py-4">{disease.description}</td>
                                       </tr>
                                   ))}



                                   </tbody>
                               </table>
                           </div>
                       </div>

                       {/*Forth Dropdown*/}
                       <button
                           type="button"
                           className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                           onClick={() => dropdownIndex!==3 ?setDropdownIndex(3) : setDropdownIndex(null)}>
                           <div className={`${dropdownIndex === 3 ? "rotate-90":"" } duration-300 transition-all ease-in-out`}> <ChevronRight /> </div>
                           Allergies
                       </button>
                       <div className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 3 ? "max-h-200" : "max-h-0"}`}>
                           <div className="overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                   <thead className="bg-gray-50">
                                   <tr>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Allergies
                                       </th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Description
                                       </th>
                                   </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200 ">
                                   {currentAppointment.user.allergies
                                       .map((allergy, index) => (
                                           <tr className="hover:bg-gray-50">
                                               <td className="px-6 py-4 whitespace-nowrap">{allergy.allergy}</td>
                                               <td className="px-6 py-4">{allergy.description}</td>
                                           </tr>
                                       ))}



                                   </tbody>
                               </table>
                           </div>
                       </div>

                       {/*Fifth Dropdown*/}
                       <button
                           type="button"
                           className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                           onClick={() => dropdownIndex!==4 ?setDropdownIndex(4) : setDropdownIndex(null)}>
                           <div className={`${dropdownIndex === 4 ? "rotate-90":"" } duration-300 transition-all ease-in-out`}> <ChevronRight /> </div>
                           MEDICATIONS
                       </button>
                       <div className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 4 ? "max-h-200" : "max-h-0"}`}>
                           <div className="overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                   <thead className="bg-gray-50">
                                   <tr>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           MEDICATIONS
                                       </th>

                                   </tr>
                                   </thead>
                                   <tbody className="bg-white divide-y divide-gray-200 ">
                                   {currentAppointment.user.drugHistories
                                       .map((drug, index) => (
                                           <tr className="hover:bg-gray-50">
                                               <td className="px-6 py-4 whitespace-nowrap">{drug.drugName}</td>
                                           </tr>
                                       ))}



                                   </tbody>
                               </table>
                           </div>
                       </div>
               </div>


               )
           }
       </>

    );

}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = date.getDate();
    const getOrdinal = n => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };
    return `${day}, ${month} ${dayNum}${getOrdinal(dayNum)}`;
}