import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import {readableTimeFormat} from '../utilities'

const StatusPadge = ({ status = 'pending' }) => {
    const statusStyle = {
        'pending': 'badge bg-secondary',
        'completed': 'badge bg-success',
        'cancelled': 'badge bg-danger',
        'failed': 'badge bg-danger',
    }
    return (
        <span className={statusStyle[status]}>{status}</span>
    );
}

export default function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [totalSpend , setTotalSpend] = useState(0);

    useEffect(() => {
        const getMyOrders = async () => {
            try {
                const response = await axiosInstance.get('orders/', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                });
                console.log(response.data);
                setOrders(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        }
        getMyOrders();
    }, [])

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    }

    useEffect(()=>{
        let total = 0;
        orders.forEach(order => {
            total += order.status ==='completed' ? Number(order.payment.total) : 0;
        });
        setTotalSpend(total);
    },[orders])


    if (isLoading) return <Spinner />

    return (
        <>
            <h6 className='m-1'>Total Spend: <span className='fw-bold text-primary'>{(totalSpend).toLocaleString()} EGP</span></h6>
            <div className="table-responsive rounded-1 shadow-2 my-4">
                <table className="table table-bordered table-hover mb-0">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">Order ID</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Total (EGP)</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Order Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order, index) => (
                                <tr key={index}>
                                    <td>#{order.id}</td>
                                    <td>{readableTimeFormat(order.created_at)}</td>
                                    <td>{order.payment ? Number(order.payment.total).toLocaleString() : 0}</td>
                                    <td>
                                        <StatusPadge status={order.payment?.payment_status} />
                                    </td>
                                    <td>
                                        <StatusPadge status={order.status} />
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#orderDetailsModal" onClick={() => handleViewDetails(order)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            <div className="modal fade" id="orderDetailsModal" tabIndex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="orderDetailsModalLabel">Order #{selectedOrder?.id} </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                selectedOrder?.invoice?.file &&

                                <><i className="bi bi-file-pdf"></i><Link to={`${axiosInstance.defaults.baseURL.replace("/api/", "") + selectedOrder?.invoice?.file}`}>Order Invoice</Link></>
                            }

                            <table className="table table-border caption-top">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">QTY</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedOrder?.items.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td><Link to={`/product/${item.product.slug}`} >{item.product.name}</Link></td>
                                                <td>{item.product.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.product.price * item.quantity}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
