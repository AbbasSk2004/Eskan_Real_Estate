import React from 'react';

const AgentSearch = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => {
      const updated = { ...f, [name]: value };
      if (onSearch) onSearch(updated); // auto filtering
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters); // manual filtering
  };

  return (
    <form className="row g-2" onSubmit={handleSubmit}>
      <div className="col-md-10">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control border-0 py-3"
              placeholder="Agent Name"
              name="name"
              value={filters.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select border-0 py-3"
              name="specialty"
              value={filters.specialty}
              onChange={handleChange}
            >
              <option value="">Agent Specialty</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Luxury">Luxury Homes</option>
              <option value="Investment">Investment Properties</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select border-0 py-3"
              name="experience"
              value={filters.experience}
              onChange={handleChange}
            >
              <option value="">Experience Level</option>
              <option value="1">0-2 Years</option>
              <option value="2">3-5 Years</option>
              <option value="3">5+ Years</option>
              <option value="4">10+ Years</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-2 d-flex align-items-end">
        <button type="submit" className="btn btn-dark w-100 py-3">
          <i className="fa fa-search me-2"></i>Search
        </button>
      </div>
    </form>
  );
};

export default AgentSearch;