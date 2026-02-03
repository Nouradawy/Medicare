import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import MedicalHistoryReport from "./helpers/MedicalHistoryReport.jsx";
import DoctorCalendar from "./DoctorCalendar.jsx";
import { DefaultMale } from "../../Constants/constant.jsx";
import {
  loadShowPatientInfo,
  persistShowPatientInfo,
  loadDailyRevenue,
  persistRevenue,
  sameDay,
  calculateStatsBase,
} from "./doctorUtils.js";
import APICalls from "../../services/APICalls.js";
import {isToday} from "date-fns";

export default function DashboardMain({
  user,
  setUser,
  appointments,
  setAppointments,
  selectedDate,
  setSelectedDate,
  stats,
  setStats,
  formData,
  setFormData,
  enableVacation,
  setEnableVacation,
}) {
  const [showPatientInfo, setShowPatientInfo] = useState(loadShowPatientInfo);
  const [appointmentIndex, setAppointmentIndex] = useState(0);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [medicalHistoryPatient, setMedicalHistoryPatient] = useState(null);
  const [medicalHistoryDate, setMedicalHistoryDate] = useState("");
  const [medicalHistoryDescription, setMedicalHistoryDescription] = useState("");
  const [addingMedicalHistory, setAddingMedicalHistory] = useState(false);

  const persisted = loadDailyRevenue();
  const todayKey = new Date().toISOString().split("T")[0];
  const [localStats, setLocalStats] = useState(() => ({
    totalPatients: stats?.totalPatients || 0,
    newPatients: stats?.newPatients || 0,
    revenue: persisted?.date === todayKey ? persisted.amount || 0 : 0,
    todayRemaining: stats?.todayRemaining || 0,
    rating: user.doctor.rating,
    servingNumber: user.doctor.servingNumber,
    totalFees: 0,
  }));

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsMode, setSettingsMode] = useState("duration");
  const [presetDuration, setPresetDuration] = useState("");
  const [customDuration, setCustomDuration] = useState(
    user?.doctor?.visitDuration || 30,
  );
  const [feesInput, setFeesInput] = useState(Number(user?.doctor?.fees || 0));
  const [servingInput, setServingInput] = useState(
    Number(user?.doctor?.servingNumber || 0),
  );
  const [savingSettings, setSavingSettings] = useState(false);
  const [extraFeesInput, setExtraFeesInput] = useState(0);
  const [extraFeesAppointmentId, setExtraFeesAppointmentId] = useState(null);

  const [dismissingTap, setDismissingTap] = useState(false);

  useEffect(() => {
    persistSelectedDateInternal(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    persistShowPatientInfo(showPatientInfo);
  }, [showPatientInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      const todayKeyInner = new Date().toISOString().split("T")[0];
      const persistedInner = loadDailyRevenue();
      if (persistedInner.date !== todayKeyInner) {
        setLocalStats((prev) => {
          const next = { ...prev, revenue: 0 };
          persistRevenue(0);
          return next;
        });

      }
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const all = JSON.parse(
      localStorage.getItem("DoctorReservations") || "[]",
    );
    setLocalStats((prev) =>
      calculateStatsBase(user, all, persistRevenue, {
        ...prev,
        revenue: localStats.revenue,
      }),
    );
  }, []);

  const filteredAppointments = useMemo(
    () => getFilteredAppointments(appointments, selectedDate),
    [appointments, selectedDate],
  );

  useEffect(() => {
    if (appointmentIndex >= filteredAppointments.length) {
      setAppointmentIndex(0);
      setShowPatientInfo(false);
    }
    const nextStats = {
      ...localStats,
      todayRemaining: filteredAppointments.length,
    };
    setLocalStats(nextStats);
    setStats(nextStats);
  }, [filteredAppointments, appointmentIndex]);

  const doctorName = user?.fullName || "Doctor";

  const currentAppointment =
    filteredAppointments.length > 0
      ? filteredAppointments[appointmentIndex]
      : null;

  const isTodayFlag = sameDay(selectedDate, new Date());

  async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
      await window.APICalls.UpdateAppointmentStatus(
        appointmentId,
        newStatus,
        Number.parseInt(extraFeesInput, 10) + user.doctor.fees,
      );

      await window.APICalls.DoctorReservations();
      await window.APICalls.GetCurrentUser();

      const doctorApp = JSON.parse(
        localStorage.getItem("DoctorReservations") || "[]",
      );
      setAppointments(doctorApp.filter((a) => a.status === "Pending"));
      const freshUser = JSON.parse(localStorage.getItem("userData"));
      setUser(freshUser);

      const all = JSON.parse(
        localStorage.getItem("DoctorReservations") || "[]",
      );
      const nextStats = calculateStatsBase(
        freshUser,
        all,
        persistRevenue,
        localStats,
      );

      if (newStatus === "Completed") {
        const fees = Number(freshUser?.doctor?.fees || 0);
        const nextRevenue = nextStats.revenue + fees;
        persistRevenue(nextRevenue);
        nextStats.revenue = nextRevenue;
      }

      setLocalStats(nextStats);
      setStats(nextStats);

      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
      return true;
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.message || "Failed to update appointment");
      return false;
    }
  }

  async function handleReschedule() {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select both date and time");
      return;
    }

    setRescheduling(true);
    try {
      const newDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
      const body = {
        date: newDateTime.toISOString(),
        doctorId: rescheduleAppointment.doctorId,
      };

      await window.APICalls.RescheduleAppointment(
        rescheduleAppointment.id,
        body,
      );

      await window.APICalls.DoctorReservations();
      const doctorApp = JSON.parse(
        localStorage.getItem("DoctorReservations") || "[]",
      );
      setAppointments(doctorApp.filter((a) => a.status === "Pending"));

      toast.success("Appointment rescheduled successfully!");
      setShowRescheduleModal(false);
      setRescheduleAppointment(null);
      setRescheduleDate("");
      setRescheduleTime("");
    } catch (error) {
      toast.error(error.message || "Failed to reschedule appointment");
    } finally {
      setRescheduling(false);
    }
  }

  async function handleAddMedicalHistory() {
    if (!medicalHistoryDate || !medicalHistoryDescription.trim()) {
      toast.error("Please fill in both date and description");
      return;
    }

    setAddingMedicalHistory(true);
    try {
      const body = {
        patientId: medicalHistoryPatient.patientId,
        date: medicalHistoryDate,
        description: medicalHistoryDescription,
      };

      await window.APICalls.AddMedicalHistory(body);
      await window.APICalls.DoctorReservations();

      const doctorApp = JSON.parse(
        localStorage.getItem("DoctorReservations") || "[]",
      );
      setAppointments(doctorApp.filter((a) => a.status === "Pending"));

      toast.success("Medical history added successfully!");
      setShowMedicalHistoryModal(false);
      setMedicalHistoryPatient(null);
      setMedicalHistoryDate("");
      setMedicalHistoryDescription("");
    } catch (error) {
      toast.error(error.message || "Failed to add medical history");
    } finally {
      setAddingMedicalHistory(false);
    }
  }

  function openRescheduleModal(appointment) {
    setRescheduleAppointment(appointment);
    const currentDate = new Date(appointment.date);
    setRescheduleDate(currentDate.toISOString().split("T")[0]);
    setRescheduleTime(currentDate.toTimeString().slice(0, 5));
    setShowRescheduleModal(true);
  }

  function openMedicalHistoryModal(appointment) {
    setMedicalHistoryPatient(appointment);
    setMedicalHistoryDate(new Date().toISOString().split("T")[0]);
    setMedicalHistoryDescription("");
    setShowMedicalHistoryModal(true);
  }

  function openVisitDuration() {
    setSettingsMode("duration");
    setPresetDuration("");
    setCustomDuration(user?.doctor?.visitDuration || 30);
    setShowSettingsModal(true);
  }

  function openFeesEditor() {
    setSettingsMode("fees");
    setFeesInput(Number(user?.doctor?.fees || 0));
    setShowSettingsModal(true);
  }

  function openServingEditor() {
    setSettingsMode("serving");
    setServingInput(Number(user?.doctor?.servingNumber || 0));
    setShowSettingsModal(true);
  }

  function openExtraFeesEditor(appointment) {
    setSettingsMode("extraFees");
    setExtraFeesAppointmentId(appointment?.id || null);
    setExtraFeesInput(0);
    setShowSettingsModal(true);
  }

  async function saveSettings() {
    if (savingSettings) return;
    setSavingSettings(true);

    try {
      const nextDoctor = { ...user.doctor };

      if (settingsMode === "serving") {
        const nextServing = Math.max(
          0,
          Number.parseInt(servingInput, 10) || 0,
        );
        await APICalls.UpdateDoctorServingNumber(nextServing);

        await APICalls.GetCurrentUser();
        const fresh = JSON.parse(localStorage.getItem("userData")) || user;
        const updated = {
          ...fresh,
          doctor: { ...fresh.doctor, servingNumber: nextServing },
        };
        localStorage.setItem("userData", JSON.stringify(updated));
        setUser(updated);
        const all = JSON.parse(
          localStorage.getItem("DoctorReservations") || "[]",
        );
        const nextStats = calculateStatsBase(
          updated,
          all,
          persistRevenue,
          localStats,
        );
        setLocalStats(nextStats);
        setStats(nextStats);
        toast.success("Serving number updated.");
      } else if (settingsMode === "duration") {
        const nextDuration = Number(presetDuration || customDuration || 30);
        nextDoctor.visitDuration = nextDuration;
      } else if (settingsMode === "fees") {
        const nextFees = Math.max(0, Number(feesInput || 0));
        nextDoctor.fees = nextFees;
      }

      if (settingsMode === "duration" || settingsMode === "fees") {
        await APICalls.UpdateOrCreateDoctorInfo({
          workingDays: nextDoctor.workingDays,
          vacations: nextDoctor.vacations,
          startTime: nextDoctor.startTime,
          endTime: nextDoctor.endTime,
          fees: nextDoctor.fees,
          visitDuration: nextDoctor.visitDuration,
        });

        await APICalls.GetCurrentUser();
        const fresh = JSON.parse(localStorage.getItem("userData")) || {
          ...user,
          doctor: nextDoctor,
        };
        setUser(fresh);
        const all = JSON.parse(
          localStorage.getItem("DoctorReservations") || "[]",
        );
        const nextStats = calculateStatsBase(
          fresh,
          all,
          persistRevenue,
          localStats,
        );
        setLocalStats(nextStats);
        setStats(nextStats);
        toast.success(
          settingsMode === "duration"
            ? "Visit duration updated."
            : "Fees updated.",
        );
      }

      setShowSettingsModal(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  function handleResetServing() {
    APICalls
      .UpdateDoctorServingNumber(0)
      .then(() => {
        setLocalStats((prev) => ({ ...prev, servingNumber: 0 }));
        setStats((prev) => ({ ...prev, servingNumber: 0 }));
      })
      .catch(() => {});
  }

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
                    <div className={`@container ${showPatientInfo ? "lg:col-span-3 " : "lg:col-span-4 "} `}>
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
                                                    {showPatientInfo ? "Close Details" : "More Details"}
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
                    {showPatientInfo && filteredAppointments.length > appointmentIndex ?<div className="lg:col-span-3">
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

function getFilteredAppointments(appointments, selectedDate) {
  const filteredDate = new Date(selectedDate);
  filteredDate.setHours(0, 0, 0, 0);

  return (appointments || [])
    .filter((app) => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === filteredDate.getTime();
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
}

function persistSelectedDateInternal(date) {
  try {
    localStorage.setItem("selectedDate", date.toISOString());
  } catch (e) {
    console.error("Failed to persist selectedDate", e);
  }
}
