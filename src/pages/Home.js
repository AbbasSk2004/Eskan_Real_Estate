import React from 'react';
import Hero from '../components/home/Hero';
import PropertyTypes from '../components/home/PropertyTypes';
import FeaturedProperties from '../components/home/FeaturedProperties';
import CallToAction from '../components/home/CallToAction';
import PropertyCarousel from '../components/home/PropertyCarousel';
import BlogSection from '../components/home/BlogSection';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <PropertyCarousel />
      <PropertyTypes />
      <FeaturedProperties />
      <BlogSection />
      <CallToAction />
    </div>
  );
};

export default Home;