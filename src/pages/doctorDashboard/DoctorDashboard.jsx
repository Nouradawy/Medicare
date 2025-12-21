import React, {useEffect, useState} from "react";
import APICalls from "../../services/APICalls.js";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import {Calendar, Check, Clock, Loader2, X, Plus} from "lucide-react";
import MedicalHistoryReport from "../Settings/MedicalHistoryReport.jsx";
import DoctorCalendar from "../doctorDashboard/DoctorCalendar.jsx";
import {useNavigate} from "react-router-dom";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import toast, { Toaster } from 'react-hot-toast';



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
    fees: user.doctor.fees
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
        <Toaster position="top-right" />
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
          <div className={`flex-col w-[${MainScreenSize.toString()}vw] bg-gray-100 border-gray-200 border-1  p-10`}>
            {Index === 0 ? (
                <Dashboard workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments} setAppointments={setAppointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} Index={Index}/>
            ) : (
                <MyCalendar workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments}   setSelectedDate={setSelectedDate}/>
            )}
          </div>
        </div>
      </>
  )}

function Dashboard({
                     user , setUser , formData ,setFormData ,
                     enableVacation , setEnableVacation , appointments ,
                     setAppointments , setSelectedDate , selectedDate}) {

  const [ShowPatientInfo, setShowPatientInfo] = useState(() => {
    const savedShowInfo = localStorage.getItem("showPatientInfo");
    return savedShowInfo ? JSON.parse(savedShowInfo) : false;
  });

  const [appointmentIndex, setAppointmentIndex] = useState(0);

  // Reschedule modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Medical history modal state
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [medicalHistoryPatient, setMedicalHistoryPatient] = useState(null);
  const [medicalHistoryDate, setMedicalHistoryDate] = useState('');
  const [medicalHistoryDescription, setMedicalHistoryDescription] = useState('');
  const [addingMedicalHistory, setAddingMedicalHistory] = useState(false);

  const [stats, setStats] = useState(() =>{
    const persisted = JSON.parse(localStorage.getItem("dailyRevenue") || "{}");
    const todayKey = new Date().toISOString().split("T")[0];

    return {
      totalPatients: 0,
      newPatients: 0,
      revenue: persisted?.date === todayKey ? persisted.amount || 0 : 0,
      todayRemaining: 0,
      rating: 0
    }
  });


  // --- MODIFICATION START ---
  // useEffect hooks to save state to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("showPatientInfo", JSON.stringify(ShowPatientInfo));
  }, [ShowPatientInfo]);


