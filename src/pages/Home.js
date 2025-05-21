import React, { useEffect } from 'react';
import HeaderCarousel from '../components/home/HeaderCarousel';
import SearchForm from '../components/home/SearchForm';
import CategorySection from '../components/home/CategorySection';
import AboutSection from '../components/home/AboutSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import CallToAction from '../components/home/CallToAction';
import TeamSection from '../components/home/TeamSection';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  useEffect(() => {
    if (window.WOW) new window.WOW().init();
  }, []);

  return (
    <>
      <HeaderCarousel />
      <SearchForm />
      {/* <CategorySection /> */}
      <AboutSection />
      <FeaturedProperties />
      <CallToAction />
      <TeamSection />
      <Testimonials />
    </>
  );
};

export default Home;