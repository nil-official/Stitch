import React, { useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import UserProfileCard from "../../../components/Admin/v2/UserProfileCard"
import ProductRecommendList from '../../../components/Admin/v2/ProductRecommendList';
import decodeJWT from '../../../utils/decodeJWT';

const AdminViewUserDetails = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { user } = location.state || {}
    console.log(user);

    useEffect(() => {
        if (localStorage.getItem("jwtToken")) {
            const authorities = decodeJWT(localStorage.getItem("jwtToken")).authorities
            if (!authorities.includes("ROLE_ADMIN")) {
                navigate("/login")
            }
        } else {
            navigate("/login")
        }
    }, [navigate])

    return (
        <div className='className="flex flex-col space-y-8 p-4 max-w-7xl mx-auto"' >
            <UserProfileCard user={user} />
            <ProductRecommendList userId={user.id} />
        </div>
    )
}

export default AdminViewUserDetails