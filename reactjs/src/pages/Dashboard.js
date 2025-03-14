import React, { useEffect, useState } from 'react'
import { LuCircleDollarSign, LuShoppingCart } from "react-icons/lu";
import { AiFillProduct } from "react-icons/ai";
import { FaUserGroup } from "react-icons/fa6";
import PaymentsChart from '../dasboardcharts/PaymentsChart';
import axiosinstance from '../components/axiosInstance'
import ProductAvailability from '../dasboardcharts/ProductAvailability';
import OrderStatus from '../dasboardcharts/OrderStatus';
import '../dash.css';
import SalesChart from '../dasboardcharts/SalesChart';
import ProductsPriceHistory from '../dasboardcharts/ProductsPriceHistory';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
    const navigate = useNavigate();
    const styleHeaderOfCard = {
        fontFamily: 'sans-serif',

    }
    const styleNumberofCard = {
        fontFamily: 'initial',
        fontSize: 'x-large'
    }
    const StyleIcons = {
        padding: '15px',
        color: "#ff6c2f",
        backgroundColor: "rgb(250, 212, 194)",
        height: "auto",
        width: "auto",
        fontWeight:'10px'
    }
    const [data, setData] = useState(null);
    useEffect(() => {
        axiosinstance.get('/d/dashboard/' ,{
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }})
            .then((res) => {
                setData(res.data)
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
                if(err.response.status===403){
                    navigate('/not-authorized')
                }
            })
    }, [])
    return (
        <div className="container mt-3" >
            <div className='row'>
                <div className='col-12'>
                    <h4 className='d-inline-block p-1' style={{fontFamily:'fantasy ', borderBottom:'3px rgb(255, 108, 47) solid'}}>Dashboard</h4>
                </div>
            </div>
            <div className='row row-cols-sm-2 row-cols-md-4 row-cols-1 bg-white p-3 rounded my-3'>
                <div className='col'>
                    <div className="card mb-3">
                        <div className="d-flex justify-content-between p-1">
                            <LuCircleDollarSign style={StyleIcons} className='img-fluid rounded' />
                            <div className="card-body text-end">
                                <h5 className="card-title" style={styleHeaderOfCard}>Revenue</h5>
                                <p className="card-text fw-bold" style={styleNumberofCard}>{Number(data?.revenue).toLocaleString()} EGP</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className="card mb-3">
                        <div className="d-flex justify-content-between p-1">
                            <LuCircleDollarSign style={StyleIcons} className='img-fluid rounded' />
                            <div className="card-body text-end">
                                <h5 className="card-title" style={styleHeaderOfCard}>In Stock</h5>
                                <p className="card-text fw-bold" style={styleNumberofCard}>{Number(data?.products_price).toLocaleString()} EGP</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className="card mb-3">
                        <div className="d-flex  justify-content-between p-1">
                            <LuShoppingCart style={StyleIcons} className='img-fluid rounded' />
                            <div className="card-body text-end">
                                <h5 className="card-title" style={styleHeaderOfCard}>Orders</h5>
                                <p className="card-text fw-bold" style={styleNumberofCard}>{data?.orders_count}</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className="card mb-3">
                        <div className="d-flex  justify-content-between p-1">
                            <AiFillProduct style={StyleIcons} className='img-fluid rounded' />
                            <div className="card-body text-end">
                                <h5 className="card-title" style={styleHeaderOfCard}>Products</h5>
                                <p className="card-text fw-bold" style={styleNumberofCard}>{data?.product_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className="card mb-3">
                        <div className="d-flex  justify-content-between p-1">
                            <FaUserGroup style={StyleIcons} className='img-fluid rounded' />
                            <div className="card-body text-end">
                                <h5 className="card-title" style={styleHeaderOfCard}>Users</h5>
                                <p className="card-text fw-bold" style={styleNumberofCard}>{data?.users_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-5">
                <div className="col bg-white rounded p-3">
                    <h5 className=''>Proucts Price History</h5>
                    <ProductsPriceHistory dataset={data?.product_history}/>
                </div>
            </div>

            <div className="row gap-3 my-5">

                <div className="col d-flex justify-content-center bg-white rounded p-3">
                    <h5>Products</h5>
                    <ProductAvailability dataset={data?.products_availability}/>
                </div>
                <div className="col d-flex justify-content-center bg-white rounded p-3">
                    <h5>Orders</h5>
                    <OrderStatus dataset={data?.order_status}/>
                </div>
                <div className="col d-flex justify-content-center bg-white rounded p-3">
                    <h5>Payments</h5>
                    <PaymentsChart dataset={data?.payment_methods}/>
                </div>
            </div>

            <div className="row my-5">
                <div className="col bg-white rounded p-3">
                    <h5>Sales</h5>
                    <SalesChart dataset={data?.sales}/>
                </div>
            </div>

        </div>
    )
}


