import React, { useEffect } from "react";
import Categories from "../components/Categories";
import { Link } from "react-router-dom";

// Importing AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

import assistance from '../assets/img/assistance.png';
import twintyFour from '../assets/img/24-hour-clock.png';
import securePayment from '../assets/img/secure-payments.png';
import freeShipping from '../assets/img/shipping.png';
import Brands from "../components/Brands";


export default function Home() {
    useEffect(()=>{
        AOS.init();
    },[])
    return (
        <div className="container mt-1">      
            {/* Carousel */}
            <div id="carouselExampleDark" className="carousel carousel-light slide my-3" data-bs-ride="carousel">
                <div className="carousel-inner p-2">
                    <div className="carousel-item active" data-bs-interval="10000">
                        <img src="https://images.squarespace-cdn.com/content/v1/5b098d691137a6ae9be0ec8a/1567736622339-SNGCM3JFCOMRIL9RLRJY/auto+spare+parts+catalog.jpg" style={{ height: "400px", objectFit: "cover" }} className="d-block w-100 rounded-2" alt="carousel-1" />
                        <div className="carousel-caption d-md-block">
                            {/* <!-- Hero Section --> */}
                            <section className="hero-section">
                                <div className="hero-overlay">
                                    <div className="container">
                                        <h1 className="display-4 fw-bold">Find Your Auto Parts</h1>
                                        <p className="lead">Premium quality auto parts for your vehicle. Shop with confidence.</p>
                                        <Link to="/store" className="btn btn-dark">Shop Now</Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="2000">
                        <img src="https://i.pinimg.com/originals/01/74/28/01742844bd9e06c2e5475bfb260339af.jpg" style={{ height: "400px", objectFit: "cover" }} className="d-block w-100 rounded-2" alt="carousel-2" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>Some representative placeholder content for the second slide.</p>
                        </div>
                    </div>

                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            {/* <!-- Categories --> */}
            <Categories />

            {/* <!-- Brands Section --> */}
            <section className="my-5 bg-light py-5">
                <div className="container" id="brands">
                    <h2 className="text-center mb-4" style={{ fontFamily: "fantasy" }}>Brands</h2>
                    <Brands />
                </div>
            </section>

            {/* <!-- Featured Products Section --> */}
            <section className="my-5 bg-light py-5">
                <div className="container" id="whyus">
                    <h2 className="text-center" style={{ fontFamily: "fantasy" }}>Why US</h2>
                    <div className="row">
                        <div className="col d-flex flex-row p-2 m-3 bg-white rounded shadow-2" data-aos="fade-in" >
                            <img src={assistance} alt="Technical Assistance" style={{width:"90px",height:"90px"}}/>
                            <div className="d-flex flex-column justify-content-around mx-1">
                                <h6 className="fw-bold">Technical Assistance</h6>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                            </div>

                        </div>
                        <div className="col d-flex flex-row p-2 m-3 bg-white rounded shadow-2" data-aos="fade-in">
                            <img src={twintyFour} alt="24 hours" style={{width:"90px",height:"90px"}}/>
                            <div className="d-flex flex-column justify-content-around mx-1">
                                <h6 className="fw-bold">24 Hours</h6>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                            </div>
                        </div>
                        <div className="col d-flex flex-row p-2 m-3 bg-white rounded shadow-2" data-aos="fade-in">
                            <img src={securePayment} alt="Secure Payments" style={{width:"90px",height:"90px"}}/>
                            <div className="d-flex flex-column justify-content-around mx-1">
                                <h6 className="fw-bold">Secure Payment</h6>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                            </div>
                        </div>
                        <div className="col d-flex flex-row p-2 m-3 bg-white rounded shadow-2" data-aos="fade-in">
                            <img src={freeShipping} alt="Free Shipping" style={{width:"90px",height:"90px"}}/>
                            <div className="d-flex flex-column justify-content-around mx-1">
                                <h6 className="fw-bold">Free Shipping</h6>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- Footer --> */}
            <footer className="bg-dark text-white py-3">
                <div className="container text-center">
                    <p>&copy; 2024 Auto Parts Store. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
