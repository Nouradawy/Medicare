import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import APICalls from '../services/APICalls.js';
import toast from 'react-hot-toast';
import { format, parse, parseISO, getDay } from 'date-fns';

function formatDateRange(dateIso) {
  try {
    const d = new Date(dateIso);
    if (isNaN(d)) return '';
    return d.toLocaleString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return ''; }
}

export default function ReservationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(() => location.state?.reservation || null);
  const [loading, setLoading] = useState(!location.state?.reservation);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(''); // yyyy-MM-dd
  const [rescheduleTime, setRescheduleTime] = useState(''); // HH:mm
  const [selectedTimeSlot ,setSelectedTimeSlot] = useState();

  // Derived values
  const reservationId = useMemo(() => {
    const n = Number(id || reservation?.id);
    return Number.isFinite(n) ? n : null;
  }, [id, reservation]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (reservation) return; // already provided from navigation state
      if (!reservationId) return;
      setLoading(true);
      try {
        const all = await APICalls.GetAllReservations();
        const found = (all || []).find(r => String(r.id) === String(reservationId));
        if (isMounted) {
          if (found) {
            setReservation(found);
            // seed reschedule inputs with current reservation
            const d = new Date(found.date);
            if (!isNaN(d)) {
              setRescheduleDate(d.toISOString().slice(0,10));
              setRescheduleTime(d.toTimeString().slice(0,5));
            }
          } else {
            toast.error('Reservation not found');
          }
        }
      } catch (e) {
        toast.error(e.message || 'Failed to load reservation');
      } finally {
        isMounted && setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [reservationId, reservation]);

  const doctorName = reservation?.doctor?.fullName || 'Doctor';
  const doctorDept = reservation?.doctor?.specialty || reservation?.specialty || '';
  const locationText = reservation?.doctor.city || reservation?.clinic || '';
  const doctorId = reservation?.doctorId || reservation?.doctor?.id;
  const status = reservation?.status;

  // Build reserved times for the selected rescheduleDate
  const reservedTimesForSelectedDay = useMemo(() => {
    const set = new Set();
    const list = reservation?.doctor?.reservationDates || [];
    if (!rescheduleDate || !Array.isArray(list)) return set;
    for (const iso of list) {
      const d = parseISO(iso);
      if (isNaN(d)) continue;
      const dateStr = d.toISOString().slice(0,10);
      if (dateStr === rescheduleDate) {
        set.add(format(d, 'HH:mm'));
      }
    }
    return set;
  }, [reservation, rescheduleDate]);

  // Generate time slots based on doctor schedule and visitDuration, only if selected date is a working day
  const timeSlots = useMemo(() => {
    const slots = [];
    const doctor = reservation?.doctor || {};
    const start = doctor.startTime; // 'HH:mm:ss'
    const end = doctor.endTime ; // 'HH:mm:ss'
    const interval = doctor.visitDuration|| 30;
    const workingDays = Array.isArray(doctor.workingDays) ? doctor.workingDays : reservation?.workingDays;

    if (!start || !end || !interval || !rescheduleDate) return slots;

    // If workingDays provided, ensure selected date weekday is allowed
    if (Array.isArray(workingDays) && workingDays.length > 0) {
      const dayMap = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
      const allowed = new Set(workingDays.map(d => dayMap[d]));
      const weekday = getDay(new Date(rescheduleDate));
      if (!allowed.has(weekday)) return slots; // not a working day -> no slots
    }

    const s = parse(start, 'HH:mm:ss', new Date());
    const e = parse(end, 'HH:mm:ss', new Date());
    while (s < e) {
      const startTimeFormatted = format(s, 'HH:mm');
      s.setMinutes(s.getMinutes() + Number(interval));
      const endTimeFormatted = format(s, 'HH:mm');
      slots.push({
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        disabled: reservedTimesForSelectedDay.has(startTimeFormatted)
      });
    }
    return slots;
  }, [reservation, reservedTimesForSelectedDay, rescheduleDate]);

  async function onConfirm() {
    if (!reservationId) return;
    setConfirming(true);
    try {
      await APICalls.UpdateAppointmentStatus(reservationId, 'Confirmed' , null);
      toast.success('Reservation confirmed');
      setReservation(prev => prev ? { ...prev, status: 'Confirmed' } : prev);
    } catch (e) {
      toast.error(e.message || 'Failed to confirm');
    } finally {
      setConfirming(false);
    }
  }

  async function onCancel() {
    if (!reservationId) return;
    if (!confirm('Cancel this reservation?')) return;
    setCancelling(true);
    try {
      await APICalls.CancelAppointment({ id: reservationId });
      toast.success('Reservation canceled');
      // Navigate back to a safe place (e.g., settings or home)
      navigate('/settings');
    } catch (e) {
      toast.error(e.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  }

  async function onReschedule() {
    if (!reservationId || !doctorId) {
      toast.error('Missing doctor or reservation id');
      return;
    }
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select date and time');
      return;
    }
    setRescheduling(true);
    try {
      const iso = new Date(`${rescheduleDate}T${rescheduleTime}`).toISOString();
      await APICalls.RescheduleAppointment(reservationId, { date: iso, queueNumber:selectedTimeSlot });
      toast.success('Reservation updated');
      setReservation(prev => prev ? { ...prev, date: iso } : prev);
    } catch (e) {
      toast.error(e.message || 'Failed to reschedule');
    } finally {
      setRescheduling(false);
    }
  }

  return (
    <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-5xl flex-1 gap-8">
        {/* Breadcrumb + Title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button className="hover:text-primary" onClick={() => navigate(-1)}>Appointments</button>
            <span className="material-icons-round text-base">chevron_right</span>
            <span>Reservation Details</span>
          </div>
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {status === 'Confirmed' ? 'Confirmed Appointment' : 'Upcoming Appointment'}
              </h1>
              <p className="text-slate-500 text-base font-normal mt-2">
                {loading ? 'Loading details…' : `Review details and confirm your visit with ${doctorName}.`}
              </p>
            </div>
            {status !== 'Confirmed' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-sm font-bold">
                <span className="material-icons-round text-lg">warning</span>
                ACTION REQUIRED
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header / Doctor Profile */}
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-slate-100">
                <div className="relative">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-24 shadow-inner"
                       style={{ backgroundImage: `url(${reservation?.doctorAvatar ||
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(reservation?.user?.username || 'User')}`
                       })`
                  }} />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 size-5 rounded-full border-4 border-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-slate-900 text-2xl font-bold">{doctorName}</h3>
                  {doctorDept && (
                    <p className="text-primary font-medium flex items-center gap-1">
                      <span className="material-icons-round text-lg">favorite</span>
                      {doctorDept}
                    </p>
                  )}
                  {locationText && (
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <span className="material-icons-round text-lg">location_on</span>
                      {locationText}
                    </p>
                  )}
                </div>
              </div>

              {/* Details grid */}
              <div className="p-6 sm:p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Date & Time</span>
                    <div className="flex items-center gap-3 text-slate-900 font-semibold text-lg">
                      <span className="material-icons-round text-primary">calendar_month</span>
                      {reservation?.date ? formatDateRange(reservation.date) : '—'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Status</span>
                    <div className="flex items-center gap-3 text-slate-900 font-semibold text-lg">
                      <span className="material-icons-round text-primary">event_available</span>
                      {status || 'Pending'}
                    </div>
                  </div>
                  {reservation?.visitPurpose && (
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Reason for Visit</span>
                      <p className="text-slate-900 font-medium">{reservation.visitPurpose}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary actions */}
              <div className="p-6 sm:p-8 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button
                  className="w-full sm:w-auto flex-1 bg-blue-900 hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onConfirm}
                  disabled={confirming || status === 'Confirmed'}
                >
                  {confirming ? (
                    <span className="loader text-sm" aria-label="loading" />
                  ) : (
                    <span className="material-icons-round">check_circle</span>
                  )}
                  {status === 'Confirmed' ? 'Confirmed' : 'Confirm Reservation'}
                </button>
                <div className="flex w-full sm:w-auto gap-3">
                  <button
                    className="flex-1 sm:flex-none bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    onClick={() => setShowReschedule(v => !v)}
                  >
                    <span className="material-icons-round">edit_calendar</span>
                    {showReschedule ? 'Hide Reschedule' : 'Reschedule'}
                  </button>
                  <button
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    title="Cancel Reservation"
                    onClick={onCancel}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <span className="loader" aria-label="loading" />
                    ) : (
                      <span className="material-icons-round">close</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Reschedule section */}
            {showReschedule && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-icons-round text-primary">edit_calendar</span>
                    Reschedule Appointment
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date selection & time slots */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Select new date</label>
                    <input type="date" className="mt-2 rounded-lg border border-slate-300 px-3 py-2 w-full"
                           value={rescheduleDate}
                           onChange={(e) => { setRescheduleDate(e.target.value); setRescheduleTime(''); }} />
                    <div className="mt-4 text-sm font-semibold text-slate-700">Available Time Slots</div>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {!rescheduleDate && (
                        <div className="text-sm text-slate-500 col-span-2">Select a date to view time slots.</div>
                      )}
                      {rescheduleDate && timeSlots.length === 0 && (
                        <div className="text-sm text-slate-500 col-span-2">No available slots for this date.</div>
                      )}
                      {timeSlots.map((slot,index) => (
                        <button
                          key={`${slot.startTime}-${slot.endTime}`}
                          className={
                            `border border-slate-200 py-2 px-3 rounded-lg text-sm ` +
                            (slot.disabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:border-primary hover:text-primary') +
                            (rescheduleTime === slot.startTime ? ' bg-primary/10 border-primary text-primary font-bold' : '')
                          }
                          disabled={slot.disabled}
                          onClick={() => {

                              setSelectedTimeSlot(index);

                              setRescheduleTime(slot.startTime);
                          }}
                        >
                          {format(parse(slot.startTime, 'HH:mm', new Date()), 'h:mm a')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-bold text-slate-900">Overview</span>
                    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                      <div className="text-sm text-slate-600">New Date & Time</div>
                      <div className="font-bold text-slate-900">
                        {rescheduleDate && rescheduleTime ? (
                          formatDateRange(`${rescheduleDate}T${rescheduleTime}`)
                        ) : '—'}
                      </div>
                    </div>
                    <button
                      className="mt-auto w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onReschedule}
                      disabled={rescheduling || !rescheduleDate || !rescheduleTime}
                    >
                      {rescheduling ? 'Updating…' : 'Update Reservation'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Location/help (static) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Location</h3>
              </div>
              <div className="h-48 w-full bg-slate-200 relative">
                <div className="absolute inset-0 bg-slate-200 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-16 rounded-full bg-primary/20 animate-pulse absolute"></div>
                  <span className="material-icons-round text-4xl text-primary drop-shadow-md z-10">location_on</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded shadow text-xs font-bold text-slate-700">
                  {locationText || 'Heart Center, CA'}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 mb-3">
                    {reservation?.doctor.address}
                </p>
                <a className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" href="#">
                  Get Directions
                  <span className="material-icons-round text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-white rounded-lg p-2 text-primary shadow-sm">
                  <span className="material-icons-round">description</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Preparation Instructions</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Please bring your ID and insurance card. Fasting is required for 8 hours prior to the blood work.</p>
                  <a className="text-sm font-bold text-primary" href="#">Read full guidelines</a>
                </div>
              </div>
            </div>

            <div className="text-center mt-2">
              <p className="text-sm text-slate-500">Need help? <a className="text-primary font-bold hover:underline" href="#">Contact Support</a></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