//  Reset revenue at day change (runs hourly)
  useEffect(() => {
    const interval = setInterval(() => {
      const todayKey = new Date().toISOString().split("T")[0];
      const persisted = JSON.parse(localStorage.getItem("dailyRevenue") || "{}");
      if (persisted.date !== todayKey) {
        setStats((prev) => {
          const next = { ...prev, revenue: 0 };
          persistRevenue(0);
          return next;
        });
      }
    }, 60 * 60 * 1000); // hourly check
    return () => clearInterval(interval);
  }, []);

  // Used to update UI on Refresh
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


    // Mock rating (between 4.0 and 5.0)
    const rating = (4 + Math.random()).toFixed(1);

    setStats(prev => ({
      ...prev,
      totalPatients: uniquePatientIds.length,
      newPatients,
      todayRemaining,
      rating
    }));
  };

  //Helper to persist revenue to localStorage
  function persistRevenue(amount) {
    const todayKey = new Date().toISOString().split("T")[0];
    localStorage.setItem("dailyRevenue", JSON.stringify({ date: todayKey, amount }));
  }
  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Call API to update appointment status
      await APICalls.UpdateAppointmentStatus(appointmentId, newStatus);

      // Refresh user data and appointments
      await APICalls.DoctorReservations();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));
      calculateStats(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));

      // Add Revenue
      if (newStatus === "Completed") {
        const fees = Number(user?.doctor?.fees || 0);
        setStats((prev) => {
          const nextRevenue = prev.revenue + fees;
          const next = { ...prev, revenue: nextRevenue };
          persistRevenue(nextRevenue);
          return next;
        });
      }
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.message || `Failed to update appointment`);
      return false;
    }
  };

  // Function to handle reschedule
  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select both date and time');
      return;
    }

    setRescheduling(true);
    try {
      const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
      const formData = {
        date: newDateTime.toISOString(),
        doctorId: rescheduleAppointment.doctorId
      };

      await APICalls.RescheduleAppointment(rescheduleAppointment.id, formData);
      
      // Refresh appointments
      await APICalls.DoctorReservations();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status === "Pending"));
      
      toast.success('Appointment rescheduled successfully!');
      setShowRescheduleModal(false);
      setRescheduleAppointment(null);
      setRescheduleDate('');
      setRescheduleTime('');
    } catch (error) {
      toast.error(error.message || 'Failed to reschedule appointment');
    } finally {
      setRescheduling(false);
    }
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setRescheduleAppointment(appointment);
    // Pre-fill with current date/time
    const currentDate = new Date(appointment.date);
    setRescheduleDate(currentDate.toISOString().split('T')[0]);
    setRescheduleTime(currentDate.toTimeString().slice(0, 5));
    setShowRescheduleModal(true);
  };

  // Open medical history modal
  const openMedicalHistoryModal = (appointment) => {
    setMedicalHistoryPatient(appointment);
    setMedicalHistoryDate(new Date().toISOString().split('T')[0]);
    setMedicalHistoryDescription('');
    setShowMedicalHistoryModal(true);
  };

  // Handle adding medical history
  const handleAddMedicalHistory = async () => {
    if (!medicalHistoryDate || !medicalHistoryDescription.trim()) {
      toast.error('Please fill in both date and description');
      return;
    }

    setAddingMedicalHistory(true);
    try {
      const formData = {
        patientId: medicalHistoryPatient.patientId,
        date: medicalHistoryDate,
        description: medicalHistoryDescription
      };

      await APICalls.AddMedicalHistory(formData);
      
      // Refresh appointments to get updated data
      await APICalls.DoctorReservations();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status === "Pending"));
      
      toast.success('Medical history added successfully!');
      setShowMedicalHistoryModal(false);
      setMedicalHistoryPatient(null);
      setMedicalHistoryDate('');
      setMedicalHistoryDescription('');
    } catch (error) {
      toast.error(error.message || 'Failed to add medical history');
    } finally {
      setAddingMedicalHistory(false);
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
    setStats(prev => ({
      ...prev,
      todayRemaining: filteredAppointments.length
    }));
  }, [filteredAppointments, appointmentIndex]);
  // --- MODIFICATION END ---



  // Get doctor's name from user data
  const doctorName = user?.fullName || "Doctor";

  return (
      <div>
        {/* Welcome Banner */}
        <section className="relative bg-gradient-to-br from-teal-400 to-teal-800 rounded-2xl shadow-lg overflow-hidden text-white mb-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-white opacity-5"></div>

          <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  Welcome back, Dr. {doctorName || ""}! 👋
                </h1>
                <p className="text-teal-100 text-lg font-light">
                  You have <span className="font-semibold text-white">{stats.todayRemaining || 0} patients</span> remaining today. Your dedication makes a difference.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <span className="material-icons-round text-yellow-300 text-sm">star</span>
                  <span className="text-sm font-medium">Today's Rating: <span className="font-bold text-white">{stats.rating || 5.0}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-100">
                  <span className="material-icons-round text-sm opacity-80">schedule</span>
                  <span>Next patient in 30min</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[200px] text-center shadow-inner">
              <p className="text-xs uppercase tracking-wider text-teal-200 font-semibold mb-1">Current Time</p>
              <div className="text-3xl font-bold font-display tabular-nums">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' ,hour12:false})} <span className="text-sm font-medium text-teal-200">{new Date().toLocaleTimeString().split(' ')[1]}</span>
              </div>
              <div className="h-px w-full bg-white/20 my-3"></div>
              <p className="text-sm font-medium text-teal-50">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        <div className="px-2 sm:px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-7xl mx-auto">
            {/* Revenue */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-900 rounded-lg text-white">
                  <span className="material-icons-round text-xl">payments</span>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+ 2%</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {Number(stats.revenue) || 0} <span className="text-sm font-normal text-gray-500 ml-1">EGP</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Per day</p>
              </div>
            </div>

            {/* Total Patients */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-900 rounded-lg text-white">
                  <span className="material-icons-round text-xl">group</span>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+ 3%</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{Number(stats.totalPatients) || 0}</h3>
                <p className="text-xs text-gray-400 mt-1">Since last month</p>
              </div>
            </div>

            {/* New Patients */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-900 rounded-lg text-white">
                  <span className="material-icons-round text-xl">person_add</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">New Patients</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{Number(stats.newPatients) || 0}</h3>
                <p className="text-xs text-gray-400 mt-1">Per month</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-[1700px] mx-auto">
            {/* Today's Appointments */}
            <div className={`@container ${ShowPatientInfo ? "lg:col-span-3 " : "lg:col-span-4 "} `}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Upcoming Reservations</h3>
                  <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded border border-gray-200">
        {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Highlighted first reservation if exists */}
                  {filteredAppointments.length > 0 && (
                      <div className="bg-[#0F766E]/5">
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="relative">
                                <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {filteredAppointments[0].user?.imageUrl !==null? (
                                      <img
                                          src={DefaultMale }
                                          alt="Patient"
                                          className="h-15 w-15 rounded-full object-cover z-1 ml-1"
                                          onError={(e) => { e.currentTarget.src = DefaultMale; }}
                                      />
                                  ) : (
                                    <span className="material-icons-round">person</span>
                                    )}


                                </div>

                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  {filteredAppointments[0].user.fullName || "Patient"}
                                </h4>

                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                  <span className="material-icons-round text-base text-primary">schedule</span>
                                  <span>{new Date(filteredAppointments[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  <span className="mx-1 text-gray-300">|</span>
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Next in 30min</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                  onClick={() => openRescheduleModal(filteredAppointments[0])}
                              >
                                Reschedule
                              </button>
                              <button
                                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                  onClick={() => updateAppointmentStatus(filteredAppointments[0].id, "Completed")}
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600 italic">
                              Selected {new Date(filteredAppointments[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <button className="text-xs font-medium text-[#0F766E] hover:underline" onClick={() => setShowPatientInfo((prev) => !prev)}>
                              {ShowPatientInfo ? "Close Details" : "More Details"}
                            </button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Remaining reservations */}
                  {filteredAppointments.slice(1).map((app) => (
                      <div key={app.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              {filteredAppointments[0].user?.imageUrl ? (
                                  <img
                                      src={filteredAppointments[0].user.imageUrl }
                                      alt="Patient"
                                      className="h-22 w-22 rounded-full object-cover z-1 ml-1"
                                      onError={(e) => { e.currentTarget.src = DefaultMale; }}
                                  />
                              ) : (
                                  <span className="material-icons-round">person</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{app.user.fullName || "Patient"}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">{app.type || "Visit"}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="material-icons-round text-[10px]">schedule</span>
                                  {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            <button
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                                title="Reschedule"
                                onClick={() => openRescheduleModal(app)}
                            >
                              <span className="material-icons-round text-lg">edit_calendar</span>
                            </button>

                          </div>
                        </div>
                      </div>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                  <button className="text-sm text-primary font-medium hover:text-primary-light transition-colors">
                    View All Reservations
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Component */}
            {ShowPatientInfo && filteredAppointments.length > appointmentIndex ?<div className="lg:col-span-3">
              <MedicalHistoryReport  appointment={filteredAppointments} Index={appointmentIndex} user={user} setUser={setUser} onAddHistory={openMedicalHistoryModal}/>
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

        {/* Reschedule Modal */}
        {showRescheduleModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Reschedule Appointment</h3>
                  <button
                      onClick={() => {
                        setShowRescheduleModal(false);
                        setRescheduleAppointment(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {rescheduleAppointment && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Patient: <span className="font-medium text-gray-900">{rescheduleAppointment.user?.fullName}</span></p>
                      <p className="text-sm text-gray-600">Current: <span className="font-medium text-gray-900">{new Date(rescheduleAppointment.date).toLocaleString()}</span></p>
                    </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                    <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                    <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                      onClick={() => {
                        setShowRescheduleModal(false);
                        setRescheduleAppointment(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleReschedule}
                      disabled={rescheduling}
                      className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {rescheduling && <Loader2 className="w-4 h-4 animate-spin" />}
                    {rescheduling ? 'Rescheduling...' : 'Reschedule'}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Medical History Modal */}
        {showMedicalHistoryModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add Medical History</h3>
                  <button
                      onClick={() => {
                        setShowMedicalHistoryModal(false);
                        setMedicalHistoryPatient(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {medicalHistoryPatient && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Patient: <span className="font-medium text-gray-900">{medicalHistoryPatient.user?.fullName}</span></p>
                      <p className="text-sm text-gray-600">Visit Purpose: <span className="font-medium text-gray-900">{medicalHistoryPatient.visitPurpose}</span></p>
                    </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={medicalHistoryDate}
                        onChange={(e) => setMedicalHistoryDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={medicalHistoryDescription}
                        onChange={(e) => setMedicalHistoryDescription(e.target.value)}
                        placeholder="Enter medical history details, diagnosis, treatment notes, etc."
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                      onClick={() => {
                        setShowMedicalHistoryModal(false);
                        setMedicalHistoryPatient(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleAddMedicalHistory}
                      disabled={addingMedicalHistory}
                      className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {addingMedicalHistory && <Loader2 className="w-4 h-4 animate-spin" />}
                    {addingMedicalHistory ? 'Adding...' : 'Add Medical History'}
                  </button>
                </div>
              </div>
            </div>
        )}
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

function MyCalendar({user , formData , setFormData , enableVacation , setEnableVacation , workingHours , setUser,
                      setSelectedDate }) {
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