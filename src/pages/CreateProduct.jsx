import React from 'react'
import decodeJWT from '../utils/decodeJWT'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import InputField2 from '../components/InputField2';

const CreateProduct = () => {
    const navigate = useNavigate();

    // state variables for the form fields
    const [imageUrl, setImageUrl] = useState("");
    const [brand, setBrand] = useState("");
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [topLevelCategory, setTopLevelCategory] = useState("");
    const [secondLevelCategory, setSecondLevelCategory] = useState("");
    const [thirdLevelCategory, setThirdLevelCategory] = useState("");
    const [size, setSize] = useState([
        { name: "XS", quantity: 0 },
        { name: "S", quantity: 0 },
        { name: "M", quantity: 0 },
        { name: "L", quantity: 0 },
        { name: "XL", quantity: 0 },
        { name: "XXL", quantity: 0 }
    ]);

    // function to handle the size input fields
    const handleSizeInputChange = (index, field, value) => {
        const newSize = [...size];
        newSize[index][field] = field === 'quantity' ? Number(value) : value;
        setSize(newSize);
    }

    // function to validate the form fields
    const validateInputs = () => {
        if (imageUrl === "" || brand === "" || title === "" || color === "" || price === 0 || discountedPrice === 0 || topLevelCategory === "" || secondLevelCategory === "" || thirdLevelCategory === "") {
            toast.error("Please fill all the fields");
            return false;
        }
        return true;
    }

    // function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate the form fields
        if (!validateInputs()) return;
        
        // create the product object
        const product = {
            imageUrl,
            brand,
            title,
            color,
            price,
            discountedPrice,
            description,
            topLevelCategory,
            secondLevelCategory,
            thirdLevelCategory,
            sizes: size.filter(s => s.quantity > 0)
        }

        console.log(product);

        // send the product object to the server
        try {
            const res = await axios.post('http://localhost:5454/api/admin/products/', product, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
            if (res.data.error) {
                console.log(error);
                toast.error(res.data.error);
            } else {
                toast.success("Product created successfully");
                navigate('/admin/products');
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    // check if the user is an admin
    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
            if (authorities.includes("ROLE_ADMIN")) {
                navigate('/admin/products/create');
            } else {
                navigate('/Log');
            }
        } else
            navigate('/Log');
    }, [navigate])

    return (
        <form onSubmit={handleSubmit}>
            <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
                <div className="space-y-12">

                    <div></div>
                    {/* border-b border-gray-900/10 */}
                    <div className="pb-4">
                        <h2 className="text-4xl font-semibold text-gray-900">Product Details</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Fill up the fields below to create a product.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className={`sm:col-span-6`}>
                                <InputField2
                                    label="Image URL"
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    name="image-url"
                                />
                            </div>
                            <div className={`sm:col-span-6`}>
                                <InputField2
                                    label="Description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="image-url"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <InputField2
                                    label="Brand"
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    name="brand"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <InputField2
                                    label="Title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    name="title"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField2
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    name="price"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField2
                                    span={3}
                                    label="Discounted Price"
                                    type="number"
                                    value={discountedPrice}
                                    onChange={(e) => setDiscountedPrice(e.target.value)}
                                    name="discountedPrice"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField2
                                    label="Color"
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    name="color"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField2
                                    label="Top Level Category"
                                    type="text"
                                    value={topLevelCategory}
                                    onChange={(e) => setTopLevelCategory(e.target.value)}
                                    name="topLevelCategory"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField2
                                    span={2}
                                    label="Second Level Category"
                                    type="text"
                                    value={secondLevelCategory}
                                    onChange={(e) => setSecondLevelCategory(e.target.value)}
                                    name="secondLevelCategory"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <InputField2
                                    label="Third Level Category"
                                    type="text"
                                    value={thirdLevelCategory}
                                    onChange={(e) => setThirdLevelCategory(e.target.value)}
                                    name="thirdLevelCategory"
                                />
                            </div>

                            <div className="block text-sm/6 font-medium text-gray-900 col-span-full">
                                Quantity:
                            </div>
                            {size.map((s, index) => (
                                <div key={index} className="sm:col-span-1">
                                    <InputField2
                                        key={index}
                                        type='number'
                                        value={s.quantity}
                                        onChange={(e) => handleSizeInputChange(index, 'quantity', e.target.value)}
                                        name={`quantity-${index}`}
                                        label={`${s.name}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6 mb-4">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CreateProduct