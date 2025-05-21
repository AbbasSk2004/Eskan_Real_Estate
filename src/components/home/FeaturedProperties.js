import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured properties (simulated)
    const fetchProperties = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use dummy data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const dummyProperties = [
          {
            id: 1,
            title: 'Luxury Villa in Los Angeles',
            type: 'sale',
            price: '$12,345',
            beds: 3,
            baths: 2,
            sqft: 1000,
            image: '/img/property-1.jpg',
            location: 'Los Angeles, CA',
            agent: {
              name: 'John Doe',
              image: '/img/agent-1.jpg'
            }
          },
          {
            id: 2,
            title: 'Modern Apartment in New York',
            type: 'rent',
            price: '$5,678',
            beds: 2,
            baths: 1,
            sqft: 800,
            image: '/img/property-2.jpg',
            location: 'New York, NY',
            agent: {
              name: 'Jane Smith',
              image: '/img/agent-2.jpg'
            }
          },
          {
            id: 3,
            title: 'Family Home in Chicago',
            type: 'sale',
            price: '$8,765',
            beds: 4,
            baths: 3,
            sqft: 1500,
            image: '/img/property-3.jpg',
            location: 'Chicago, IL',
            agent: {
              name: 'Robert Johnson',
              image: '/img/agent-3.jpg'
            }
          },
          {
            id: 4,
            title: 'Cozy Apartment in San Francisco',
            type: 'rent',
            price: '$4,500',
            beds: 1,
            baths: 1,
                       sqft: 600,
            image: '/img/property-4.jpg',
            location: 'San Francisco, CA',
            agent: {
              name: 'Emily Wilson',
              image: '/img/agent-4.jpg'
            }
          },
          {
            id: 5,
            title: 'Beachfront Condo in Miami',
            type: 'sale',
            price: '$15,900',
            beds: 3,
            baths: 2,
            sqft: 1200,
            image: '/img/property-5.jpg',
            location: 'Miami, FL',
            agent: {
              name: 'John Doe',
              image: '/img/agent-1.jpg'
            }
          },
          {
            id: 6,
            title: 'Downtown Loft in Seattle',
            type: 'rent',
            price: '$3,200',
            beds: 1,
            baths: 1,
            sqft: 750,
            image: '/img/property-6.jpg',
            location: 'Seattle, WA',
            agent: {
              name: 'Jane Smith',
              image: '/img/agent-2.jpg'
            }
          }
        ];
        
        setProperties(dummyProperties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (!loading && window.WOW) {
      if (window.wowInstance) {
        window.wowInstance.sync();
      } else {
        window.wowInstance = new window.WOW();
        window.wowInstance.init();
      }
    }
  }, [loading]);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Featured Properties</h1>
          <p>Explore our handpicked selection of premium properties available for sale and rent.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading properties...</p>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map((property) => (
              <div key={property.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="property-item rounded overflow-hidden">
                  <div className="position-relative overflow-hidden">
                    <Link to={`/property/${property.id}`}>
                      <img className="img-fluid" src={property.image} alt="" />
                    </Link>
                    <div className="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                      {property.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </div>
                    <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                      {property.price}
                    </div>
                  </div>
                  <div className="p-4 pb-0">
                    <h5 className="text-primary mb-3">{property.title}</h5>
                    <p className="d-block h6 mb-2 text-uppercase">
                      <i className="fa fa-map-marker-alt text-primary me-2"></i>
                      {property.location}
                    </p>
                    <div className="d-flex mb-3">
                      <small className="me-2"><i className="fa fa-bed text-primary me-2"></i>{property.beds} Bed</small>
                      <small className="me-2"><i className="fa fa-bath text-primary me-2"></i>{property.baths} Bath</small>
                      <small><i className="fa fa-ruler-combined text-primary me-2"></i>{property.sqft} Sqft</small>
                    </div>
                  </div>
                  <div className="d-flex border-top">
                    <small className="flex-fill text-center border-end py-2">
                      <i className="fa fa-ruler-combined text-primary me-2"></i>
                      {property.sqft} Sqft
                    </small>
                    <small className="flex-fill text-center py-2">
                      <img className="rounded-circle me-2" src={property.agent.image} width="18" height="18" alt="" />
                      {property.agent.name}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.1s">
          <Link to="/properties" className="btn btn-primary py-3 px-5 mt-5">Browse More Properties</Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
