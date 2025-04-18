import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from '../components/Loader';
import ErrorPage from '../pages/ErrorPage';
import { getCart } from '../redux/customer/cart/action';
import { getAddress } from '../redux/customer/address/action';

import InputField from '../components/Auth/InputField';
import axios from 'axios';
import BASE_URL from '../utils/baseurl';
import { ShopContext } from '../context/ShopContext';

const OrderAddress = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currency, setCurrency] = useState('INR');
    const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
    const { address, loading: addressLoading, error: addressError } = useSelector((state) => state.address);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: ''
    });

    useEffect(() => {
        dispatch(getCart());
        dispatch(getAddress());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const { setRerender, rerender, orderData, setOrderData } = useContext(ShopContext);
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [streetAddress, setStreetAddress] = useState('');
    // const [state, setState] = useState('');
    // const [city, setCity] = useState('');
    // const [zipCode, setZipCode] = useState('');
    // const [user, setUser] = useState({});
    // const [mobile, setMobile] = useState('');
    // const [selectedAddress, setSelectedAddress] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    // const [errorMessages, setErrorMessages] = useState({});
    // const [orderDetails, setOrderDetails] = useState({})
    const [addressId, setAddressId] = useState(null);
    const [render, setRender] = useState(false);

    // const [addresses, setAddresses] = useState([]);
    // const location = useLocation();
    // const receivedData = orderData;

    // useEffect(() => {
    //     console.log("received from context: ", orderData);
    //     if (!orderData) {
    //         console.log('refresh----------------');
    //         navigate('/user/cart');
    //     } 
    // console.log("received: ", receivedData);
    // location.state = null;
    // console.log("updated received: ", receivedData);
    // }, [navigate])



    // useEffect(() => {
    //     const fetchAddresses = async () => {
    //         setIsLoading(true);
    //         try {
    //             const res = await axios.get(`${BASE_URL}/api/user/address`, {
    //                 headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
    //             });
    //             if (res.data) {
    //                 setAddresses(res.data || []);
    //                 // console.log("Fetched addresses:", res.data);
    //             }
    //         } catch (err) {
    //             console.log("Error fetching profile:", err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchAddresses();
    // }, [render]);

    // const validateForm = () => {
    //     const errors = {};

    //     if (!firstName) errors.firstName = "First Name is required";
    //     if (!lastName) errors.lastName = "Last Name is required";
    //     if (!streetAddress) errors.streetAddress = "Street Address is required";
    //     if (!city) errors.city = "City is required";
    //     if (!state) errors.state = "State is required";
    //     if (!zipCode) errors.zipCode = "Zip Code is required";
    //     if (!mobile) errors.mobile = "Mobile Number is required";

    //     setErrorMessages(errors);
    //     return Object.keys(errors).length === 0;
    // };

    const placeOrderWithNewAddress = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const userDetails = { firstName, lastName, streetAddress, city, state, zipCode, user, mobile };
        console.log(userDetails);
        try {
            const res = await axios.post(`${BASE_URL}/api/orders/`,
                userDetails,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            )
            if (res) {
                console.log(res.data)
                navigate('/checkout/pay', { state: res.data });
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
                navigate('/checkout/pay', { state: res.data });
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

    // if (isLoading) {
    //     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    // }

    return (
        <div className="min-h-screen flex justify-center">
            <div className="w-[1400px] flex">

                {/* Left section */}
                <div className='w-full sm:w-3/4 p-6'>
                    {/* Previous addresses */}
                    {addressError ? (
                        <ErrorPage code={400} title='An Error Occurred!' description={addressError} />
                    ) : addressLoading ? (
                        <Loader />
                    ) : address && address.length > 0 && (
                        <div className="w-full p-4 shadow-md rounded-md mb-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h3>
                            <div className="space-y-4 w-full h-full">
                                {address.map((address) => (
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
                    )}

                    {/* Add a new address */}
                    <div className="w-full p-4 shadow-md rounded-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Add a new address</h2>
                        <form onSubmit={placeOrderWithNewAddress}>
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                <InputField
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter First Name"
                                    required
                                />
                                <InputField
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Last Name"
                                    required
                                />
                            </div>

                            <InputField
                                label="Street Address"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder="Enter Street Address"
                                required
                            />

                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                <InputField
                                    label="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter City"
                                    required
                                />

                                <InputField
                                    label="State"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter State"
                                    required
                                />

                                <InputField
                                    label="Zip Code"
                                    value={formData.zipCode}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    placeholder="Enter Zip Code"
                                    required
                                />
                            </div>

                            <InputField
                                label="Mobile Number"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value)) {
                                        handleInputChange(e);
                                    }
                                }}
                                placeholder="Enter Mobile Number"
                                required
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
                {cartError ? (
                    <ErrorPage code={400} title='An Error Occurred!' description={cartError} />
                ) : cartLoading ? (
                    <Loader />
                ) : cart && (
                    <div className='p-6 w-full sm:w-1/4'>
                        <div className="p-4 shadow-md rounded-md">
                            <h2 className="text-xl font-bold mb-2">Price Details</h2>
                            <hr className='mb-6' />
                            <div className="text-sm text-gray-600 space-y-6">
                                <div className="flex justify-between">
                                    <span>Price ({cart.totalItem} items)</span>
                                    <span>{currency}&nbsp;{cart.totalPrice}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="text-green-500">-&nbsp;{currency}&nbsp;{cart.discount}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <hr className="my-4" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Payable</span>
                                    <span>{currency}&nbsp;{cart.totalDiscountedPrice}.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default OrderAddress;
