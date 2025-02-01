import React from 'react'

export default function OrderDetails({shippingAddress , orderPayment}) {
  return (
    <div className="row g-4">
        <div className="col-md-12">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Shipping Address</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-6">
                            <h6 className="fw-bold">Name:</h6>
                            <p className="text-muted">{shippingAddress.user.username}</p>
                        </div>                        
                        <div className="col-6">
                            <h6 className="fw-bold">Phone:</h6>
                            <p className="text-muted">{shippingAddress.phone}</p>
                        </div>


                        <div className="col-6">
                            <h6 className="fw-bold">Email:</h6>
                            <p className="text-muted">{shippingAddress.email}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="fw-bold">Address:</h6>
                            <p className="text-muted">{shippingAddress.address}</p>
                        </div>

                        <div className="col-6">
                            <h6 className="fw-bold">Country:</h6>
                            <p className="text-muted">{shippingAddress.country}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="fw-bold">State:</h6>
                            <p className="text-muted">{shippingAddress.state}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div className="col-md-12">
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Payment Information</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-6">
                            <h6 className="fw-bold">Payment Method:</h6>
                            <p className="text-muted">{orderPayment.payment_method}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="fw-bold">Payment Status:</h6>
                            <p className="text-muted">{orderPayment.payment_status}</p>
                        </div>

                        <div className="col-6">
                            <h6 className="fw-bold">Total Amount:</h6>
                            <p className="text-muted">{orderPayment.total}</p>
                        </div>
                        <div className="col-6">
                            <h6 className="fw-bold">Payment Date:</h6>
                            <p className="text-muted">{orderPayment.created_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  )
}
