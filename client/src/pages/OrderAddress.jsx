import React, { useState, useEffect, useContext } from 'react';
import InputField from '../components/Auth/InputField';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import BASE_URL from '../utils/baseurl';
import { ShopContext } from '../context/ShopContext';

const OrderAddress = () => {
    const navigate = useNavigate();
    const { currency, setRerender, rerender, orderData, setOrderData } = useContext(ShopContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [user, setUser] = useState({});
    const [mobile, setMobile] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [addressId, setAddressId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({})
    const [render, setRender] = useState(false);

    const location = useLocation();
    const receivedData = orderData;

    useEffect(() => {
        console.log("received from context: ", orderData);
        if (!orderData) {
            console.log('refresh----------------');
            navigate('/cart');
        } 
        // console.log("received: ", receivedData);
        // location.state = null;
        // console.log("updated received: ", receivedData);
    }, [navigate])

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/api/addresses/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
                });
                if (res.data) {
                    setAddresses(res.data || []);
                    console.log("Fetched addresses:", res.data);
                }
            } catch (err) {
                console.log("Error fetching profile:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, [render]);

    const validateForm = () => {
        const errors = {};

        if (!firstName) errors.firstName = "First Name is required";
        if (!lastName) errors.lastName = "Last Name is required";
        if (!streetAddress) errors.streetAddress = "Street Address is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (!zipCode) errors.zipCode = "Zip Code is required";
        if (!mobile) errors.mobile = "Mobile Number is required";

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const placeOrderWithNewAddress = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const userDetails = { firstName, lastName, streetAddress, city, state, zipCode, user, mobile };
        console.log(userDetails);
        try {
            console.log(userDetails);
            const res = await axios.post(`${BASE_URL}/api/orders/`,
                userDetails,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            )
            if (res) {
                console.log(res.data)
                navigate('/order-summary', { state: res.data });
            }
        } catch (err) {
            console.log("Something went wrong", err);
        }
    };

    const placeOrderWithSavedAddress = async () => {
        try {
            console.log(addressId)
            const res = await axios.post(`${BASE_URL}/api/orders/${addressId}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            )
            if (res) {
                console.log(res)
                navigate('/order-summary', { state: res.data });
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    const deleteAddressHandler = async (id) => {
        try {
            console.log("Deleting address with ID:", id);
            const res = await axios.delete(
                `${BASE_URL}/api/addresses/delete/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );
            if (res.status === 200) {
                console.log("Address deleted successfully:", res.data);
                setRender(!render);
            }
        } catch (error) {
            console.error("Error occurred while deleting the address:", error);
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-[1400px] flex">

                {/* Left section */}
                <div className='w-full sm:w-3/4 p-6'>
                    {/* Previous addresses */}
                    {addresses.length > 0 ? (
                        <div className="w-full p-4 shadow-md rounded-md mb-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h3>
                            <div className="space-y-4 w-full h-full">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`p-4 border rounded-lg transition-all duration-200 ease-in-out ${addressId === address.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={addressId === address.id}
                                                    onChange={() => setAddressId(addressId === address.id ? null : address.id)}
                                                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                                                />
                                                <span className="text-gray-700 text-sm">
                                                    {address.firstName} {address.lastName}, {address.streetAddress}, {address.city}, {address.state} {address.zipCode}
                                                </span>
                                            </label>
                                            <button
                                                onClick={() => deleteAddressHandler(address.id)}
                                                title="Delete Address"
                                                aria-label="Delete Address"
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {addressId ? (
                                <div className="flex justify-center items-center mt-6">
                                    <button
                                        onClick={placeOrderWithSavedAddress}
                                        type="submit"
                                        className="w-fit p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Deliver Here
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : null}

                    {/* Add a new address */}
                    <div className="w-full p-4 shadow-md rounded-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Add a new address</h2>
                        <form onSubmit={placeOrderWithNewAddress}>
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                <InputField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter First Name"
                                    error={errorMessages.firstName}
                                />
                                <InputField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter Last Name"
                                    error={errorMessages.lastName}
                                />
                            </div>

                            <InputField
                                label="Street Address"
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                placeholder="Enter Street Address"
                                error={errorMessages.streetAddress}
                            />

                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                <InputField
                                    label="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter City"
                                    error={errorMessages.city}
                                />

                                <InputField
                                    label="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="Enter State"
                                    error={errorMessages.state}
                                />

                                <InputField
                                    label="Zip Code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder="Enter Zip Code"
                                    error={errorMessages.zipCode}
                                />
                            </div>

                            <InputField
                                label="Mobile Number"
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter Mobile Number"
                                error={errorMessages.mobile}
                            />

                            <div className='flex justify-center items-center mt-6'>
                                <button
                                    type="submit"
                                    className="w-fit p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Save and Deliver Here
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Right section */}
                {receivedData ? (
                    <div className='p-6 w-full sm:w-1/4'>
                        <div className="p-4 shadow-md rounded-md">
                            <h2 className="text-xl font-bold mb-2">Price Details</h2>
                            <hr className='mb-6' />
                            <div className="text-sm text-gray-600 space-y-6">
                                <div className="flex justify-between">
                                    <span>Price ({receivedData.totalItems} items)</span>
                                    <span>{currency}&nbsp;{receivedData.totalPrice}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="text-green-500">-&nbsp;{currency}&nbsp;{receivedData.discount}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <hr className="my-4" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Payable</span>
                                    <span>{currency}&nbsp;{receivedData.totalDiscountedrice}.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : navigate('/cart')}

            </div>
        </div >
    );
};

export default OrderAddress;
