import React, { memo, useEffect, useState } from 'react';
import 'swiper/css'; // Swiper core styles
import 'swiper/css/navigation'; // Swiper navigation styles
import { Swiper, SwiperSlide } from 'swiper/react';
import Spinner from './Spinner';
import axiosInstance from './axiosInstance';
import { Navigation } from 'swiper/modules';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('viewset/categories');
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (

    <div className="bg-white rounded py-4 mt-5">
      <h2 className="text-center mb-4" style={{ fontFamily: "fantasy" }}>
        Top Categories
      </h2>
      <div className="p-2">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <Spinner />
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            slidesPerView={6}
            spaceBetween={30}
            navigation={true}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 30 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
              1200: { slidesPerView: 6, spaceBetween: 50 },
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card shadow-sm border-0"
                  style={{
                    backgroundColor: 'rgb(231, 234, 249)',
                    borderRadius: '10px',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <img
                    src={category.image}
                    className="card-img-top p-3"
                    alt={category.name}
                    style={{
                      height: '80px',
                      objectFit: 'contain',
                      borderRadius: '10px 10px 0 0',
                    }}
                  />
                  <div className="card-body text-center">
                    <h6 className="card-title fw-bold text-dark">{category.name}</h6>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default memo(Categories);
