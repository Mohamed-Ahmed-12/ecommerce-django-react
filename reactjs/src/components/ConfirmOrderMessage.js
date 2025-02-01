import React from 'react'

const ConfirmOrderMessage = () => {

    return (
        <div className="container my-3 ">
            <div className="text-center p-4">
                <i className='bi bi-check-circle-fill text-success' style={{fontSize:"75px"}}></i>
                <h3 className="mb-3">Thank You for Your Order!</h3>
                <p className="lead">Your order has been successfully placed.</p>
            </div>
        </div>
    );
};

export default ConfirmOrderMessage;