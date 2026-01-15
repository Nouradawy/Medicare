import React, { useState, useEffect } from 'react';

function DoctorCalendar({ appointments, onDateSelect , user ,formData , setFormData , enableVacation , setEnableVacation}) {
  // Load from localStorage or use defaults
  const getInitialMonth = () => {
    const saved = localStorage.getItem('lastMonth');
    return saved ? new Date(saved) : new Date();
  };
  const getInitialDate = () => {
    const saved = localStorage.getItem('SelectedDate');
    return saved ? new Date(saved) : new Date();
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getInitialDate);

  useEffect(() => {
    localStorage.setItem('lastMonth', currentMonth.toISOString());
  }, [currentMonth]);

  useEffect(() => {
    localStorage.setItem('SelectedDate', selectedDate.toISOString());
  }, [selectedDate]);

  useEffect(() => {
    generateCalendarDays(currentMonth);

  }, [currentMonth, appointments,user , formData]);

  // Generate calendar days for the current month with padding for previous/next month days
  function generateCalendarDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days  = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Normalize vacations to a safe array
    const vacations = (formData && Array.isArray(formData.vacations))
      ? formData.vacations
      : [];

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();



    // Add previous month's days to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, day),
        day: day,
        isPreviousMonth: true,
        status: "unavailable"
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      // Determine status based on appointments
      const status = getDayStatus(currentDate, appointments );
      const dateStr = new Date(year, month, i+1).toISOString().split('T')[0];
      let finalStatus = status;
      if (appointments.find(d => d.date.split('T')[0] === dateStr)) {
        finalStatus = 'booked';
      }
      // Mark as unavailable if it's the vacation day
      // Vacations can be either day names (e.g., "MON", "TUE") or ISO date strings
      const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      if (
          vacations.some(v => {
            if (typeof v === 'string') {
              // Check if v is a day name (e.g., "MON", "TUE", "WED")
              if (/^(SUN|MON|TUE|WED|THU|FRI|SAT)$/i.test(v)) {
                return v.toUpperCase() === currentDayName;
              }
              // Check if v is a valid ISO date string (YYYY-MM-DD format)
              if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
                return v.split('T')[0] === dateStr;
              }
            }
            return false;
          })
      ) {
        finalStatus = 'onVacation';
      }

      days.push({
        date: currentDate,
        day: i,
        isCurrentMonth: true,
        status: finalStatus
      });
    }

    // Add next month's days to complete the grid (42 cells for 6 rows of 7 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        day: i,
        isNextMonth: true,
        status: "unavailable"
      });
    }

    setCalendarDays(days);
  }

  // Determine day status based on appointments
  function getDayStatus(date, appointments) {
    const workingDays = user && user.doctor && Array.isArray(user.doctor.workingDays)
      ? user.doctor.workingDays
      : [];

    const dayName = date
      .toLocaleDateString('en-US', { weekday: 'short' })
      .toUpperCase();

    if (workingDays.includes(dayName)) {
      return 'available';
    }
    return 'unavailable';
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format the month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    console.log(day.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase());
    setSelectedDate(day.date);

    if (onDateSelect) {
      onDateSelect(day.date);
    }

    const NextDay = new Date(day.date.getTime() + 24 * 60 * 60 * 1000);
    // setFormData(...)
    if(enableVacation ===true)
    {
      if(formData.vacations.includes(NextDay.toISOString().split('T')[0])){
        setFormData({...formData, vacations: formData.vacations.filter(date => date !== NextDay.toISOString().split('T')[0])});
      } else {
        setFormData({...formData, vacations: [...formData.vacations, NextDay.toISOString().split('T')[0]]});
      }


    }
    console.log(formData.vacation);
    console.log(day.date.toISOString().split('T')[0]);

  };

  // Get day of week labels
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-50/50 p-5 ">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Calendar</h2>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={goToPreviousMonth}
            >
              ◀
            </button>
            <span className="font-medium">{formatMonthYear(currentMonth)}</span>
            <button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={goToNextMonth}
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekdayLabels.map(day => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            // Determine background color based on status
            let bgColor = "bg-blue-100";
            if (day.status === "booked") bgColor = "bg-[#14B8A6]/90";
            if (day.status === "unavailable") bgColor = "bg-gray-200";
            if (day.status === "onVacation") bgColor = "bg-red-100";

            // Add transparency for days not in current month
            if (day.isPreviousMonth || day.isNextMonth) {
              bgColor = "bg-gray-100";
            }

            // Highlight today's date
            const today = new Date();
            const isToday = day.date.getDate() === today.getDate() &&
                            day.date.getMonth() === today.getMonth() &&
                            day.date.getFullYear() === today.getFullYear();

            // Highlight selected date
            const isSelected = day.date.getDate() === selectedDate.getDate() &&
                              day.date.getMonth() === selectedDate.getMonth() &&
                              day.date.getFullYear() === selectedDate.getFullYear();

            return (
              <button
                key={i}
                className={`
                  ${bgColor} rounded-full h-10 w-10 flex items-center justify-center mx-auto
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${isSelected ? 'ring-2 ring-indigo-600' : ''}
                  ${day.isPreviousMonth || day.isNextMonth ? 'text-gray-400' : 
                    day.status === "booked" ? 'text-white' : 
                        day.status === "onVacation" ? 'text-red-800' :
                    day.status === "unavailable" ? 'text-gray-500' : 'text-blue-800'}
                  hover:opacity-80 transition-opacity
                `}
                onClick={() => handleDateSelect(day)}
                disabled={day.status === "unavailable" && enableVacation === false}
              >
                {day.day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-around text-sm">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-100 mr-1"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-gray-200 mr-1"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#14B8A6] mr-1"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-100 mr-1"></div>
            <span className="text-gray-600">onVacation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorCalendar;