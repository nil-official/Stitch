import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, AlertCircle, MessageSquare } from "lucide-react"
import AdminIssue2 from "../../../components/Admin/v2/AdminIssue2"
import BASE_URL from "../../../utils/baseurl"

const AdminHelpAndSupport = () => {
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState("ALL")

    // Get the list of issues
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/issues/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                })

                setIssues(response.data)

            } catch (err) {
                console.error("Error fetching issues:", err.response?.data || err.message)
                setError(err.response?.data?.message || "Failed to fetch issues.")
            } finally {
                setLoading(false)
            }
        }
        fetchIssues()
    }, [])

    // Filter issues based on status
    const filteredIssues = activeFilter === "ALL" ? issues : issues.filter((issue) => issue.status === activeFilter)

    // Count issues by status
    const openCount = issues.filter((issue) => issue.status === "OPEN").length
    const holdCount = issues.filter((issue) => issue.status === "HOLD").length
    const closedCount = issues.filter((issue) => issue.status === "CLOSED").length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <MessageSquare className="mr-2 h-6 w-6 text-cyan-500" />
                <h1 className="text-2xl font-bold">Help & Support</h1>
                <div className="ml-auto flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></span>
                        {issues.length} ISSUES
                    </span>
                </div>
            </div>

            {/* Status Filters */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveFilter("ALL")}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "ALL"
                            ? "bg-slate-900 text-cyan-400 border border-cyan-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        All Issues ({issues.length})
                    </button>
                    <button
                        onClick={() => setActiveFilter("OPEN")}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "OPEN"
                            ? "bg-slate-900 text-red-400 border border-red-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        Open ({openCount})
                    </button>
                    <button
                        onClick={() => setActiveFilter("HOLD")}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "HOLD"
                            ? "bg-slate-900 text-amber-400 border border-amber-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        On Hold ({holdCount})
                    </button>
                    <button
                        onClick={() => setActiveFilter("CLOSED")}
                        className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "CLOSED"
                            ? "bg-slate-900 text-green-400 border border-green-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        Closed ({closedCount})
                    </button>
                </div>
            </div>

            {/* Issues List */}
            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-4" />
                        <p className="text-slate-400">Loading issues...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-400">
                        <AlertCircle className="h-10 w-10 mb-4" />
                        <p>{error}</p>
                    </div>
                ) : filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <MessageSquare className="h-16 w-16 text-slate-600 mb-4" />
                        <p className="text-lg font-medium">No issues found</p>
                        <p className="text-sm mt-1">
                            {activeFilter === "ALL"
                                ? "There are no support issues in the system."
                                : `There are no ${activeFilter.toLowerCase()} issues.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredIssues.map((issue) => (
                            <AdminIssue2
                                key={issue.id}
                                issue={issue}
                                onUpdate={(updatedIssue) => {
                                    setIssues(issues.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)))
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminHelpAndSupport
