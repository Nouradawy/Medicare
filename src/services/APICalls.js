import {API_URL} from "../Constants/constant.jsx";


const APICalls = {
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
    }

}

export default APICalls