import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import decodeJWT from "../utils/decodeJWT";
import { toast } from "react-toastify";
import axios from "axios";
import InputField2 from "../components/InputField2";

const CreateProduct = () => {
  const navigate = useNavigate();

  // State variables for the form fields
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
    { name: "XXL", quantity: 0 },
    { name: "28", quantity: 0 },
    { name: "30", quantity: 0 },
    { name: "32", quantity: 0 },
    { name: "34", quantity: 0 },
    { name: "36", quantity: 0 },
    { name: "38", quantity: 0 },
    { name: "40", quantity: 0 },
  ]);

  // Function to handle size input fields
  const handleSizeInputChange = (index, field, value) => {
    const newSize = [...size];
    newSize[index][field] = field === "quantity" ? Number(value) : value;
    setSize(newSize);
  };

  // Function to validate form fields
  const validateInputs = () => {
    if (
      !imageUrl ||
      !brand ||
      !title ||
      !color ||
      price === 0 ||
      discountedPrice === 0 ||
      !topLevelCategory ||
      !secondLevelCategory ||
      !thirdLevelCategory
    ) {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

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
      sizes: size.filter((s) => s.quantity > 0),
    };

    try {
      const res = await axios.post(
        "http://localhost:5454/api/admin/products/",
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success("Product created successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Check if the user is an admin
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities;
      if (authorities.includes("ROLE_ADMIN")) {
        navigate("/admin/products/create");
      } else {
        navigate("/Log");
      }
    } else navigate("/Log");
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-12 sm:mx-24 md:mx-40 lg:mx-48 xl:mx-80">
        <div className="space-y-12">
          <div className="pb-4 mt-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Create Product
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fill up the fields below to create a product.
            </p>
          </div>

          {imageUrl && (
            <div className="flex justify-center mb-6">
              <div className="w-60 h-60 shadow-lg rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-6 gap-x-6">
            <div className="sm:col-span-6">
              <InputField2
                label="Image URL"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="sm:col-span-6">
              <InputField2
                label="Description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <InputField2
                label="Brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <InputField2
                label="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Discounted Price"
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Top Level Category"
                type="text"
                value={topLevelCategory}
                onChange={(e) => setTopLevelCategory(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Second Level Category"
                type="text"
                value={secondLevelCategory}
                onChange={(e) => setSecondLevelCategory(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField2
                label="Third Level Category"
                type="text"
                value={thirdLevelCategory}
                onChange={(e) => setThirdLevelCategory(e.target.value)}
              />
            </div>

            <div className="block text-sm font-medium text-gray-900 col-span-full">
              Quantity:
            </div>
            {size.map((s, index) => (
              <div key={index} className="sm:col-span-1">
                <InputField2
                  type="number"
                  value={s.quantity}
                  onChange={(e) =>
                    handleSizeInputChange(index, "quantity", e.target.value)
                  }
                  label={`${s.name}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 mb-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-50 text-sm font-semibold shadow rounded-lg text-black-600 hover:text-black-800 hover:shadow-lg hover:bg-gray-800 hover:text-white transition"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-sm font-semibold shadow rounded-lg text-white hover:shadow-lg hover:bg-gray-600 hover:text-white transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateProduct;
