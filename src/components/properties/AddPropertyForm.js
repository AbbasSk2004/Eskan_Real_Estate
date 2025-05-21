import React, { useState, useEffect } from 'react';
import TermsAndConditions from '../legal/TermsAndConditions';
import PrivacyPolicy from '../legal/PrivacyPolicy';
import { endpoints } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PROPERTY_TYPES } from '../../utils/propertyTypes';
import { PROPERTY_TYPE_FIELDS, COMMON_FEATURES } from '../../utils/propertyTypeFields';

function AddPropertyForm() {
  const { currentUser } = useAuth();
  // State for form data
  const [form, setForm] = useState({
    propertyTitle: '',
    propertyType: '',
    propertyStatus: '',
    price: '',
    governorate: '',
    city: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    area: '',
    yearBuilt: '',
    furnishingStatus: '',
    description: '',
    termsConditions: false,
    status: '',
    airConditioning: false,
    heating: false,
    internet: false,
    parking: false,
    swimmingPool: false,
    generator: false,
    waterTank: false,
    security: false,
    balcony: false,
    elevator: false,
    solarPanels: false
  });

  // State for extra fields specific to property type
  const [extraFields, setExtraFields] = useState({});

  // State for file uploads
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  // State for cities based on governorate
  const [cities, setCities] = useState([]);
  const [cityDisabled, setCityDisabled] = useState(true);

  // State for submission error
  const [submitError, setSubmitError] = useState('');
  const [missingFields, setMissingFields] = useState([]);

  // Get current property type configuration
  const typeConfig = PROPERTY_TYPE_FIELDS[form.propertyType] || { 
    details: [], 
    features: [],
    showStandard: {
      bedrooms: true,
      bathrooms: true,
      parkingSpaces: true,
      yearBuilt: true,
      furnishingStatus: true
    }
  };

  // Add this line to debug
  console.log("Current type config:", form.propertyType, typeConfig);

  // Reset extra fields when property type changes
  useEffect(() => {
    // When property type changes, reset extra fields and features for that type
    setExtraFields({});
    if (form.propertyType && typeConfig) {
      // Build a new features object based on the current type's features
      const newFeatures = {};
      typeConfig.features.forEach(feature => {
        newFeatures[feature] = form[feature] || false;
      });
      setForm(prevForm => ({ ...prevForm, ...newFeatures }));
    }
    // eslint-disable-next-line
  }, [form.propertyType]);

  // Lebanese cities organized by governorate
  const lebanonCities = {
    "Beirut": [
      "Achrafieh", "Ain El Mraiseh", "Bachoura", "Badaro", "Basta", "Bourj Hammoud", 
      "Clemenceau", "Dar El Fatwa", "Gemmayze", "Hamra", "Karm El Zeitoun", "Malla", 
      "Manara", "Mar Elias", "Mar Mikhael", "Mazraa", "Medawar", "Minet El Hosn", 
      "Moussaitbeh", "Ras Beirut", "Rmeil", "Saifi", "Sanayeh", "Sodeco", "Tabaris", 
      "Zoqaq El Blat"
    ],
    "Mount Lebanon": [
      "Aley", "Antelias", "Baabda", "Beit Mery", "Bikfaya", "Broummana", "Dbayeh", 
      "Dora", "Fanar", "Hazmieh", "Jal El Dib", "Jamhour", "Jbeil (Byblos)", "Jounieh", 
      "Kaslik", "Mansourieh", "Metn", "Naccache", "Rabieh", "Roumieh", "Sin El Fil", 
      "Zouk Mikael", "Zouk Mosbeh"
    ],
    "North Lebanon": [
      "Amioun", "Batroun", "Bcharreh", "Chekka", "Ehden", "Enfeh", "Halba", "Koura", 
      "Minieh", "Tripoli", "Zgharta"
    ],
    "South Lebanon": [
      "Jezzine", "Maghdouche", "Saida (Sidon)", "Tyre (Sour)"
    ],
    "Bekaa": [
      "Aanjar", "Baalbek", "Chtaura", "Hermel", "Jib Jannine", "Joub Jannine", 
      "Kefraya", "Qab Elias", "Rashaya", "Zahle"
    ],
    "Nabatieh": [
      "Bent Jbeil", "Hasbaya", "Marjeyoun", "Nabatieh"
    ],
    "Akkar": [
      "Akkar", "Halba", "Qoubaiyat"
    ],
    "Baalbek-Hermel": [
      "Baalbek", "Hermel"
    ]
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Handle extra field changes
  const handleExtraFieldChange = (e) => {
    const { name, value, type } = e.target;
    setExtraFields({
      ...extraFields,
      [name]: value // Always store as string
    });
  };

  // Handle checkbox changes
  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      [name]: checked
    });
  };

  // Handle terms checkbox
  const handleTermsChange = (e) => {
    setForm({
      ...form,
      termsConditions: e.target.checked
    });
  };

  // Handle governorate change and load cities
  const handleGovernorateChange = (e) => {
    const governorate = e.target.value;
    setForm({
      ...form,
      governorate,
      city: '' // Reset city when governorate changes
    });
    
    if (governorate && lebanonCities[governorate]) {
      setCities(lebanonCities[governorate]);
      setCityDisabled(false);
    } else {
      setCities([]);
      setCityDisabled(true);
    }
  };

  // Handle file uploads
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller image.');
        e.target.value = '';
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file.');
        e.target.value = '';
        return;
      }
      
      setMainImage(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check number of files (max 10)
    if (files.length > 10) {
      alert('You can select a maximum of 10 images.');
      e.target.value = '';
      return;
    }
    
    // Check each file
    for (let i = 0; i < files.length; i++) {
      // Check file size (5MB max)
      if (files[i].size > 5 * 1024 * 1024) {
        alert(`File "${files[i].name}" exceeds 5MB. Please choose smaller images.`);
        e.target.value = '';
        return;
      }
      
      // Check file type
      if (!files[i].type.match('image.*')) {
        alert(`File "${files[i].name}" is not an image. Please select only image files.`);
        e.target.value = '';
        return;
      }
    }
    
    setAdditionalImages(files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Merge extraFields into form
    const mergedForm = { ...form, ...extraFields };

    // Get current property type configuration
    const typeConfig = PROPERTY_TYPE_FIELDS[form.propertyType] || { showStandard: {}, details: [] };

    // Always required
    const requiredFields = [
      'propertyTitle',
      'propertyType',
      'status',
      'price',
      'governorate',
      'city',
      'address',
      'description',
      'termsConditions'
    ];

    // Add standard fields based on typeConfig.showStandard
    Object.entries(typeConfig.showStandard || {}).forEach(([field, show]) => {
      if (show) requiredFields.push(field);
    });

    // Add dynamic fields from typeConfig.details
    (typeConfig.details || []).forEach(field => {
      requiredFields.push(field.name);
    });

    // Add images (but check them separately)
    const missing = [];
    for (const field of requiredFields) {
      if (
        mergedForm[field] === undefined ||
        mergedForm[field] === null ||
        mergedForm[field] === '' ||
        (typeof mergedForm[field] === 'boolean' && mergedForm[field] === false)
      ) {
        missing.push(field);
      }
    }
    // Check file inputs separately
    if (!mainImage) missing.push('mainImage');
    if (!additionalImages || additionalImages.length === 0) missing.push('additionalImages');

    if (missing.length > 0) {
      setMissingFields(missing);
      setSubmitError(
        `Please fill in the following required field${missing.length > 1 ? 's' : ''}: ${missing.map(f => prettifyFieldName(f)).join(', ')}`
      );
      return;
    } else {
      setMissingFields([]);
      setSubmitError('');
    }

    // Prepare FormData for submission
    const formData = new FormData();
    Object.entries(mergedForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Images
    if (mainImage) formData.append('mainImage', mainImage);
    additionalImages.forEach(img => formData.append('additionalImages', img));

    try {
      await handleAddProperty(formData);
      // Clear all fields after successful submit
      setForm({
        propertyTitle: '',
        propertyType: '',
        propertyStatus: '',
        price: '',
        governorate: '',
        city: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        parkingSpaces: '',
        area: '',
        yearBuilt: '',
        furnishingStatus: '',
        description: '',
        termsConditions: false,
        status: '',
        airConditioning: false,
        heating: false,
        internet: false,
        parking: false,
        swimmingPool: false,
        generator: false,
        waterTank: false,
        security: false,
        balcony: false,
        elevator: false,
        solarPanels: false
      });
      setExtraFields({});
      setMainImage(null);
      setAdditionalImages([]);
      // Clear file input values
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
      if (additionalImagesInputRef.current) additionalImagesInputRef.current.value = '';
      setSubmitError('');
    } catch (err) {
      setSubmitError('Failed to submit property. Please try again.');
    }
  };

  // Format price with commas
  const formatPrice = (e) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // Format with commas
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-US');
    }
    
    setForm({
      ...form,
      price: value
    });
  };

  function handleError(error) {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      message = error.response.data?.message || 'API error';
      const backendDetail = error.response.data?.error || '';
      message += backendDetail ? `\n${backendDetail}` : '';
      console.error('API error:', error.response.data);
    } else if (error.request) {
      message = 'No response from server.';
      console.error('No response:', error.request);
    } else {
      message = 'Error: ' + error.message;
      console.error('Error:', error.message);
    }
    setSubmitError(message);
    alert(message); // Optional: keep this for now
  }

  // Handle property addition
  const handleAddProperty = async (data) => {
    try {
      await endpoints.addProperty(data);
    } catch (error) {
      handleError(error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1900; y--) {
    years.push(y);
  }

  const mainImageInputRef = React.useRef(null);
  const additionalImagesInputRef = React.useRef(null);

  // Helper to prettify field names
  function prettifyFieldName(field) {
    // You can customize this mapping for better labels
    const map = {
      propertyTitle: 'Property Title',
      propertyType: 'Property Type',
      status: 'Property Status',
      price: 'Price',
      governorate: 'Governorate',
      city: 'City',
      address: 'Address',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      parkingSpaces: 'Parking Spaces',
      area: 'Area',
      yearBuilt: 'Year Built',
      furnishingStatus: 'Furnishing Status',
      description: 'Description',
      termsConditions: 'Terms & Conditions',
      // Add more mappings as needed
    };
    return map[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  return (
    <div className="container-xxl py-5">
      <div className="container">
        {submitError && (
          <div className="alert alert-danger">{submitError}</div>
        )}
        <div className="bg-light rounded p-3">
          <div className="bg-white rounded p-4" style={{border: '1px dashed rgba(0, 185, 142, .3)'}}>
            <div className="row g-5 align-items-center">
              <div className="col-lg-12 wow fadeIn" data-wow-delay="0.1s">
                <div className="text-center mb-4">
                  <h1 className="mb-3">List Your Property in Lebanon</h1>
                  <p>Complete the form below to list your property on our platform. Our commission-free model ensures you get the best value for your listing.</p>
                </div>
                <form id="propertyForm" onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="bg-light rounded p-3 mb-2">
                        <h4 className="mb-0">Basic Information</h4>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="text" 
                          className={`form-control${missingFields.includes('propertyTitle') ? ' is-invalid' : ''}`}
                          id="propertyTitle" 
                          name="propertyTitle"
                          placeholder="Property Title"
                          value={form.propertyTitle}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="propertyTitle">Property Title</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select 
                          className="form-select" 
                          id="propertyType"
                          name="propertyType"
                          value={form.propertyType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>Select Type</option>
                          {PROPERTY_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <label htmlFor="propertyType">Property Type</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select 
                          className="form-select" 
                          id="status"
                          name="status"
                          value={form.status}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="For Sale">For Sale</option>
                          <option value="For Rent">For Rent</option>
                        </select>
                        <label htmlFor="status">Property Status</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="price" 
                          name="price"
                          placeholder="Price"
                          value={form.price}
                          onChange={formatPrice}
                        />
                        <label htmlFor="price">Price (USD)</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded p-3 mb-2 mt-3">
                        <h4 className="mb-0">Property Location</h4>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select 
                          className="form-select" 
                          id="governorate"
                          name="governorate"
                          value={form.governorate}
                          onChange={handleGovernorateChange}
                        >
                          <option value="" disabled>Select Governorate</option>
                          <option value="Beirut">Beirut</option>
                          <option value="Mount Lebanon">Mount Lebanon</option>
                          <option value="North Lebanon">North Lebanon</option>
                          <option value="South Lebanon">South Lebanon</option>
                          <option value="Bekaa">Bekaa</option>
                          <option value="Nabatieh">Nabatieh</option>
                          <option value="Akkar">Akkar</option>
                          <option value="Baalbek-Hermel">Baalbek-Hermel</option>
                        </select>
                        <label htmlFor="governorate">Governorate</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select 
                          className="form-select" 
                          id="city"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          disabled={cityDisabled}
                        >
                          <option value="" disabled>Select City</option>
                          {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                          ))}
                        </select>
                        <label htmlFor="city">City/District</label>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-floating">
                        <input 
                          type="text" 
                          className="form-control" 
                          id="address" 
                          name="address"
                          placeholder="Detailed Address"
                          value={form.address}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="address">Detailed Address</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded p-3 mb-2 mt-3">
                        <h4 className="mb-0">Property Details</h4>
                      </div>
                    </div>
                    
                    {/* Area field (always shown) */}
                    {form.propertyType !== 'Farm' && (typeConfig.showStandard.area !== false) && (
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            type="number" 
                            className="form-control" 
                            id="area" 
                            name="area"
                            placeholder="Area"
                            value={form.area}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                          />
                          <label htmlFor="area">Area (m²)</label>
                        </div>
                      </div>
                    )}
                    
                    {/* Dynamic property-specific fields */}
                    {typeConfig.details.map(field => (
  <div className="col-md-6" key={field.name}>
    <div className="form-floating">
      {/* Special dropdown for Office Layout */}
      {form.propertyType === 'Office' && field.name === 'officeLayout' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
        >
          <option value="" disabled>Select Office Layout</option>
          <option value="Open Plan">Open Plan</option>
          <option value="Cubicles">Cubicles</option>
          <option value="Private Offices">Private Offices</option>
          <option value="Co-working">Co-working</option>
          <option value="Other">Other</option>
        </select>
      ) : form.propertyType === 'Land' && field.name === 'landType' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
        >
          <option value="" disabled>Select Land Type</option>
          <option value="Residential">Residential</option>
          <option value="Agricultural">Agricultural</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Mixed-Use">Mixed-Use</option>
          <option value="Other">Other</option>
        </select>
      ) : form.propertyType === 'Land' && field.name === 'zoning' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
        >
          <option value="" disabled>Select Zoning</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Mixed-Use">Mixed-Use</option>
          <option value="Agricultural">Agricultural</option>
          <option value="Industrial">Industrial</option>
          <option value="Other">Other</option>
        </select>
      ) : form.propertyType === 'Farm' && field.name === 'waterSource' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
        >
          <option value="" disabled>Select Water Source</option>
          <option value="Well">Well</option>
          <option value="River">River</option>
          <option value="Municipal">Municipal</option>
          <option value="None">None</option>
          <option value="Other">Other</option>
        </select>
      ) : form.propertyType === 'Farm' && field.name === 'cropTypes' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
        >
          <option value="" disabled>Select Crop Type</option>
          <option value="Olives">Olives</option>
          <option value="Grapes">Grapes</option>
          <option value="Wheat">Wheat</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Other">Other</option>
        </select>
      ) : field.type === 'select' ? (
        <select
          className="form-select"
          id={field.name}
          name={field.name}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
          required
        >
          <option value="" disabled>Select {field.label}</option>
          {field.options && field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          className="form-control"
          id={field.name}
          name={field.name}
          placeholder={field.label}
          value={extraFields[field.name] ?? ''}
          onChange={handleExtraFieldChange}
          required
          min={field.min !== undefined ? field.min : (field.type === 'number' ? "0" : undefined)}
          inputMode={field.type === 'number' ? "numeric" : undefined}
          pattern={field.type === 'number' ? "[0-9]*" : undefined}
        />
      )}
      <label htmlFor={field.name}>{field.label}</label>
    </div>
  </div>
))}
                    
                    {/* Conditionally show standard fields based on property type */}
                    {typeConfig.showStandard.bedrooms && (
                      <div className="col-md-3">
                        <div className="form-floating">
                          <input 
                            type="number" 
                            className="form-control" 
                            id="bedrooms" 
                            name="bedrooms"
                            placeholder="Bedrooms"
                            value={form.bedrooms}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                          />
                          <label htmlFor="bedrooms">Bedrooms</label>
                        </div>
                      </div>
                    )}
                    
                    {typeConfig.showStandard.bathrooms && (
                      <div className="col-md-3">
                        <div className="form-floating">
                          <input 
                            type="number" 
                            className="form-control" 
                            id="bathrooms" 
                            name="bathrooms"
                            placeholder="Bathrooms"
                            value={form.bathrooms}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                          />
                          <label htmlFor="bathrooms">Bathrooms</label>
                        </div>
                      </div>
                    )}
                    
                    {typeConfig.showStandard.parkingSpaces && (
                      <div className="col-md-3">
                        <div className="form-floating">
                          <input 
                            type="number" 
                            className="form-control" 
                            id="parkingSpaces" 
                            name="parkingSpaces"
                            placeholder="Parking Spaces"
                            value={form.parkingSpaces}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                          />
                          <label htmlFor="parkingSpaces">Parking Spaces</label>
                        </div>
                      </div>
                    )}
                    
                    {typeConfig.showStandard.yearBuilt && (
                      <div className="col-md-3">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="yearBuilt"
                            name="yearBuilt"
                            value={form.yearBuilt}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>Select Year Built</option>
                            {years.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <label htmlFor="yearBuilt">Year Built</label>
                        </div>
                      </div>
                    )}
                    
                    {typeConfig.showStandard.furnishingStatus && (
                      <div className="col-md-3">
                        <div className="form-floating">
                          <select 
                            className="form-select" 
                            id="furnishingStatus"
                            name="furnishingStatus"
                            value={form.furnishingStatus}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>Select Status</option>
                            <option value="Furnished">Furnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                          </select>
                          <label htmlFor="furnishingStatus">Furnishing Status</label>
                        </div>
                      </div>
                    )}
                    
                    {form.propertyType && (
                      <div className="col-12">
                        <div className="bg-light rounded p-3 mb-2 mt-3">
                          <h4 className="mb-0">Property Features</h4>
                        </div>
                      </div>
                    )}
                    
                                       {/* Dynamic property features */}
                    {form.propertyType && typeConfig.features.map(featureKey => (
                      <div className="col-md-4" key={featureKey}>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={featureKey}
                            name={featureKey}
                            checked={form[featureKey] || false}
                            onChange={handleFeatureChange}
                          />
                          <label className="form-check-label" htmlFor={featureKey}>
                            {COMMON_FEATURES[featureKey] || featureKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                        </div>
                      </div>
                    ))}
                    
                    <div className="col-12">
                      <div className="bg-light rounded p-3 mb-2 mt-3">
                        <h4 className="mb-0">Property Description</h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea 
                          className="form-control" 
                          placeholder="Description" 
                          id="description"
                          name="description"
                          style={{height: '150px'}}
                          value={form.description}
                          onChange={handleInputChange}
                        ></textarea>
                        <label htmlFor="description">Description</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-light rounded p-3 mb-2 mt-3">
                        <h4 className="mb-0">Property Images</h4>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="mainImage" className="form-label">Main Image (Cover Photo)</label>
                        <input 
                          className="form-control" 
                          type="file" 
                          id="mainImage" 
                          accept="image/*"
                          onChange={handleMainImageChange}
                          ref={mainImageInputRef}
                          required
                        />
                        <div className="form-text">Recommended size: 1200 x 800 pixels. Max file size: 5MB</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="additionalImages" className="form-label">Additional Images (Select multiple)</label>
                        <input 
                          className="form-control" 
                          type="file" 
                          id="additionalImages" 
                          multiple 
                          accept="image/*"
                          onChange={handleAdditionalImagesChange}
                          ref={additionalImagesInputRef}
                          required
                        />
                        <div className="form-text">You can select up to 10 additional images. Max file size: 5MB each</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="termsConditions"
                          name="termsConditions"
                          checked={form.termsConditions}
                          onChange={handleTermsChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="termsConditions">
                          I agree to the <button
  type="button"
  className="btn btn-link p-0 align-baseline"
  data-bs-toggle="modal"
  data-bs-target="#termsModal"
>
  Terms and Conditions
</button> and <a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button className="btn btn-primary w-100 py-3" type="submit">Submit Property</button>
                    </div>
                    {submitError && (
  <div className="col-12 mt-2">
    <div className="alert alert-danger text-center">{submitError}</div>
  </div>
)}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terms Modal */}
      <div className="modal fade" id="termsModal" tabIndex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="termsModalLabel">Terms and Conditions</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <TermsAndConditions />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <div className="modal fade" id="privacyModal" tabIndex="-1" aria-labelledby="privacyModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="privacyModalLabel">Privacy Policy</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <PrivacyPolicy />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPropertyForm;

