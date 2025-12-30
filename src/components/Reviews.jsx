import React from "react";

export default function Reviews ({Review, selectedDoctor})  {
    return (<>
        {Review.length !== 0 ? (
            <>
                <div className="mb-10 pb-8 border-b border-gray-200  "></div>
                <div className="mb-10 pb-8  ">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Patient Feedback
                            <span
                                className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold border border-yellow-200">
                                        {selectedDoctor.rating} Rating
                                    </span>
                        </h3>
                        <button
                            className="text-sm font-semibold text-primary hover:text-emerald-700 transition flex items-center gap-1 group">
                            View all {Review.length} reviews
                            <span
                                className="material-icons-round text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                    <div className="flex-col ">
                        {Review.map((review, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 mt-4"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt={review.name || "Patient"}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                            src={review.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_HuUaHLem-708lyJRRXJGYIvspItRFOaxC_tA8-T-g4Q89W9jQtlzQb6JDhm4fqj0X6U40mUvMSU-o60QMbmoKFqMnyAe8CpFJYbCi4TZCNg71zNIXaBd-I6RMgHpq4RaHwFQb3QH_SKXxQwdEF3jdN7GthkjvYGAMuBdnuhD-Sb0wbOM5OA_0WJgSIX8k46BS7yA8PczAw7bY5m5aZIyKhzExA86HKeamHi7ViiofjVrWnwTLtGywtyR7swcMj_l2jWaa5ERlrI"}
                                        />
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{review.username || "Anonymous"}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="material-icons-round text-[14px]">
                                                                        {i < Math.round(review.rating) ? "star" : "star_border"}
                                                                    </span>
                                                    ))}
                                                </div>
                                                <span
                                                    className="text-xs text-gray-400 font-medium">{review.date || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed italic relative pl-3 border-l-2 border-primary/30">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : null}
    </>);
}