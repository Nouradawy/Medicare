import React, { useState } from 'react';
import APICalls from '../../services/APICalls.js';

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState(user || {});

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call API to update user
            await APICalls.UpdateUserById(editedUser, user.userId);
            onSave(editedUser);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={editedUser.fullName || ''}
                                onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={editedUser.email || ''}
                                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                value={editedUser.phoneNumber || ''}
                                onChange={(e) => setEditedUser({...editedUser, phoneNumber: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                value={editedUser.age || ''}
                                onChange={(e) => setEditedUser({...editedUser, age: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                value={editedUser.address || ''}
                                onChange={(e) => setEditedUser({...editedUser, address: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
