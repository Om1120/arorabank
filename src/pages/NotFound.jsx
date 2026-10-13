import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="p-3 rounded-circle bg-warning-subtle text-warning mb-3">
        <AlertTriangle size={48} />
      </div>
      <h2 className="fw-bold mb-2" style={{ color: 'var(--aurora-navy)' }}>
        404 — Ledger Record Not Found
      </h2>
      <p className="text-secondary mb-4" style={{ maxWidth: '420px' }}>
        The requested routing node does not exist on the Aurora Bank network.
      </p>
      <div className="d-flex gap-2">
        <Link to="/dashboard" className="btn btn-aurora-primary d-inline-flex align-items-center gap-2">
          <Home size={16} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
