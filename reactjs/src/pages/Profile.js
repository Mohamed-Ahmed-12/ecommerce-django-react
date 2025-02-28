import { toast } from 'react-toastify';
import ShippingAddressForm from '../components/ShippingAddressForm'
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../components/axiosInstance';
import Spinner from '../components/Spinner';
import OrdersTable from '../components/OrdersTable';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState(null);

  const fetchShippingAddress = useCallback(async () => {
    try {
      const response = await axiosInstance.get("shipping-address/",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }
      );
      console.log(response.data);
      setShippingAddress(response.data);
    } catch (error) {
      console.error("Error fetching Shipping Address:", error);

    } finally {
      setIsLoading(false);

    }
  }, []);

  const ShippingAddressFormSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("shipping-address/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setShippingAddress(response.data.data);
      toast.success("Shipping Address Saved Successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving shipping address:", error);
      toast.error("Failed to save shipping address", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingAddress();
  }, [])
  if (isLoading) {
    return <Spinner />
  }
  return (
    <div className='container-fluid min-vh-100'>
      <div className='d-flex my-4'>

        <aside className='w-25'>
          <ul id='profile-side'>
            <li><a href='#main'>Account Main</a></li>
            <li><a href="#orders">Orders History</a></li>
            <li><a href="#">My Wishlist</a></li>
            <li><a href="#">Transactions</a></li>
            <li><a href="#">Change Password</a></li>
            <li><a href="#">Logout</a></li>
          </ul>

        </aside>

        <main className=' w-75 mx-2' id="profile-main">
          <div className='card p-3' style={{ overflow: "auto" }}>
            <h4 id='main'>Main Info</h4>
            <div className='d-flex flex-column rounded border bg-light p-3 my-2'>
              <h6>Username: {shippingAddress?.user.username}</h6>
              <h6>Email: {shippingAddress?.email},</h6>
              <h6>Phone: {shippingAddress?.phone}</h6>
            </div>

            <div className='d-flex flex-column rounded border bg-light p-3 my-2'>
              <h6>Location: {shippingAddress?.address}</h6>
              <h6>Area: {shippingAddress?.area}</h6>
              <h6>City: {shippingAddress?.state}</h6>
            </div>
          </div>

          <div className='card p-3 my-3' style={{ overflow: "auto" }}>
            <h4 id="orders">My Orders</h4>
              <OrdersTable />
          </div>
        </main>
      </div>

    </div>
  )
}
