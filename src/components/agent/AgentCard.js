import React from 'react';

const AgentCard = ({ agent }) => (
  <div className="team-item rounded overflow-hidden">
    <div className="position-relative">
      <img
        className="img-fluid"
        src={agent.image}
        alt={agent.name}
        style={{ height: '300px', width: '100%', objectFit: 'cover' }}
      />
      <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
        <a className="btn btn-square mx-1" href={agent.social.facebook || "/"} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a className="btn btn-square mx-1" href={agent.social.twitter || "/"} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a className="btn btn-square mx-1" href={agent.social.instagram || "/"} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a
          className={`btn btn-square mx-1${!agent.social.whatsapp ? ' disabled' : ''}`}
          href={agent.social.whatsapp ? `https://wa.me/${agent.social.whatsapp.replace(/\D/g, '')}` : "/"}
          target="_blank"
          rel="noopener noreferrer"
          title={agent.social.whatsapp ? "Chat on WhatsApp" : "No WhatsApp number"}
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </div>
    <div className="text-center p-4 mt-3">
      <h5 className="fw-bold mb-0">{agent.name}</h5>
      <small>{agent.title}</small>
      {agent.experience && (
        <div className="mt-2">
          <span className="badge bg-primary">
            {agent.experience === "1" && "0-2 Years Experience"}
            {agent.experience === "2" && "3-5 Years Experience"}
            {agent.experience === "3" && "5+ Years Experience"}
            {agent.experience === "4" && "10+ Years Experience"}
            {!["1", "2", "3", "4"].includes(agent.experience) && `${agent.experience} Experience`}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default AgentCard;