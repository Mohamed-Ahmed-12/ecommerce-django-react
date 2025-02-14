import React, { useEffect, memo } from 'react';
import axiosInstance from './axiosInstance';

//  this component appear in side when click on cart btn in nav bar
function Cart({ cartItems, fetchCartItems, removeCartItem }) {

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className='d-flex flex-column justify-content-between h-100'>
            <ul className="list-group" data-bs-spy="scroll" data-bs-offset="0" tabIndex="0">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <li key={item.id} className="list-group-item list-group-item-light d-flex align-items-between p-2">
                            <div className='me-2'>
                                <img src={`${axiosInstance.defaults.baseURL.replace("/api/", "") + item.product.image}`} style={{ width: "100%", height: "100px" }} alt={item.name} className='img-thumbnail' />
                            </div>

                            <div className='d-flex flex-column justify-content-between'>
                                <h6 className=' '>{item.product.name.slice(0, 45)}</h6>
                                
                                <div className='d-flex justify-content-between'>
                                <p className='fw-bold mb-1'><small>${item.product.price}</small></p>
                                    <button className='btn btn-sm btn-danger bi bi-trash' onClick={() => { removeCartItem(item.product.id) }}></button>
                                </div>
                            </div>


                        </li>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </ul>
        </div>
    );
}

export default memo(Cart);