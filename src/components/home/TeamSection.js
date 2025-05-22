import React, { useEffect, useState } from 'react';
import { endpoints } from '../../services/api';

const experienceLabel = (exp) => {
  if (exp === "1") return "0-2 Years Experience";
  if (exp === "2") return "3-5 Years Experience";
  if (exp === "3") return "5+ Years Experience";
  if (exp === "4") return "10+ Years Experience";
  return exp ? `${exp} Experience` : '';
};

const TeamSection = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await endpoints.getAgents();
        // Sort by experience descending (convert to number for sorting)
        const sorted = [...response.data].sort((a, b) => Number(b.experience) - Number(a.experience));
        setAgents(sorted.slice(0, 4));
      } catch (err) {
        setAgents([]);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Property Agents</h1>
          <p>Meet our experienced team of property agents who are dedicated to helping you find your perfect property.</p>
        </div>
        <div className="row g-4">
          {agents.map((agent, index) => (
            <div key={agent.id} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`}>
              <div className="team-item rounded overflow-hidden">
                <div className="position-relative">
                  <img
                    className="img-fluid"
                    src={agent.profile_photo}
                    alt={agent.full_name}
                    style={{ height: '300px', width: '100%', objectFit: 'cover',position: 'center' }}
                  />
                  <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                    <a className="btn btn-square mx-1" href={agent.facebook || "/"} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square mx-1" href={agent.twitter || "/"} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square mx-1" href={agent.instagram || "/"} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      className={`btn btn-square mx-1${!agent.phone ? ' disabled' : ''}`}
                      href={agent.phone ? `https://wa.me/${agent.phone.replace(/\D/g, '')}` : "/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={agent.phone ? "Chat on WhatsApp" : "No WhatsApp number"}
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
                <div className="text-center p-4 mt-3">
                  <h5 className="fw-bold mb-0">{agent.full_name}</h5>
                  <small>{agent.specialty}</small>
                  <div className="mt-2">
                    <span className="badge bg-primary">{experienceLabel(agent.experience)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;