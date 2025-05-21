import React, { useEffect, useState, useRef } from 'react';
import AgentCard from './AgentCard';
import { endpoints } from '../../services/api';

const CARD_WIDTH = 270 + 24; // Card width + gap (px)

const AgentList = ({ filters }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await endpoints.getAgents(filters); // Pass filters here
        setAgents(response.data);
      } catch (error) {
        setFetchError(
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch agents.'
        );
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [filters]); // Re-fetch when filters change

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -CARD_WIDTH * 2, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: CARD_WIDTH * 2, behavior: 'smooth' });
    }
  };

  // Touch/swipe support
  let startX = 0;
  let scrollLeftStart = 0;
  const handleTouchStart = (e) => {
    startX = e.touches[0].pageX;
    scrollLeftStart = scrollRef.current.scrollLeft;
  };
  const handleTouchMove = (e) => {
    if (!scrollRef.current) return;
    const dx = e.touches[0].pageX - startX;
    scrollRef.current.scrollLeft = scrollLeftStart - dx;
  };

  if (loading) return <div>Loading agents...</div>;
  if (fetchError) return <div className="alert alert-danger">{fetchError}</div>;
  if (!agents.length) return <div className="alert alert-warning">No agents found.</div>;

  return (
    <div className="container-xxl py-5">
      <div className="container position-relative">
        {/* Left Button */}
        <button
          className="btn btn-primary position-absolute top-50 start-0 translate-middle-y"
          style={{ zIndex: 2, left: '-90px' }} // was -20px
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <i className="fa fa-chevron-left"></i>
        </button>
        {/* Right Button */}
        <button
          className="btn btn-primary position-absolute top-50 end-0 translate-middle-y"
          style={{ zIndex: 2, right: '-90px' }} // was -20px
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <i className="fa fa-chevron-right"></i>
        </button>
        {/* Scrollable Row */}
        <div
          className="d-flex flex-row"
          style={{
            gap: '1.5rem',
            paddingBottom: '1rem',
            scrollBehavior: 'smooth',
            overflowX: 'auto',
            msOverflowStyle: 'none', // IE/Edge
            scrollbarWidth: 'none'   // Firefox
          }}
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              className="col-lg-3 col-md-6 wow fadeInUp"
              data-wow-delay={`${0.1 + index * 0.2}s`}
              style={{
                minWidth: '270px',
                maxWidth: '270px',
                flex: '0 0 auto'
              }}
            >
              <AgentCard
                agent={{
                  name: agent.profiles
                    ? `${agent.profiles.first_name} ${agent.profiles.last_name}`
                    : agent.full_name,
                  image: agent.profile_photo,
                  title: agent.specialty,
                  experience: agent.experience,
                  about: agent.about_me,
                  social: {
                    facebook: agent.facebook,
                    twitter: agent.twitter,
                    instagram: agent.instagram,
                    whatsapp: agent.phone
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentList;