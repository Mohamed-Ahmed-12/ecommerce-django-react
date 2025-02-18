import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import axiosInstance from './axiosInstance';

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchBrands() {
      await axiosInstance.get('/viewset/brands/')
        .then(response => {
          setBrands(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
    fetchBrands();
  }, []);

  return (
    <Swiper
      spaceBetween={20} // Reduce space for better alignment
      loop={true}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      dir="rtl"
      modules={[Autoplay]}
      breakpoints={{
        // Mobile view (small screens)
        320: { 
          slidesPerView: 2, // 2 brands visible at a time on mobile
        },
        576: {
          slidesPerView: 3, // 3 brands on medium-sized screens (tablets)
        },
        992: {
          slidesPerView: 4, // 4 brands on large screens (desktops)
        },
      }}
    >
      {brands.map((brand) => (
        <SwiperSlide key={brand.id}>
          <div className="d-flex justify-content-center align-items-center bg-white rounded">
            <img 
              src={brand.img} 
              alt={brand.name} 
              className="object-fit-contain" 
              height={'110px'} 
              width={'auto'} 
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
