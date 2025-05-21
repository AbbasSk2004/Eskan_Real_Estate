import React from 'react';
import { PROPERTY_TYPES } from '../../utils/propertyTypes';

const CategorySection = () => (
  <div className="container-xxl py-5">
    <div className="container">
      <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
        <h1 className="mb-3">Property Types</h1>
        <p>Browse through our diverse range of property types to find what suits your needs best.</p>
      </div>
      <div className="row g-4">
        {PROPERTY_TYPES.map((type, index) => (
          <div key={type.value} className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay={`${0.1 + (index * 0.2)}s`}>
            <a className="cat-item d-block bg-light text-center rounded p-3" href="">
              <div className="rounded p-4">
                <div className="icon mb-3">
                  <span className="material-icons" style={{ fontSize: 48, color: '#00B98E', transition: 'color 0.3s' }}>
                    {type.icon}
                  </span>
                </div>
                <h6>{type.label}</h6>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CategorySection;