import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import Cart from "./Cart";
import { useAuthContext } from "./context/AuthContext";
import Spinner from "./Spinner";
import { useCart } from "./context/CartContext";

export default function Navbar() {
    const { isAuthenticated, setIsAuthenticated, loading } = useAuthContext();
    const { cartItems, fetchCartItems, removeCartItem } = useCart();
    const navigate = useNavigate();
    const [subTotal, setSubTotal] = useState(0);
    const [shipping, setShipping] = useState(0);

    useEffect(() => {
        // Calculate the subtotal
        setSubTotal(Array.isArray(cartItems)
            ? cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
            : 0); // Update the state once
    }, [cartItems]); // Recalculate whenever cartItems changes

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            // Logout API call
            await axiosInstance.post(
                "logout/",
                { refresh_token: refreshToken },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );

            // Clear tokens from storage and reset isAuthenticated
            localStorage.clear();
            axiosInstance.defaults.headers["Authorization"] = null;

            // Optionally update the context state (if it's not updating automatically)
            setIsAuthenticated(false);

            // Navigate to login page
            navigate("/login");
        } catch (e) {
            console.error("Error during logout:", e);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            {/* <!-- Top Section --> */}
            <div className="container-fluid py-2 bg-dark text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="contact-info">
                        <span><i className="bi bi-phone me-2"></i>+123 456 7890</span>
                        <span className="ms-3"><i className="bi bi-map me-2"></i>123 E-commerce St, Shop City</span>
                    </div>
                    <div className="social-icons">
                        <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ fontFamily: "sans-serif" }}>
                    <img src="https://static.vecteezy.com/system/resources/previews/016/471/452/non_2x/abstract-modern-ecommerce-logo-ecommerce-logo-design-shop-logo-design-template-creative-ecommerce-logo-vector.jpg" alt="" width="50" height="50" />
                        eCommerce
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            aria-current="page"
                                            to="/store"
                                        >
                                            <i className="bi bi-house" /> Store
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <button className="nav-link " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                                            <i className="bi bi-cart" /> Cart {cartItems.length > 0 ? <span className="badge rounded-pill bg-danger">{cartItems.length}</span> : <></>}
                                            <span className="visually-hidden">Cart Items</span>
                                        </button>
                                    </li>

                                    <li className="nav-item dropdown">

                                        <a className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            👋Welcome {localStorage.getItem('username')}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start" aria-labelledby="dropdownMenuButton1">
                                            <li>
                                                <Link to="/profile" className="dropdown-item">
                                                    <i className="bi bi-person" /> Profile</Link>
                                            </li>
                                            <li>
                                                <Link to="/orders" className="dropdown-item">
                                                    <i className="bi bi-list-check" /> Orders</Link>
                                            </li>
                                            <li>

                                                <Link to="/checkout" className="dropdown-item"><i className="bi bi-cart-check-fill" /> Checkout</Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={handleLogout}
                                                >
                                                    <i className="bi bi-box-arrow-left" /> Logout
                                                </button>
                                            </li>
                                        </ul>

                                    </li>

                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Cart */}
            <div
                className="offcanvas offcanvas-end h-100"
                tabIndex="-1"
                id="offcanvasCart"
                aria-labelledby="offcanvasCartLabel"
            >
                <div className="offcanvas-header">
                    <h3 className="offcanvas-title" id="offcanvasCartLabel">
                        Shopping Cart {cartItems.length > 0 ? <span>({cartItems.length})</span> : <></>}
                    </h3>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {
                        isAuthenticated ?
                            (
                                <Cart cartItems={cartItems} fetchCartItems={fetchCartItems} removeCartItem={removeCartItem} />
                            ) :
                            <Spinner />
                    }
                </div>
                <div className="offcanvas-footer border-top p-2">
                    <div className=''>
                        <div className='d-flex justify-content-between bg-light p-2'>
                            <h6>Shipping</h6>
                            <span>{shipping}$</span>
                        </div>
                        <div className='d-flex justify-content-between bg-light p-2'>
                            <h6>Subtotal</h6>
                            <span>{subTotal}$</span>
                        </div>
                        <div className='d-flex justify-content-between bg-light p-2 border-top'>
                            <h5 className='fw-bold'>Total</h5>
                            <span className='fw-bold'>{subTotal + shipping}$</span>
                        </div>

                    </div>
                    <div className='mt-1'>
                        <Link type="button" className='btn btn-dark mt-2 w-100' to='/checkout'>Checkout</Link>
                        <Link type="button" className="btn btn-primary mt-1 w-100" to='/cart'>Shopping Cart</Link>
                    </div>

                </div>
            </div>
        </>
    );
}