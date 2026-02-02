import React, {useEffect, useState} from "react";
import APICalls from "../../services/APICalls.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export default function  Reservations() {
    const [doctorList , SetdoctorList] = useState(JSON.parse(localStorage.getItem("DoctorsList")) || []);
    const [reservation , SetReservation] = useState(JSON.parse(localStorage.getItem("PatientReservations")) || []);
    const [expandedId, setExpandedId] = useState(null);
    const [reviews, setReviews] = useState({});
    const [reportModal, setReportModal] = useState({ open: false, report: null });
    const [isReservationsLoading, setIsReservationsLoading] = useState(true);
    const navigate = useNavigate();
    const openReportModal = (report) => setReportModal({ open: true, report });
    const closeReportModal = () => setReportModal({ open: false, report: null });
    const [savingId, setSavingId] = useState(null);
    const [formData , setformData ] = useState({
        status:"Canceled",
        id:''
    });

    const messageDoctor = (doctorId) => {
        try {
            // Open chat popup focused to doctorId
            window.dispatchEvent(new CustomEvent('app:open-chat', { detail: { toId: String(doctorId) } }));
        } catch (e) {
            console.error('Open chat failed', e);
        }
    };

    useEffect(() => {
        const fetchReservations = async () => {
            // Fetch doctor list if not already loaded
            try{
                setIsReservationsLoading(true);
                let doctors = JSON.parse(localStorage.getItem("DoctorsList"));
                if (!doctors || doctors.length === 0) {
                    await APICalls.GetDoctorsList();
                    doctors = JSON.parse(localStorage.getItem("DoctorsList")) || [];
                }
                SetdoctorList(doctors);
                await APICalls.PatientReservations();
                const data = JSON.parse(localStorage.getItem("PatientReservations")) || [];
                SetReservation(data);
                // hydrate reviews keyed by reservationId only
                const apiList = (await APICalls.GetReviews()) || []; // assume returns an array
                const storedList = Array.isArray(apiList)
                    ? apiList
                    : JSON.parse(localStorage.getItem("ReservationReviewsList") || "[]");

                const byRes = {};
                (storedList || []).forEach(r => {
                    const resId = r.reservationId;
                    if (resId != null) {
                        byRes[resId] = {
                            rating: r.rating ?? 0,
                            text: r.comment ?? r.text ?? ""
                        };
                    }
                });

                const fallback = JSON.parse(localStorage.getItem("ReservationReviews") || "{}");
                const initial = Object.keys(byRes).length ? byRes : fallback;
                setReviews(initial);
                localStorage.setItem("ReservationReviews", JSON.stringify(initial));

            }
            catch{
                toast.error("Failed to load reservations");
            }
            finally {
                setIsReservationsLoading(false);
            }

        };

        fetchReservations();


    }, [reservation.length, doctorList.length]);


    function ReportModal({ open, report, onClose }) {
        if (!open || !report) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full">
                    <h2 className="text-xl font-bold mb-4">Doctor Report</h2>
                    <div className="mb-4">
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: report.reportText }} />
                    </div>
                    {Array.isArray(report.reportFiles) && report.reportFiles.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Files:</h3>
                            <ul className="list-disc pl-5">
                                {report.reportFiles.map((file, idx) => (
                                    <li key={idx}>
                                        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            {file.split('/').pop()}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const doctorsById = React.useMemo(() => {
        const map = {};
        (doctorList || []).forEach(d => {
            const id = d.id || d.doctorId || d.userId;
            if (id) map[id] = d;
        });
        return map;
    }, [doctorList]);

    const formatDate = (r) => {
        const val = r.date || r.appointmentDate || r.createdAt || r.startTime || r.time;
        if (!val) return "—";
        const d = new Date(val);
        if (isNaN(d)) return String(val);
        return d.toLocaleDateString();
    };

    const formatTime = (r) => {
        const t = r.time || r.appointmentTime;
        if (t) return t;
        const val = r.startTime || r.date || r.appointmentDate;
        if (!val) return "—";
        const d = new Date(val);
        if (isNaN(d)) return "—";
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getDoctorName = (r) => {
        const d = doctorsById[r.doctorId] || doctorsById[r.doctor?.id];
        return r.doctorName || d?.fullName || d?.name || "Doctor";
    };

    const getLocation = (r) => {
        const d = doctorsById[r.doctorId] || doctorsById[r.doctor?.id];
        return r.location || d?.clinic?.address || d?.address || "—";
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const onChangeReviewText = (id, text) => {
        setReviews(prev => ({ ...prev, [id]: { ...(prev[id] || {}), text } }));
    };

    const onChangeReviewRating = (id, rating) => {
        setReviews(prev => ({ ...prev, [id]: { ...(prev[id] || {}), rating } }));
    };

    const saveReview = async (doctorId , patientId , reservationId) => {
        const current = reviews[reservationId] || {};
        if (!current.rating || !current.text?.trim()) {
            toast.error("Please add rating and review text");
            return;
        }try {
            setSavingId(reservationId);

            const payload = {
                patientId: patientId,
                doctorId: doctorId,
                rating: current.rating,
                comment: current.text,
                reservationId: reservationId,
            };
            // TODO: replace with real API call, e.g., APICalls.AddReview({ reservationId: id, ...current })
            await APICalls.AddNewReview(payload);
            setReviews(prev => {
                const next = {
                    ...prev,
                    [reservationId]: { rating: payload.rating, text: payload.comment }
                };
                localStorage.setItem("ReservationReviews", JSON.stringify(next)); // write after state update
                return next;
            });
            toast.success("Review saved");
            localStorage.setItem("ReservationReviews", JSON.stringify(reviews));
        } catch {
            toast.error("Failed to save review");
        } finally {
            setSavingId(null);
        }
    };

    const statusBadgeClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "completed") return "bg-green-100 text-green-800";
        if (s === "canceled" || s === "cancelled") return "bg-red-100 text-red-800";
        if (s === "confirmed") return "bg-blue-100 text-blue-800";
        if (s === "pending") return "bg-yellow-400 text-black";
        return "bg-gray-100 text-gray-800";
    };

    const StarRating = ({ value, onChange }) => {
        const stars = [1, 2, 3, 4, 5];
        return (
            <div className="flex items-center gap-1">
                {stars.map(s => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => onChange(s)}
                        className={(value >= s ? "text-yellow-400" : "text-gray-300") + " text-xl leading-none"}
                        aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                        title={`${s} star${s > 1 ? "s" : ""}`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };
    return (
        <main className="flex-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Reservations</h2>
                </div>

                <div className="flex flex-col p-6 space-y-6">
                    {(reservation || []).map((r) => {
                        const id = r.id ;
                        const isOpen = expandedId === id;
                        const meds = r.medications || r.drugHistories || [];
                        const report = r.preVisit && r.preVisit.reportText ? r.preVisit.reportText : "";
                        const queue = r.queueNumber || "—";
                        const doctorId = r.doctorId ;
                        const reviewState = reviews[id] || { rating: 0, text: "" };

                        return (
                            <div key={id} className="group bg-white transition-colors duration-150 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div
                                    className={`px-6 py-4 grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-gray-50 ${isOpen ? "border-b-2 border-blue-500" : ""}`}
                                    onClick={() => toggleExpand(id)}
                                >


                                    <div className="col-span-2">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Date</div>
                                        <div className="text-sm text-gray-600 font-medium">
                                            <i className="fa-regular fa-calendar mr-2 text-gray-400"></i>{formatDate(r)}
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Doctor Name</div>
                                        <div className="text-sm text-gray-600 font-semibold">{getDoctorName(r)}</div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Location</div>
                                        <div className="text-sm text-gray-600 truncate">
                                            <i className="fa-solid fa-location-dot mr-1"></i>{getLocation(r)}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Time</div>
                                        <div className="text-sm text-gray-600">{formatTime(r)}</div>
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <div className="text-xs font-bold text-gray-900 mb-1">Status</div>
                                        <span className={`status-badge inline-flex px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(r.status)}`}>
                      {r.status || "—"}
                    </span>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="bg-gray-50 border-blue-100 px-6 py-6 pl-8 animate-fade-in">
                                        <div className="grid-cols-3 grid space-y-3 ">
                                            <div className="flex flex-wrap items-baseline gap-2 col-span-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Queue Number:</span>
                                                <span className="text-base font-bold text-gray-900">{queue}</span>
                                            </div>

                                            <div className="flex flex-wrap items-baseline gap-2 col-span-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Latest Doctor Report:</span>
                                                {report ? (
                                                    <button
                                                        className="text-blue-600 underline"
                                                        onClick={() => openReportModal(r.preVisit)}
                                                        type="button"
                                                    >
                                                        View Report
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-gray-500">No report available</span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 col-span-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Medications:</span>
                                                {Array.isArray(meds) && meds.length > 0 ? (
                                                    meds.map((m, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                              {m.drugName ? `${m.drugName}${m.dosage ? ` ${m.dosage}` : ""}` : (typeof m === "string" ? m : "Medication")}
                            </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-500">None</span>
                                                )}
                                            </div>
                                            <div  className="grid-cols-3 col-span-1 justify-items-end ">
                                                <button
                                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white mb-6 px-5 py-2.5 rounded-lg shadow-md transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#0e7490] w-full lg:w-auto justify-center"
                                                    type="button"
                                                    onClick={() => {
                                                        navigate(`/reservation/${r.id}`);
                                                    }}
                                                >
                                                    <span className="material-icons-round">app_registration</span> Edit Reservation
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 bg-[#0e7490] hover:bg-cyan-800 text-white px-5 py-2.5 rounded-lg shadow-md transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#0e7490] w-full lg:w-auto justify-center"
                                                    type="button"
                                                    onClick={() => messageDoctor(r.doctorId)}
                                                >
                                                    <span className="material-icons-round">chat_bubble</span> Message Doctor
                                                </button>
                                            </div>

                                            { r.status ==="Completed" &&  (<div className="pt-1 col-span-3">
                                                <div
                                                    className="text-xs font-bold text-gray-500 uppercase tracking-wide">Review
                                                    Last Visit
                                                </div>
                                                <div
                                                    className="border border-gray-200 rounded p-3 bg-white mt-1 text-sm text-gray-600 ">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-sm font-medium">Add a review for this
                                                            visit
                                                        </div>
                                                        <StarRating value={reviewState.rating || 0}
                                                                    onChange={(v) => onChangeReviewRating(id, v)}/>
                                                    </div>
                                                    <textarea
                                                        rows={3}
                                                        className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm"
                                                        placeholder="Share feedback about your visit..."
                                                        value={reviewState.text || ""}
                                                        onChange={(e) => onChangeReviewText(id, e.target.value)}
                                                    />
                                                    <div className="mt-2 flex justify-end">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                                                            disabled={savingId === id}
                                                            onClick={() => saveReview(doctorId , r.patientId ,id)}
                                                        >
                                                            {savingId === id ? "Saving..." : "Save Review"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <ReportModal
                        open={reportModal.open}
                        report={reportModal.report}
                        onClose={closeReportModal}
                    />
                    {isReservationsLoading ? (
                        <div className="px-4 py-6 space-y-4">
                            {[0, 1].map((i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-gray-200 rounded" />
                                                <div className="h-3 w-24 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-3 w-20 bg-gray-200 rounded" />
                                    </div>
                                    <div className="h-3 w-full bg-gray-200 rounded" />
                                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (!reservation || reservation.length === 0) && (
                        <div className="px-4 py-6 text-sm text-gray-500">No reservations found</div>
                    )}
                </div>
            </div>
        </main>
    );
}