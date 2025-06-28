import React, { useState } from 'react';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: 'fa-question-circle',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Join us" in the top navigation, then select "Register". Fill in your details including email, password, and phone number. You\'ll receive a verification code via SMS to complete the registration.'
        },
        {
          question: 'Is the platform free to use?',
          answer: 'Yes, our platform is completely free for both property seekers and property owners. We don\'t charge any commission or listing fees.'
        },
        {
          question: 'How do I contact property owners?',
          answer: 'On each property detail page, you\'ll find a contact form. Fill in your details and message, and it will be sent directly to the property owner. You can also use our chat feature if you\'re logged in.'
        }
      ]
    },
    properties: {
      title: 'Property Listings',
      icon: 'fa-home',
      faqs: [
        {
          question: 'How do I list my property?',
          answer: 'After logging in, click "Add Property" in the navigation. Fill in all required details, upload high-quality photos, and submit for review. Your listing will be live once approved.'
        },
        {
          question: 'What types of properties can I list?',
          answer: 'You can list apartments, houses, villas, commercial spaces, land, and other real estate types. We support both sale and rental listings.'
        },
        {
          question: 'How long does it take for my listing to be approved?',
          answer: 'Most listings are reviewed and approved within 24-48 hours. We may contact you if additional information is needed.'
        },
        {
          question: 'Can I edit my property listing after it\'s published?',
          answer: 'Yes, you can edit your listings anytime from your profile dashboard. Changes will be reviewed before going live.'
        }
      ]
    },
    search: {
      title: 'Search & Filters',
      icon: 'fa-search',
      faqs: [
        {
          question: 'How do I search for properties?',
          answer: 'Use the search form on the homepage or properties page. You can filter by location, property type, price range, bedrooms, bathrooms, and more specific criteria.'
        },
        {
          question: 'Can I save my search preferences?',
          answer: 'Yes, logged-in users can save search preferences and receive notifications when new properties matching their criteria are listed.'
        },
        {
          question: 'How do I view properties on a map?',
          answer: 'On the properties listing page, click the "Map View" button to see all properties displayed on an interactive map with their exact locations.'
        }
      ]
    },
    account: {
      title: 'Account & Profile',
      icon: 'fa-user',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email we send you.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your profile page by clicking on your name in the top navigation, then click "Edit Profile" to update your information.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our support team at support@eskan-lebanon.com to request account deletion. Please note this action is irreversible.'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: 'fa-cog',
      faqs: [
        {
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, or try accessing the site in an incognito/private browsing window. If the problem persists, contact our support team.'
        },
        {
          question: 'I\'m having trouble uploading images. What are the requirements?',
          answer: 'Images should be in JPG, PNG, or WebP format, maximum 10MB each. We recommend high-resolution images (at least 1200x800 pixels) for best quality.'
        },
        {
          question: 'Is the website mobile-friendly?',
          answer: 'Yes, our website is fully responsive and optimized for mobile devices. You can access all features from your smartphone or tablet.'
        }
      ]
    }
  };

  const allFaqs = Object.values(faqCategories).flatMap(category => 
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchTerm 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqCategories[activeCategory]?.faqs || [];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container">
          {/* Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="search-box bg-light rounded p-4 text-center">
                <h3 className="mb-3">How can we help you?</h3>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fa fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Categories Sidebar */}
            {!searchTerm && (
              <div className="col-lg-3 mb-4">
                <div className="bg-white rounded shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                  <h5 className="text-primary mb-4">
                    <i className="fa fa-list me-2"></i>
                    Categories
                  </h5>
                  <nav className="nav flex-column">
                    {Object.entries(faqCategories).map(([key, category]) => (
                      <button
                        key={key}
                        className={`nav-link text-start border-0 bg-transparent p-3 rounded mb-2 ${
                          activeCategory === key ? 'bg-primary text-white' : 'text-dark'
                        }`}
                        onClick={() => setActiveCategory(key)}
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <i className={`fa ${category.icon} me-2`}></i>
                        {category.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* FAQ Content */}
            <div className={searchTerm ? 'col-12' : 'col-lg-9'}>
              <div className="bg-white rounded shadow-sm p-5">
                {searchTerm ? (
                  <div className="mb-4">
                    <h4>Search Results for "{searchTerm}"</h4>
                    <p className="text-muted">{filteredFaqs.length} result(s) found</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h4 className="text-primary">
                      <i className={`fa ${faqCategories[activeCategory]?.icon} me-2`}></i>
                      {faqCategories[activeCategory]?.title}
                    </h4>
                  </div>
                )}

                {/* FAQ Accordion */}
                <div className="accordion" id="faqAccordion">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="accordion-item border-0 mb-3">
                      <div className="accordion-header">
                        <button
                          className={`accordion-button ${expandedFaq === index ? '' : 'collapsed'} bg-light border rounded`}
                          type="button"
                          onClick={() => toggleFaq(index)}
                        >
                          <div>
                            <h6 className="mb-0">{faq.question}</h6>
                            {searchTerm && (
                              <small className="text-muted d-block">
                                Category: {faq.category}
                              </small>
                            )}
                          </div>
                        </button>
                      </div>
                      <div className={`accordion-collapse ${expandedFaq === index ? 'show' : ''}`}>
                        <div className="accordion-body bg-white">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results Message */}
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-5">
                    <i className="fa fa-search fa-3x text-muted mb-3"></i>
                    <h5>No results found</h5>
                    <p className="text-muted">
                      Try adjusting your search terms or browse through our categories
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="bg-primary rounded p-5 text-white text-center">
                <h4 className="mb-3">Still need help?</h4>
                <p className="mb-4">
                  Can't find what you're looking for? Our support team is here to help you.
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="fa fa-envelope fa-2x me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-1">Email Support</h6>
                        <small>support@eskan-lebanon.com</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center justify-content-center">
                                            <i className="fa fa-phone fa-2x me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-1">Phone Support</h6>
                        <small>+961 1 234 567</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="fa fa-clock fa-2x me-3"></i>
                      <div className="text-start">
                        <h6 className="mb-1">Support Hours</h6>
                        <small>Mon-Fri: 9AM-6PM</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/contact" className="btn btn-light btn-lg">
                    <i className="fa fa-paper-plane me-2"></i>
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
