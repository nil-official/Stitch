import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pencil, Save } from "lucide-react";
import { format } from 'date-fns';
import { updateProfile } from '../../redux/customer/profile/action';

const ProfileInformation = ({ profile }) => {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        dob: profile.dob || '',
        height: profile.height || '',
        weight: profile.weight || '',
        email: profile.email || '',
        mobile: profile.mobile || ''
    });

    const [editMode, setEditMode] = useState({
        personal: false,
        email: false,
        mobile: false
    });

    const toggleEdit = (section) => {
        setEditMode(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getChangedFields = () => {
        const changed = {};
        for (const key in formData) {
            if (formData[key] !== profile[key]) {
                changed[key] = formData[key];
            }
        }
        return changed;
    };

    const handleSave = (section) => {
        const updatedData = getChangedFields();
        if (Object.keys(updatedData).length > 0) dispatch(updateProfile(updatedData));
        toggleEdit(section);
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            {/* Personal Information */}
            <div className="mb-8">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-medium">Personal Information</h2>
                    {!editMode.personal ? (
                        <Pencil
                            onClick={() => toggleEdit('personal')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Edit
                        </Pencil>
                    ) : (
                        <Save
                            onClick={() => handleSave('personal')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Save
                        </Save>
                    )}
                </div>

                {editMode.personal ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                        <div>
                            <p className="mb-2">Firstname</p>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <p className="mb-2">Lastname</p>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                        <div>
                            <p className="mb-2">Firstname</p>
                            <input
                                type="text"
                                value={formData.firstName}
                                className="w-full border rounded px-3 py-2 bg-gray-50"
                                readOnly
                            />
                        </div>
                        <div>
                            <p className="mb-2">Lastname</p>
                            <input
                                type="text"
                                value={formData.lastName}
                                className="w-full border rounded px-3 py-2 bg-gray-50"
                                readOnly
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 px-4">
                    <p className="mb-2">Gender</p>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                disabled={!editMode.personal}
                                className="mr-2"
                            />
                            <p>Male</p>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                disabled={!editMode.personal}
                                className="mr-2"
                            />
                            <p>Female</p>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={formData.gender === 'other'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                disabled={!editMode.personal}
                                className="mr-2"
                            />
                            <p>Others</p>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4">
                    <div>
                        <p className="mb-2">Date of Birth</p>
                        <input
                            type="date"
                            max={format(new Date(), "yyyy-MM-dd")}
                            value={formData.dob && format(new Date(formData.dob), "yyyy-MM-dd")}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className={`w-full border rounded px-3 py-2 ${!editMode.personal ? 'bg-gray-50' : ''}`}
                            readOnly={!editMode.personal}
                        />
                    </div>
                    <div>
                        <p className="mb-2">Height (cm)</p>
                        <input
                            type="number"
                            min={50}
                            max={250}
                            value={formData.height || ''}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className={`w-full border rounded px-3 py-2 ${!editMode.personal ? 'bg-gray-50' : ''}`}
                            readOnly={!editMode.personal}
                        />
                    </div>
                    <div>
                        <p className="mb-2">Weight (kg)</p>
                        <input
                            type="number"
                            min={20}
                            max={200}
                            value={formData.weight || ''}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className={`w-full border rounded px-3 py-2 ${!editMode.personal ? 'bg-gray-50' : ''}`}
                            readOnly={!editMode.personal}
                        />
                    </div>
                </div>
            </div>

            {/* Email Address */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Email Address</h2>
                    {!editMode.email ? (
                        <Pencil
                            onClick={() => toggleEdit('email')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Edit
                        </Pencil>
                    ) : (
                        <Save
                            onClick={() => handleSave('email')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Save
                        </Save>
                    )}
                </div>

                <div className='px-4'>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full border rounded px-3 py-2 ${!editMode.email ? 'bg-gray-50' : ''}`}
                        readOnly={!editMode.email}
                    />
                </div>
            </div>

            {/* Mobile Number */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Mobile Number</h2>
                    {!editMode.mobile ? (
                        <Pencil
                            onClick={() => toggleEdit('mobile')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Edit
                        </Pencil>
                    ) : (
                        <Save
                            onClick={() => handleSave('mobile')}
                            size={18}
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                        >
                            Save
                        </Save>
                    )}
                </div>

                <div className='px-4'>
                    <input
                        type="tel"
                        maxLength={10}
                        value={formData.mobile || ''}
                        onChange={(e) => {
                            (/^\d*$/.test(e.target.value)) && setFormData({ ...formData, mobile: e.target.value });
                        }}
                        className={`w-full border rounded px-3 py-2 ${!editMode.mobile ? 'bg-gray-50' : ''}`}
                        readOnly={!editMode.mobile}
                    />
                </div>
            </div>

            {/* Account Actions */}
            <div className="pt-4 border-t">
                <button className="text-red-600 block hover:underline">Delete Account</button>
            </div>
        </div>
    );
};

export default ProfileInformation;