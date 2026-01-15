
export function loadUser() {
    try {
        return JSON.parse(localStorage.getItem("userData"));
    } catch {
        return null;
    }
}

export function loadDoctorReservations() {
    try {
        return JSON.parse(localStorage.getItem("DoctorReservations") || "[]");
    } catch {
        return [];
    }
}

export function getInitialSelectedDate() {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : new Date();
}

export function persistSelectedDate(date) {
    localStorage.setItem("selectedDate", date.toISOString());
}

export function loadShowPatientInfo() {
    const saved = localStorage.getItem("showPatientInfo");
    return saved ? JSON.parse(saved) : false;
}

export function persistShowPatientInfo(flag) {
    localStorage.setItem("showPatientInfo", JSON.stringify(flag));
}

export function loadDailyRevenue() {
    return JSON.parse(localStorage.getItem("dailyRevenue") || "{}");
}

export function persistRevenue(amount) {
    const todayKey = new Date().toISOString().split("T")[0];
    localStorage.setItem("dailyRevenue", JSON.stringify({ date: todayKey, amount }));
}

export function buildWorkingHoursOptions() {
    const options = [];
    for (let i = 1; i <= 12; i++) {
        const h = i.toString().padStart(2, "0");
        options.push({ key: `${h}:00 AM`, value: `${h}:00 AM` });
    }
    for (let i = 1; i <= 12; i++) {
        const h = i.toString().padStart(2, "0");
        options.push({ key: `${h}:00 PM`, value: `${h}:00 PM` });
    }
    return options;
}

export function sameDay(a, b) {
    const d1 = new Date(a);
    const d2 = new Date(b);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
}

export function calculateStatsBase(user, reservations, persistRevenueFn, prevStats) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = reservations.filter((app) => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime() && app.status !== "Canceled";
    });

    const todayRemaining = todayAppointments.filter((app) => app.status !== "Completed").length;

    const uniquePatientIds = [...new Set(reservations.map((app) => app.patientId))];

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newPatients = reservations
        .filter((app) => new Date(app.date) >= lastMonth)
        .reduce((unique, app) => {
            if (!unique.includes(app.patientId)) unique.push(app.patientId);
            return unique;
        }, []).length;

    return {
        ...prevStats,
        totalPatients: uniquePatientIds.length,
        newPatients,
        todayRemaining,
        rating: user?.doctor?.rating ?? prevStats.rating,
        servingNumber: user?.doctor?.servingNumber ?? prevStats.servingNumber,
    };
}
