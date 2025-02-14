import { toast } from 'react-toastify';
import ShippingAddressForm from '../components/ShippingAddressForm'
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../components/axiosInstance';
import Spinner from '../components/Spinner';

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

  useEffect(()=>{
    fetchShippingAddress();
  },[])
  if(isLoading){
    return <Spinner />
  }
  return (
    <div className='container'>
      <h1>Profile</h1>
      <ShippingAddressForm onSubmit={ShippingAddressFormSubmit}  initialData={shippingAddress}/>
    </div>
  )
}
