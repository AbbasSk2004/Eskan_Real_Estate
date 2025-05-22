import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { endpoints } from '../../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    endpoints.getTestimonials().then(res => setTestimonials(res.data));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Our Clients Say!</h1>
          <p>Read what our satisfied clients have to say about their experience with us.</p>
        </div>
        <Slider {...settings} className="testimonial-carousel">
          {testimonials.map((t, idx) => (
            <div key={t.id || idx} className="testimonial-item bg-light rounded p-3">
              <div className="bg-white border rounded p-4">
                <p>{t.text}</p>
                <div className="d-flex align-items-center">
                  {/* Profile Picture */}
                  <img
                    src={t.profiles?.profile_photo || '/default-profile.png'}
                    alt={t.profiles?.first_name ? `${t.profiles.first_name} ${t.profiles.last_name || ''}` : 'User'}
                    className="testimonial-profile-img me-3"
                  />
                  <div className="ps-3">
                    <h6 className="fw-bold mb-1">
                      {t.profiles?.first_name || ''} {t.profiles?.last_name || t.profiles?.email || 'User'}
                    </h6>
                    <small>
                      {Array.from({ length: t.rating }, (_, i) => (
                        <span key={i} style={{ color: '#FFD700' }}>★</span>
                      ))}
                      {Array.from({ length: 5 - t.rating }, (_, i) => (
                        <span key={i} style={{ color: '#ccc' }}>★</span>
                      ))}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
