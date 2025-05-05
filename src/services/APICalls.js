const API_URL = 'https://medicareb.work.gd/api/public';

const APICalls = {
    GetDoctorsList: async () => {
        try {
            const response = await fetch(`${API_URL}/alldoctors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`

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

}

export default APICalls