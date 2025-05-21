import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <>
      {/* Header Start */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-12 p-5" style={{ marginTop: '100px' }}>
            <h1 className="display-5 animated fadeIn mb-4">Login</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Login</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Login Form Start */}
      <LoginForm />
      {/* Login Form End */}
    </>
  );
};

export default Login;
