import { useEffect, useState } from "react";
import axios from "axios";
import { X, Check, ChevronRight, Search, Filter, ShoppingBag } from "lucide-react";

function ProductRecommendList({ userId }) {
    const [products, setProducts] = useState([{
        "product_id": 7905472381090,
        "title": "Doric Red Shirt",
        "brand": "LOUIS PHILIPPE",
        "description": "Maintain a timeless look as you transition between smart and casual in timeless style with snitch's new season collection of men's shirts. No matter what your style is, you need this half sleeve SlimFit shirt in your wardrobe. It is made from 100% rayon and features a roomy cut for a casual style.",
        "color": "Red",
        "price": 1099,
        "discountedPrice": 899,
        "sizes": [
            {
                "name": "M",
                "quantity": 0
            },
            {
                "name": "L",
                "quantity": 68
            },
            {
                "name": "S",
                "quantity": 14
            },
            {
                "name": "XL",
                "quantity": 91
            },
            {
                "name": "XS",
                "quantity": 0
            },
            {
                "name": "XXL",
                "quantity": 32
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1953.jpg?v=1682497115",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1953.jpg?v=1682497115",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1962.jpg?v=1682497115",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1922.jpg?v=1682497115",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1902.jpg?v=1682497115",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Augusto_23rdFeb1906.jpg?v=1682497115",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/chemical-free-tag-final_eba3506b-8e73-42fe-8a61-f910b31643b7.webp?v=1682497115"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8595182157986,
        "title": "Dark Blue Checks Regular Fit Shirt",
        "brand": "SNITCH",
        "description": "Give a majestic lift to your look with this dark blue checks pattern shirt. The shirt is crafted from fine 40% polyester, 60% cotton. It is a versatile staple and great for teaming with jeans for a more casual look or smartening up with a classic pair of chinos.",
        "color": "Dark Blue",
        "price": 1499,
        "discountedPrice": 1199,
        "sizes": [
            {
                "name": "XXL",
                "quantity": 0
            },
            {
                "name": "S",
                "quantity": 0
            },
            {
                "name": "L",
                "quantity": 0
            },
            {
                "name": "XL",
                "quantity": 70
            },
            {
                "name": "M",
                "quantity": 0
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_1_632841d3-a37e-47c0-a89a-74b5bccdf1e6.jpg?v=1739862181",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_1_632841d3-a37e-47c0-a89a-74b5bccdf1e6.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_2_c84852eb-abd9-4952-886f-04f5cd4342c7.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_3_d9cfba9a-6522-4019-869a-0f3979200db1.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_4_97c0a04f-1d81-4e7f-b912-b0a4f4888ae8.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_5_a9c9945b-3ad7-4efa-99ca-247a145d735f.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_6_3b481a89-494c-40a5-bd60-3338aadc5b59.jpg?v=1739862181",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_7_58cbbad3-1ca4-405d-b2c2-2da7da8bcb6a.jpg?v=1739862182",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_8_26f73c5a-0bb5-4e8b-a372-df81855baa2f.jpg?v=1739862182",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-06_9_87e55e73-1438-4f44-96d8-3e6fe6cdf7d9.jpg?v=1739862182"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8477180657826,
        "title": "Blue Slim Fit Stripes Shirt",
        "brand": "WRANGLER",
        "description": "Give a majestic lift to your look with this blue stripes pattern shirt. The shirt is crafted from fine 100% cotton. It is a versatile staple and great for teaming with jeans for a more casual look or smartening up with a classic pair of chinos..",
        "color": "Blue",
        "price": 1299,
        "discountedPrice": 1169,
        "sizes": [
            {
                "name": "XS",
                "quantity": 42
            },
            {
                "name": "XL",
                "quantity": 40
            },
            {
                "name": "S",
                "quantity": 0
            },
            {
                "name": "XXL",
                "quantity": 32
            },
            {
                "name": "L",
                "quantity": 52
            },
            {
                "name": "M",
                "quantity": 89
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e58912bb42aca8d93cd115cc2e46ba3b.webp?v=1725080640",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e58912bb42aca8d93cd115cc2e46ba3b.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/be70b2ac0627e56d70280c57eed8eff0.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/6d45c1ac47ea27a75cab590faa9befad.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/086080aae31516d5970bba86b4532e43.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/bae5435dd680769dabefb23bd0b40474.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/7422dd07006be9698989ff57d203f3d6.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/0a33a869081e67cb5b32281acbd779f8.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/846341b4e08b295413956fb3cce415a6.webp?v=1725080640",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/422ac85718db8a15ba114a9273f95fdb.webp?v=1725080640"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8619999821986,
        "title": "Olive Geometric Box Fit Shirt",
        "brand": "SNITCH",
        "description": "Maintain a timeless look as you transition between smart and casual in timeless style with snitch's new season collection of men's shirts. No matter what your style is, you need this half sleeve box fit shirt in your wardrobe. It is made from 55% polyester 45% cotton and features a roomy cut for a casual style.",
        "color": "Olive",
        "price": 1699,
        "discountedPrice": 1399,
        "sizes": [
            {
                "name": "XXL",
                "quantity": 0
            },
            {
                "name": "XL",
                "quantity": 63
            },
            {
                "name": "L",
                "quantity": 0
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_1_4471ed76-668e-490b-bba2-0d4ccf9d3a29.jpg?v=1742393362",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_1_4471ed76-668e-490b-bba2-0d4ccf9d3a29.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_2_5041e5fe-7af5-4455-aa27-0d12342a2d9d.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_3_d49aa3a1-4b6d-438c-8466-a4b5000183b8.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_4_ec56062c-d05e-4ee9-b1e4-a9caca476ce3.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_5_92cd7cf7-f4f2-4969-b037-e1b8878ed159.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_6_a959d03c-e812-415a-b7c1-7c3ace68bf2d.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_7_e903038f-f954-42f3-9e70-5d60c2e2b66d.jpg?v=1742393362",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3198-02_8_7737e8bd-e4c5-43ab-a50d-50ea3b1fdab1.jpg?v=1742393362"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8619999920290,
        "title": "Black Textured Slim Fit Shirt",
        "brand": "WRANGLER",
        "description": "Maintain a timeless look as you transition between smart and casual in timeless style with snitch's new season collection of men's shirts. No matter what your style is, you need this full sleeve slim fit shirt in your wardrobe. It is made from 97% polyester, 3% spandex and features a roomy cut for a casual style.",
        "color": "Black",
        "price": 1399,
        "discountedPrice": 999,
        "sizes": [
            {
                "name": "XS",
                "quantity": 0
            },
            {
                "name": "S",
                "quantity": 0
            },
            {
                "name": "M",
                "quantity": 0
            },
            {
                "name": "XL",
                "quantity": 0
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_1_3159b917-745d-4e07-bbbf-749576b1e8c1.jpg?v=1742393378",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_1_3159b917-745d-4e07-bbbf-749576b1e8c1.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_2_78f188c9-5141-41fc-9cc8-dd2d2723fb57.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_3_32f6f0f0-77eb-45e7-8119-5a38e3e85442.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_4_3ec10189-1cc9-4046-a170-857f13e5b917.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_5_d95418cf-8e1e-4628-8bd3-92f2e4fc1c9b.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_6_172c58ce-f588-40e8-884c-3f3a89fd3f4c.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_7_72417df5-9669-49ae-b4a0-260b7e62424d.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_8_d7054922-d42c-4b3e-9532-b24326784454.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_9_dfa1a79b-79c1-4983-b61a-032055c6823c.jpg?v=1742393378",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3901-04_10_33848ccc-122d-4e5c-970c-6a09da6ca427.jpg?v=1742393378"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8620001231010,
        "title": "Light Grey Slim Fit Linen Blend Shirt",
        "brand": "PEPE JEANS",
        "description": "Give your everyday wardrobe an effortless appeal with this classy light grey 70% cotton 30% linen shirt. Designed in a slim fit, this shirt is known for its endless versatility. A look that bridges dressy and casual, with full sleeve and button down, it is perfect to wear alone or as an outer layer.",
        "color": "Light Grey",
        "price": 1499,
        "discountedPrice": 1299,
        "sizes": [
            {
                "name": "XL",
                "quantity": 4
            },
            {
                "name": "L",
                "quantity": 67
            },
            {
                "name": "M",
                "quantity": 10
            },
            {
                "name": "XXL",
                "quantity": 54
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_1_fe89c552-c61e-44b3-ab0b-6af4bd3d5bff.jpg?v=1742393514",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_1_fe89c552-c61e-44b3-ab0b-6af4bd3d5bff.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_2_8094931b-a939-436e-8494-408122eb3c0d.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_3_de3d2d41-fd32-43c8-9b3e-75dd4e6cd8f2.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_4_d6937d6f-d325-4513-a8f5-96c5a6947d8f.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_5_2262c1e3-ed26-45b3-bff0-3c0ebbe810a1.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_6_2138f147-f34f-48e6-97ee-c5369b751a24.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_7_2ce51f0f-3aba-4a16-a3f3-315821bbf446.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_8_2d77b014-265e-4d43-b58a-672a6da5756a.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_9_0af2b0ac-47bb-4738-834f-d87c63f7a025.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_10_dd509a9f-24e4-4107-95d5-5c107e18d1c2.jpg?v=1742393514",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-03_11_f9bb267a-0c02-424f-ab09-811df38b06dc.jpg?v=1742393514"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    },
    {
        "product_id": 8620001362082,
        "title": "Orange Slim Fit Linen Blend Shirt",
        "brand": "WRANGLER",
        "description": "Give a majestic lift to your look with this orange plain pattern shirt. The shirt is crafted from fine 70% cotton 30% linen. It is a versatile staple and great for teaming with jeans for a more casual look or smartening up with a classic pair of chinos.",
        "color": "Orange",
        "price": 1599,
        "discountedPrice": 1299,
        "sizes": [
            {
                "name": "M",
                "quantity": 65
            },
            {
                "name": "S",
                "quantity": 61
            },
            {
                "name": "XXL",
                "quantity": 0
            },
            {
                "name": "L",
                "quantity": 15
            },
            {
                "name": "XL",
                "quantity": 15
            }
        ],
        "preview": "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_1_d226e7c8-159c-4cf9-a632-03d8ceef1a95.jpg?v=1742393529",
        "images": [
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_1_d226e7c8-159c-4cf9-a632-03d8ceef1a95.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_2_11345201-d339-4683-87d9-584a95145cc6.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_3_125a959f-7ff1-4fa7-be52-7c228478b0f7.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_4_0eba72f0-6f61-4cf7-9acb-4727fa26519a.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_5_ffbfa2be-bab7-4ed7-ac82-288acf9d7216.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_6_765c1a97-43fd-46a0-b063-4ba9b92e7aed.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_7_96466bb4-06ed-4f5f-aefd-483d307e2a23.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_8_4e2f24f7-c976-46a8-9061-ae16b913a1f8.jpg?v=1742393529",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_9_1d3a8827-37f7-427c-88e8-934489af1999.jpg?v=1742393530",
            "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3976-05_10_e40f778a-0f07-4325-b66c-1f11d2b0e64d.jpg?v=1742393530"
        ],
        "topLevelCategory": "Men",
        "secondLevelCategory": "Clothing",
        "thirdLevelCategory": "Shirt"
    }]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios
            .get("/api/products")
            .then((res) => {
                setProducts(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch products:", err);
                setIsLoading(false);
            });
    }, []);

    const toggleSelect = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const handleRecommend = () => {
        axios
            .post(`/api/recommend/${userId}`, { productIds: selectedProducts })
            .then(() => {
                alert("Products recommended successfully!");
                setShowModal(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Recommendation failed.");
            });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getCategoryPath = (category) => {
        if (!category) return "";
        const path = [];
        let current = category;

        while (current) {
            path.unshift(current.name);
            current = current.parentCategory || null;
        }

        return path.join(" > ");
    };

    const getTotalStock = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            return product.sizes.reduce((total, size) => total + size.quantity, 0);
        }
        return product.quantity || 0;
    };

    const renderProduct = (product) => {
        const totalStock = getTotalStock(product);
        const discountPercentage = product.discountPercent || 0;
        const categoryPath = getCategoryPath(product.category);

        return (
            <div
                key={product.id}
                className="bg-slate-800/60 border border-slate-700/40 rounded-lg mb-3 overflow-hidden hover:border-slate-600/60 transition-colors"
            >
                {/* Mobile View */}
                <div className="md:hidden p-3 space-y-2 gap-3">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-slate-800 mr-3">
                            <img
                                src={product.preview || "/placeholder.svg?height=48&width=48"}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg?height=48&width=48";
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                            <p className="text-xs text-slate-400">{product.brand}</p>
                        </div>
                        <div className="ml-2">
                            <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${selectedProducts.includes(product.id)
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    }`}
                                onClick={() => toggleSelect(product.id)}
                            >
                                {selectedProducts.includes(product.id) && <Check className="h-3.5 w-3.5" />}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-slate-400">Price: </span>
                            <span className="text-slate-300 font-medium">{formatPrice(product.discountedPrice)}</span>
                            {discountPercentage > 0 && (
                                <span className="ml-1 text-green-400">(-{discountPercentage}%)</span>
                            )}
                        </div>
                        <div>
                            <span className="text-slate-400">Stock: </span>
                            <span
                                className={`font-medium ${totalStock > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                                {totalStock > 0 ? `${totalStock} units` : "Out of stock"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-10 gap-2 items-center p-3">
                    <div className="col-span-1 flex justify-center">
                        <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer ${selectedProducts.includes(product.id)
                                ? "bg-green-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                            onClick={() => toggleSelect(product.id)}
                        >
                            {selectedProducts.includes(product.id) && <Check className="h-3.5 w-3.5" />}
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-800">
                            <img
                                src={product.preview || "/placeholder.svg?height=40&width=40"}
                                alt={product.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg?height=40&width=40";
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-span-2 min-w-0">
                        <h3 className="text-sm font-medium text-slate-200 truncate">{product.title}</h3>
                        <p className="text-xs text-slate-400">{product.brand}</p>
                    </div>

                    <div className="col-span-2 text-xs text-slate-400 truncate">{categoryPath}</div>

                    <div className="col-span-1 text-sm font-medium text-slate-300">
                        {formatPrice(product.discountedPrice)}
                    </div>

                    <div className="col-span-1">
                        {discountPercentage > 0 ? (
                            <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                {discountPercentage}% off
                            </span>
                        ) : (
                            <span className="text-xs text-slate-500">No discount</span>
                        )}
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center">
                            <div
                                className={`h-2 w-2 rounded-full mr-2 ${totalStock > 10
                                    ? "bg-green-400"
                                    : totalStock > 0
                                        ? "bg-yellow-400"
                                        : "bg-red-400"
                                    }`}
                            ></div>
                            <span className="text-sm font-medium text-slate-300">
                                {totalStock > 0 ? `${totalStock} units` : "Out of stock"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-1/2 h-full p-6 bg-slate-900 rounded-lg shadow-lg border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-slate-200 font-semibold">Recommend Products</h3>
                {selectedProducts.length > 0 && (
                    <button
                        onClick={handleRecommend}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                        Recommend {selectedProducts.length}{" "}
                        {selectedProducts.length === 1 ? "Product" : "Products"}
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-10 text-slate-400">No products available to recommend</div>
            ) : (
                <>
                    <div className="space-y-2">{products.slice(0, 6).map(renderProduct)}</div>

                    {products.length > 6 && (
                        <button
                            className="mt-6 w-full px-4 py-3 text-sm font-medium rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700/30 transition-colors flex items-center justify-center"
                            onClick={() => setShowModal(true)}
                        >
                            See More Products
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                    )}
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-slate-800 p-6 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <ShoppingBag className="h-5 w-5 text-green-400" />
                                    <h4 className="text-slate-200 font-bold text-xl">Select Products to Recommend</h4>
                                </div>
                                <button
                                    className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-full"
                                    onClick={() => setShowModal(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                                />
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    <Filter className="h-3 w-3 mr-1" />
                                    All Categories
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    In Stock
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer">
                                    With Discount
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">{products.map(renderProduct)}</div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-800 p-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer ${selectedProducts.length > 0
                                        ? "bg-green-500 text-white"
                                        : "bg-slate-700 text-slate-300"
                                        }`}
                                >
                                    {selectedProducts.length > 0 && <Check className="h-4 w-4" />}
                                </div>
                                <div className="text-sm text-slate-300">
                                    <span className="font-medium">{selectedProducts.length}</span> of{" "}
                                    <span className="font-medium">{products.length}</span> products selected
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    className="px-4 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-6 py-2 font-semibold rounded-md ${selectedProducts.length > 0
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                                        } transition-colors`}
                                    onClick={handleRecommend}
                                    disabled={selectedProducts.length === 0}
                                >
                                    Recommend Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRecommendList;