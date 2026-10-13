import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginAs } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDemoLogin = (role) => {
    dispatch(loginAs(role));
    dispatch(addToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Signed in as ${role === 'admin' ? 'Elena Rostova (Admin Operations)' : 'Alex Morgan (Customer)'}`
    }));
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Determine role by email
    const isAdmin = values.email.toLowerCase().includes('admin');
    const role = isAdmin ? 'admin' : 'customer';
    dispatch(loginAs(role));
    dispatch(addToast({
      type: 'success',
      title: 'Authentication Successful',
      message: `Welcome to Aurora Bank, ${values.email.split('@')[0]}`
    }));
    setSubmitting(false);
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <div className="py-5" style={{ minHeight: '85vh', backgroundColor: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <div className="aurora-card overflow-hidden shadow-lg border-0" style={{ borderRadius: '24px' }}>
          <div className="row g-0">
            {/* Left Column: Branding & Value */}
            <div className="col-lg-5 p-5 text-white d-flex flex-column justify-content-between" style={{
              background: 'linear-gradient(135deg, #0A192F 0%, #172A45 100%)'
            }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--aurora-emerald-light)'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                  <span className="fw-bold fs-5 tracking-tight">AURORA BANK</span>
                </div>

                <h3 className="fw-bold mb-3 text-white">
                  Institutional Security, Refined Experience.
                </h3>
                <p className="text-white-50 small mb-4" style={{ lineHeight: 1.6 }}>
                  Log in to access your high-yield multi-vault accounts, instantaneous clearance transfers, and real-time ledger intelligence.
                </p>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2 text-white-50 small">
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>Real-time persistent transaction ledger</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-white-50 small">
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>Multi-vault wealth & high-yield APY</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-white-50 small">
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>Zero simulated transfer fees</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-top border-secondary border-opacity-25 mt-4">
                <span className="badge bg-white bg-opacity-10 text-white-50 py-1 px-2" style={{ fontSize: '0.7rem' }}>
                  Simulated Sandbox v4.2 &bull; No Real Money Moved
                </span>
              </div>
            </div>

            {/* Right Column: Form & Quick Demo Persona Switcher */}
            <div className="col-lg-7 p-4 p-md-5 bg-white">
              <div className="mb-4">
                <h4 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
                  Sign In to Aurora
                </h4>
                <p className="text-secondary small mb-0">
                  Select a preconfigured demo persona or enter test credentials.
                </p>
              </div>

              {/* 1-Click Demo Personas */}
              <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
                <div className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                  1-Click Quick Demo Personas
                </div>
                <div className="d-flex flex-column sm-flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="btn btn-outline-success d-flex align-items-center justify-content-between p-2 px-3 text-start flex-fill"
                    style={{ fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    <div>
                      <strong className="d-block text-dark">Alex Morgan (Customer)</strong>
                      <span className="text-muted small">Checking, Savings & Cards</span>
                    </div>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="btn btn-outline-danger d-flex align-items-center justify-content-between p-2 px-3 text-start flex-fill"
                    style={{ fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    <div>
                      <strong className="d-block text-dark">Elena Rostova (Admin)</strong>
                      <span className="text-muted small">Settlement & Operations Lead</span>
                    </div>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="position-relative text-center my-4">
                <hr className="text-muted" />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                  or sign in with credentials
                </span>
              </div>

              {/* Formik Form */}
              <Formik
                initialValues={{ email: 'alex.morgan@aurorabank.demo', password: 'password123' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="aurora-label" htmlFor="email">Email Address</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="aurora-input"
                        placeholder="you@domain.com"
                      />
                      <ErrorMessage name="email" component="div" className="aurora-error-text" />
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="aurora-label mb-0" htmlFor="password">Password</label>
                        <span className="text-muted small cursor-pointer" onClick={() => alert('Demo hint: Any password works!')}>
                          Forgot?
                        </span>
                      </div>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className="aurora-input"
                        placeholder="••••••••"
                      />
                      <ErrorMessage name="password" component="div" className="aurora-error-text" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-aurora-primary w-100 py-3 justify-content-center"
                    >
                      <Lock size={16} />
                      {isSubmitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-4 text-muted small">
                Don't have an account? <Link to="/register" className="text-success fw-semibold text-decoration-none">Create a Demo Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
