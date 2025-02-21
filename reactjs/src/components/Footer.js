import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: "#F2EFEA", padding: '40px 0' }}>
            <div className="container">
                <div className="row">
                    {/* Newsletter Subscription */}
                    <div className="col-md-4">
                        <h5>Subscribe to Our Newsletter</h5>
                        <form>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Enter your email" />
                                <button className="btn btn-dark">Subscribe</button>
                            </div>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-2">
                        <h5 className='fw-bold'>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Home</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Shop</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">About Us</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="col-md-2">
                        <h5 className='fw-bold'>Customer Service</h5>
                        <ul className="list-unstyled">
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">FAQs</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Shipping & Returns</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Privacy Policy</a></li>
                            <li className='my-2'><a className='text-dark text-decoration-none' href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-4">
                        <h5 className='fw-bold'>Contact Us</h5>
                        <p>Email: support@example.com</p>
                        <p>Phone: +1 (234) 567-890</p>
                        <p>Address: 123 Street, City, Country</p>
                        
                        {/* Social Icons */}
                        <div className="d-flex gap-3 mt-3">
                            <a href="#" className="text-dark"><FaFacebook size={20} /></a>
                            <a href="#" className="text-dark"><FaTwitter size={20} /></a>
                            <a href="#" className="text-dark"><FaInstagram size={20} /></a>
                            <a href="#" className="text-dark"><FaLinkedin size={20} /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-4">
                    <p className="mb-0">© {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
