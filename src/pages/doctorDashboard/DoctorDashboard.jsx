import React, { useEffect, useState } from "react";
import APICalls from "../../services/APICalls.js";
import { City } from "../../Constants/constant.jsx";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Reviews from "../../components/Reviews.jsx";
import FindPatientSearch from "../FindPatient/FindPatientSearch.jsx";
import DashboardMain from "./DashboardMain.jsx";
import CalendarSettings from "./CalendarSettings.jsx";
import AppointmentsTable from "./AppointmentsTable.jsx";
import {
  loadUser,
  loadDoctorReservations,
  getInitialSelectedDate,
  buildWorkingHoursOptions,
  loadDailyRevenue,
  persistRevenue,
  calculateStatsBase,
} from "./doctorUtils.js";

export default function DoctorDashboard() {
  const MainScreenSize = 80;
  const [workingHoursDropDown, setWorkingHoursDropDown] = useState([]);
  const [Index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(loadUser);
  const [formData, setFormData] = useState(() => ({
    workingDays: user.doctor.workingDays,
    vacations: user.doctor.vacations,
    startTime: user.doctor.startTime,
    endTime: user.doctor.endTime,
    fees: user.doctor.fees,
  }));
  const [enableVacation, setEnableVacation] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate);

  const persisted = loadDailyRevenue();
  const todayKey = new Date().toISOString().split("T")[0];
  const [stats, setStats] = useState(() => ({
    totalPatients: 0,
    newPatients: 0,
    revenue: persisted?.date === todayKey ? persisted.amount || 0 : 0,
    todayRemaining: 0,
    rating: user.doctor.rating,
    servingNumber: user.doctor.servingNumber,
    totalFees: 0,
  }));

  useEffect(() => {
    if (workingHoursDropDown.length === 0) {
      setWorkingHoursDropDown(buildWorkingHoursOptions());
    }
  }, [workingHoursDropDown]);

  useEffect(() => {
    (async () => {
      try {
        await APICalls.DoctorReservations();
        const doctorApp = loadDoctorReservations();
        setAppointments(doctorApp.filter((appointment) => appointment.status === "Confirmed"));
        setStats((prev) =>
          calculateStatsBase(user, doctorApp, persistRevenue, prev),
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    })();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-row  justify-center space-x-10 @container">
        {/*SideBar*/}
        <div className="flex-col bg-white ">
          {/*sidebar Item*/}
          <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 0 ? "text-teal-800 " : "text-gray-500"
              } `}
            >
              dashboard
            </span>
            <p
              className={`${
                Index === 0 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              Dashboard
            </p>
          </SidebarItem>

          <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 1 ? "text-teal-800 " : "text-gray-500"
              }`}
            >
              calendar_today
            </span>
            <p
              className={`${
                Index === 1 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              Calender Settings
            </p>
          </SidebarItem>

          <SidebarItem setIndex={setIndex} Index={2} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 2 ? "text-teal-800 " : "text-gray-500"
              }`}
            >
              calendar_today
            </span>
            <p
              className={`${
                Index === 2 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              Appointments
            </p>
          </SidebarItem>

          <SidebarItem setIndex={setIndex} Index={3} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 3 ? "text-teal-800 " : "text-gray-500"
              }`}
            >
              group
            </span>
            <p
              className={`${
                Index === 3 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              Patients
            </p>
          </SidebarItem>

          <SidebarItem setIndex={setIndex} Index={4} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 4 ? "text-teal-800 " : "text-gray-500"
              }`}
            >
              person_search
            </span>
            <p
              className={`${
                Index === 4 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              Find Patient
            </p>
          </SidebarItem>

          <SidebarItem setIndex={setIndex} Index={5} currentIndex={Index}>
            <span
              className={`material-icons-round mr-3 text-xl ${
                Index === 5 ? "text-teal-800 " : "text-gray-500"
              }`}
            >
              reviews
            </span>
            <p
              className={`${
                Index === 5 ? "text-teal-800 " : "text-gray-500"
              } font-medium`}
            >
              reviews
            </p>
          </SidebarItem>
        </div>

        {/*MainScreen*/}
        <div
          className={`flex-col w-[${MainScreenSize.toString()}vw]  bg-gray-50 border-gray-200 border-1  p-10`}
        >
          {Index === 0 ? (
            <DashboardMain
              user={user}
              setUser={setUser}
              appointments={appointments}
              setAppointments={setAppointments}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              stats={stats}
              setStats={setStats}
              formData={formData}
              setFormData={setFormData}
              enableVacation={enableVacation}
              setEnableVacation={setEnableVacation}
            />
          ) : Index === 1 ? (
            <CalendarSettings
              workingHours={workingHoursDropDown}
              user={user}
              setUser={setUser}
              formData={formData}
              setFormData={setFormData}
              enableVacation={enableVacation}
              setEnableVacation={setEnableVacation}
              setSelectedDate={setSelectedDate}
            />
          ) : Index === 4 ? (
            <FindPatientSearch />
          ) : Index === 5 ? (
            <div className="bg-white p-15  pr-50">
              <Reviews selectedDoctor={user.doctor} />
            </div>
          ) : (
            <AppointmentsTable
              appointments={appointments}
              setAppointments={setAppointments}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
        </div>
      </div>
    </>
  );
}

function SidebarItem({ children, setIndex, Index, currentIndex }) {
  const isActive = Index === currentIndex;
  return (
    <div className="flex flex-row items-center gap-3">
      <button
        onClick={() => {
          setIndex(Index);
        }}
        className={`inline-flex w-full px-7 py-4 text-gray-800 hover:bg-blue-100 cursor-pointer ${
          isActive ? "bg-gradient-custom" : ""
        }`}
      >
        {children}
      </button>
    </div>
  );
}

