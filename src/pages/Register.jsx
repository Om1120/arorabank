import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginAs, updateProfile } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { UserCheck, ArrowRight } from 'lucide-react';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'Name too short').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the simulated demonstration terms')
});

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loginAs('customer'));
    dispatch(updateProfile({
      name: values.fullName,
      email: values.email,
      phone: values.phone
    }));
    dispatch(addToast({
      type: 'success',
      title: 'Demo Account Created',
      message: `Welcome to Aurora Bank, ${values.fullName}! ₹2,48,500 demo credits assigned.`
    }));
    setSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="py-5" style={{ minHeight: '85vh', backgroundColor: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="aurora-card p-4 p-md-5 shadow-lg border-0" style={{ borderRadius: '24px' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle bg-success-subtle text-success mb-2">
              <UserCheck size={32} />
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
              Open an Aurora Demo Account
            </h3>
            <p className="text-secondary small">
              Experience private digital wealth banking in under 60 seconds.
            </p>
          </div>

          <Formik
            initialValues={{
              fullName: 'Jordan Taylor',
              email: 'jordan.taylor@aurorabank.demo',
              phone: '+91 98111 22334',
              password: 'SecurePassword123!',
              acceptTerms: true
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label className="aurora-label" htmlFor="fullName">Full Legal Name</label>
                  <Field
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="aurora-input"
                    placeholder="e.g. Jordan Taylor"
                  />
                  <ErrorMessage name="fullName" component="div" className="aurora-error-text" />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <label className="aurora-label" htmlFor="phone">Phone Number</label>
                    <Field
                      type="text"
                      name="phone"
                      id="phone"
                      className="aurora-input"
                      placeholder="+91 98000 00000"
                    />
                    <ErrorMessage name="phone" component="div" className="aurora-error-text" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="aurora-label" htmlFor="password">Security Password</label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="aurora-input"
                    placeholder="Minimum 8 characters"
                  />
                  <ErrorMessage name="password" component="div" className="aurora-error-text" />
                </div>

                <div className="form-check mb-4">
                  <Field
                    type="checkbox"
                    name="acceptTerms"
                    id="acceptTerms"
                    className="form-check-input"
                  />
                  <label className="form-check-label text-secondary small" htmlFor="acceptTerms">
                    I acknowledge this is an educational simulation with simulated transactions.
                  </label>
                  <ErrorMessage name="acceptTerms" component="div" className="aurora-error-text" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-aurora-emerald w-100 py-3 justify-content-center"
                >
                  {isSubmitting ? 'Provisioning Account...' : 'Open Account Instantly'}
                  <ArrowRight size={16} />
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4 text-muted small">
            Already have an account? <Link to="/login" className="text-success fw-semibold text-decoration-none">Sign In Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
