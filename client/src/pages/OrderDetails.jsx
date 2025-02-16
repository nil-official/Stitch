import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import BASE_URL from '../utils/baseurl';

const OrdersDetails = () => {
  const { id } = useParams();
  const { currency } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [order, setOrder] = useState(null);

  console.log("got orderid as:", id);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await axios.get(`${BASE_URL}/api/orders/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } })
        if (res) {
          console.log("Order details fetched: ", res.data)
          setOrder(res.data);
        }
      } catch (err) {
        console.log("Something went wrong", err)
      } finally {
        setPageLoading(false);
      }
    }
    fetchOrder()
  }, [id])

  const handleRepayment = () => {
    console.log("Repayment initiated");
    setLoading(true);
    try {
      window.open(`${order.paymentDetails.razorpayPaymentLinkUrl}`, "_blank");
    } catch (err) {
      console.log("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className='w-[1400px] p-6'>
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>
        {pageLoading ? (
          <div className="flex justify-center items-center h-48">
            <ThreeDots
              height="48"
              width="48"
              color="black"
              ariaLabel="loading"
            />
          </div>
        ) : (
          order && (
            <div key={order.id} className="bg-white shadow-md rounded-lg mb-6 p-6">
              <div className="flex justify-between mb-4">
                <div className='font-medium'>
                  <p>Order Id: {order.orderId}</p>
                  <p>Order Date: {format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
                {/* <h3 className="text-lg font-semibold">Order Id: {order.orderId}</h3> */}
                <div
                  className={`max-h-10 px-4 rounded-full text-sm font-medium flex justify-center items-center
                ${order.orderStatus === 'PENDING' ? 'bg-red-100 text-red-800' :
                      order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                  {order.orderStatus}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-100 px-4 py-2 rounded-xl">
                <div>
                  <p className="font-medium">Expected Delivery Date:</p>
                  <p>{format(new Date(order.deliveryDate), 'PPP')}</p>
                </div>
              </div>
              <div className="mb-4 bg-gray-100 px-4 py-2 rounded-xl">
                <h4 className="font-medium mb-2">Shipping Address:</h4>
                <p>{order.orderAddress.firstName} {order.orderAddress.lastName}</p>
                <p>{order.orderAddress.streetAddress}</p>
                <p>{order.orderAddress.city}, {order.orderAddress.state} {order.orderAddress.zipCode}</p>
                <p>Phone: {order.orderAddress.mobile}</p>
              </div>
              <div className="mb-4 bg-gray-100 px-4 py-2 rounded-xl">
                <h4 className="font-medium">Order Items:</h4>
                <ul className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.title}</p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size[0] === 'T' ? item.size.split('T')[1] : item.size},
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm">
                            Price:&nbsp;{currency}&nbsp;{item.discountedPrice}
                            <span className="line-through text-gray-500 ml-2">{currency}&nbsp;{item.price}</span>
                            <span className="text-green-500 ml-2">({item.product.discountPercent}% OFF)</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price details */}
              <div className='mb-4 bg-gray-100 px-4 py-2 rounded-xl'>
                <h2 className="font-medium mb-2">Price Details:</h2>
                <div className="">
                  <div className="flex justify-between">
                    <p>Price ({order.totalItem} items)</p>
                    <p>{currency}&nbsp;{order.totalPrice}.00</p>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-500">-&nbsp;{currency}&nbsp;{order.totalPrice - order.totalDiscountedPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between pb-2 font-bold">
                    <span>Total Payable</span>
                    <span>{currency}&nbsp;{order.totalDiscountedPrice}.00</span>
                  </div>
                </div>
              </div>

              {/* Payment details */}
              {order.orderStatus === 'PENDING' ? (
                <div className='flex justify-end'>
                  <button
                    onClick={handleRepayment}
                    disabled={loading}  // Disable the button while loading
                    className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-500">
                    {loading ? (
                      <ThreeDots
                        height="24"
                        width="24"
                        color="white"
                        ariaLabel="loading"
                      />
                    ) : (
                      "Complete Payment"
                    )}
                  </button>
                </div>
              ) : (
                <div className='mb-2 bg-gray-100 px-4 py-2 rounded-xl'>
                  <h2 className="font-medium mb-2">Payment Details:</h2>
                  <div className="">
                    <div className="flex justify-between">
                      <p>Payment id: </p>
                      <p>{order.paymentDetails.razorpayPaymentId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Payment description: </p>
                      <p>{order.paymentDetails.razorpayPaymentDescription}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Payment method: </p>
                      <p>{order.paymentDetails.razorpayPaymentMethod}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Payment status: </p>
                      <p>{order.paymentDetails.razorpayPaymentStatus}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div >
  );
};

export default OrdersDetails;
