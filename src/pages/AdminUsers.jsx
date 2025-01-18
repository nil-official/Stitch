import React, { useState, useEffect } from 'react'
import decodeJWT from '../utils/decodeJWT'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = "http://localhost:5454/api/admin/users/all";

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (authorities.includes("ROLE_ADMIN")) {
                navigate('/admin/users');
            } else {
                navigate('/Log');
            }
        } else
            navigate('/Log');
    }, [navigate])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })

            if (response.data) {
                console.log(response.data)
                setUsers(response.data);
            } else {
                console.error('Unexpected response format:', response.data)
                toast.error('Error fetching orders. Please try again.')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Error fetching orders. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const editUser = (id) => {
        const user = users.find(user => user.id === id);
        navigate('/admin/users/edit', { state: { user } });
    }

    const deleteUser = async (id) => {
        setUsers(users.filter(user => user.id !== id));
        console.log(id)
        // send delete request to API
        axios.delete(`http://localhost:5454/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        })
            .then(response => {
                console.log(response)
                toast.success('User deleted successfully.')
            })
            .catch(error => {
                console.error('Error deleting user:', error)
                toast.error('Error deleting user. Please try again.')
            })
    }

    const handleRoleUpdate = (user) => {
        const API_URL = "http://localhost:5454/api/admin";
        if (user.roles[0].name === "ROLE_USER") {
            axios.patch(`${API_URL}/promote/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
                .then(response => {
                    console.log(response)
                    toast.success('User role updated successfully.')
                })
                .catch(error => {
                    console.error('Error updating user role:', error)
                    toast.error('Error updating user role. Please try again.')
                })
        }
        if (user.roles[0].name === "ROLE_ADMIN") {
            axios.patch(`${API_URL}/demote/${user.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
                .then(response => {
                    console.log(response)
                    toast.success('User role updated successfully.')
                })
                .catch(error => {
                    console.error('Error updating user role:', error)
                    toast.error('Error updating user role. Please try again.')
                })
        }
    }

    return (
        <>
            <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
                <div className="space-y-12">
                    <div></div>
                    <div className="pb-4">
                        <h2 className="text-4xl font-semibold text-gray-900">All Users</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Edit or delete orders from the buttons</p>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter(user => user.email !== decodeJWT(localStorage.getItem("jwtToken")).email)
                                    .map((user, index) => (
                                        <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.email}</th>
                                            <td className="px-6 py-4">{user.roles[0].name.split('_')[1]}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button onClick={() => editUser(user.id)} className="font-medium text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => deleteUser(user.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                                <button onClick={() => handleRoleUpdate(user)} className="font-medium text-purple-600 hover:underline">
                                                    {user.roles[0].name === "ROLE_USER" ? "Promote" : "Demote"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminUsers