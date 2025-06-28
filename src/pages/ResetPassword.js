import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <>
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-11">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <ResetPasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword; 