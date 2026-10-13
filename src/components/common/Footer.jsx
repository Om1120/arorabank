import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Globe, Check } from 'lucide-react';

const CURRENT_YEAR = 2026;

export const Footer = () => {
  return (
    <footer className="no-print mt-auto border-top bg-white py-5" style={{ borderColor: 'var(--aurora-border)' }}>
      <div className="container-fluid px-lg-5">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--aurora-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--aurora-emerald-light)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <span className="fw-bold" style={{ fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--aurora-navy)' }}>
                AURORA BANK
              </span>
            </div>
            <p className="text-secondary small mb-3" style={{ maxWidth: '320px', lineHeight: 1.6 }}>
              Next-generation institutional and private digital banking platform. Designed with strict client security, multi-vault reserves, and real-time ledger settlement.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge-aurora-emerald py-1 px-2" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={13} className="me-1" />
                ISO 27001 Certified
              </span>
              <span className="badge-aurora-navy py-1 px-2" style={{ fontSize: '0.72rem' }}>
                <Lock size={13} className="me-1" />
                AES-256 Encrypted
              </span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Products
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/transfers" className="text-decoration-none text-secondary">Instant Transfers</Link></li>
              <li><Link to="/cards" className="text-decoration-none text-secondary">World Elite Cards</Link></li>
              <li><Link to="/analytics" className="text-decoration-none text-secondary">Wealth Management</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-secondary">Multi-Vault Reserves</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Platform
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/admin" className="text-decoration-none text-secondary">Admin Operations</Link></li>
              <li><Link to="/transactions" className="text-decoration-none text-secondary">Audit Trail</Link></li>
              <li><Link to="/login" className="text-decoration-none text-secondary">Security & 2FA</Link></li>
              <li><a href="#rates" className="text-decoration-none text-secondary">Interest Rates</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Globe size={16} color="#059669" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--aurora-navy)' }}>Simulated Banking Environment</strong>
              </div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.785rem', lineHeight: 1.5 }}>
                Aurora Bank is an interactive frontend demonstration built for technical evaluation. All balances, transactions, account numbers, and simulated settlement flows operate entirely within client-side storage.
              </p>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.72rem' }}>
                <Check size={13} color="#059669" /> No real financial assets or banking credentials are stored or transferred.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2 text-muted small">
          <div>
            &copy; {CURRENT_YEAR} Aurora Bank Technologies Inc. All simulated rights reserved.
          </div>
          <div className="d-flex gap-3">
            <span className="cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="cursor-pointer">Privacy & Cookie Notice</span>
            <span>&bull;</span>
            <span className="cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
