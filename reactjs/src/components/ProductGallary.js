import React, { memo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Navigation styles
import { Navigation } from "swiper/modules"; // Import modules

function ProductGallery ({ images }){
    return (
        <>
            <Swiper
                navigation={true} // Enable navigation arrows
                //loop={true} // Enable infinite loop
                spaceBetween={10} // Space between slides
                slidesPerView={1} // Show one slide at a time
                modules={[Navigation]} // Add navigation and pagination
                style={{ width: "100%", height: "250px" }} // Set gallery dimensions
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`${index + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
export default memo(ProductGallery);