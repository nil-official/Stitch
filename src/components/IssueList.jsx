import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BASE_URL from '../utils/baseurl';

export default function IssueList() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch issues on component mount
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/issues/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });
                setIssues(response.data);
            } catch (err) {
                console.error('Error fetching issues:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to fetch issues.');
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    // Handle loading state
    if (loading) {
        return <div>Loading issues...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {issues.length === 0 ? (
                <div>No issues found.</div>
            ) : (
                issues.map((issue) => (
                    <div key={issue.id} className="bg-white border border-gray-300 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{issue.title}</h3>
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'CLOSED'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {issue.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Reference No: {issue.referenceNumber}</p>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-1">Description:</h4>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                            </div>
                            {issue.reply && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Admin Reply:</h4>
                                    <p className="text-sm text-gray-600">{issue.reply}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
