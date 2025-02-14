import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';

const ConfirmOrderMessage = () => {
      const {fetchCartItems} = useCart();
    
    useEffect(()=>{
        fetchCartItems();
    },[])
    return (
        <div className="container my-3 ">
            <div className="text-center p-4">
                <i className='bi bi-check-circle-fill text-success' style={{fontSize:"75px"}}></i>
                <h3 className="mb-3">Thank You for Your Order!</h3>
                <p className="lead">Your order has been successfully placed.</p>
                <p className="lead">You will receive an email with the details of your order.</p>
                <Link to='/orders' className='btn btn-dark btn-sm'>Orders Page</Link>
            </div>
        </div>
    );
};

export default ConfirmOrderMessage;