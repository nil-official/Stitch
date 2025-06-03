import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { createOrder, verifyPayment, handlePaymentFailure, cancelOrder } from '../../redux/customer/order/action';
import CheckoutSteps from '../../components/CheckoutSteps';
import Loader from '../../components/Loader';
import ActionButtons from '../../components/Payment/ActionButtons';
import OrderItems from '../../components/Payment/OrderItems';
import DeliveryInfo from '../../components/Payment/DeliveryInfo';
import OrderDetails from '../../components/Payment/OrderDetails';
import StatusHeader from '../../components/Payment/StatusHeader';

const PaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { orderData } = useSelector(state => state.order);
  const { currentOrder, error } = useSelector(state => state.order);

  useEffect(() => {
    if (!orderData) {
      navigate('/checkout/cart');
      return;
    }

    const processOrder = async () => {
      try {
        // Create order via Redux action
        const orderResponse = await dispatch(createOrder(orderData));

        console.log('Order Response:', orderResponse);


        // Initialize Razorpay once order is created
        openRazorpayCheckout(
          orderResponse.razorpayOrderId,
          orderResponse.totalDiscountedPrice || orderResponse.totalPrice,
          orderResponse.orderId
        );
      } catch (error) {
        console.error('Error creating order:', error);
        setLoading(false);
        setPaymentStatus({
          success: false,
          message: 'Failed to create order. Please try again.'
        });
      }
    };

    processOrder();
  }, [orderData, dispatch, navigate]);

  const openRazorpayCheckout = (razorpayOrderId, amount, orderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Stitch',
      description: 'Purchase Payment',
      order_id: razorpayOrderId,
      handler: function (response) {
        handlePaymentSuccess(response, orderId);
      },
      prefill: {
        name: orderData?.user?.name || '',
        email: orderData?.user?.email || '',
        contact: orderData?.orderAddress?.mobile || ''
      },
      notes: {
        orderId: orderId
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function () {
          handlePaymentCancelled(orderId);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentSuccess = async (response, orderId) => {
    setLoading(true);
    try {
      const verifyData = {
        orderId: orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      };

      // Use Redux action to verify payment
      await dispatch(verifyPayment(verifyData));

      setLoading(false);
      setPaymentStatus({
        success: true,
        message: 'Payment completed successfully!'
      });
    } catch (error) {
      console.error('Payment verification failed:', error);
      setLoading(false);
      setPaymentStatus({
        success: false,
        message: 'Payment verification failed. Please contact support.'
      });
    }
  };

  const handlePaymentCancelled = async (orderId) => {
    setLoading(true);
    try {
      // Use Redux action to cancel order
      await dispatch(cancelOrder(orderId));
      setLoading(false);
      setPaymentStatus({
        success: false,
        message: 'Payment was cancelled. Your order has been saved.'
      });
    } catch (error) {
      console.error('Error updating cancelled order:', error);
      setLoading(false);
      setPaymentStatus({
        success: false,
        message: 'Payment was cancelled.'
      });
    }
  };

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;

    return (
      <div className="w-full rounded-lg overflow-hidden shadow-md border border-primary-200">
        {/* Status Header */}
        <StatusHeader
          success={paymentStatus.success}
          message={paymentStatus.message}
        />

        {/* Order Details Section */}
        {currentOrder && (
          <OrderDetails order={currentOrder} />
        )}

        {/* Delivery Section - Only show if payment successful */}
        {paymentStatus.success && currentOrder && currentOrder.orderAddress && (
          <DeliveryInfo orderAddress={currentOrder.orderAddress} />
        )}

        {/* Order Items - Only show if payment successful */}
        {paymentStatus.success && currentOrder && currentOrder.orderItems && (
          <OrderItems items={currentOrder.orderItems} />
        )}

        {/* Action Buttons */}
        <ActionButtons
          success={paymentStatus.success}
          orderId={currentOrder?.orderId}
        />
      </div>
    );
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center gap-8 py-8 lg:py-12">
      <CheckoutSteps
        currentStep={4}
      />

      <div className="w-11/12 xl:w-5/6 2xl:w-3/4">
        <div className='flex items-center gap-2 md:gap-4 mb-4 md:mb-6'>
          <Link to='/checkout/summary' className="text-primary-700 hover:text-primary-800 transition-all duration-300">
            <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' />
          </Link>
          <p className="text-lg md:text-2xl font-semibold">Payment</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader className='mb-4' />
            <p className="text-lg text-gray-600">Processing your payment...</p>
            <p className="text-sm text-gray-500 mt-2">Please do not minimize or close this window!</p>
          </div>
        ) : renderPaymentStatus()}
      </div>
    </div>
  );
};

export default PaymentPage;