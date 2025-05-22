import React from 'react';
import Testimonials from '../components/home/Testimonials';

const advisors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Residential Property Specialist',
    image: 'img/team-1.jpg',
    delay: '0.1s'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Commercial Property Advisor',
    image: 'img/team-2.jpg',
    delay: '0.3s'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Luxury Property Consultant',
    image: 'img/team-3.jpg',
    delay: '0.5s'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Investment Property Strategist',
    image: 'img/team-4.jpg',
    delay: '0.7s'
  }
];

const About = () => {
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">About Us</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">About</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src="img/header.jpg" alt="" />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* About Intro Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img position-relative overflow-hidden p-5 pe-0">
                <img className="img-fluid w-100" src="img/about.jpg" alt="About Us" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <h1 className="mb-4">Your Trusted Partner in Real Estate</h1>
              <p className="mb-4">
                Founded with a vision to revolutionize the real estate industry, we are committed to providing a transparent, efficient, and commission-free property buying experience. Our platform connects property seekers directly with sellers, eliminating unnecessary intermediary costs while maintaining the highest standards of service.
              </p>
              <p><i className="fa fa-check text-primary me-3"></i>Zero commission fees for buyers and sellers</p>
              <p><i className="fa fa-check text-primary me-3"></i>Verified property listings with detailed information</p>
              <p><i className="fa fa-check text-primary me-3"></i>Professional guidance throughout your property journey</p>
              <p><i className="fa fa-check text-primary me-3"></i>Transparent process with no hidden costs</p>
              <a className="btn btn-primary py-3 px-5 mt-3" href="/properties">Explore Properties</a>
            </div>
          </div>
        </div>
      </div>
      {/* About Intro End */}

      {/* Mission Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-light rounded p-3">
            <div className="bg-white rounded p-4" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
              <div className="row g-5 align-items-center">
                <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                  <img className="img-fluid rounded w-100" src="img/call-to-action.jpg" alt="" />
                </div>
                <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                  <div className="mb-4">
                    <h1 className="mb-3">Our Mission</h1>
                    <p>We believe that finding your dream property shouldn't cost a fortune in commissions. Our mission is to create a fair marketplace where buyers and sellers can connect directly, supported by our expert team who provide guidance without the traditional commission structure. We're committed to transparency, integrity, and exceptional service at every step of your property journey.</p>
                  </div>
                  <a href="contact.html" className="btn btn-primary py-3 px-4 me-2"><i className="fa fa-phone-alt me-2"></i>Contact Us</a>
                  <a href="property-list.html" className="btn btn-dark py-3 px-4"><i className="fa fa-search me-2"></i>Find Properties</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mission End */}

      {/* Advisors Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="mb-3">Our Expert Property Advisors</h1>
            <p>Our team of experienced property advisors is dedicated to helping you navigate the real estate market with ease. Unlike traditional agents, our advisors don't work on commission, ensuring that their recommendations are always in your best interest.</p>
          </div>
          <div className="row g-4">
            {advisors.map(advisor => (
              <div key={advisor.id} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={advisor.delay}>
                <div className="team-item rounded overflow-hidden">
                  <div className="position-relative">
                    <img className="img-fluid" src={advisor.image} alt={advisor.name} />
                    <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                      <a className="btn btn-square mx-1" href="/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square mx-1" href="/" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square mx-1" href="/" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </div>
                  <div className="text-center p-4 mt-3">
                    <h5 className="fw-bold mb-0">{advisor.name}</h5>
                    <small>{advisor.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Advisors End */}

      {/* Why Choose Us Start */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="mb-3">Why Choose Us</h2>
            <p>
              We're revolutionizing the real estate industry with our client-first approach and commission-free model.
            </p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div>
                <div className="mb-3"><i className="fa fa-dollar-sign fa-2x text-success"></i></div>
                <h5 className="fw-bold">Zero Commission</h5>
                <p>We've eliminated traditional commission fees, saving you thousands on your property transaction. Our transparent pricing model means no surprises.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                <div className="mb-3"><i className="fa fa-shield-alt fa-2x text-success"></i></div>
                <h5 className="fw-bold">Verified Listings</h5>
                <p>Every property on our platform undergoes a thorough verification process, ensuring you have access to accurate and reliable information.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                <div className="mb-3"><i className="fa fa-handshake fa-2x text-success"></i></div>
                <h5 className="fw-bold">Expert Guidance</h5>
                <p>Our property advisors provide unbiased advice and personalized support throughout your property journey, without commission-based incentives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Why Choose Us End */}

      {/* Testimonials Section - Only use the component */}
      <Testimonials />
    </>
  );
};

export default About;