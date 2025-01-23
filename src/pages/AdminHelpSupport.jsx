import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BASE_URL from '../utils/baseurl';
import AdminIssue from '../components/AdminIssue';

const AdminHelpSupport = () => {

	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// get the list of issues
	useEffect(() => {
		const fetchIssues = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/api/admin/issues/`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
					}
				});
				console.log(response.data);
				
				setIssues(response.data);
			} catch (err) {
				console.error('Error fetching issues:', err.response?.data || err.message);
				setError(err.response?.data?.message || 'Failed to fetch issues.');
			} finally {
				setLoading(false);
			}
		};
		fetchIssues();
	}, [])

	// Handle loading state
	if (loading) {
		return <div>Loading issues...</div>;
	}

	// Handle error state
	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="min-h-[70vh] flex justify-center">
			<div className="w-[1400px] p-6">
				<h1 className="text-2xl font-bold mb-6">All Issues</h1>
				<div className="mb-4">
					<div className="flex border-b border-gray-300">

					</div>
				</div>
				<div className="space-y-6">
					{issues.length === 0 ? (
						<div>No issues found.</div>
					) : (
						issues.map((issue) => (
							<AdminIssue issue={issue} key={issue.id} />
						))
					)}
				</div>

			</div>
		</div>
	)
}

export default AdminHelpSupport