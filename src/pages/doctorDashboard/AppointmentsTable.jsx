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
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden h-[60vh]">
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

