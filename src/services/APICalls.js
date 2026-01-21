import {API_URL} from "../Constants/constant.jsx";
import toast from "react-hot-toast";


const APICalls = {
    GetCurrentUser: async () => {
        try {
            const response = await fetch(`${API_URL}public/currentUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`

                }
            });
            const userdata = await response.json();
            localStorage.setItem('userData', JSON.stringify(userdata || {}));
            return userdata;
        } catch (error) {
            console.error('CurrentUser error:', error);
            throw error;
        }
    },
    GetDoctorsList: async () => {
        try {
            const response = await fetch(`${API_URL}public/alldoctors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',

                }
            });
            const data = await response.json();
            if (!response.ok) {
                console.log('Failed to fetch current user:', response.status);
                throw new Error(data.message || 'Failed to fetch current user');
            }
            localStorage.setItem('DoctorsList', JSON.stringify(data || {}));
            return data;
        } catch (error) {
            console.error('DoctorsList error:', error);
            throw error;
        }
    },

    CreatAppointment: async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                console.log('Failed to fetch current user:', response.status);
                throw new Error(data.message || 'Failed to fetch current user');
            }

            return data;
        } catch (error) {
            console.error('DoctorsList error:', error);
            throw error;
        }
    },

    AddPatientInfo: async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/patient/Info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                console.log('Failed to fetch current user:', response.status);
                throw new Error(data.message || 'Failed to fetch current user');
            }

            return data;
        } catch (error) {
            console.error('DoctorsList error:', error);
            throw error;
        }
    },

    DoctorEditPatientInfo: async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/doctor/edit-patient-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                console.log('Failed to fetch current user:', response.status);
                throw new Error(data.message || 'Failed to fetch current user');
            }

            return data;
        } catch (error) {
            console.error('DoctorsList error:', error);
            throw error;
        }
    },

    DeleteMedicalRecord: async (id,Type,patientId) => {
        try{
            const response = await fetch(`${API_URL}public/doctor/delete-medical-record?id=${id}&Type=${Type}&patientId=${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },

            });
            const data = await response.json();
            if (!response.ok) {
                toast.success('Medical record deleted successfully!');
            }
            return data;
        }  catch (error) {
            console.error('Deleting MedicalRecord error:', error);
            throw error;
        }
    },

    CancelAppointment: async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/Cancel-reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                console.log('Failed to fetch current user:', response.status);
                throw new Error(data.message || 'Failed to fetch current user');
            }

            return data;
        } catch (error) {
            console.error('DoctorsList error:', error);
            throw error;
        }
    },

    UpdateUser: async (formData) => {
            const response = await fetch(`${API_URL}public/Update-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
        if (!response.ok) {
            const text = await response.text();
            let errorMessage = 'Something went wrong';

            try {
                const json = JSON.parse(text);
                errorMessage = json.message || errorMessage;
            } catch (e) {
                // response wasn't JSON – keep default message
                if (text) errorMessage = text;
            }

            throw new Error(errorMessage);
        }

        // Only parse if the response is OK and has JSON
        return await response.json();

    },

    uploadProfilePicture: async (file) => {
        await fetch(`${API_URL}public/uploadProfilePicture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            },
            body: file,
        });
    },

    DoctorReservations: async () => {
        try{
            const response = await fetch(`${API_URL}public/doctor-reservation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            const userdata = await response.json();
            localStorage.setItem('DoctorReservations', JSON.stringify(userdata || {}));
        } catch (error) {
            console.error('DoctorReservations error:', error);
            throw error;
        }
    },

    PatientReservations: async () => {
        try{
            const response = await fetch(`${API_URL}public/patient-reservation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            const userdata = await response.json();
            localStorage.setItem('PatientReservations', JSON.stringify(userdata || {}));
        } catch (error) {
            console.error('PatientReservations error:', error);
            throw error;
        }
    },

    uploadDocument: async (file , PatientID) => {
        await fetch(`${API_URL}public/uploadDocument/${PatientID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            },
            body: file,
        });
    },

    changePasswordSecure : async (passwordData) => {
    try {
        const response = await fetch(`${API_URL}/auth/change-password-secure`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
            },
            body: JSON.stringify(passwordData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to change password');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Network error occurred');
    }
},

    GetAllUsers : async () => {
    try{
        const response = await fetch(`${API_URL}public/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        });
        const allUsers = await response.json();
        localStorage.setItem('allUsers', JSON.stringify(allUsers || {}));
    } catch (error) {
        console.error('PatientReservations error:', error);
        throw error;
    }
} ,

    GetReservationCount : async (date , DocId) => {
    try{

        const response = await fetch(`${API_URL}public/reservation/count?date=${date}&doctorId=${DocId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            },
        });

        return await response.json();
    } catch (error) {
        console.error('PatientReservations error:', error);
        throw error;
    }
} ,

    UpdateOrCreateDoctorInfo : async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },
    GetDoctorsByStatus: async (status) => {
        try {
            const response = await fetch(`${API_URL}public/doctors-by-status/${status}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            const allDoctors = await response.json();
            localStorage.setItem('DoctorsList', JSON.stringify(allDoctors || {}));
            return allDoctors;
        } catch (error) {
            console.error('GetDoctors error:', error);
            throw error;
        }

    },


    UpdateDoctorStatus: async (doctorId, status) => {
        const response = await fetch(`${API_URL}public/doctor/status/${doctorId}?status=${status}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        });
        if (!response.ok) {
            console.error("Failed to update doctor status", response.statusText);

        }
        const allDoctors = await response.json();
        localStorage.setItem('DoctorsList', JSON.stringify(allDoctors || {}));
        return allDoctors;
    },

    UpdateDoctorServingNumber: async (ServingNumber) => {

        try{
            await fetch(`${API_URL}public/doctor/update-serving-number/${ServingNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
            });
        } catch (error) {
            toast.error(error.message || `Failed to update Serving Number`);
            throw error;
        }
    },

    AddNewReview: async (Review) => {

        try{
            await fetch(`${API_URL}public/addReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(Review)
            });
        } catch (error) {
            toast.error(error.message || `Failed to update Serving Number`);
            throw error;
        }
    },

    GetReviews: async () => {
        try {
            const response = await fetch(`${API_URL}public/reviews/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });

            const reviews = await response.json();
            localStorage.setItem('ReservationReviews', JSON.stringify(reviews || {}));
            return reviews;
        } catch (error) {
            console.error('GetDoctors error:', error);
            throw error;
        }

    },

    GetReviewsByDoctorId: async (doctorId) => {
        try {
            const response = await fetch(`${API_URL}public/getReviewsByDoctor/${doctorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            const allDoctors = await response.json();
            localStorage.setItem('DoctorReviews', JSON.stringify(allDoctors || {}));
            return allDoctors;
        } catch (error) {
            console.error('GetDoctors error:', error);
            throw error;
        }

    },

    UpdateAppointmentStatus: async (Id, status , totalFees) => {
        try{
            const url = totalFees !=null?`${API_URL}public/reservation/updatestatus?id=${Id}&status=${status}&totalFees=${totalFees}`
                : `${API_URL}public/reservation/updatestatus?id=${Id}&status=${status}`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });

        } catch (error) {
            console.error('PatientReservations error:', error);
            throw error;
        }
    },

    RescheduleAppointment: async (id, formData) => {
        try {
            const response = await fetch(`${API_URL}public/reservation/reschedule/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to reschedule appointment');
            }
            return data;
        } catch (error) {
            console.error('RescheduleAppointment error:', error);
            throw error;
        }
    },

    AddMedicalHistory: async (formData) => {
        try {
            const response = await fetch(`${API_URL}public/doctor/add-medical-record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add medical history');
            }
            return data;
        } catch (error) {
            console.error('AddMedicalHistory error:', error);
            throw error;
        }
    },

    GetAllReservations: async () => {
        try {
            const response = await fetch(`${API_URL}public/reservation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            const reservations = await response.json();
            return reservations;
        } catch (error) {
            console.error('GetAllReservations error:', error);
            throw error;
        }
    },

    DeleteUser: async (userId) => {
        try {
            const response = await fetch(`${API_URL}public/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete user');
            }
            
            // Backend returns plain text, not JSON
            return await response.text();
        } catch (error) {
            console.error('DeleteUser error:', error);
            throw error;
        }
    }

}

export default APICalls