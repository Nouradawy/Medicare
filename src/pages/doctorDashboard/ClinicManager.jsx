import React from "react";
import toast from "react-hot-toast";

function toAmPm(timeStr) {
  const [hour, minute] = timeStr.split(":");
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${minute} ${ampm}`;
}

function amPmToSqlTime(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00.000000`;
}

export default function ClinicManager({
  workingHours,
  formData,
  setFormData,
  enableVacation,
  setEnableVacation,
}) {
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
      const nextDays = exists
        ? prev.workingDays.filter((d) => d !== name)
        : [...prev.workingDays, name];
      return { ...prev, workingDays: nextDays };
    });
  }

  function formatVacationDate(dateStr) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
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

