import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPassword';

const ForgotPassword = () => {
  return (
    <>
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-11">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <ForgotPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword; 