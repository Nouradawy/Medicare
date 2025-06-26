import React, {useEffect, useState} from "react";
import APICalls from "../../services/APICalls.js";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import {Calendar, Check, Clock} from "lucide-react";
import MedicalHistoryReport from "../Settings/MedicalHistoryReport.jsx";
import DoctorCalendar from "../Homepage/components/DoctorCalendar.jsx";
import {useNavigate} from "react-router-dom";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";



export default function DoctorDashboard(){
  const MainScreenSize = 80;
  const [workingHoursDropDown , setWorkingHoursDropDown]  = useState([]);
  const [Index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [formData, setFormData] = useState({
    workingDays : user.doctor.workingDays,
    vacations: user.doctor.vacations,
    startTime: user.doctor.startTime,
    endTime: user.doctor.endTime,
  });

  const [enableVacation , setEnableVacation] = useState(false);
  const [appointments, setAppointments] = useState([]);
  // Initialize state from localStorage or use default values.
  // This function ensures localStorage is accessed only on the initial render.
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  useEffect(() => {

    if(workingHoursDropDown.length ===0 ) {
      for (let i = 1; i <= 12; i++) {
        i < 10 ? workingHoursDropDown.push({key:"0" +i + ":00 AM",value:"0" +i + ":00 AM"}) : workingHoursDropDown.push({key:i +":00 AM", value:i +":00 AM"});
      }
      for (let i = 1; i <= 12; i++) {
        i < 10 ? workingHoursDropDown.push({key:"0" +i + ":00 PM" , value:"0" +i + ":00 PM"}) : workingHoursDropDown.push({key:i +":00 PM" , value:i + ":00 PM"});
      }
      setWorkingHoursDropDown(workingHoursDropDown);
    }
  },[workingHoursDropDown]);

  return(
      <>
        <NavBar/>
        <div className="flex flex-row  justify-center space-x-10 @container">
          {/*SideBar*/}
          <div className="flex-col bg-white border-gray-200  rounded-lg pt-5 @max-[800px]:hidden ">
            {/*sidebar Item*/}
            <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index}>

              <svg
                  height="24px"
                  width="24px"
                  fill="#000000"
                  viewBox="0 -960 960 960"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
              </svg>
              <p>Dashboard</p>
            </SidebarItem>

            <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index}>
              <svg
                  height="24px"
                  width="24px"
                  fill="#000000"
                  viewBox="0 -960 960 960"
                  xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
              </svg>
              <p>Calender</p>

            </SidebarItem>



          </div>
          {/*MainScreen*/}
          <div className={`flex-col w-[${MainScreenSize.toString()}vw] bg-white border-gray-200 border-1 rounded-lg p-10`}>
            {Index === 0 ? (
                <Dashboard workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments} setAppointments={setAppointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} Index={Index}/>
            ) : (
                <MyCalendar workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments}   setSelectedDate={setSelectedDate}/>
            )}
          </div>
        </div>
      </>
  )}

