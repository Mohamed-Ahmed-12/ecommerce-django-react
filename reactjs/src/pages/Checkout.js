
import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../components/context/CartContext';
import ShippingAddressForm from '../components/ShippingAddressForm';
import axiosInstance from '../components/axiosInstance';
import Spinner from '../components/Spinner';
import { toast } from "react-toastify";
import OrderDetails from '../components/OrderDetails';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaDollarSign, FaReceipt, FaShoppingBag, FaShoppingCart, FaTimes, FaTruck } from 'react-icons/fa';

export default function Checkout() {
    const { cartItems, fetchCartItems } = useCart();
    const [subTotal, setSubTotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [orderPayment, setOrderPayment] = useState(null);
    const navigate = useNavigate();

    const ShippingAddressFormSubmit = async (data) => {
        try {
            const response = await axiosInstance.post("shipping-address/", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            setShippingAddress(response.data.data);
            toast.success("Shipping Address Saved Successfully", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error saving shipping address:", error);
            toast.error("Failed to save shipping address", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const calculateSubTotal = useCallback(() => {
        const total = cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
            )
            : 0; // Default to 0 if cartItems is empty or undefined
        setSubTotal(total);
    }, [cartItems]);

    useEffect(() => {
        calculateSubTotal();
    }, [cartItems, calculateSubTotal]);

    const fetchShippingAddress = useCallback(async () => {
        try {
            const response = await axiosInstance.get("shipping-address/",
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                }
            );
            console.log(response.data);
            setShippingAddress(response.data);
        } catch (error) {
            console.error("Error fetching Shipping Address:", error);

        } finally {
            setIsLoading(false);

        }
    }, []);

    const fetchOrderPayment = useCallback(async () => {
        try {
            const response = await axiosInstance.get("payment/order/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            console.log(response.data);
            setOrderPayment(response.data);
            setIsPaid(true);
        } catch (error) {
            console.error("Error fetching Payment Status:", error);
        }
    }, []);

    const handlePayment = async (paymentOption) => {
        const result = window.confirm(`Are you sure to pay with ${paymentOption} ?`);
        if (result) {
            try {
                const token = localStorage.getItem("access_token");
                const total = (subTotal + shipping).toFixed(2)
                const response = await axiosInstance.post('payment/order/', { total, paymentOption },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Correctly set the Authorization header
                        },
                    }
                );

                toast.success('Payment Successfully ')
                setIsPaid(true);
                if (response.data.approval_url) {
                    window.location.href = response.data.approval_url; // Redirect to PayPal approval page
                }
            } catch (e) {
                console.error(e);
                toast.error('Sorry something Wrong in Payment ')
            }
        }

    };

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            fetchShippingAddress();
            fetchOrderPayment();
        } else {
            setIsLoading(false); // Stop loading spinner if no cart items
        }
    }, [cartItems, fetchShippingAddress, fetchOrderPayment]);

    useEffect(() => {
        console.log(isPaid)
        if (isPaid) {
            fetchOrderPayment();
        }
    }, [isPaid])

    const confirmOrder = async () => {
        setIsLoading(true); // Show spinner
        try {
            const response = await axiosInstance.post("order/confirm/", {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            toast.success("Order successfully completed!");
            // Re-fetch cart items to update the state
            await fetchCartItems();
            setIsLoading(false);
            navigate('/order/success')
        } catch (e) {
            console.error("Error confirming order:", e);
            toast.error("Failed to confirm the order. Please try again.");
        }
    };

    const cancelOrder = async () => {
        const result = window.confirm("Are you sure to cancel this order ?");
        if (result) {
            setIsLoading(true); // Show spinner
            try {
                const response = await axiosInstance.post("order/cancel/", {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                toast.success("Cancelled Successfully!", { position: "top-right" });
                // Re-fetch cart items to update the state
                await fetchCartItems();
                setIsLoading(false);
                navigate('/orders')
            } catch (e) {
                console.error("Error confirming order:", e);
                toast.error("Failed to cancel the order. Please try again.");
            }
        }
    }
    if (isLoading) return <div className="container mt-5"> <Spinner /> </div>;

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container text-center mt-5">
                <h3>Your cart is empty</h3>
                <p>Please add items to your cart to proceed with the checkout.</p>
                <Link to="/store" className="bi bi-arrow-left">
                    {" "}
                    Back To Store
                </Link>
            </div>
        );
    }


    return (
        <div className='container min-vh-100'>
            <h3 className='mt-3'>Checkout</h3>
            <div className='row mt-3'>
                <div className='col-sm-12 col-xl-8'>
                    {
                        shippingAddress ?
                            (
                                orderPayment ? <OrderDetails shippingAddress={shippingAddress} orderPayment={orderPayment} /> :
                                    <div className='border bg-light rounded-2 p-3 mb-3'>
                                        <h4>Payment Options</h4>
                                        <input type="image" className='form-control mt-3' style={{ width: "100px", height: "50px", objectFit: "cover" }} onClick={() => handlePayment("paypal")} src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                                            alt="pay-using-paypal" id="paypal-btn" />
                                        <input type="image" className='form-control mt-3' style={{ width: "100px", height: "50px", objectFit: "cover" }} onClick={() => handlePayment("cod")} src="https://png.pngtree.com/png-clipart/20220603/original/pngtree-red-badge-cod-cash-on-delivery-png-image_7900047.png"
                                            alt="cod" id="cod-btn" />
                                    </div>
                            ) :
                            <ShippingAddressForm onSubmit={ShippingAddressFormSubmit} initialData={shippingAddress || {}} />
                    }
                </div>
                {/* Order Summary Section */}
                <div className="col-md-4 mb-3">
                    <div className="p-3 text-white text-center"
                        style={{ background: "linear-gradient(135deg, #007bff, #0056b3)", borderRadius: "5px" }}>
                        <h5 className="mb-0 fw-bold">
                            <FaShoppingCart className="me-2" /> Order Summary
                        </h5>
                    </div>

                    <div className="p-3 mt-2 border rounded">
                        {cartItems && cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="d-flex align-items-center py-2 border-bottom">
                                    <img src={`${axiosInstance.defaults.baseURL.replace("/api/", "") + item.product.image}`}
                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                        alt={item.product.name}
                                        className='img-thumbnail' />
                                    <div className='ms-3 flex-grow-1'>
                                        <span className="fw-bold">{item.product.name}</span>
                                        <div className="text-muted small">Price: ${item.product.price}</div>
                                        <div className="text-muted small">Qty: {item.quantity}</div>
                                    </div>
                                    <span className="fw-bold text-success">${(item.quantity * item.product.price).toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No items in cart</p>
                        )}

                        <div className="mt-3">
                            <p><FaTruck className="text-primary me-2" /> <strong>Shipping:</strong> ${shipping.toFixed(2)}</p>
                            <p><FaDollarSign className="text-primary me-2" /> <strong>Sub Total:</strong> ${subTotal.toFixed(2)}</p>
                            <p className="fw-bold fs-5 border-top pt-2">
                                <FaReceipt className="text-danger me-2" /> Total (USD): <span className="text-danger">${(shipping + subTotal).toFixed(2)}</span>
                            </p>
                        </div>
                        {
                            cartItems.length > 0 &&
                            <button className="btn btn-outline-danger w-100 mt-3" onClick={cancelOrder}>
                                <FaTimes className="me-2" /> Cancel Order
                            </button>
                        }

                        {isPaid ? (
                            <button className="btn btn-success w-100 mt-2" onClick={confirmOrder}>
                                <FaCheck className="me-2" /> Confirm Order
                            </button>
                        ) : (
                            <button className="btn btn-secondary w-100 mt-2" disabled>
                                <FaShoppingBag className="me-2" /> Confirm Order
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
