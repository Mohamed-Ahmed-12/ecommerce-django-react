import React from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCreditCard, FaDollarSign, FaCalendar } from "react-icons/fa";

export default function OrderDetails({ shippingAddress, orderPayment }) {
  // Format currency (Assuming USD, change as needed)
  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  // Format date
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="container">
      <div className="row g-4">
        
        {/* Shipping Address Section */}
        <div className="col-md-6">
          <div className="p-3 text-white text-center"
               style={{ background: "linear-gradient(135deg, #007bff, #6610f2)", borderRadius: "5px" }}>
            <h5 className="mb-0 fw-bold">
              <FaMapMarkerAlt className="me-2" /> Shipping Details
            </h5>
          </div>
          
          <div className="p-3 mt-2 border rounded">
            <p><FaUser className="text-primary me-2" /> <strong>Name:</strong> {shippingAddress.user.username}</p>
            <p><FaPhone className="text-primary me-2" /> <strong>Phone:</strong> {shippingAddress.phone}</p>
            <p><FaEnvelope className="text-primary me-2" /> <strong>Email:</strong> {shippingAddress.email}</p>
            <p><FaMapMarkerAlt className="text-primary me-2" /> <strong>Address:</strong> {shippingAddress.address}</p>
            <p><FaGlobe className="text-primary me-2" /> <strong>Country:</strong> {shippingAddress.country}</p>
            <p><FaGlobe className="text-primary me-2" /> <strong>State:</strong> {shippingAddress.state}</p>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="col-md-6">
          <div className="p-3 text-white text-center"
               style={{ background: "linear-gradient(135deg, #28a745, #155724)", borderRadius: "5px" }}>
            <h5 className="mb-0 fw-bold">
              <FaCreditCard className="me-2" /> Payment Summary
            </h5>
          </div>

          <div className="p-3 mt-2 border rounded">
            <p><FaCreditCard className="text-success me-2" /> <strong>Payment Method:</strong> {orderPayment.payment_method}</p>
            <p><FaCreditCard className="text-success me-2" /> <strong>Payment Status:</strong> {orderPayment.payment_status}</p>
            <p><FaDollarSign className="text-success me-2" /> <strong>Total Amount:</strong> {formatPrice(orderPayment.total)}</p>
            <p><FaCalendar className="text-success me-2" /> <strong>Payment Date:</strong> {formatDate(orderPayment.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
