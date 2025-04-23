import { createContext, useEffect, useState } from "react"
//import { products } from "../assets/assets"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-hot-toast';
import BASE_URL from "../utils/baseurl";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const [cartItemCount, setCartItemCount] = useState(0)
    const [cartIds, setCartIds] = useState([]);
    const [rerender, setRerender] = useState(0);
    const currency = 'INR';
    const delivery_fee = 10;

    const [orderData, setOrderData] = useState(null);

    const fetchCartData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/cart/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
            if (res) {
                // console.log(res.data)
                const ids = res.data.cartItems.map((item) => item.id);
                setCartItemCount(res.data.cartItems.length);
                setCartIds(ids);
            }
        } catch (err) {
            console.log("Something went wrong", err)
        }
    }

    const addToCart = async (productId, size, quantity) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/cart/add`, { productId, size, quantity }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
            if (res) {
                console.log(res.data);
                toast.success(res.data.message)
                setRerender(!rerender);
            }
        } catch (err) {
            console.log("Something went wrong")
        }
    }

    const value = {
        rerender, setRerender, currency, delivery_fee,
        cartItemCount, fetchCartData, addToCart, cartIds,
        orderData, setOrderData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;