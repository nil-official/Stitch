import React, { useState } from "react";
import PostIssue from "../../components/Help/PostIssue";
import IssueList from "../../components/Help/IssueList";
import BASE_URL from "../../utils/baseurl";
import axios from "axios";
import { toast } from 'react-hot-toast';

const HelpPage = () => {
    const [activeTab, setActiveTab] = useState('post-issue')
    // const [issues, setIssues] = useState([
    //     { id: 1, title: "Late delivery", description: "My order is 3 days late", status: "Open", reply: "We apologize for the delay. Your order will be delivered tomorrow." },
    //     { id: 2, title: "Wrong item received", description: "I received a different product than what I ordered", status: "Closed", reply: "We're sorry for the mix-up. Please return the item using the prepaid label, and we'll send the correct item right away." },
    // ])

    const addIssue = async (newIssue) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/issues/create`, newIssue, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                },
            });
            toast.success('Issue submitted!');
            console.log("Issue submitted successfully:", response.data);
        } catch (error) {
            toast.success('Error submitting issue!');
            console.error("Error submitting issue:", error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <div className="min-h-[70vh] flex justify-center">
            <div className="w-[1400px] p-6">
                <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
                <div className="mb-4">
                    <div className="flex border-b border-gray-300">
                        <button
                            className={`py-2 px-4 ${activeTab === 'post-issue' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('post-issue')}
                        >
                            Post an Issue
                        </button>
                        <button
                            className={`py-2 px-4 ${activeTab === 'view-issues' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('view-issues')}
                        >
                            View Issues
                        </button>
                    </div>
                </div>
                {activeTab === 'post-issue' ? (
                    <PostIssue onSubmit={addIssue} />
                ) : (
                    <IssueList />
                )}
            </div>
        </div>
    )
}

export default HelpPage;