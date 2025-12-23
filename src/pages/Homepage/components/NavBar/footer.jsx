export default function Footer(){
    return (
        <footer className="mt-20 bg-[#1F2937] text-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-4">
                {/* Brand */}
                <div className="md:col-span-2 space-y-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#A7EFFF]">
                        Medicare
                    </h2>
                    <p className="text-sm text-gray-300 max-w-md">
                        We help you find the right doctors, clinics, and care for your family
                        with trusted profiles and real patient ratings.
                    </p>
                    <p className="text-xs text-gray-400">
                        Available 24/7 – wherever you are in Egypt.
                    </p>
                </div>

                {/* Quick links */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#C0D2FF] mb-3">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="#top" className="hover:text-[#A7EFFF] transition-colors">
                                Search doctors
                            </a>
                        </li>
                        <li>
                            <a href="/settings" className="hover:text-[#A7EFFF] transition-colors">
                                My profile
                            </a>
                        </li>
                        <li>
                            <a href="/settings" className="hover:text-[#A7EFFF] transition-colors">
                                My reservations
                            </a>
                        </li>
                        <li>
                            <a href="/settings" className="hover:text-[#A7EFFF] transition-colors">
                                Medical history
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#C0D2FF] mb-3">
                        Contact & Support
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="text-gray-300">support@medicare.eg</li>
                        <li className="text-gray-300">+20 (0) 123 456 789</li>
                        <li className="text-gray-400 text-xs">
                            Sun – Thu, 9:00 AM – 9:00 PM
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-700">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} Medicare. All rights reserved.</p>
                    <div className="space-x-4 mt-2 md:mt-0">
                        <button className="hover:text-[#A7EFFF]">Privacy</button>
                        <button className="hover:text-[#A7EFFF]">Terms</button>
                        <button className="hover:text-[#A7EFFF]">Cookies</button>
                    </div>
                </div>
            </div>
        </footer>
    )
}