import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Close navbar on route change
  useEffect(() => {
    setNavbarOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 45);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Toggle navbar for mobile
  const handleNavbarToggle = () => setNavbarOpen((prev) => !prev);

  // Toggle profile dropdown
  const handleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);

  // Handle sign out
  const handleSignOut = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  // Fallback profile image/icon
  const profileImg = currentUser?.profile_photo;
  const firstName = currentUser?.first_name || '';

  return (
    <div className={`container-fluid nav-bar bg-transparent ${isSticky ? 'sticky-top' : ''}`}>
      <nav className="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
        <Link to="/" className="navbar-brand d-flex align-items-center text-center">
          <div className="icon p-2 me-2">
            <img className="img-fluid" src="/img/icon-deal.png" alt="Icon" style={{ width: '30px', height: '30px' }} />
          </div>
          <h1 className="m-0 text-primary">ESKAN</h1>
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          aria-label="Toggle navigation"
          aria-expanded={navbarOpen}
          onClick={handleNavbarToggle}
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${navbarOpen ? ' show' : ''}`} id="navbarCollapse">
          <div className="navbar-nav ms-auto">
            <NavLink to="/" end className="nav-item nav-link text-dark">
              Home
            </NavLink>
            <NavLink to="/about" className="nav-item nav-link text-dark">
              About
            </NavLink>
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-dark"
                data-bs-toggle="dropdown"
                type="button"
                style={{ textDecoration: 'none', color: 'inherit', boxShadow: 'none' }}
                id="propertyDropdown"
                aria-expanded="false"
              >
                Property
              </button>
              <div className="dropdown-menu rounded-0 m-0" aria-labelledby="propertyDropdown">
                <Link to="/properties" className="dropdown-item">Property List</Link>
                <Link to="/property-agent" className="dropdown-item">Property Agent</Link>
              </div>
            </div>
            <NavLink to="/contact" className="nav-item nav-link text-dark">
              Contact
            </NavLink>
            <NavLink to="/add-property" className="nav-item nav-link text-dark">
              Add Property
            </NavLink>
          </div>
          {/* Profile Dropdown or Join Us */}
          <div className="nav-item dropdown ms-lg-3 mt-3 mt-lg-0" ref={dropdownRef}>
            {(typeof isAuthenticated === 'function' ? isAuthenticated() : isAuthenticated) && currentUser ? (
              <div className="d-flex align-items-center flex-column flex-lg-row">
                <button
                  className="btn btn-link p-0 d-flex align-items-center"
                  type="button"
                  onClick={handleProfileDropdown}
                  style={{ textDecoration: 'none', color: 'inherit', boxShadow: 'none' }}
                  aria-label="Profile"
                >
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: 36, height: 36, objectFit: 'cover', border: '2px solid #ccc', marginRight: 8 }}
                    />
                  ) : (
                    <i className="fa fa-user-circle fa-2x text-primary" style={{ marginRight: 8 }}></i>
                  )}
                  <span className="d-block text-dark" style={{ fontSize: 14, fontWeight: 500 }}>
                    {firstName || 'Account'}
                  </span>
                </button>
                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-end show mt-2" style={{ minWidth: 240, right: 0, left: 'auto' }}>
                    <div className="text-center p-3">
                      {profileImg ? (
                        <img
                          src={profileImg}
                          alt="Profile"
                          className="rounded-circle mb-2"
                          style={{ width: 64, height: 64, objectFit: 'cover', border: '2px solid #ccc' }}
                        />
                      ) : (
                        <i className="fa fa-user-circle fa-4x text-primary mb-2"></i>
                      )}
                      <div className="fw-bold">{firstName || 'Account'}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/messages" className="dropdown-item">
                      <i className="fa fa-envelope me-2"></i>Direct Messages
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      <i className="fa fa-user-edit me-2"></i>Manage Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <i className="fa fa-cog me-2"></i>Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleSignOut}
                      type="button"
                    >
                      <i className="fa fa-sign-out-alt me-2"></i>Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="btn btn-primary px-3 dropdown-toggle w-100 w-lg-auto"
                  data-bs-toggle="dropdown"
                  type="button"
                  id="joinusDropdown"
                >
                  <i className="fa fa-user me-2"></i>Join us
                </button>
                <div className="dropdown-menu rounded-0 m-0" aria-labelledby="joinusDropdown">
                  <Link to="/login" className="dropdown-item">Login</Link>
                  <Link to="/register" className="dropdown-item">Register</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;