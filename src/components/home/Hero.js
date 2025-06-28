import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HeaderCarousel.css';

const Hero = () => {
  const settings = {
    autoplay: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    autoplaySpeed: 3000
  };

  return (
    <div className="container-fluid header bg-white p-0">
      <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
        <div className="col-md-6 p-5 mt-lg-5">
          <h1 className="display-5 animated fadeIn mb-4">
            Find Your <span className="text-primary">Dream Property</span> Today
          </h1>
          <p className="animated fadeIn mb-4 pb-2">
            Explore a curated selection of homes, apartments, and investment properties. Let us help you find the perfect place to call home.
          </p>
          <Link to="/properties" className="btn btn-primary py-3 px-5 me-3 animated fadeIn">
            Get Started
          </Link>
        </div>
        <div className="col-md-6 animated fadeIn">
          <Slider {...settings}>
            <div className="slider-item">
              <img className="img-fluid" src={process.env.PUBLIC_URL + '/img/carousel-1.jpg'} alt="Property Carousel" />
            </div>
            <div className="slider-item">
              <img className="img-fluid" src={process.env.PUBLIC_URL + '/img/carousel-2.jpg'} alt="Property Carousel" />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Hero;