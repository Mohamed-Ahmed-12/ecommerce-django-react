import React, { useState } from "react";

const ShippingAddressForm = ({ onSubmit, initialData = {}}) => {
    const [formData, setFormData] = useState({
        email: initialData.email || "",
        phone: initialData.phone || "",
        country: initialData.country || "",
        address: initialData.address || "",
        state: initialData.state || "",
        area: initialData.area || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Call parent function to handle submission
    };

    return (
        <div className="border bg-light rounded-2 p-3 mb-3">
            <h4>Shipping Address</h4>
            <form onSubmit={handleSubmit} className="was-validated">
                {/* Email Field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Phone Field */}
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="11"
                        required
                    />
                </div>

                {/* Country Field */}
                <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                        Country
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Address Field */}
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* State Field */}
                <div className="mb-3">
                    <label htmlFor="state" className="form-label">
                        State
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Area Field */}
                <div className="mb-3">
                    <label htmlFor="area" className="form-label">
                        Area
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-100 btn btn-dark rounded-pill">
                    Continue to payment
                </button>
            </form>
        </div>
    );
};

export default ShippingAddressForm;
