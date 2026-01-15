import React from "react";
import toast from "react-hot-toast";
import DoctorCalendar from "./DoctorCalendar.jsx";
import ClinicManager from "./ClinicManager.jsx";
import APICalls from "../../services/APICalls.js";

export default function CalendarSettings({
  user,
  formData,
  setFormData,
  enableVacation,
  setEnableVacation,
  workingHours,
  setUser,
  setSelectedDate,
}) {
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
    <div className="flex flex-col bg-white border-gray-200 rounded-lg shadow-xs p-10 w-[80-vw] min-xl:h-[60vh] max-w-[1350px] mx-auto">
      {/* ...existing JSX from CalendarSettings in DoctorDashboard.jsx... */}
      <div className="text-red-500 text-sm mb-4">
        {/* TODO: Move full CalendarSettings JSX here. */}
        CalendarSettings JSX not yet fully migrated.
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8">
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
        <div className="flex-1 basis-[520px] min-w-[420px] max-w-[860px]">
          <ClinicManager
            workingHours={workingHours}
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
