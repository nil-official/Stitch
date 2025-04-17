import axios from 'axios';
import React, { useState } from 'react';
import BASE_URL from '../../utils/baseurl';

const AdminIssue = ({ issue }) => {
	const [reply, setReply] = useState(issue.reply || '');
	const [status, setStatus] = useState(issue.status);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);

	const toggleStatus = () => {
		const newStatus = status === 'OPEN' ? 'HOLD' : status === 'HOLD' ? 'CLOSED' : 'OPEN';
		setStatus(newStatus);
	};

	const handleSave = async () => {
		setIsSaving(true);
		setError(null);

		try {
			const response = await axios.post(
				`${BASE_URL}/api/admin/issues/respond/${issue.id}`,
				{ reply, status },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
					},
				}
			);
			// Update local state
			issue.reply = reply;
			issue.status = status;
			setIsModalOpen(false);
		} catch (err) {
			console.error('Error saving issue:', err.response?.data || err.message);
			setError(err.response?.data?.message || 'Failed to save changes.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div key={issue.id} className="bg-white border border-gray-300 rounded-lg p-6">
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">{issue.title}</h3>
				<span
					className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'CLOSED'
						? 'bg-green-100 text-green-800'
						: issue.status === 'HOLD'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-red-100 text-red-800'
						}`}
				>
					{issue.status}
				</span>
			</div>
			<p className="text-sm text-gray-500 mb-2">Reference No: {issue.referenceNumber}</p>
			<p className="text-sm text-gray-500 mb-2">User ID: {issue.userId}</p>
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
			<div className="flex justify-end mt-4">
				<button
					className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-semibold"
					onClick={() => setIsModalOpen(true)}
				>
					Reply
				</button>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[600px] p-6 relative">
						<button
							className="absolute top-4 right-4 text-gray-800 hover:text-gray-900 text-2xl font-bold"
							onClick={() => setIsModalOpen(false)}
						>
							&times;
						</button>
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-bold">Reply: {issue.title}</h2>

						</div>
						<p className="text-sm text-gray-600 mb-4">
							<strong>Description:</strong> {issue.description}
						</p>
						<p className="text-sm text-gray-600 mb-2">
							Reference No: {issue.referenceNumber}
						</p>
						<p className="text-sm text-gray-600 mb-2">
							User ID: {issue.userId}
						</p>
						<p className="text-sm text-gray-600 mb-2">
							Status: <button
								className={`px-2 py-1 text-xs font-semibold rounded-full ${status === 'CLOSED'
									? 'bg-green-100 text-green-800'
									: status === 'HOLD'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-red-100 text-red-800'
									}`}
								onClick={toggleStatus}
							>
								{status}
							</button>
							<span className='text-gray-400 italic ml-2'>{'(click to change)'}</span>
						</p>


						<textarea
							className="w-full border border-gray-300 rounded-lg p-2 mb-4"
							rows="4"
							placeholder="Type your reply here..."
							value={reply}
							onChange={(e) => setReply(e.target.value)}
						/>

						{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

						<div className="flex justify-end">
							<button
								className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-semibold disabled:opacity-50"
								onClick={handleSave}
								disabled={isSaving || reply.trim() === ''}
							>
								{isSaving ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminIssue;
