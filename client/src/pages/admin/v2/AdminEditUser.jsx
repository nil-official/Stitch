import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { PencilLine, ArrowLeft, Save, User, Phone, Calendar } from "lucide-react"
import axios from "axios"
import { toast } from 'react-hot-toast';
import BASE_URL from "../../../utils/baseurl";

const AdminEditUser = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = location.state || {}
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        dob: "",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                mobile: user.mobile || "",
                dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            })
        } else {
            // No user data provided, redirect back to users list
            toast.error("No user data found")
            navigate("/admin/users")
        }
    }, [user, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await axios.patch(`${BASE_URL}/api/admin/users/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            })
            toast.success("User updated successfully")
            navigate("/admin/users")
        } catch (error) {
            console.error("Error updating user:", error)
            toast.error("Error updating user. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <PencilLine className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">Edit User</h1>
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/users")}
                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </button>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="First Name"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Mobile</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                    placeholder="Mobile Number"
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Information Card */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                        <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-500 mr-4">
                                {formData.firstName && formData.lastName ? (
                                    <span className="text-lg font-medium">
                                        {formData.firstName.charAt(0)}
                                        {formData.lastName.charAt(0)}
                                    </span>
                                ) : (
                                    <User className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-slate-300 font-medium">
                                    {formData.firstName} {formData.lastName}
                                </h3>
                                <div className="text-sm text-slate-400 flex flex-wrap gap-x-4">
                                    {formData.mobile && (
                                        <span className="flex items-center">
                                            <Phone className="h-3 w-3 mr-1" /> {formData.mobile}
                                        </span>
                                    )}
                                    {formData.dob && (
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" /> {formData.dob}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700/30">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminEditUser
