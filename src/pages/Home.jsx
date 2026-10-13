import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { formatCurrency } from '../services/transactionService';

export const Home = () => {
  // Interactive Fixed Deposit Calculator state
  const [depositAmount, setDepositAmount] = useState(200000);
  const [tenureYears, setTenureYears] = useState(3);
  const interestRate = 7.4; // 7.4% fixed annual

  // Maturity calculation: Compound quarterly: A = P * (1 + r/4)^(4*t)
  const maturityValue = Math.round(depositAmount * Math.pow(1 + (interestRate / 400), 4 * tenureYears));
  const totalInterest = maturityValue - depositAmount;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 py-lg-6" style={{
        background: 'radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(10, 25, 47, 0.05) 0%, transparent 40%), #FFFFFF',
        borderBottom: '1px solid var(--aurora-border)'
      }}>
        <div className="container-fluid px-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{
                backgroundColor: 'var(--aurora-emerald-bg)',
                border: '1px solid var(--aurora-emerald-subtle)',
                color: 'var(--aurora-emerald-dark)',
                fontSize: '0.825rem',
                fontWeight: 600
              }}>
                <Zap size={14} />
                <span>Next-Generation Financial Architecture</span>
              </div>

              <h1 className="display-4 fw-bold mb-3" style={{
                color: 'var(--aurora-navy)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15
              }}>
                Intelligent Banking for the Modern Economy.
              </h1>

              <p className="lead text-secondary mb-4" style={{ fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '600px' }}>
                Seamlessly manage liquid assets, high-yield wealth vaults, and institutional settlement transfers with Aurora Bank's unified digital platform.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/dashboard" className="btn-aurora-emerald px-4 py-3 text-decoration-none shadow" style={{ fontSize: '1rem' }}>
                  Open Demo Dashboard
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-aurora-secondary px-4 py-3 text-decoration-none" style={{ fontSize: '1rem' }}>
                  Sign In / Persona Switch
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-top d-flex flex-wrap gap-4 text-muted small">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} color="#059669" />
                  <span><strong>6.85% APY</strong> High-Yield Reserve</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} color="#059669" />
                  <span><strong>Zero</strong> Hidden Transfer Fees</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} color="#059669" />
                  <span><strong>AES-256</strong> Ledger Security</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="col-lg-5">
              <div className="aurora-card p-4 p-md-5" style={{
                boxShadow: '0 20px 40px -15px rgba(10, 25, 47, 0.12)',
                border: '1.5px solid #E2E8F0',
                borderRadius: '20px'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-success-subtle text-success">
                      <Calculator size={20} />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                      Fixed Yield Calculator
                    </h5>
                  </div>
                  <span className="badge-aurora-emerald">7.40% p.a.</span>
                </div>

                {/* Deposit Slider */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-semibold">Principal Deposit</span>
                    <span className="font-mono fw-bold text-dark fs-6">{formatCurrency(depositAmount)}</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                {/* Tenure Slider */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small fw-semibold">Investment Tenure</span>
                    <span className="font-mono fw-bold text-dark fs-6">{tenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="10"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                    <span>1 Year</span>
                    <span>10 Years</span>
                  </div>
                </div>

                {/* Output Breakdown */}
                <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #EDF2F7' }}>
                  <div className="d-flex justify-content-between py-1 small">
                    <span className="text-muted">Total Interest Accrued:</span>
                    <span className="font-mono fw-bold text-success">+{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-top mt-1 pt-1">
                    <span className="fw-semibold text-dark">Estimated Maturity:</span>
                    <span className="font-mono fw-bold text-dark fs-5">{formatCurrency(maturityValue)}</span>
                  </div>
                </div>

                <Link to="/transfers" className="btn-aurora-primary w-100 py-2 justify-content-center text-decoration-none">
                  Simulate Deposit Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Financial Rates Ticker */}
      <section className="py-3 bg-light border-bottom">
        <div className="container-fluid px-lg-5">
          <div className="row g-3 text-center">
            <div className="col-md-3 col-6">
              <div className="text-muted small">Savings Reserve APY</div>
              <div className="fw-bold font-mono text-success">6.85% <span className="small text-muted">Daily Accrual</span></div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-muted small">Fixed Term Vault</div>
              <div className="fw-bold font-mono text-dark">7.40% <span className="small text-muted">Quarterly Compound</span></div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-muted small">Instant IMPS/UPI Fee</div>
              <div className="fw-bold font-mono text-primary">₹0.00 <span className="small text-muted">100% Free</span></div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-muted small">Simulated Settlement Core</div>
              <div className="fw-bold font-mono text-success">Active <span className="small text-muted">v4.2</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Banking Features */}
      <section className="py-5 py-lg-6 bg-white">
        <div className="container-fluid px-lg-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: 'var(--aurora-navy)' }}>
              Engineered for Discerning Financial Control
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Built from first principles for instant liquidity, rigorous security controls, and transparent reporting.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="aurora-card p-4 h-100">
                <div className="p-3 rounded-3 bg-primary-subtle text-primary d-inline-block mb-3">
                  <Layers size={24} />
                </div>
                <h5 className="fw-bold mb-2">Multi-Vault Architecture</h5>
                <p className="text-secondary small mb-0">
                  Partition your finances cleanly between everyday checking, compound interest wealth reserves, and locked investment term vaults.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="aurora-card p-4 h-100">
                <div className="p-3 rounded-3 bg-success-subtle text-success d-inline-block mb-3">
                  <Zap size={24} />
                </div>
                <h5 className="fw-bold mb-2">Instant Settlement Hub</h5>
                <p className="text-secondary small mb-0">
                  Execute internal transfers, domestic bank wires (NEFT/RTGS), and UPI instant payments with zero latency and certified receipt generation.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="aurora-card p-4 h-100">
                <div className="p-3 rounded-3 bg-warning-subtle text-warning d-inline-block mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h5 className="fw-bold mb-2">Total Card Governance</h5>
                <p className="text-secondary small mb-0">
                  Instantly freeze lost cards, adjust daily online spend limits, toggle international payments, and reveal CVV with fine-grained access keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Callout Banner */}
      <section className="py-5" style={{ backgroundColor: 'var(--aurora-navy-dark)', color: '#FFFFFF' }}>
        <div className="container-fluid px-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2 text-success">
                <Lock size={18} />
                <span className="fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Institutional Grade</span>
              </div>
              <h3 className="fw-bold text-white mb-2">
                Simulated Sandbox with Production Design Integrity
              </h3>
              <p className="text-white-50 mb-0" style={{ maxWidth: '640px' }}>
                Every button, form, filter, and balance calculator is connected to a reactive state engine. Test transfers, export statements, and review audit logs in real time.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/transfers" className="btn-aurora-emerald px-4 py-3 text-decoration-none">
                Experience Transfer Flow
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
