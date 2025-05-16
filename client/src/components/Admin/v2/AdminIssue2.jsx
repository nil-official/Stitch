import { useState } from "react"
import axios from "axios"
import { MessageCircle, User, Hash, X, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import BASE_URL from "../../../utils/baseurl"

const AdminIssue2 = ({ issue, onUpdate }) => {
    const [reply, setReply] = useState(issue.reply || "")
    const [status, setStatus] = useState(issue.status)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    const toggleStatus = () => {
        const newStatus = status === "OPEN" ? "HOLD" : status === "HOLD" ? "CLOSED" : "OPEN"
        setStatus(newStatus)
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)

        try {
            const response = await axios.post(
                `${BASE_URL}/api/admin/issues/respond/${issue.id}`,
                { reply, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                },
            )

            // Create updated issue object
            const updatedIssue = {
                ...issue,
                reply,
                status,
            }

            // Call the onUpdate callback with the updated issue
            if (onUpdate) {
                onUpdate(updatedIssue)
            }

            setIsModalOpen(false)
        } catch (err) {
            console.error("Error saving issue:", err.response?.data || err.message)
            setError(err.response?.data?.message || "Failed to save changes.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-slate-900/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-700/70 transition-all duration-200 overflow-hidden relative group">
            <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-200 mb-1">{issue.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                            <span className="flex items-center">
                                <Hash className="h-3.5 w-3.5 mr-1" /> {issue.referenceNumber}
                            </span>
                            <span className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1" /> User ID: {issue.userId}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status === "CLOSED"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : status === "HOLD"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                        >
                            {status}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                                <User className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-300 whitespace-pre-line">{issue.description}</p>
                            </div>
                        </div>
                    </div>

                    {issue.reply && (
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-cyan-900/30">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-300 flex-shrink-0">
                                    <MessageCircle className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <p className="text-xs font-medium text-cyan-400 mb-1">Admin Reply</p>
                                    </div>
                                    <p className="text-sm text-slate-300 whitespace-pre-line">{issue.reply}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700 transition-colors border border-cyan-500/30 flex items-center"
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {issue.reply ? "Edit Reply" : "Reply"}
                    </button>
                </div>
            </div>

            {/* Cyan accent line on hover - only visible on desktop */}
            <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl border border-slate-700 relative">
                        <div className="p-6">
                            <button
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="text-xl font-bold text-slate-200 mb-4 pr-6">
                                {issue.reply ? "Edit Reply" : "Reply to Issue"}
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                                    <h3 className="text-lg font-medium text-slate-200 mb-2">{issue.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
                                        <span className="flex items-center">
                                            <Hash className="h-3.5 w-3.5 mr-1" /> {issue.referenceNumber}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="h-3.5 w-3.5 mr-1" /> User ID: {issue.userId}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 whitespace-pre-line">{issue.description}</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-slate-300">Status</label>
                                        <button
                                            type="button"
                                            onClick={toggleStatus}
                                            className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${status === "CLOSED"
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : status === "HOLD"
                                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                }`}
                                        >
                                            <RefreshCw className="h-3 w-3 mr-1" />
                                            {status}
                                        </button>
                                    </div>

                                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Reply</label>
                                    <textarea
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-300 min-h-[120px]"
                                        placeholder="Type your reply here..."
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors flex items-center justify-center min-w-[100px]"
                                    disabled={isSaving || reply.trim() === ""}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Reply"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminIssue2
