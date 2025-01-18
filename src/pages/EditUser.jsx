import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import InputField2 from '../components/InputField2';

const EditUser = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = location.state;

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		mobile: '',
		dob: '',

	});

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				mobile: user.mobile,
				dob: new Date(user.dob).toISOString().split('T')[0],
			});
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.patch(`http://localhost:5454/api/admin/users/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
			navigate('/admin/users');	
		} catch (error) {
			console.error('Error updating user:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
            <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
                <div className="space-y-12">

                    <div></div>
                    {/* border-b border-gray-900/10 */}
                    <div className="pb-4">
                        <h2 className="text-4xl font-semibold text-gray-900">Edit User Details</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Fill up the fields below to edit the user.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className={`sm:col-span-6`}>
                                <InputField2
                                    label="First Name"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    name="firstName"
                                />
                            </div>
							<div className={`sm:col-span-6`}>
								<InputField2
									label="Last Name"
									type="text"
									value={formData.lastName}
									onChange={handleChange}
									name="lastName"
								/>
							</div>
							<div className={`sm:col-span-6`}>
								<InputField2
									label="Mobile"
									type="text"
									value={formData.mobile}
									onChange={handleChange}
									name="mobile"
								/>
							</div>
							<div className={`sm:col-span-6`}>
								<InputField2
									label="Date of Birth"
									type="date"
									value={formData.dob}
									onChange={handleChange}
									name="dob"
								/>
							</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6 mb-4">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
	);
};

export default EditUser;