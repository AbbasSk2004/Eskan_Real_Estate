import React from 'react';
import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import PropertyTypes from '../components/home/PropertyTypes';
import FeaturedProperties from '../components/home/FeaturedProperties';
import CallToAction from '../components/home/CallToAction';
import PropertyCarousel from '../components/home/PropertyCarousel';
import BlogSection from '../components/home/BlogSection';

const Home = () => {
  return (
    <>
      <SEO title="Home" description="Find your dream property with Eskan Real Estate. Browse curated homes, apartments, and investment opportunities in your area." />
      <div className="home-page">
        <Hero />
        <PropertyCarousel />
        <PropertyTypes />
        <FeaturedProperties />
        <BlogSection />
        <CallToAction />
      </div>
    </>
  );
};

export default Home;