function Dashboard({workingHours , user , setUser , formData ,setFormData , enableVacation , setEnableVacation , appointments , setAppointments , setSelectedDate , selectedDate ,Index}) {

  const [ShowPatientInfo, setShowPatientInfo] = useState(() => {
    const savedShowInfo = localStorage.getItem("showPatientInfo");
    return savedShowInfo ? JSON.parse(savedShowInfo) : false;
  });

  const [appointmentIndex, setAppointmentIndex] = useState(0);

  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    revenue: 0,
    todayRemaining: 0,
    rating: 0
  });

  // --- MODIFICATION START ---
  // useEffect hooks to save state to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("showPatientInfo", JSON.stringify(ShowPatientInfo));
  }, [ShowPatientInfo]);




  useEffect(() => {
    const fetchData = async () => {

      try {
        await APICalls.DoctorReservations();
        const doctorApp = JSON.parse(localStorage.getItem("DoctorReservations"));
        setAppointments(doctorApp.filter(appointment => appointment.status === "Pending"));
        // calculateStats([...appointments, ...doctorApp.filter(appointment => appointment.status === "Pending")]);

      } catch (error) {
        console.error("Error fetching appointments:", error);
      }


    };

    fetchData();
  }, []);




  // Calculate statistics
  const calculateStats = (reservations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = reservations.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime() && app.status !== "Canceled";
    });

    const todayRemaining = todayAppointments.filter(app => app.status !== "Completed").length;

    // Unique patients count
    const uniquePatientIds = [...new Set(reservations.map(app => app.patientId))];

    // New patients in the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newPatients = reservations.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= lastMonth;
    }).reduce((unique, app) => {
      if (!unique.includes(app.patientId)) {
        unique.push(app.patientId);
      }
      return unique;
    }, []).length;

    // Mock revenue calculation (250 EGP per appointment)
    const revenue = reservations.filter(app => app.status === "Completed").length * 250;

    // Mock rating (between 4.0 and 5.0)
    const rating = (4 + Math.random()).toFixed(1);

    setStats({
      totalPatients: uniquePatientIds.length,
      newPatients,
      revenue,
      todayRemaining,
      rating
    });
  };

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Call API to update appointment status
      await APICalls.UpdateAppointmentStatus(appointmentId, newStatus);

      // Refresh user data and appointments
      await APICalls.DoctorReservations();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));
      calculateStats(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));


      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return false;
    }
  };

  // Get patient list from localStorage
  const patientList = JSON.parse(localStorage.getItem("DoctorReservations") || "[]");

  // Filter appointments for the selected date
  const getFilteredAppointments = () => {
    const filteredDate = new Date(selectedDate);
    filteredDate.setHours(0, 0, 0, 0);

    return appointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === filteredDate.getTime();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Check if selected date is today
  const isToday = () => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear();
  };

  const [filteredAppointments , SetfilteredAppointments] = useState(getFilteredAppointments());
  useEffect(() => {
    SetfilteredAppointments(getFilteredAppointments());
  }, [appointments, selectedDate]);

  // --- MODIFICATION START ---
  // Add a check to ensure appointmentIndex is valid.
  // This prevents an error if the appointments list changes after a refresh
  // and the saved index is now out of bounds.
  useEffect(() => {
    if (appointmentIndex >= filteredAppointments.length) {
      setAppointmentIndex(0);
      setShowPatientInfo(false);
    }
  }, [filteredAppointments, appointmentIndex]);
  // --- MODIFICATION END ---



  // Get doctor's name from user data
  const doctorName = user?.fullName || "Doctor";

  return (
      <div className="min-h-screen bg-gray-50 pb-10">
        {/* Welcome Banner */}
        <div className="bg-[#e8e8d4] p-4 sm:p-6 rounded-lg shadow-sm mb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Welcome {doctorName}!</h1>
              <p className="text-base sm:text-lg mt-1">you have {stats.todayRemaining} patients remaining
                today!</p>
              <p className="text-base sm:text-lg">your Todays Rating is <span
                  className="font-bold">{stats.rating}</span></p>
            </div>
            <div
                className="relative sm:absolute right-8 top-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 mt-4 sm:mt-0">
              <img
                  src="/api/placeholder/150/100"
                  alt="Stethoscope"
                  className="opacity-80 w-32 sm:w-auto"
              />
            </div>
          </div>
          <div className="absolute top-4 right-4 text-gray-600 hidden sm:block">
            <p>{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p className="text-right">{new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}</p>
          </div>
          <div className="block sm:hidden mt-4 text-gray-600">
            <p>{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p>{new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}</p>
          </div>
        </div>

        <div className="px-2 sm:px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">Revenue</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold">{stats.revenue} EGP</p>
                  <p className="text-sm text-gray-500">Per day</p>
                </div>
                <div className="flex items-center text-green-500">
                  <span className="text-xs mr-1">↑</span>
                  <span className="text-sm">2%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">Total
                patients</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold">{stats.totalPatients}</p>
                  <p className="text-sm text-gray-500">&nbsp;</p>
                </div>
                <div className="flex items-center text-green-500">
                  <span className="text-xs mr-1">↑</span>
                  <span className="text-sm">3%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 font-medium mb-2 bg-gray-800 text-white inline-block px-4 py-1 rounded">New
                patients</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold">{stats.newPatients}</p>
                  <p className="text-sm text-gray-500">Per month</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs mr-1">&nbsp;</span>
                  <span className="text-sm">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-[1700px] mx-auto">
            {/* Today's Appointments */}
            <div className={`@container ${ShowPatientInfo ? "lg:col-span-3 ":"lg:col-span-4 "} `}>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 p-4 border-b">
                  <h2 className="text-lg sm:text-xl font-bold">Reservations</h2>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                              <span className="font-medium">
                                  {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                {isToday() ? " (Today)" : ""}
                              </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment, index) => {
                        // Find the patient info - if patient isn't in list, use placeholder data
                        const patient = patientList.find(p => p.id === appointment.user.userId) || {
                          fullName: "Patient #" + appointment.patientId,
                          email: "Not available",
                          phone: "Not available"
                        };

                        return (
                            <div key={index}
                                 className={`p-4 hover:bg-gray-50 transition-colors ${index === 0 && "bg-[#E7F0EE]/42"}`}>
                              <div className={`flex items-start ${index ===0 && "h-35"}`}>
                                <div className={`flex`}>
                                  <img
                                      src={appointment.user.imageUrl != null ? appointment.user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                                      alt="Patient"
                                      className="h-22 w-22 rounded-full object-cover z-1 ml-1"
                                  />
                                  {index == 0 && <div
                                      className="w-[50cqw] md:w-[75cqw] bg-[#ABD1DD]/47 rounded-xl z-0 mt-15 absolute px-5 py-7 text-black/70">
                                    <p className="max-[1700px]:w-[50cqw] overflow-hidden text-ellipsis whitespace-nowrap">{appointment.visitPurpose}</p>
                                    <button type="button"
                                            onClick={()=> {
                                              setAppointmentIndex(index);
                                              setShowPatientInfo(!ShowPatientInfo);
                                            }
                                            }
                                            className="absolute right-0 bottom-0 font-[Poppins] bg-[#FFFFFF]/47 rounded-xl px-4 py-2 mr-2 mb-2 text-xs">More
                                      Details</button>
                                  </div>
                                  }

                                </div>
                                <div className="flex-grow">
                                  <div
                                      className={`flex justify-between items-start  ml-5`}>
                                    <div className="flex flex-col">
                                      <div className="flex flex-row">
                                        <h3 className="font-medium font-[Poppins]">{appointment.user.fullName}</h3>
                                        <p className="text-sm text-gray-500 ml-4">
                                          {/*TODO:Add New Patient tages logic*/}
                                          {appointment.status === "New Patient" ? "New Patient" : "Return Visit"}
                                        </p>

                                      </div>
                                      {index !== 0 && (<div
                                          className="flex items-center text-sm text-gray-500">
                                        <Clock size={14} className="mr-1"/>
                                        <span>{new Date(appointment.date).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}</span>
                                      </div>)}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                      {/*redesign appointment status should be !==*/}
                                      {appointment.status !== "Canceled" && appointment.status !== "Completed" && (
                                          <>
                                            <button
                                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm"
                                                onClick={() => {
                                                  // Show details or reschedule logic
                                                }}
                                            >
                                              Reschedule
                                            </button>
                                            <button
                                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-sm flex items-center"
                                                onClick={async () => {
                                                  await updateAppointmentStatus(appointment.id, "Completed");
                                                }}
                                            >
                                              <Check size={14} className="mr-1"/> Dismiss
                                            </button>

                                            {index === 0 && (
                                                <div
                                                    className="flex flex-col bg-orange-100 text-orange-700 px-3 py-0.5 rounded text-xs w-30 mt-5 items-center">
                                                  <p>Next patient in</p>
                                                  {/*TODO: add logic to calculate time left*/}
                                                  <p>30min</p>
                                                </div>
                                            )}
                                          </>
                                      )}
                                      {appointment.status === "Completed" && (
                                          <span
                                              className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                                                                      Completed
                                                                  </span>
                                      )}
                                      {appointment.status === "Canceled" && (
                                          <span
                                              className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                                                      Canceled
                                                                  </span>
                                      )}
                                    </div>
                                  </div>


                                </div>
                              </div>
                            </div>
                        );
                      })
                  ) : (

                      <div className="py-8 text-center text-gray-500">
                        <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400"/>
                        <p>No appointments scheduled for {isToday() ? "today" : "this date"}.</p>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Component */}
            {ShowPatientInfo && filteredAppointments.length > appointmentIndex ?<div className="lg:col-span-3">
              <MedicalHistoryReport  appointment={filteredAppointments} Index={appointmentIndex} user={user} setUser={setUser}/>
            </div> :<div className=" lg:col-span-2">
              <DoctorCalendar
                  appointments={appointments}
                  onDateSelect={(date) => setSelectedDate(date)}
                  user={user}
                  formData={formData}
                  setFormData={setFormData}
                  enableVacation={enableVacation}
                  setEnableVacation={setEnableVacation}

              />

            </div>}

          </div>

          {/* All Appointments Table */}
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-100 p-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold">All Patient Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {appointments && appointments.length > 0 ? (
                    appointments.map((appointment, index) => {
                      // Find the patient info - if patient isn't in list, use placeholder data
                      const patient = patientList.find(p => p.id === appointment.patientId) || {
                        fullName: "Patient #" + appointment.patientId,
                        // TODO: Add email and phone number as contact info
                        email: "Not available",
                        phone: "Not available"
                      };

                      return (
                          <tr
                              key={index}
                              className={`
                          ${appointment.status === "Canceled" ? "bg-red-50" :
                                  appointment.status === "Completed" ? "bg-green-50" :
                                      appointment.status === "Confirmed" ? "bg-blue-50" : ""}
                      hover:bg-gray-50
                          `}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div
                                      className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                                  <div
                                      className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{appointment.email}</div>
                              <div className="text-sm text-gray-500">{patient.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${appointment.status === "Canceled" ? "bg-red-100 text-red-800" :
                              appointment.status === "Completed" ? "bg-green-100 text-green-800" :
                                  "bg-blue-100 text-blue-800"}
                          `}>
                            {appointment.status}
                          </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {appointment.status !== "Canceled" && appointment.status !== "Completed" && (
                                  <div className="flex space-x-2">
                                    <button
                                        className="text-green-600 hover:text-green-900"
                                        onClick={async () => {
                                          await updateAppointmentStatus(appointment.id, "Completed");

                                        }}
                                    >
                                      Complete
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={async () => {
                                          if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                            const success = await updateAppointmentStatus(appointment.id, "Canceled");
                                            if (success) {
                                              alert("Appointment canceled successfully.");
                                            }
                                          }
                                        }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                              )}
                              {appointment.status === "Completed" && (
                                  <span className="text-green-600">✓ Completed</span>
                              )}
                              {appointment.status === "Canceled" && (
                                  <span className="text-red-600">✗ Canceled</span>
                              )}
                            </td>
                          </tr>
                      );
                    })
                ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No appointments found. Your scheduled appointments will appear here.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}
function SidebarItem({children , setIndex, Index , currentIndex}) {
  const isActive = Index === currentIndex;
  return(
      <div className="flex flex-row items-center gap-3">
        <button
            onClick={() => {
              setIndex(Index);
              console.log(Index);
            }}
            className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
          {children}
        </button>
      </div>


  )
}
function ClinicManger({workingHours, setUser , formData ,setFormData , enableVacation , setEnableVacation }){




  useEffect( () => {

    const fetchUser = async () => {
      {
        console.log("From USEeffect", formData.workingDays);
        await APICalls.UpdateOrCreateDoctorInfo(formData);
        await APICalls.GetCurrentUser();
        setUser(JSON.parse(localStorage.getItem("userData")));
      }
    }
    fetchUser();
  },[formData, setUser]);


  function handleWorkingHoursChange({e}){
    const {name, value} = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: amPmToSqlTime(value)
    });
  }

  function handleWorkingDayChange({name}) {
    if(formData.workingDays.includes(name)){
      setFormData({...formData, workingDays: formData.workingDays.filter(day => day !== name)});
      console.log("Remove" , formData.workingDays);
    } else {
      setFormData({...formData, workingDays: [...formData.workingDays, name]});
      console.log("ADD" , formData.workingDays);
    }
  }
  return(
      <div className="flex flex-col  gap-3">
        <div className="flex flex-col">
          <div>working days</div>
          <div className="flex flex-row space-x-2 ">
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "SUN"});
                }}
                className={`${formData.workingDays.includes("SUN") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>sun
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "MON"});
                }}
                className={`${formData.workingDays.includes("MON") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>MON
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "TUE"});
                }}
                className={`${formData.workingDays.includes("TUE") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>TUE
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "WED"});
                }}
                className={`${formData.workingDays.includes("WED") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>WED
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "THU"});
                }}
                className={`${formData.workingDays.includes("THU") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>THU
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "FRI"});
                }}
                className={`${formData.workingDays.includes("FRI") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>FRI
            </button>
            <button
                type="button"
                onClick={() => {
                  handleWorkingDayChange({name: "SAT"});
                }}
                className={`${formData.workingDays.includes("SAT") ? 'bg-blue-100' : 'bg-gray-100 text-gray-500'} p-2`}>SAT
            </button>
          </div>
        </div>
        <div className="flex flex-col space-x-10">
          <div>vacations</div>
          <button type="button"
                  onClick={() => {
                    setEnableVacation(!enableVacation);
                  }}
                  className={`${enableVacation?"bg-green-300":"bg-blue-100"} rounded-lg p-2`}
          >
            EDIT
          </button>
        </div>

        <div>working hours</div>
        <div className="flex flex-row space-x-10 ">
          <select
              name="startTime"
              value={toAmPm(formData.startTime)}
              onChange={(e) => {
                handleWorkingHoursChange({e});
              }}
          >
            {workingHours.map(({key, value}, idx) => (
                <option key={idx} value={value}> {key}</option>
            ))}
          </select>
          <p>to</p>
          <select
              name="endTime"
              value={toAmPm(formData.endTime)}
              onChange={(e) => {
                handleWorkingHoursChange({e});
              }}
          >
            {workingHours.map(({key, value}, idx) => (
                <option key={idx} value={value}> {key}</option>
            ))}
          </select>


        </div>
      </div>
  );
}

function MyCalendar({user , formData , setFormData , enableVacation , setEnableVacation , workingHours , setUser , appointments  , setSelectedDate }) {
return(<div className="flex flex-row justify-center items-center">
  <div className="min-w-[400px] max-w-[600px] ">
    <DoctorCalendar
      appointments={[]}
      onDateSelect={(date) => setSelectedDate(date)}
      user={user}
      formData={formData}
      setFormData={setFormData}
      enableVacation={enableVacation}
      setEnableVacation={setEnableVacation}

  /></div>
  < ClinicManger workingHours={workingHours}  setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation}  setEnableVacation={setEnableVacation} />
</div>);
}

function toAmPm(timeStr) {
  const [hour, minute] = timeStr.split(':');
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

function amPmToSqlTime(timeStr) {
  // Expects format "hh:mm AM/PM"
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00.000000`;
}