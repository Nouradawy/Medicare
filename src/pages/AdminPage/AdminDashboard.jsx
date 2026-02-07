import NavBar from "../Homepage/components/NavBar/NavBar.jsx";
import React, {useEffect, useState} from "react";
import APICalls from "../../services/APICalls.js";
import {API_URL} from "../../Constants/constant.jsx";
import StatsCard from "../../components/admin/StatsCard.jsx";
import UserEditModal from "../../components/admin/UserEditModal.jsx";
import ConfirmationModal from "../../components/admin/ConfirmationModal.jsx";
import './AdminDashboard.css';

function SidebarItem({children , setIndex, Index , currentIndex}) {
    const isActive = Index === currentIndex;

    return(
        <div className="flex flex-row items-center gap-3">
            <button
                onClick={() => setIndex(Index)}
                className={`inline-flex w-full px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer rounded-lg transition-colors ${isActive ? "bg-blue-500 text-white" : ""}`} >
                {children}
            </button>
        </div>
    )
}

export default function AdminDashboard () {
    const [Index, setIndex] = useState(0);
    const MainScreenSize = 80;
    const [DoctorsList, setDoctorsList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const [AllReservations, setAllReservations] = useState([]);
    const [Stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalReservations: 0,
        pendingDoctors: 0
    });
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [doctorStatusFilter, setDoctorStatusFilter] = useState('all');
    
    // Pagination state
    const [userPagination, setUserPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
    const [doctorPagination, setDoctorPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
    const [reservationPagination, setReservationPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
    const [reservationStatusFilter, setReservationStatusFilter] = useState('all');
    
    // Pagination loading states - track direction (prev/next) for each section
    const [paginationLoading, setPaginationLoading] = useState({
        users: null,      // null | 'prev' | 'next'
        doctors: null,    // null | 'prev' | 'next'
        reservations: null // null | 'prev' | 'next'
    });
    
    // Section loading states for filters/search
    const [sectionLoading, setSectionLoading] = useState({
        users: false,
        doctors: false,
        reservations: false
    });

    const fetchData = async (index) => {
        setLoading(true);
        try {
            switch(index) {
                case 0: // Dashboard Stats
                    await fetchStats();
                    break;
                case 1: // Doctor Managementtotal
                    await fetchDoctors();
                    break;
                case 2: // User Management
                    await fetchUsers();
                    break;
                case 3: // Reservation Management
                    await fetchReservations();
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await APICalls.GetAdminStats();
            setStats({
                totalUsers: stats.totalUsers,
                totalDoctors: stats.totalDoctors,
                pendingDoctors: stats.pendingDoctors,
                totalReservations: stats.totalReservations
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchUsers = async (page = userPagination.page, search = searchTerm, role = roleFilter, direction = null) => {
        if (direction) {
            setPaginationLoading(prev => ({ ...prev, users: direction }));
        } else {
            setSectionLoading(prev => ({ ...prev, users: true }));
        }
        try {
            const response = await APICalls.GetAdminUsers(page, userPagination.size, 'userId', 'asc', search, role);
            setUserList(response.content || []);
            setUserPagination({
                page: response.page,
                size: response.size,
                totalPages: response.totalPages,
                totalElements: response.totalElements
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            setUserList([]);
        } finally {
            setPaginationLoading(prev => ({ ...prev, users: null }));
            setSectionLoading(prev => ({ ...prev, users: false }));
        }
    };

    const fetchDoctors = async (page = doctorPagination.page, status = doctorStatusFilter, direction = null) => {
        if (direction) {
            setPaginationLoading(prev => ({ ...prev, doctors: direction }));
        } else {
            setSectionLoading(prev => ({ ...prev, doctors: true }));
        }
        try {
            const response = await APICalls.GetAdminDoctors(page, doctorPagination.size, 'userId', 'asc', status);
            setDoctorsList(response.content || []);
            setDoctorPagination({
                page: response.page,
                size: response.size,
                totalPages: response.totalPages,
                totalElements: response.totalElements
            });
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setDoctorsList([]);
        } finally {
            setPaginationLoading(prev => ({ ...prev, doctors: null }));
            setSectionLoading(prev => ({ ...prev, doctors: false }));
        }
    };

    const fetchReservations = async (page = reservationPagination.page, status = reservationStatusFilter, direction = null) => {
        if (direction) {
            setPaginationLoading(prev => ({ ...prev, reservations: direction }));
        } else {
            setSectionLoading(prev => ({ ...prev, reservations: true }));
        }
        try {
            const response = await APICalls.GetAdminReservations(page, reservationPagination.size, 'id', 'desc', status);
            setAllReservations(response.content || []);
            setReservationPagination({
                page: response.page,
                size: response.size,
                totalPages: response.totalPages,
                totalElements: response.totalElements
            });
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setAllReservations([]);
        } finally {
            setPaginationLoading(prev => ({ ...prev, reservations: null }));
            setSectionLoading(prev => ({ ...prev, reservations: false }));
        }
    };

    // Handle user search with debounce
    useEffect(() => {
        if (Index === 2) {
            const delayDebounceFn = setTimeout(() => {
                fetchUsers(0, searchTerm, roleFilter);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchTerm, roleFilter]);

    // Handle doctor status filter change
    useEffect(() => {
        if (Index === 1) {
            fetchDoctors(0, doctorStatusFilter);
        }
    }, [doctorStatusFilter]);

    // Handle reservation status filter change
    useEffect(() => {
        if (Index === 3) {
            fetchReservations(0, reservationStatusFilter);
        }
    }, [reservationStatusFilter]);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        try {
            await APICalls.DeleteUser(userToDelete.userId);
            await fetchUsers(); // Refresh user list
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleSaveUser = async (updatedUser) => {
        await fetchUsers(); // Refresh user list
    };

    useEffect(() => {
        fetchData(Index);
    }, [Index]);


    return (
        <>
            <NavBar/>
            <div className="flex flex-row justify-center space-x-10 @container min-h-screen bg-gray-50">
                {/*SideBar*/}
                <div className="flex-col bg-white border-gray-200 shadow-lg rounded-lg pt-5 @max-[800px]:hidden h-fit min-w-[250px]">
                    <div className="px-4 py-3 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                    </div>
                    
                    {/*Dashboard Stats*/}
                    <SidebarItem setIndex={setIndex} Index={0} currentIndex={Index}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        <p>Dashboard</p>
                    </SidebarItem>

                    {/*Doctor Management*/}
                    <SidebarItem setIndex={setIndex} Index={1} currentIndex={Index}>
                        <svg height="24px" width="24px" fill="currentColor" viewBox="0 -960 960 960">
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                        </svg>
                        <p>Doctor Management</p>
                    </SidebarItem>

                    {/*User Management*/}
                    <SidebarItem setIndex={setIndex} Index={2} currentIndex={Index}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p>User Management</p>
                    </SidebarItem>

                    {/*Reservation Management*/}
                    <SidebarItem setIndex={setIndex} Index={3} currentIndex={Index}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                        </svg>
                        <p>Reservations</p>
                    </SidebarItem>
                </div>
                {/*MainScreen*/}
                <div className={`flex-col w-[${MainScreenSize}vw] bg-white border-gray-200 border shadow-lg rounded-lg p-6`}>
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {/* Dashboard Overview */}
                    {Index === 0 && !loading && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
                            
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatsCard
                                    title="Total Users"
                                    value={Stats.totalUsers}
                                    bgColor="bg-blue-50 border-blue-200"
                                    textColor="text-blue-600"
                                    iconBg="bg-blue-100"
                                    icon={<svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                    </svg>}
                                />

                                <StatsCard
                                    title="Total Doctors*2"
                                    value= {Stats.totalDoctors*2}
                                    bgColor="bg-green-50 border-green-200"
                                    textColor="text-green-600"
                                    iconBg="bg-green-100"
                                    icon={<svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="-6 -6 24 24">
                                        <path d="M5.5,7C4.1193,7,3,5.8807,3,4.5l0,0v-2C3,2.2239,3.2239,2,3.5,2H4c0.2761,0,0.5-0.2239,0.5-0.5S4.2761,1,4,1H3.5&#xA;&#x9;C2.6716,1,2,1.6716,2,2.5v2c0.0013,1.1466,0.5658,2.2195,1.51,2.87l0,0C4.4131,8.1662,4.9514,9.297,5,10.5C5,12.433,6.567,14,8.5,14&#xA;&#x9;s3.5-1.567,3.5-3.5V9.93c1.0695-0.2761,1.7126-1.367,1.4365-2.4365C13.1603,6.424,12.0695,5.7809,11,6.057&#xA;&#x9;C9.9305,6.3332,9.2874,7.424,9.5635,8.4935C9.7454,9.198,10.2955,9.7481,11,9.93v0.57c0,1.3807-1.1193,2.5-2.5,2.5S6,11.8807,6,10.5&#xA;&#x9;c0.0511-1.2045,0.5932-2.3356,1.5-3.13l0,0C8.4404,6.7172,9.001,5.6448,9,4.5v-2C9,1.6716,8.3284,1,7.5,1H7&#xA;&#x9;C6.7239,1,6.5,1.2239,6.5,1.5S6.7239,2,7,2h0.5C7.7761,2,8,2.2239,8,2.5v2l0,0C8,5.8807,6.8807,7,5.5,7 M11.5,9&#xA;&#x9;c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S12.0523,9,11.5,9z"/>
                                    </svg>}
                                />

                                <StatsCard
                                    title="Pending Doctors"
                                    value={Stats.pendingDoctors}
                                    bgColor="bg-yellow-50 border-yellow-200"
                                    textColor="text-yellow-600"
                                    iconBg="bg-yellow-100"
                                    icon={<svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>}
                                />

                                <StatsCard
                                    title="Total Reservations"
                                    value={Stats.totalReservations}
                                    bgColor="bg-purple-50 border-purple-200"
                                    textColor="text-purple-600"
                                    iconBg="bg-purple-100"
                                    icon={<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>}
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button 
                                        onClick={() => setIndex(1)}
                                        className="flex items-center p-4 bg-white rounded-lg border hover:bg-blue-50 transition-colors"
                                    >
                                        <svg className="w-12 h-12 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5.5,7C4.1193,7,3,5.8807,3,4.5l0,0v-2C3,2.2239,3.2239,2,3.5,2H4c0.2761,0,0.5-0.2239,0.5-0.5S4.2761,1,4,1H3.5&#xA;&#x9;C2.6716,1,2,1.6716,2,2.5v2c0.0013,1.1466,0.5658,2.2195,1.51,2.87l0,0C4.4131,8.1662,4.9514,9.297,5,10.5C5,12.433,6.567,14,8.5,14&#xA;&#x9;s3.5-1.567,3.5-3.5V9.93c1.0695-0.2761,1.7126-1.367,1.4365-2.4365C13.1603,6.424,12.0695,5.7809,11,6.057&#xA;&#x9;C9.9305,6.3332,9.2874,7.424,9.5635,8.4935C9.7454,9.198,10.2955,9.7481,11,9.93v0.57c0,1.3807-1.1193,2.5-2.5,2.5S6,11.8807,6,10.5&#xA;&#x9;c0.0511-1.2045,0.5932-2.3356,1.5-3.13l0,0C8.4404,6.7172,9.001,5.6448,9,4.5v-2C9,1.6716,8.3284,1,7.5,1H7&#xA;&#x9;C6.7239,1,6.5,1.2239,6.5,1.5S6.7239,2,7,2h0.5C7.7761,2,8,2.2239,8,2.5v2l0,0C8,5.8807,6.8807,7,5.5,7 M11.5,9&#xA;&#x9;c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S12.0523,9,11.5,9z"/>
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Manage Doctors</p>
                                            <p className="text-sm text-gray-500">Approve pending doctors</p>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setIndex(2)}
                                        className="flex items-center p-4 bg-white rounded-lg border hover:bg-green-50 transition-colors"
                                    >
                                        <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Manage Users</p>
                                            <p className="text-sm text-gray-500">View and edit user accounts</p>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setIndex(3)}
                                        className="flex items-center p-4 bg-white rounded-lg border hover:bg-purple-50 transition-colors"
                                    >
                                        <svg className="w-8 h-8 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">View Reservations</p>
                                            <p className="text-sm text-gray-500">Monitor appointments</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg border p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                                <div className="space-y-3">
                                    {Stats.pendingDoctors > 0 && (
                                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                                            <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd"></path>
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800">
                                                    {Stats.pendingDoctors} doctor{Stats.pendingDoctors > 1 ? 's' : ''} awaiting approval
                                                </p>
                                                <button 
                                                    onClick={() => setIndex(1)}
                                                    className="text-sm text-yellow-600 hover:text-yellow-800 underline"
                                                >
                                                    Review now →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                        </svg>
                                        <p className="text-sm text-gray-600">System running normally</p>
                                    </div>

                                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <p className="text-sm text-green-600">All services operational</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctor Management */}
                    {Index === 1 && !loading && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => fetchDoctors(0, doctorStatusFilter)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Doctor Status Filter */}
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                                        <select
                                            value={doctorStatusFilter}
                                            onChange={(e) => setDoctorStatusFilter(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Showing {DoctorsList.length} of {doctorPagination.totalElements} doctors
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {sectionLoading.doctors && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                {DoctorsList.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No doctors found.
                                    </div>
                                ) : (
                                    DoctorsList.map((doc, index) => (
                                        <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900">{doc.fullName}</h3>
                                                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                                                        <p><span className="font-medium">Username:</span> {doc.username || 'N/A'}</p>
                                                        <p><span className="font-medium">City:</span> {doc.city || 'N/A'}</p>
                                                        <p><span className="font-medium">Specialty:</span> {doc.specialty || 'N/A'}</p>
                                                        <p><span className="font-medium">Fees:</span> {doc.fees ? `$${doc.fees}` : 'N/A'}</p>
                                                        <p><span className="font-medium">Working Hours:</span> {doc.startTime && doc.endTime ? `${doc.startTime} - ${doc.endTime}` : 'N/A'}</p>
                                                        <p><span className="font-medium">Rating:</span> {doc.rating ? `${doc.rating}/5` : 'N/A'}</p>
                                                        <p><span className="font-medium">Working Days:</span> {doc.workingDays ? doc.workingDays.join(', ') : 'N/A'}</p>
                                                        <p><span className="font-medium">Specialty Details:</span> {doc.specialityDetails || 'N/A'}</p>
                                                    </div>
                                                    {doc.bio && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Bio:</span> {doc.bio}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-6 flex flex-col items-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                                                        doc.status === "Confirmed" ? "bg-green-100 text-green-800" :
                                                        doc.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                    }`}>
                                                        {doc.status}
                                                    </span>
                                                    
                                                    {/* Status change dropdown */}
                                                    <div className="relative">
                                                        <select
                                                            value={doc.status}
                                                            onChange={async (e) => {
                                                                const newStatus = e.target.value;
                                                                if (newStatus !== doc.status) {
                                                                    await APICalls.UpdateDoctorStatus(doc.doctorId, newStatus);
                                                                    await fetchDoctors();
                                                                    alert(`Doctor status updated to ${newStatus}`);
                                                                }
                                                            }}
                                                            className="text-xs px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Confirmed">Confirmed</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick action buttons for pending doctors */}
                                            {doc.status === "Pending" && (
                                                <div className="flex space-x-3 mt-4 pt-4 border-t">
                                                    <button
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                        onClick={async () => {
                                                            await APICalls.UpdateDoctorStatus(doc.doctorId, "Confirmed");
                                                            await fetchDoctors();
                                                            alert("Doctor approved successfully!");
                                                        }}
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                        </svg>
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                        onClick={async () => {
                                                            await APICalls.UpdateDoctorStatus(doc.doctorId, "Rejected");
                                                            await fetchDoctors();
                                                            alert("Doctor rejected.");
                                                        }}
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                        </svg>
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {/* Action buttons for confirmed/rejected doctors */}
                                            {doc.status !== "Pending" && (
                                                <div className="flex space-x-3 mt-4 pt-4 border-t">
                                                    {doc.status === "Confirmed" && (
                                                        <>
                                                            <button
                                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                                                                onClick={async () => {
                                                                    await APICalls.UpdateDoctorStatus(doc.doctorId, "Pending");
                                                                    await fetchDoctors();
                                                                    alert("Doctor status changed to Pending for review.");
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                                                </svg>
                                                                Set to Pending
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                                onClick={async () => {
                                                                    await APICalls.UpdateDoctorStatus(doc.doctorId, "Rejected");
                                                                    await fetchDoctors();
                                                                    alert("Doctor rejected.");
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                                </svg>
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {doc.status === "Rejected" && (
                                                        <>
                                                            <button
                                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                                onClick={async () => {
                                                                    await APICalls.UpdateDoctorStatus(doc.doctorId, "Confirmed");
                                                                    await fetchDoctors();
                                                                    alert("Doctor approved successfully!");
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                                </svg>
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                                                                onClick={async () => {
                                                                    await APICalls.UpdateDoctorStatus(doc.doctorId, "Pending");
                                                                    await fetchDoctors();
                                                                    alert("Doctor status changed to Pending for review.");
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                                                                </svg>
                                                                Set to Pending
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                </div>
                            </div>
                            
                            {/* Pagination Controls */}
                            {doctorPagination.totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Page {doctorPagination.page + 1} of {doctorPagination.totalPages}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => fetchDoctors(doctorPagination.page - 1, doctorStatusFilter, 'prev')}
                                            disabled={doctorPagination.page === 0 || paginationLoading.doctors}
                                            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[90px] justify-center"
                                        >
                                            {paginationLoading.doctors === 'prev' ? (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : 'Previous'}
                                        </button>
                                        <button
                                            onClick={() => fetchDoctors(doctorPagination.page + 1, doctorStatusFilter, 'next')}
                                            disabled={doctorPagination.page >= doctorPagination.totalPages - 1 || paginationLoading.doctors}
                                            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[70px] justify-center"
                                        >
                                            {paginationLoading.doctors === 'next' ? (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : 'Next'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Management */}
                    {Index === 2 && !loading && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                                <button 
                                    onClick={() => fetchUsers(0, searchTerm, roleFilter)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search users by name, email, or username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="sm:w-48">
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="patient">Patients</option>
                                        <option value="doctor">Doctors</option>
                                        <option value="admin">Admins</option>
                                    </select>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-4">
                                Showing {UserList.length} of {userPagination.totalElements} users
                            </div>

                            <div className="relative">
                                {sectionLoading.users && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {UserList.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                        No users found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                UserList.map((user, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {user.fullName?.charAt(0) || 'U'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                                    <div className="text-sm text-gray-500">{user.username}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {user.role || 'PATIENT'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.age || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.cityName || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button 
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination Controls */}
                                {userPagination.totalPages > 1 && (
                                    <div className="px-6 py-4 border-t flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Page {userPagination.page + 1} of {userPagination.totalPages}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => fetchUsers(userPagination.page - 1, searchTerm, roleFilter, 'prev')}
                                                disabled={userPagination.page === 0 || paginationLoading.users}
                                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[80px] justify-center"
                                            >
                                                {paginationLoading.users === 'prev' ? (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : 'Previous'}
                                            </button>
                                            <button
                                                onClick={() => fetchUsers(userPagination.page + 1, searchTerm, roleFilter, 'next')}
                                                disabled={userPagination.page >= userPagination.totalPages - 1 || paginationLoading.users}
                                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[60px] justify-center"
                                            >
                                                {paginationLoading.users === 'next' ? (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : 'Next'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                    )}

                    {/* Reservation Management */}
                    {Index === 3 && !loading && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">Reservation Management</h1>
                                <button 
                                    onClick={() => fetchReservations(0, reservationStatusFilter)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* Status Filter */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="sm:w-48">
                                    <select
                                        value={reservationStatusFilter}
                                        onChange={(e) => setReservationStatusFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Canceled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-4">
                                Showing {AllReservations.length} of {reservationPagination.totalElements} reservations
                            </div>

                            <div className="relative">
                                {sectionLoading.reservations && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {AllReservations.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No reservations found.</td>
                                                </tr>
                                            ) : (
                                                AllReservations.map((reservation, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.patientName || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {reservation.doctorName || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {reservation.doctorSpecialty || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(reservation.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {reservation.duration ? `${reservation.duration} min` : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                reservation.status === "Confirmed" ? "bg-green-100 text-green-800" :
                                                                reservation.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                                                reservation.status === "Completed" ? "bg-blue-100 text-blue-800" :
                                                                "bg-red-100 text-red-800"
                                                            }`}>
                                                                {reservation.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination Controls */}
                                {reservationPagination.totalPages > 1 && (
                                    <div className="px-6 py-4 border-t flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Page {reservationPagination.page + 1} of {reservationPagination.totalPages}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => fetchReservations(reservationPagination.page - 1, reservationStatusFilter, 'prev')}
                                                disabled={reservationPagination.page === 0 || paginationLoading.reservations}
                                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[80px] justify-center"
                                            >
                                                {paginationLoading.reservations === 'prev' ? (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : 'Previous'}
                                            </button>
                                            <button
                                                onClick={() => fetchReservations(reservationPagination.page + 1, reservationStatusFilter, 'next')}
                                                disabled={reservationPagination.page >= reservationPagination.totalPages - 1 || paginationLoading.reservations}
                                                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center min-w-[60px] justify-center"
                                            >
                                                {paginationLoading.reservations === 'next' ? (
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : 'Next'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <UserEditModal
                    user={selectedUser}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSaveUser}
                />

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setUserToDelete(null);
                    }}
                    onConfirm={confirmDeleteUser}
                    title="Delete User"
                    message={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </>
    )
}