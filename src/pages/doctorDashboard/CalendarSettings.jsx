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
