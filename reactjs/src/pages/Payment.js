import React, { useEffect } from 'react';
import axiosInstance from "../components/axiosInstance";
import { Link } from 'react-router-dom';
const PaymentSuccess = () => {
    const executePayment = async () => {
        const params = new URLSearchParams(window.location.search);
        console.log(params)
        const paymentId = params.get("paymentId");
        const payerId = params.get("PayerID");
        const token = params.get("token");
        try {
            const response = await axiosInstance.post("execute-payment/",
                {
                    "paymentId": paymentId,
                    "PayerID": payerId,
                    'token': token
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Correctly set the Authorization header
                    },
                }
            )
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        executePayment();
    }, []);

    return (

        <div className="container my-3 ">
            <div className="text-center p-4">
                <i className='bi bi-check-circle-fill text-success' style={{ fontSize: "75px" }}></i>
                <h3 className="mb-3">Your payment has been successfully</h3>
                <p className="lead">Thank you for your purchase .</p>
                <Link className="btn btn-success text-white mt-3" to='/store'>Return to Store</Link>
            </div>

        </div>

    );
};

const PaymentCancel = () => {
    return (


        <div className="container my-3 ">
            <div className="text-center p-4">
                <i className='bi bi-exclamation-circle-fill text-danger' style={{ fontSize: "75px" }}></i>
                <h3 className="mb-3">Payment Cancelled</h3>
                <p className="lead">Your payment was cancelled. If you encountered an issue, please try again or contact our support team.</p>
                <Link className="btn btn-danger text-white mt-3" to='/store'>Return to Store</Link>
            </div>

        </div>
    );
};

export { PaymentSuccess, PaymentCancel };
