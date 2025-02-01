
import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../components/context/CartContext';
import ShippingAddressForm from '../components/ShippingAddressForm';
import axiosInstance from '../components/axiosInstance';
import Spinner from '../components/Spinner';
import { toast } from "react-toastify";
import OrderDetails from '../components/OrderDetails';
import { Link, useNavigate } from 'react-router-dom';

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
            const response = await axiosInstance.get("order/payment/", {
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
        try {
            const token = localStorage.getItem("access_token");
            const total = (subTotal + shipping).toFixed(2)
            const response = await axiosInstance.post('order/payment/', { total, paymentOption },
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

    };

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            fetchShippingAddress();
        } else {
            setIsLoading(false); // Stop loading spinner if no cart items
        }
    }, [cartItems, fetchShippingAddress]);

    useEffect(()=>{
        console.log(isPaid)
        if (isPaid){
            fetchOrderPayment();
        }
    },[isPaid])

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
        <div className='container'>
            <h3 className='mt-3'>Checkout</h3>
            <div className='row mt-3'>
                <div className='col-sm-12 col-xl-8'>
                    {
                        shippingAddress != null ?
                            (orderPayment ? <OrderDetails shippingAddress={shippingAddress} orderPayment={orderPayment} /> :
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
                {/* Order Summary */}
                <div className='col-sm-12 col-xl-4'>
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body">

                            <ul className='list-group'>
                                {
                                    cartItems && cartItems.length > 0 ?
                                        cartItems.map((item) => (
                                            <li className="list-group-item d-flex" key={item.id}>
                                                <img src={`${axiosInstance.defaults.baseURL.replace("/api/", "") + item.product.image}`} style={{ width: "75px", height: "75px" }} alt={item.name} className='img-thumbnail' />
                                                <div className='d-flex flex-column ms-4'>
                                                    <span className="text-muted fw-bold">Total ${(item.quantity * item.product.price).toFixed(2)}</span>
                                                    <small className="text-muted">Price ${item.product.price}</small>
                                                    <small className="text-muted">Qty {item.quantity}</small>
                                                </div>

                                            </li>
                                        ))
                                        :
                                        <></>
                                }
                            </ul>
                            <ul className='list-group my-3'>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Shipping:</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Sub Total:</span>
                                    <span>${subTotal.toFixed(2)}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total (USD):</span>
                                    <strong>${(shipping + subTotal).toFixed(2)}</strong>
                                </li>
                            </ul>
                            {
                                isPaid ? <button className="btn btn-success w-100" onClick={confirmOrder}>Place Order</button> : <button className="btn btn-success w-100" disabled>Place Order</button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
