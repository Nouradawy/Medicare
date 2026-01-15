import React, { useEffect, useState } from "react";

export default function AppointmentsTable({
  appointments,
  setAppointments,
  selectedDate,
  setSelectedDate,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const doctorApp = JSON.parse(
      localStorage.getItem("DoctorReservations") || "[]",
    );
    setAppointments(doctorApp);
  }, [setAppointments]);

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
      {/* ...existing JSX from Appointments component in DoctorDashboard.jsx... */}
      <div className="text-red-500 text-sm">
        {/* TODO: Move full Appointments JSX here. */}
        AppointmentsTable JSX not yet fully migrated.
      </div>
    </div>
  );
}

