import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Search,
    Loader2,
    Edit2,
    UserCheck,
    UserX,
    Trash2,
} from "lucide-react"
import decodeJWT from '../../../utils/decodeJWT';
import BASE_URL from '../../../utils/baseurl';

const AdminViewAllUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const API_URL = `${BASE_URL}/api/admin/users/all`;

    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(10)

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

    const filteredUsers = users.filter(
        (user) =>
            user.email !== decodeJWT(localStorage.getItem("jwtToken")).email &&
            (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    // Paginate users
    const paginatedUsers = filteredUsers.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)

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

    const navigateToUserDetails = (id) => {
        const user = users.find(user => user.id === id);
        navigate(`/admin/usersDetails`, { state: { user } });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Activity className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="ml-auto flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></span>
                        {filteredUsers.length} USERS
                    </span>
                    <button
                        onClick={() => navigate("/admin/users/create")}
                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-cyan-400 hover:bg-slate-700 border border-cyan-500/30"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300 placeholder:text-slate-500"
                        />
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                        <span>
                            Showing {paginatedUsers.length} of {filteredUsers.length} users
                        </span>
                        <span className="mx-2">|</span>
                        <span>Page {pageNumber + 1}</span>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                        <span className="ml-2 text-slate-400">Loading users...</span>
                    </div>
                ) : paginatedUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs font-medium text-slate-400 border-b border-slate-700/50">
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => navigateToUserDetails(user.id)}>
                                        <td className="px-4 py-3 text-sm text-slate-300">{user.id}</td>
                                        <td className="px-4 py-3 text-sm text-slate-300">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-300">{user.email}</td>
                                        <td className="px-2 py-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.roles[0].name === "ROLE_ADMIN"
                                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                                    : "bg-slate-700/50 text-slate-300 border border-slate-600/30"
                                                    }`}
                                            >
                                                {user.roles[0].name.replace("ROLE_", "")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editUser(user.id)
                                                    }}
                                                    className="p-1.5 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRoleUpdate(user)
                                                    }}
                                                    className={`p-2 rounded-md transition-colors min-w-20 ${user.roles[0].name === "ROLE_USER"
                                                        ? "bg-slate-600 text-slate-100 hover:bg-cyan-600 hover:text-cyan-100"
                                                        : "bg-slate-600 text-slate-100 hover:bg-amber-600 hover:text-amber-100"
                                                        }`}
                                                    title={user.roles[0].name === "ROLE_USER" ? "Promote to Admin" : "Demote to User"}
                                                >
                                                    <div className="flex items-center justify-center space-x-1">
                                                        {user.roles[0].name === "ROLE_USER" ? (
                                                            <>
                                                                <UserCheck className="h-5 w-5" />
                                                                <span className="hidden sm:inline text-sm">User</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="h-5 w-5" />
                                                                <span className="hidden sm:inline text-sm">Admin</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteUser(user.id)
                                                    }}
                                                    className="p-1.5 rounded-md bg-slate-700/50 text-slate-300 hover:bg-red-700/50 hover:text-red-400 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-slate-600 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > pageSize && (
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevPage}
                        disabled={pageNumber === 0}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={(pageNumber + 1) * pageSize >= filteredUsers.length}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
};

export default AdminViewAllUsers;
