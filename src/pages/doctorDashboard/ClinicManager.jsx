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
      {/* ...existing JSX content from ClinicManger in DoctorDashboard.jsx... */}
      <div className="text-red-500 text-sm">
        {/* TODO: Move full ClinicManger JSX here. */}
        ClinicManager JSX not yet fully migrated.
      </div>
    </div>
  );
}

