import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => (
  <>
    {/* Header Start */}
    <div className="container-fluid header bg-white p-0">
      <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
        <div className="col-md-12 p-5" style={{ marginTop: '100px' }}>
          <h1 className="display-5 animated fadeIn mb-4">Register</h1>
          <nav aria-label="breadcrumb animated fadeIn">
            <ol className="breadcrumb text-uppercase">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item text-body active" aria-current="page">Register</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
    {/* Header End */}

    {/* Register Form Start */}
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
            <div className="bg-light rounded p-3">
              <div className="bg-white rounded p-4" style={{ border: '1px dashed rgba(0, 185, 142, .3)' }}>
                <h3 className="mb-4">Create Your Account</h3>
                <RegisterForm />
              </div>
            </div>
          </div>
          <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
            <div className="about-img position-relative overflow-hidden p-5 pe-0">
              <img className="img-fluid w-100" src="/img/about.jpg" alt="About" />
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Register Form End */}
  </>
);

export default Register;
