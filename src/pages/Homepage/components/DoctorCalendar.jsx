import React, { useState, useEffect } from 'react';

function DoctorCalendar({ appointments, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    generateCalendarDays(currentMonth);
  }, [currentMonth, appointments]);

  // Generate calendar days for the current month with padding for previous/next month days
  function generateCalendarDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days = [];
    
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
      const status = getDayStatus(currentDate, appointments);
      
      days.push({
        date: currentDate,
        day: i,
        isCurrentMonth: true,
        status: status
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
    if (!appointments || appointments.length === 0) return "available";
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Find appointments for this day
    const dayAppointments = appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate.toISOString().split('T')[0] === dateStr;
    });
    
    if (dayAppointments.length === 0) return "available";
    
    // Check if the day is fully booked (this is a simplified example - you may need more logic)
    const maxAppointmentsPerDay = 8; // Example: assume 8 slots per day
    if (dayAppointments.length >= maxAppointmentsPerDay) return "unavailable";
    
    // If there are some appointments but not fully booked, mark as booked
    return "booked";
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
    setSelectedDate(day.date);
    if (onDateSelect) {
      onDateSelect(day.date);
    }
  };

  // Get day of week labels
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-100 p-4 border-b">
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
            if (day.status === "booked") bgColor = "bg-red-100";
            if (day.status === "unavailable") bgColor = "bg-gray-200";
            
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
                    day.status === "booked" ? 'text-red-800' : 
                    day.status === "unavailable" ? 'text-gray-500' : 'text-blue-800'}
                  hover:opacity-80 transition-opacity
                `}
                onClick={() => handleDateSelect(day)}
                disabled={day.status === "unavailable"}
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
            <div className="h-3 w-3 rounded-full bg-red-100 mr-1"></div>
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorCalendar;