import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import '../assets/css/PageHeader.css';

const Register = () => {
  return (
    <>
      {/* Header */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-12 p-5 mt-lg-5">
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

      {/* Register Form */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
