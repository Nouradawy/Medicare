import React, {useEffect, useState} from "react";
import APICalls from "../../services/APICalls.js";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import {Calendar, Check, Clock, Loader2, X, Plus} from "lucide-react";
import MedicalHistoryReport from "../Settings/MedicalHistoryReport.jsx";
import DoctorCalendar from "../doctorDashboard/DoctorCalendar.jsx";
import {useNavigate} from "react-router-dom";
import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import toast, { Toaster } from 'react-hot-toast';
import Reviews from "../../components/Reviews.jsx";



export default function DoctorDashboard(){
  const MainScreenSize = 80;
  const [workingHoursDropDown , setWorkingHoursDropDown]  = useState([]);
  const [Index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));
  // Get patient list from localStorage
  const patientList = JSON.parse(localStorage.getItem("DoctorReservations") || "[]");
  const [formData, setFormData] = useState({
    workingDays : user.doctor.workingDays,
    vacations: user.doctor.vacations,
    startTime: user.doctor.startTime,
    endTime: user.doctor.endTime,
    fees: user.doctor.fees
  });
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Call API to update appointment status
      await APICalls.UpdateAppointmentStatus(appointmentId, newStatus , null);

      // Refresh user data and appointments
      await APICalls.DoctorReservations();

      await APICalls.GetCurrentUser();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")));
      const freshUser =JSON.parse(localStorage.getItem("userData"));
      setUser(freshUser);

      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.message || `Failed to update appointment`);
      return false;
    }
  };
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
        <div className="flex flex-row  justify-center space-x-10 @container">
          {/*SideBar*/}
          <div className="flex-col bg-white ">
            {/*sidebar Item*/}
            <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index}>

              <span className={`material-icons-round mr-3 text-xl ${Index ===0?"text-teal-800 ":"text-gray-500"} `}>dashboard</span>
              <p className={`${Index ===0?"text-teal-800 ":"text-gray-500"} font-medium`}>Dashboard</p>
            </SidebarItem>

            <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index}>
              <span
                  className={`material-icons-round mr-3 text-xl ${Index ===1?"text-teal-800 ":"text-gray-500"}`}>calendar_today</span>
              <p className={`${Index ===1?"text-teal-800 ":"text-gray-500"} font-medium`}>Calender Settings</p>

            </SidebarItem>

            <SidebarItem setIndex={setIndex} Index={2} currentIndex={Index}>
              <span
                  className={`material-icons-round mr-3 text-xl ${Index ===2?"text-teal-800 ":"text-gray-500"}`}>calendar_today</span>
              <p className={`${Index ===2?"text-teal-800 ":"text-gray-500"} font-medium`}>Appointments</p>

            </SidebarItem>

            <SidebarItem setIndex={setIndex} Index={3} currentIndex={Index}>
              <span
                  className={`material-icons-round mr-3 text-xl ${Index ===3?"text-teal-800 ":"text-gray-500"}`}>group</span>
              <p className={`${Index ===3?"text-teal-800 ":"text-gray-500"} font-medium`}>Patients</p>

            </SidebarItem>

            <SidebarItem setIndex={setIndex} Index={4} currentIndex={Index}>
              <span
                  className={`material-icons-round mr-3 text-xl ${Index ===4?"text-teal-800 ":"text-gray-500"}`}>reviews</span>
              <p className={`${Index ===3?"text-teal-800 ":"text-gray-500"} font-medium`}>reviews</p>

            </SidebarItem>


          </div>
          {/*MainScreen*/}
          <div className={`flex-col w-[${MainScreenSize.toString()}vw]  bg-gray-50 border-gray-200 border-1  p-10`}>
            {Index === 0 ? (
                <Dashboard workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments} setAppointments={setAppointments} selectedDate={selectedDate} setSelectedDate={setSelectedDate} Index={Index}/>
            ) : Index ===1?(
                <CalendarSettings workingHours={workingHoursDropDown} user={user} setUser={setUser} formData={formData} setFormData={setFormData} enableVacation={enableVacation} setEnableVacation={setEnableVacation} appointments={appointments}   setSelectedDate={setSelectedDate}/>
            ) : Index ===4?(
                    <div className="bg-white p-15  pr-50">
                      <Reviews selectedDoctor={user.doctor}/>
                    </div>

            ) :(
                <Appointments
                    appointments={appointments}
                    updateAppointmentStatus={updateAppointmentStatus}
                    setAppointments={setAppointments}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
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
      rating: user.doctor.rating,
      servingNumber:user.doctor.servingNumber,
      totalFees:0,
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
        calculateStats([...appointments, ...doctorApp.filter(appointment => appointment.status === "Pending")]);

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




    setStats(prev => ({
      ...prev,
      totalPatients: uniquePatientIds.length,
      newPatients,
      todayRemaining,
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
      // TODO:Call API to update appointment status

      await APICalls.UpdateAppointmentStatus(appointmentId, newStatus ,(Number.parseInt(extraFeesInput, 10)+user.doctor.fees));

      // Refresh user data and appointments
      await APICalls.DoctorReservations();

      await APICalls.GetCurrentUser();
      setAppointments(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));
      calculateStats(JSON.parse(localStorage.getItem("DoctorReservations")).filter(app => app.status ==="Pending"));
      const freshUser =JSON.parse(localStorage.getItem("userData"));
      setUser(freshUser);

      // Add Revenue
      if (newStatus === "Completed") {
        const nextServing = freshUser?.doctor?.servingNumber ?? stats.servingNumber;
        const fees = Number(user?.doctor?.fees || 0);
        setStats((prev) => {
          const nextRevenue = prev.revenue + fees;
          const next = { ...prev, revenue: nextRevenue ,servingNumber: nextServing};
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

  // Visit duration modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsMode, setSettingsMode] = useState('duration'); // 'duration' | 'fees'
  const [presetDuration, setPresetDuration] = useState('');
  const [customDuration, setCustomDuration] = useState(user?.doctor?.visitDuration || 30);
  const [feesInput, setFeesInput] = useState(Number(user?.doctor?.fees || 0));
  const [servingInput, setServingInput] = useState(Number(user?.doctor?.servingNumber || 0));
  const [savingSettings, setSavingSettings] = useState(false);
  const [extraFeesInput, setExtraFeesInput] = useState(0);
  const [extraFeesAppointmentId, setExtraFeesAppointmentId] = useState(null);
  const openVisitDuration = () => {
    setSettingsMode('duration');
    setPresetDuration('');
    setCustomDuration(user?.doctor?.visitDuration || 30);
    setShowSettingsModal(true);
  };
  const openFeesEditor = () => {
    setSettingsMode('fees');
    setFeesInput(Number(user?.doctor?.fees || 0));
    setShowSettingsModal(true);
  };

  const openServingEditor = () => {
    setSettingsMode('serving');
    setServingInput(Number(user?.doctor?.servingNumber || 0));
    setShowSettingsModal(true);
  };

  function openExtraFeesEditor(appointment) {
    setSettingsMode('extraFees');
    setExtraFeesAppointmentId(appointment?.id || null);
    setExtraFeesInput(0);
    setShowSettingsModal(true);
  }

  // Save handler branches by mode
  async function saveSettings() {
    if (savingSettings) return;
    setSavingSettings(true);
    if(settingsMode === 'extraFees'){

      setSavingSettings(false);
      setShowSettingsModal(false);

    }
    else{
      try {
        const nextDoctor = {...user.doctor};

        if (settingsMode === 'serving') {
          const nextServing = Math.max(0, Number.parseInt(servingInput, 10) || 0);
          await APICalls.UpdateDoctorServingNumber(nextServing);

          const fresh = JSON.parse(localStorage.getItem('userData')) || user;
          const updated = {...fresh, doctor: {...fresh.doctor, servingNumber: nextServing}};
          localStorage.setItem('userData', JSON.stringify(updated));
          setUser(updated);
          setStats(prev => ({...prev, servingNumber: nextServing}));
          toast.success('Serving number updated.');
        } else {
          if (settingsMode === 'duration') {
            const nextDuration = Number(presetDuration || customDuration || 30);
            nextDoctor.visitDuration = nextDuration;
          } else if (settingsMode === 'fees') {
            const nextFees = Math.max(0, Number(feesInput || 0));
            nextDoctor.fees = nextFees;
          }

          await APICalls.UpdateOrCreateDoctorInfo({
            workingDays: nextDoctor.workingDays,
            vacations: nextDoctor.vacations,
            startTime: nextDoctor.startTime,
            endTime: nextDoctor.endTime,
            fees: nextDoctor.fees,
            visitDuration: nextDoctor.visitDuration,
          });

          await APICalls.GetCurrentUser();
          const fresh = JSON.parse(localStorage.getItem('userData')) || {...user, doctor: nextDoctor};
          setUser(fresh);

          toast.success(
              settingsMode === 'duration'
                  ? 'Visit duration updated.'
                  : 'Fees updated.'
          );
        }

        setShowSettingsModal(false);
      } catch (err) {
        toast.error(err?.message || 'Failed to save settings.');
      } finally {
        setSavingSettings(false);
      }
    }
  }
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
  const [dismissingTap, setDismissingTap] = useState(false);
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
                  <span className="text-sm font-medium"> Rating: <span className="font-bold text-white">{stats.rating || 5.0}</span></span>
                </div>
                <button className="flex items-center gap-2 text-sm text-teal-100 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"
                        onClick={ openVisitDuration}
                >
                  <span className="material-icons-round text-sm opacity-80">schedule</span>
                  <span>visit duration {(user.doctor.visitDuration || 30)} min</span>
                </button>
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
            <div  className={`flex flex-row bg-white rounded-xl p-6 shadow-sm border border-gray-100`}
                  style={{ gap: '35%' }}
                  onClick={ openFeesEditor}
                  role="button"
                  aria-haspopup="dialog"
            >
              <div className=" flex flex-col ">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-900 rounded-lg text-white">
                    <span className="material-icons-round text-xl">payments</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">Today's Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {Number(stats.revenue) || 0}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">EGP</p>
                </div>
              </div>

              <div  className={'flex flex-col '}>
                <span className={`self-end bg-green-200 p-2 mb-7 rounded text-sm text-gray-700`}>Edit Fees</span>
                <p className={` text-sm text-gray-500 font-medium`}>Fee per Visit</p>
                <p className={` flex items-end text-gray font-bold text-2xl`}> {user.doctor.fees} </p>
                <p className={`text-xs text-gray-400 mt-1`}>EGP</p>
              </div>
            </div>


            {/* Total Patients */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-900 rounded-lg text-white">
                  <span className="material-icons-round text-xl">group</span>
                </div>

              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{Number(stats.totalPatients) || 0}</h3>
                <p className="text-xs text-gray-400 mt-1">Patients</p>
              </div>
            </div>

            {/* New Patients */}
            <div className=" bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500  uppercase tracking-wide font-medium  flex items-center"> <span className="material-icons-round text-xl pr-2 ">confirmation_number</span> Serving Number</p>
                    <h3 className="text-5xl font-black text-gray-900  mt-1 tabular-nums tracking-tight">#{stats.servingNumber}</h3>
                  </div>
                  <div className="mb-1 flex items-center gap-2">

                    <button className="rounded-md bg-white  px-3 py-1.5 text-xs font-semibold text-gray-900 hadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 transition-colors  flex"
                    onClick={async () => {
                      await APICalls.UpdateDoctorServingNumber(0);
                      setStats(prev => ({
                        ...prev,
                        servingNumber: 0,
                      }));
                    }}
                    >
                      <span className="material-icons-round !text-[15px]  pr-2 ">replay</span> Reset
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4  flex gap-2">
                  <button className="flex-1 bg-[#14B8A6] active:bg-teal-700 text-white text-sm font-semibold py-2.5 px-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group/btn"
                          onClick={openServingEditor}
                  >
                    <span>SETTINGS</span>
                    <span className="material-icons-round text-lg group-hover/btn:translate-x-0.5 transition-transform">edit</span>
                  </button>
                </div>
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
                                  {filteredAppointments[0].user?.imageUrl ? (
                                      <img
                                          src={filteredAppointments[0].user.imageUrl }
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
                                  <span className="material-icons-round text-base text-[#0F766E]">schedule</span>
                                  <span>{new Date(filteredAppointments[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  <span className="mx-1 text-gray-300">|</span>
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Next in 30min</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                  className="  self-end px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                  onClick={() => openRescheduleModal(filteredAppointments[0])}
                              >
                                <span className="flex items-center gap-2  "> <span className="material-icons-round">event_repeat</span> Reschedule</span>
                              </button>
                              <div className="flex flex-row gap-2">

                                <button
                                    className="px-3 py-1.5 text-xs font-medium hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors rounded"
                                    onClick={async () => {
                                      openExtraFeesEditor(filteredAppointments[0])
                                    }}
                                >
                                  <span className="items-center gap-2 flex "> <span className="material-icons-round">add_circle</span> extra fees {Number(extraFeesInput) || 0}</span>

                                </button>

                                <button
                                    className="px-6 py-1.5 text-xs font-medium hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors rounded disabled:opacity-50"
                                    disabled={dismissingTap}
                                    onClick={async () => {
                                      setDismissingTap(true);
                                      try {
                                        await updateAppointmentStatus(filteredAppointments[0].id, "Completed");
                                      } finally {
                                        setExtraFeesInput(0);
                                        setDismissingTap(false);
                                        setShowPatientInfo(false);
                                      }
                                    }}
                                >
                                  <span className="items-center gap-2 flex "> <span className="material-icons-round">arrow_outward</span> {dismissingTap ? "Dismissing..." : "Dismiss"}</span>

                                </button>
                              </div>

                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600 italic">
                              {filteredAppointments[0].visitPurpose}
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
                {filteredAppointments.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p>No appointments scheduled for {isToday() ? "today" : "this date"}.</p>
                    </div>
                )}

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


        </div>

        {/* Unified Settings Modal */}
        {showSettingsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
          <span className="material-icons-round text-blue-600">
            {settingsMode === 'duration'
                ? 'schedule'
                : settingsMode === 'fees'
                    ? 'payments'
                    : settingsMode === 'serving'
                        ? 'confirmation_number'
                        : 'add_circle'}
          </span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 " id="modal-title">
                      {settingsMode === 'duration'
                          ? 'Adjust Visit Duration'
                          : settingsMode === 'fees'
                              ? 'Standard Fee Per Visit'
                              : settingsMode === 'serving'
                                  ? 'Edit Serving Number'
                                  : 'Additional Fees'}
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500 mb-4">
                        {settingsMode === 'duration'
                            ? 'Set the default duration for patient visits. This will affect future appointment scheduling.'
                            : settingsMode === 'fees'
                                ? 'The base cost for a regular patient consultation.'
                                : settingsMode === 'serving'
                                    ? 'Update your current serving number'
                                    : 'Add surcharge for specialized procedures or materials'}

                      </p>

                      {settingsMode === 'duration' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700" htmlFor="preset-duration">Quick Preset</label>
                              <select
                                  id="preset-duration"
                                  name="preset-duration"
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300  focus:outline-none focus:ring-[#0F766E] focus:border-[#0F766E] sm:text-sm rounded-md shadow-sm h-10"
                                  value={presetDuration}
                                  onChange={(e) => setPresetDuration(e.target.value)}
                              >
                                <option value="">Select...</option>
                                <option value="15">15 min</option>
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                                <option value="60">60 min</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700" htmlFor="duration">Custom Duration</label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    min="5"
                                    step="5"
                                    className="focus:ring-[#0F766E] focus:border-[#0F766E] block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
                                    value={customDuration}
                                    onChange={(e) => setCustomDuration(e.target.value)}
                                    placeholder="30"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                      ) : settingsMode === 'fees' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="fee-input">Base Consultation Fee</label>
                            <div className="mt-1 relative  w-70 border-gray-300 border rounded-md shadow-sm">
                              <input
                                  id="fee-input"
                                  name="fee-input"

                                  className="focus:ring-[#0F766E] focus:border-[#0F766E] block  pl-3 pr-10 sm:text-sm border-gray-500 rounded-md h-10 w-full"
                                  value={feesInput}
                                  onChange={(e) => setFeesInput(e.target.value)}
                                  placeholder="0"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">/ visit</span>
                              </div>
                            </div>
                            <p className={`text-[12px] text-gray-500  mt-2`}> This amount will be automatically applied to new  reservations.</p>
                          </div>
                      ) : settingsMode === 'serving' ?(
                          <div>
                            <label className="block text-sm font-medium text-gray-700 " htmlFor="serving-input">Serving Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                  id="serving-input"
                                  name="serving-input"
                                  type="number"
                                  min="0"
                                  step="1"
                                  className="focus:ring-[#0F766E] focus:border-[#0F766E] block w-full pl-3 pr-10 sm:text-sm border-gray-300   rounded-md h-10"
                                  value={servingInput}
                                  onChange={(e) => setServingInput(e.target.value)}
                                  placeholder="0"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">#</span>
                              </div>
                            </div>
                          </div>
                      ) : (
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Extra fees amount (EGP)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={extraFeesInput}
                                onChange={(e) => setExtraFeesInput(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="0.00"
                            />
                            {extraFeesAppointmentId && (
                                <p className="text-xs text-gray-400">For appointment \#{extraFeesAppointmentId}</p>
                            )}
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#0F766E] text-base font-medium text-white hover:bg-[#0F766E]-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E] sm:ml-3 sm:w-auto sm:text-sm"
                      type="button"
                      onClick={saveSettings}
                      disabled={savingSettings}
                  >
                    {savingSettings && <Loader2 className="h-4 w-4 animate-spin" />}
                    {savingSettings ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300  shadow-sm px-4 py-2 bg-white  text-base font-medium text-gray-700 0 hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F766E] sm:mt-0 sm:w-auto sm:text-sm"
                      type="button"
                      onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}


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
            className={`inline-flex w-full px-7 py-4 text-gray-800 hover:bg-blue-100 cursor-pointer ${isActive?"bg-gradient-custom":""}`} >
          {children}
        </button>
      </div>


  )
}


function ClinicManger({ workingHours, formData, setFormData, enableVacation, setEnableVacation }) {
  // Persist local changes to userData on every form change

  function handleWorkingHoursChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: amPmToSqlTime(value),
    }));
  }

  function removeVacation(dateStr) {
    setFormData((prev) => ({
      ...prev,
      vacations: (prev.vacations || []).filter((d) => d !== dateStr),
    }));
    toast.success("Vacation removed.");
  }
  function handleWorkingDayChange(name) {
    setFormData((prev) => {
      const exists = prev.workingDays.includes(name);
      const nextDays = exists ? prev.workingDays.filter((d) => d !== name) : [...prev.workingDays, name];
      return { ...prev, workingDays: nextDays };
    });
  }
  function formatVacationDate(dateStr) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  const dayButtons = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
      <div className="bg-white p-5 w-full max-w-[760px] min-w-[450px]">
        {/* Default Working Days */}
        <div className="mb-6 ">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-icons-round text-gray-400 text-lg">date_range</span>
            Default Working Days
          </h3>
          <div className="flex flex-wrap gap-2">
            {dayButtons.map((day) => {
              const active = formData.workingDays.includes(day);
              return (
                  <button
                      key={day}
                      type="button"
                      onClick={() => handleWorkingDayChange(day)}
                      className={
                        active
                            ? "w-12 h-10 rounded-lg text-sm font-bold transition-all text-[#14B8A6] bg-[#14B8A6]/10 border border-[#14B8A6]"
                            : "w-12 h-10 rounded-lg text-sm font-medium transition-all text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }
                  >
                    {day.slice(0, 3)}
                  </button>
              );
            })}
          </div>
        </div>

        {/* Planned Vacations */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="material-icons-round text-gray-400 text-lg">beach_access</span>
            Planned Vacations
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {Array.isArray(formData.vacations) && formData.vacations.length > 0
                      ? `${formData.vacations.length} vacation day(s) selected.`
                      : "No vacations scheduled for this month."}
                </p>
                <p className="text-xs text-blue-600 mt-1">Select days on the calendar to mark as off.</p>
              </div>
              <button
                  type="button"
                  onClick={() => setEnableVacation(!enableVacation)}
                  className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
              >
                {enableVacation ? "Done" : "Edit"}
              </button>
            </div>

            {/* 3) Vacation dates list as removable chips */}
            {Array.isArray(formData.vacations) && formData.vacations.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.vacations.map((dateStr) => (
                      <button
                          key={dateStr}
                          type="button"
                          onClick={() => removeVacation(dateStr)}
                          className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          title="Click to remove"
                      >
                        <span className="material-icons-round text-[14px] text-blue-500 group-hover:text-blue-700">event_busy</span>
                        <span>{formatVacationDate(dateStr)}</span>
                      </button>
                  ))}
                </div>
            )}
          </div>
        </div>


        {/* Working Hours */}
        <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-icons-round text-gray-400 text-lg">schedule</span>
            Working Hours
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="w-full md:w-auto flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Start Time
              </label>
              <div className="relative">
                <select
                    className="block bg-white  w-full pl-10 pr-15 py-2.5 text-base border-gray-300  rounded-lg shadow-sm appearance-none"
                    name="startTime"
                    value={toAmPm(formData.startTime)}
                    onChange={handleWorkingHoursChange}
                >
                  {workingHours.map(({ key, value }, idx) => (
                      <option key={idx} value={value}>
                        {key}
                      </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                  <span className="material-icons-round text-lg">wb_sunny</span>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  <span className="material-icons-round text-lg">expand_more</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center pt-6 text-gray-400">
              <span className="material-icons-round">arrow_forward</span>
            </div>
            <div className="md:hidden flex items-center justify-center text-gray-400 rotate-90 my-[-10px]">
              <span className="material-icons-round">arrow_forward</span>
            </div>

            <div className="w-full md:w-auto flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                End Time
              </label>
              <div className="relative">
                <select
                    className="block bg-white  w-full pl-10 pr-15 py-2.5 text-base border-gray-300  rounded-lg shadow-sm appearance-none"
                    name="endTime"
                    value={toAmPm(formData.endTime)}
                    onChange={handleWorkingHoursChange}
                >
                  {workingHours.map(({ key, value }, idx) => (
                      <option key={idx} value={value}>
                        {key}
                      </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                  <span className="material-icons-round text-lg">nights_stay</span>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  <span className="material-icons-round text-lg">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function CalendarSettings({ user, formData, setFormData, enableVacation, setEnableVacation, workingHours, setUser, setSelectedDate }) {
  async function handleSaveChanges() {
    try {
      await APICalls.UpdateOrCreateDoctorInfo(formData);
      await APICalls.GetCurrentUser();
      const fresh = JSON.parse(localStorage.getItem("userData"));
      setUser(fresh);
      toast.success("Changes saved to the server.");
    } catch (err) {
      toast.error(err?.message || "Failed to save changes.");
    }
  }

  function resetToUserDoctor() {
    const doc = user?.doctor || {};
    setFormData({
      workingDays: doc.workingDays || [],
      vacations: doc.vacations || [],
      startTime: doc.startTime || "08:00:00.000000",
      endTime: doc.endTime || "16:00:00.000000",
      fees: doc.fees || 0,
    });
    toast.success("Reset local changes.");
  }
  return (
      <div className={`flex flex-col bg-white border-gray-200 rounded-lg shadow-xs p-10 w-[80-vw] min-xl:h-[60vh] max-w-[1350px] mx-auto`}>
        <div className="flex flex-row justify-between items-center p-5 max-w-[1180px]">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-900 flex">
              <span className="material-icons-round text-[#14B8A6] pr-2">edit_calendar</span>
              Availability Settings</p>
            <p className="text-sm text-gray-500 ">Manage your working days and clinic hours .</p>
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={resetToUserDoctor}
            >
              <span className="material-icons-round text-lg">undo</span>
              Reset
            </button>
            <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] text-white rounded-lg text-sm font-medium hover:bg-[#14B8A6]/90 transition-colors shadow-sm"
                onClick={handleSaveChanges}
            >
              <span className="material-icons-round text-lg">save</span>
              Save Changes
            </button>
          </div>
        </div>
        <div className=" flex flex-wrap items-start justify-center gap-8">
          <div className="flex-1 basis-[360px] max-w-[410px] min-w-[320px] mt-4">
            <DoctorCalendar
                appointments={[]}
                onDateSelect={(date) => setSelectedDate(date)}
                user={user}
                formData={formData}
                setFormData={setFormData}
                enableVacation={enableVacation}
                setEnableVacation={setEnableVacation}
            />
          </div>
          <div className={`flex-1 basis-[520px] min-w-[420px] max-w-[860px]`}>
            <ClinicManger
                workingHours={workingHours}
                setUser={setUser}
                formData={formData}
                setFormData={setFormData}
                enableVacation={enableVacation}
                setEnableVacation={setEnableVacation}
            />
          </div>

        </div>
      </div>

  );
}

function Appointments({ appointments, setAppointments, selectedDate, setSelectedDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const doctorApp = JSON.parse(localStorage.getItem("DoctorReservations")) || [];
    setAppointments(doctorApp);
  }, [setAppointments]);

  // Normalize selected day to midnight for comparison
  const selectedDayKey = (() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  const filtered = (appointments || []).filter((app) => {
    const d = new Date(app.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === selectedDayKey;
  });

  return (
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-white p-4 border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold">All Patient Appointments</h2>

          <div className="relative">
            <button
                type="button"
                className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setShowDatePicker((s) => !s)}
                aria-haspopup="dialog"
                aria-expanded={showDatePicker}
            >
              <span className="material-icons-round text-base text-gray-500">calendar_today</span>
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </button>

            {showDatePicker && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10">
                  <input
                      type="date"
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      value={new Date(selectedDate).toISOString().split("T")[0]}
                      onChange={(e) => {
                        const next = new Date(e.target.value);
                        setSelectedDate(next);
                        setShowDatePicker(false);
                      }}
                      // Optional: limit range if needed
                      // min={new Date().toISOString().split("T")[0]}
                  />
                </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200 text-xs sm:text-sm">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="bg-gray-50">
            <tr>
              <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filtered && filtered.length > 0 ? (
                filtered.map((appointment, index) => (
                    <tr
                        key={index}
                        className={`${
                            appointment.status === "Canceled"
                                ? "bg-red-50"
                                : appointment.status === "Completed"
                                    ? "bg-green-50"
                                    : appointment.status === "Confirmed"
                                        ? "bg-blue-50"
                                        : ""
                        } hover:bg-gray-50`}
                    >
                      {/* Patient Name: less padding, no extra flex */}
                      <td className="px-10 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                          {appointment.user?.fullName || "Patient"}
                        </div>
                        <div className="text-xs text-gray-500">ID: {appointment.patientId}</div>
                      </td>

                      {/* Contact: less padding, truncate long values */}
                      <td className="py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-[220px]">
                          {appointment.user?.email}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[220px]">
                          {appointment.user?.phoneNumber}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 ">
                        <div className="flex-col justify-center ">
                          <div>{new Date(appointment.date).toLocaleDateString()}</div>
                          <div>
                            {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </td>

                      {/* Status: centered */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
              <span
                  className={`px-2 inline-flex justify-center text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === "Canceled"
                          ? "bg-red-100 text-red-800"
                          : appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                  }`}
              >
                {appointment.status}
              </span>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No appointments found for the selected date.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
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