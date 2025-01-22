import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import decodeJWT from '../utils/decodeJWT';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/baseurl';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = `${BASE_URL}/api/admin/users/all`;

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (authorities.includes("ROLE_ADMIN")) {
                navigate('/admin/users');
            } else {
                navigate('/Log');
            }
        } else {
            navigate('/Log');
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (response.data) {
                setUsers(response.data);
            } else {
                toast.error('Error fetching users. Please try again.');
            }
        } catch (error) {
            toast.error('Error fetching users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = (user) => {
        const updatedUsers = [...users];
        const userIndex = updatedUsers.findIndex(u => u.id === user.id);
        const currentRole = user.roles[0].name;

        if (currentRole === "ROLE_USER") {
            axios.patch(`${BASE_URL}/api/admin/promote/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
            .then(response => {
                updatedUsers[userIndex].roles[0].name = "ROLE_ADMIN"; // Update the role locally
                setUsers(updatedUsers);
                toast.success('User role updated to Admin.');
            })
            .catch(error => {
                toast.error('Error promoting user.');
            });
        } else if (currentRole === "ROLE_ADMIN") {
            axios.patch(`${BASE_URL}/api/admin/demote/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
            .then(response => {
                updatedUsers[userIndex].roles[0].name = "ROLE_USER"; // Update the role locally
                setUsers(updatedUsers);
                toast.success('User role updated to User.');
            })
            .catch(error => {
                toast.error('Error demoting user.');
            });
        }
    };

    const editUser = (id) => {
        const user = users.find(user => user.id === id);
        navigate('/admin/users/edit', { state: { user } });
    }

    const deleteUser = async (id) => {
        setUsers(users.filter(user => user.id !== id));
        try {
            await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
            toast.success('User deleted successfully.');
        } catch (error) {
            toast.error('Error deleting user. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
                <p className="text-gray-600 mt-1">Manage users, promote/demote roles, or delete users.</p>
            </div>
            {isLoading ? (
                <p>Loading users...</p>
            ) : (
                <div className="space-y-6">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                                .filter(user => user.email !== decodeJWT(localStorage.getItem("jwtToken")).email)
                                .map(user => (
                                    <tr key={user.id} className="border-b">
                                        <td className="px-6 py-3">{user.id}</td>
                                        <td className="px-6 py-3">{user.firstName} {user.lastName}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3">{user.roles[0].name.replace('ROLE_', '')}</td>
                                        <td className="px-6 py-3 flex space-x-4">
                                            <button 
                                                onClick={() => editUser(user.id)} 
                                                className="px-4 py-2 text-sm font-semibold shadow rounded-lg text-gray-800 hover:shadow-lg hover:bg-gray-800 hover:text-white transition">
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleRoleUpdate(user)} 
                                                className="px-4 py-2 text-sm font-semibold shadow rounded-lg text-blue-600 hover:shadow-lg hover:bg-blue-600 hover:text-white transition ">
                                                {user.roles[0].name === 'ROLE_USER' ? 'Promote' : 'Demote'}
                                            </button>
                                            <button 
                                                onClick={() => deleteUser(user.id)} 
                                                className="px-4 py-2 text-sm font-semibold shadow rounded-lg text-red-600 hover:shadow-lg hover:bg-red-600 hover:text-white transition">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
