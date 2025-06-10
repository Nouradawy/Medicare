import {API_URL} from "../Constants/constant.jsx";


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
}

}

export default APICalls