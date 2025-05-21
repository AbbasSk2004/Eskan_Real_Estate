import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { endpoints } from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize WOW.js for animations
    const WOW = window.WOW;
    if (WOW) {
      new WOW().init();
    }

    // Fetch property details
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await endpoints.getProperty(id);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load property details. Please try again.');
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <div className="text-center mt-4">
            <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-xxl py-5">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Property not found.
          </div>
          <div className="text-center mt-4">
            <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 p-5 mt-lg-5">
            <h1 className="display-5 animated fadeIn mb-4">{property.title}</h1>
            <nav aria-label="breadcrumb animated fadeIn">
              <ol className="breadcrumb text-uppercase">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/properties">Properties</a></li>
                <li className="breadcrumb-item text-body active" aria-current="page">Property Detail</li>
              </ol>
            </nav>
          </div>
          <div className="col-md-6 animated fadeIn">
            <img className="img-fluid" src={property.images[0]} alt={property.title} />
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Property Details Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
              <div className="mb-5">
                <img className="img-fluid w-100 mb-4" src={property.images[0]} alt={property.title} />
                <h1 className="mb-3">{property.title}</h1>
                <p className="mb-4">
                  <i className="fa fa-map-marker-alt text-primary me-2"></i>
                  {`${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zip}`}
                </p>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0 bg-light rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="fa fa-bed text-primary"></i>
                  </div>
                  <div className="ms-3 pt-2">
                    <p className="mb-0">Bedrooms</p>
                    <h5 className="mb-0">{property.beds}</h5>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0 bg-light rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="fa fa-bath text-primary"></i>
                  </div>
                  <div className="ms-3 pt-2">
                                       <p className="mb-0">Bathrooms</p>
                    <h5 className="mb-0">{property.baths}</h5>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0 bg-light rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="fa fa-ruler-combined text-primary"></i>
                  </div>
                  <div className="ms-3 pt-2">
                    <p className="mb-0">Square Feet</p>
                    <h5 className="mb-0">{property.sqft}</h5>
                  </div>
                </div>
                <p className="mb-4">{property.description}</p>
                <div className="mb-5">
                  <h4 className="mb-4">Property Features</h4>
                  <div className="row g-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="col-md-4">
                        <i className="fa fa-check text-primary me-2"></i>{feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="mb-4">Property Gallery</h4>
                <div className="row g-4">
                  {property.images.slice(1).map((image, index) => (
                    <div key={index} className="col-md-4">
                      <div className="position-relative overflow-hidden">
                        <img className="img-fluid w-100" src={image} alt={`Gallery ${index + 1}`} />
                        <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                          Gallery {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h4 className="mb-4">Location Map</h4>
                <div className="position-relative overflow-hidden">
                  <iframe 
                    className="position-relative rounded w-100 h-100"
                    style={{ minHeight: '400px', border: '0' }}
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${property.location.coordinates.lat},${property.location.coordinates.lng}`}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                    title="Property Location"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp" data-wow-delay="0.5s">
              <div className="bg-light rounded p-4 mb-5">
                <div className="border rounded p-4">
                  <h3 className="mb-3">{property.price}</h3>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Property Type</span>
                      <span>{property.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Year Built</span>
                      <span>{property.yearBuilt}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Lot Size</span>
                      <span>{property.lotSize}</span>
                    </div>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-primary mb-3">Book Showing</button>
                    <button className="btn btn-outline-primary">Add to Favorites</button>
                  </div>
                </div>
              </div>

              <div className="bg-light rounded p-4 mb-5">
                <h4 className="mb-4">Agent Information</h4>
                <div className="d-flex align-items-center mb-4">
                  <img className="rounded-circle flex-shrink-0" src={property.agent.image} alt={property.agent.name} style={{ width: '70px', height: '70px' }} />
                  <div className="ms-4">
                    <h5 className="mb-1">{property.agent.name}</h5>
                    <p className="mb-0">Real Estate Agent</p>
                  </div>
                </div>
                <p><i className="fa fa-phone-alt text-primary me-2"></i>{property.agent.phone}</p>
                <p><i className="fa fa-envelope text-primary me-2"></i>{property.agent.email}</p>
                <button className="btn btn-primary w-100 py-3">Contact Agent</button>
              </div>

              <div className="bg-light rounded p-4">
                <h4 className="mb-4">Request Information</h4>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                  </div>
                  <div className="mb-3">
                    <input type="tel" className="form-control" placeholder="Your Phone" required />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows="5" placeholder="Message" required></textarea>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary py-3">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Property Details End */}

      {/* Related Properties Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="mb-3">Related Properties</h1>
            <p>Explore other properties you might be interested in.</p>
          </div>
          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`0.${item}s`}>
                <div className="property-item rounded overflow-hidden">
                  <div className="position-relative overflow-hidden">
                    <Link to={`/property/${item + 10}`}>
                      <img className="img-fluid" src={`/img/property-${item + 3}.jpg`} alt="" />
                    </Link>
                    <div className="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                      {item % 2 === 0 ? 'For Rent' : 'For Sale'}
                    </div>
                    <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
                      ${Math.floor(Math.random() * 10000) + 1000}
                    </div>
                  </div>
                  <div className="p-4 pb-0">
                    <h5 className="text-primary mb-3">Related Property {item}</h5>
                    <p className="d-block h6 mb-2 text-uppercase">
                      <i className="fa fa-map-marker-alt text-primary me-2"></i>
                      {['New York, NY', 'Los Angeles, CA', 'Chicago, IL'][item - 1]}
                    </p>
                  </div>
                  <div className="d-flex border-top">
                    <small className="flex-fill text-center border-end py-2">
                      <i className="fa fa-ruler-combined text-primary me-2"></i>
                      {[1000, 1200, 900][item - 1]} Sqft
                    </small>
                    <small className="flex-fill text-center py-2">
                      <i className="fa fa-bed text-primary me-2"></i>
                      {[3, 2, 4][item - 1]} Bed
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Related Properties End */}
    </>
  );
};

export default PropertyDetail;
