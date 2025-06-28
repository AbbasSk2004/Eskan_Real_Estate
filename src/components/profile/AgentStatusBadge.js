import React from 'react';

const AgentStatusBadge = ({ status }) => {
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'accepted':
        return 'bg-success';
      case 'rejected':
      case 'declined':
        return 'bg-danger';
      case 'pending':
      case 'in_review':
        return 'bg-warning';
      case 'suspended':
        return 'bg-dark';
      case 'inactive':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    
    // Convert status to title case and replace underscores with spaces
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default AgentStatusBadge;