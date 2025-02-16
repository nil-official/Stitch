import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import BASE_URL from "../utils/baseurl";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import Address from "../components/Address";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');

  // For validation
  const [errors, setErrors] = useState({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
          });
        console.log(res.data);
        setUserData(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email);
        setMobile(res.data.mobile);
        setDob(res.data.dob);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    if (isEditing) {
      // Validate fields before updating
      const validationErrors = validateFields();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({}); // Clear previous errors if any
      try {
        const formattedDob = dob ? format(new Date(dob), "yyyy-MM-dd") : null;
        const res = await axios.patch(`${BASE_URL}/api/users/update`,
          {
            firstName,
            lastName,
            mobile,
            dob: formattedDob,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
          }
        );
        console.log(res);
        setUserData(res.data);
        setIsEditing(false); // Exit edit mode after saving
        toast.success('Profile updated successfully!');
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    } else {
      setIsEditing(true); // Enter edit mode
    }
  };

  const validateFields = () => {
    const errors = {};
    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(mobile)) {
      errors.mobile = "Mobile number must be 10 digits.";
    }
    return errors;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        Failed to load user data.
      </div>
    );
  }

  // Forgot password
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error while reset password: ", error.response?.data?.error);
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-6 flex justify-center min-h-[60vh]">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md">
        {/* Header Section */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-yellow-400 flex items-center justify-center text-white text-3xl font-semibold">
              {userData.firstName[0]}
              {userData.lastName[0]}
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold">
              {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 p-4">
            <button
              className={`px-4 py-2 text-lg font-semibold ${activeTab === "profile"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 text-lg font-semibold ${activeTab === "addresses"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500"
                }`}
              onClick={() => setActiveTab("addresses")}
            >
              Addresses
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    defaultValue={userData.firstName}
                    readOnly={!isEditing}
                    className={`mt-2 w-full p-3 border ${isEditing ? "border-gray-500" : "border-gray-300"
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    defaultValue={userData.lastName}
                    readOnly={!isEditing}
                    className={`mt-2 w-full p-3 border ${isEditing ? "border-gray-500" : "border-gray-300"
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  readOnly
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  onChange={(e) => setMobile(e.target.value)}
                  defaultValue={userData.mobile}
                  readOnly={!isEditing}
                  className={`mt-2 w-full p-3 border ${isEditing ? "border-gray-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isEditing ? "bg-white" : "bg-gray-100"} ${errors.mobile ? "border-red-500" : ""}`}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  onChange={(e) => setDob(e.target.value)}
                  defaultValue={userData.dob ? format(new Date(userData.dob), "yyyy-MM-dd") : ""}
                  readOnly={!isEditing}
                  className={`mt-2 w-full p-3 border ${isEditing ? "border-gray-500" : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isEditing ? "bg-white" : "bg-gray-100"
                    }`}
                />
              </div>
              <div>
                <label
                  htmlFor="createdAt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Member Since
                </label>
                <input
                  id="createdAt"
                  type="text"
                  defaultValue={formatDate(userData.createdAt)}
                  readOnly
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                />
              </div>

              {/* Edit and Rest buttons */}
              <div className="border-t flex justify-between py-6">
                <div className="">
                  <button
                    onClick={updateProfile}
                    className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>
                <div className="">
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 min-w-40 flex justify-center"
                  >
                    {isResetting ? (
                      <ThreeDots
                        height="24"
                        width="24"
                        color="white"
                        ariaLabel="loading"
                      />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          {activeTab === "addresses" && (
            <div>
              <Address />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
