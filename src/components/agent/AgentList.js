import React, { useEffect, useState, useRef, useCallback } from 'react';
import AgentCard from './AgentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { endpoints } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const abortControllerRef = useRef(null);
  const fetchAttemptRef = useRef(0);

  const fetchAgents = useCallback(async () => {
    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);
      
      const response = await endpoints.agents.getAll();
      
      // Check if component is still mounted
      if (!abortControllerRef.current) return;

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Failed to fetch agents');
      }

      // Filter for approved agents
      const approvedAgents = (response.data.data || []).filter(agent => 
        agent.approved && agent.status === 'approved'
      );
      
      setAgents(approvedAgents);
      setLoading(false);
    } catch (err) {
      // Skip error handling if request was cancelled or component unmounted
      if (err.name === 'AbortError' || !abortControllerRef.current) {
        return;
      }

      console.error('Error fetching agents:', err);
      setError(err.message || 'Failed to fetch agents. Please try again.');
      
      // Only show toast on first attempt
      if (fetchAttemptRef.current === 0) {
        toast.error('Failed to fetch agents');
      }
      
      setAgents([]);
      setLoading(false);
      fetchAttemptRef.current += 1;
    }
  }, []); // No dependencies needed since we use refs

  useEffect(() => {
    fetchAttemptRef.current = 0;
    fetchAgents();

    return () => {
      // Cleanup: abort any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []); // No dependencies needed

  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3">Loading our property agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl py-5">
        <div className="alert alert-danger text-center" role="alert">
          <p>{error}</p>
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => {
              fetchAttemptRef.current = 0;
              fetchAgents();
            }}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="container-xxl py-5">
        <div className="text-center">
          <h5>No Agents Available</h5>
          <p className="text-muted">There are currently no approved agents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl py-5">
      <div className="container">
        
        <div className="row g-4">
          {agents.map((agent, index) => (
            <div key={agent.id} 
                 className="col-lg-3 col-md-6 wow fadeInUp" 
                 data-wow-delay={`${0.1 + (index % 4) * 0.2}s`}>
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentList;