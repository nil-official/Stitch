import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axios from "axios";
import BASE_URL from "../../utils/baseurl";
import PostIssue from "../../components/Help/PostIssue";
import IssueList from "../../components/Help/IssueList";
import { AUTH_ROUTES } from "../../routes/routePaths";

const HelpPage = () => {

    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('post-issue');

    useEffect(() => {
        if (!isAuthenticated) navigate(AUTH_ROUTES.LOGIN);
    }, [isAuthenticated]);

    const addIssue = async (newIssue) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/issues`, newIssue, {
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