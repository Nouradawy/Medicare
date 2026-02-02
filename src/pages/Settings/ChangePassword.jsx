import {useState} from "react";
import {DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import APICalls from "../../services/APICalls.js";
import toast from "react-hot-toast";

export default function ChangePassword({ user, screenSize }) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validatePasswords = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirmation password don't match");
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters long");
            return false;
        }
        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password");
            return false;
        }
        return true;
    };

    return (
        <form onSubmit={
            async (e) => {
                e.preventDefault();
                setError(null);
                setResponse(null);

                if (!validatePasswords()) {
                    return;
                }

                try {
                    setLoading(true);
                    const passwordData = {
                        currentPassword: formData.currentPassword,
                        newPassword: formData.newPassword
                    };

                    const result = await APICalls.changePasswordSecure(passwordData);
                    setResponse(result);
                    toast.success('Password changed successfully!');

                    // Clear form on success
                    setFormData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });

                } catch (error) {
                    setError(error.message);
                    toast.error(error.message || 'Failed to change password');
                } finally {
                    setLoading(false);
                }
            }
        }>
            <div className="flex-row">
                <div className="flex flex-row">
                    <div className="relative overflow-hidden rounded-full mb-10">
                        {/* Profile image section - same as ProfileSettings */}
                        <img
                            src={user.imageUrl != null ? user.imageUrl : user.gender === "male" ? DefaultMale : DefaultFemale}
                            alt={user.gender === "male" ? DefaultMale : DefaultFemale}
                            className="w-50 h-50 rounded-full object-cover"
                        />
                    </div>

                    <div className={`flex flex-col space-y-4`}>
                        <div className={`flex flex-col space-y-2`} style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg">Username</label>
                            <input
                                type="text"
                                className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                value={user.username}
                                disabled={true}
                            />
                        </div>
                        <div className="flex flex-col space-y-2" style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg">Email</label>
                            <input
                                type="text"
                                className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                value={user.email}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 h-130">
                {/* Current Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Enter your current password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* New Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col space-y-2">
                    <label className="text-lg">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Changing Password...' : 'Change Password'}
                </button>
            </div>

            {response && <p className="text-green-500 mt-4">{response.message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
    );
}