import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Layers,
  ArrowRightLeft,
  CreditCard,
  PieChart,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Send,
  Building2,
  LogOut,
  ChevronDown,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import {
  toggleMobileMenu,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  addToast
} from '../../store/slices/uiSlice';
import { loginAs, logout } from '../../store/slices/authSlice';
import { formatCurrency } from '../../services/transactionService';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.currentUser);
  const accounts = useSelector(state => state.accounts.accounts);
  const mobileMenuOpen = useSelector(state => state.ui.mobileMenuOpen);
  const notifications = useSelector(state => state.ui.notifications || []);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchPersona = (roleKey) => {
    dispatch(loginAs(roleKey));
    setUserDropdownOpen(false);
    dispatch(addToast({
      type: 'success',
      title: 'Persona Switched',
      message: `Now operating as ${roleKey === 'admin' ? 'Elena Rostova (Admin Operations)' : 'Alex Morgan (Private Client)'}.`
    }));
    navigate(roleKey === 'admin' ? '/admin' : '/dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    dispatch(addToast({
      type: 'info',
      title: 'Session Terminated',
      message: 'You have been signed out of the Aurora portal.'
    }));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 px-lg-4" style={{
      borderColor: 'var(--aurora-border)',
      boxShadow: '0 2px 10px rgba(10, 25, 47, 0.03)',
      zIndex: 1020
    }}>
      <div className="container-fluid px-0">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--aurora-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--aurora-emerald-light)',
            boxShadow: '0 4px 10px rgba(10, 25, 47, 0.15)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--aurora-navy)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              AURORA<span style={{ color: 'var(--aurora-emerald)' }}>.</span>
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--aurora-text-muted)',
              textTransform: 'uppercase'
            }}>
              Fintech Platform
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="navbar-toggler border-0 p-1 d-lg-none"
          type="button"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} color="#0F172A" /> : <Menu size={24} color="#0F172A" />}
        </button>

        {/* Desktop Nav Items */}
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold ${isActive('/dashboard') ? 'text-emerald fw-bold' : 'text-secondary'}`}
                style={{
                  color: isActive('/dashboard') ? 'var(--aurora-emerald)' : '#334155',
                  backgroundColor: isActive('/dashboard') ? 'var(--aurora-emerald-bg)' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/transfers"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold`}
                style={{
                  color: isActive('/transfers') ? 'var(--aurora-emerald)' : '#334155',
                  backgroundColor: isActive('/transfers') ? 'var(--aurora-emerald-bg)' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                Transfers
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/transactions"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold`}
                style={{
                  color: isActive('/transactions') ? 'var(--aurora-emerald)' : '#334155',
                  backgroundColor: isActive('/transactions') ? 'var(--aurora-emerald-bg)' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                History & Statements
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/cards"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold`}
                style={{
                  color: isActive('/cards') ? 'var(--aurora-emerald)' : '#334155',
                  backgroundColor: isActive('/cards') ? 'var(--aurora-emerald-bg)' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                Cards & Limits
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/analytics"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold`}
                style={{
                  color: isActive('/analytics') ? 'var(--aurora-emerald)' : '#334155',
                  backgroundColor: isActive('/analytics') ? 'var(--aurora-emerald-bg)' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin"
                className={`nav-link px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-1`}
                style={{
                  color: isActive('/admin') ? '#DC2626' : '#64748B',
                  backgroundColor: isActive('/admin') ? '#FEE2E2' : 'transparent',
                  fontSize: '0.9rem'
                }}
              >
                <ShieldCheck size={15} />
                Admin Portal
              </Link>
            </li>
          </ul>

          {/* Right Action Bar */}
          <div className="d-flex align-items-center gap-3">
            {/* Net Worth Quick Pill */}
            <div className="d-none d-xl-flex flex-column text-end">
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>TOTAL NET WORTH</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.925rem', color: 'var(--aurora-navy)' }}>
                {formatCurrency(totalNetWorth)}
              </span>
            </div>

            {/* Quick Send Button */}
            <Link to="/transfers" className="btn-aurora-emerald text-decoration-none py-2 px-3 shadow-sm" style={{ fontSize: '0.85rem' }}>
              <Send size={15} />
              Send Money
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="position-relative" ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="btn btn-light position-relative p-2 rounded-circle border shadow-sm"
                style={{ width: '38px', height: '38px', borderColor: 'var(--aurora-border)' }}
                aria-label="View notifications"
              >
                <Bell size={18} color="#334155" />
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-0"
                  style={{ width: '320px', zIndex: 1050, borderColor: 'var(--aurora-border)' }}
                >
                  <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Notifications</h6>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {unreadCount} unread alerts
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllNotificationsAsRead())}
                        className="btn btn-sm btn-link text-decoration-none text-success p-0"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted small">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => dispatch(markNotificationAsRead(n.id))}
                          className={`p-3 border-bottom cursor-pointer transition-all ${
                            n.read ? 'bg-white' : 'bg-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="fw-bold text-dark" style={{ fontSize: '0.825rem' }}>
                              {n.title}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                              {n.time}
                            </span>
                          </div>
                          <p className="text-secondary small mb-0" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 text-center bg-light border-top rounded-bottom">
                    <button
                      onClick={() => dispatch(clearNotifications())}
                      className="btn btn-sm btn-link text-muted text-decoration-none py-0"
                      style={{ fontSize: '0.72rem' }}
                    >
                      Clear all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="position-relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="btn d-flex align-items-center gap-2 p-1 border rounded-pill bg-light"
                style={{ borderColor: 'var(--aurora-border)' }}
                aria-expanded={userDropdownOpen}
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div className="text-start pe-2 d-none d-sm-block">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--aurora-navy)', lineHeight: 1.1 }}>
                    {currentUser?.name || 'Customer'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'capitalize' }}>
                    {currentUser?.role || 'Guest'}
                  </div>
                </div>
                <ChevronDown size={14} className="text-muted me-1" />
              </button>

              {userDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2"
                  style={{ width: '280px', zIndex: 1050, borderColor: 'var(--aurora-border)' }}
                >
                  {/* User Profile Info Card */}
                  <div className="p-3 mb-2 rounded-2 bg-light border">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <img
                        src={currentUser?.avatar}
                        alt={currentUser?.name}
                        className="rounded-circle border"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{currentUser?.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{currentUser?.email}</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.68rem' }}>
                        <CheckCircle2 size={11} className="me-1" />
                        KYC Verified
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary py-0 px-2" style={{ fontSize: '0.68rem' }}>
                        {currentUser?.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Persona Switcher Menu */}
                  <div className="px-2 py-1 text-uppercase text-muted fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                    Switch Demo Persona
                  </div>

                  <button
                    onClick={() => handleSwitchPersona('customer')}
                    className={`btn w-100 text-start d-flex align-items-center justify-content-between p-2 rounded-2 mb-1 ${
                      currentUser?.role === 'customer' ? 'bg-success-subtle text-success fw-bold' : 'hover-bg-light text-dark'
                    }`}
                    style={{ fontSize: '0.825rem' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <UserCheck size={16} />
                      <span>Alex Morgan (Client)</span>
                    </div>
                    {currentUser?.role === 'customer' && <CheckCircle2 size={14} />}
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('admin')}
                    className={`btn w-100 text-start d-flex align-items-center justify-content-between p-2 rounded-2 mb-2 ${
                      currentUser?.role === 'admin' ? 'bg-danger-subtle text-danger fw-bold' : 'hover-bg-light text-dark'
                    }`}
                    style={{ fontSize: '0.825rem' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>Elena Rostova (Admin Ops)</span>
                    </div>
                    {currentUser?.role === 'admin' && <CheckCircle2 size={14} />}
                  </button>

                  <div className="border-top pt-2">
                    <button
                      onClick={handleLogout}
                      className="btn w-100 text-start d-flex align-items-center gap-2 p-2 rounded-2 text-danger hover-bg-danger-subtle"
                      style={{ fontSize: '0.825rem' }}
                    >
                      <LogOut size={16} />
                      <span>Lock Session / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="d-lg-none w-100 pt-3 pb-2 border-top mt-2">
          <div className="d-flex flex-column gap-1">
            <Link
              to="/dashboard"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
                isActive('/dashboard') ? 'bg-emerald text-white' : 'text-dark'
              }`}
            >
              <Layers size={18} />
              Dashboard
            </Link>
            <Link
              to="/transfers"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
                isActive('/transfers') ? 'bg-emerald text-white' : 'text-dark'
              }`}
            >
              <ArrowRightLeft size={18} />
              Transfer Funds
            </Link>
            <Link
              to="/transactions"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
                isActive('/transactions') ? 'bg-emerald text-white' : 'text-dark'
              }`}
            >
              <Building2 size={18} />
              History & Statements
            </Link>
            <Link
              to="/cards"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
                isActive('/cards') ? 'bg-emerald text-white' : 'text-dark'
              }`}
            >
              <CreditCard size={18} />
              Cards & Limits
            </Link>
            <Link
              to="/analytics"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 ${
                isActive('/analytics') ? 'bg-emerald text-white' : 'text-dark'
              }`}
            >
              <PieChart size={18} />
              Wealth Analytics
            </Link>
            <Link
              to="/admin"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className={`p-2 rounded-2 fw-semibold text-decoration-none d-flex align-items-center gap-2 text-danger`}
            >
              <ShieldCheck size={18} />
              Admin Operations
            </Link>

            {/* Mobile Persona Switcher & Net Worth */}
            <div className="pt-3 mt-2 border-top d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Consolidated Net Worth:</span>
                <strong className="font-mono text-emerald">{formatCurrency(totalNetWorth)}</strong>
              </div>

              <div className="d-flex gap-2 mt-1">
                <button
                  onClick={() => { handleSwitchPersona('customer'); dispatch(toggleMobileMenu(false)); }}
                  className="btn btn-sm btn-outline-success flex-fill py-1"
                  style={{ fontSize: '0.785rem' }}
                >
                  Persona: Client
                </button>
                <button
                  onClick={() => { handleSwitchPersona('admin'); dispatch(toggleMobileMenu(false)); }}
                  className="btn btn-sm btn-outline-danger flex-fill py-1"
                  style={{ fontSize: '0.785rem' }}
                >
                  Persona: Admin
                </button>
              </div>

              <button
                onClick={() => { handleLogout(); dispatch(toggleMobileMenu(false)); }}
                className="btn btn-sm btn-outline-secondary w-100 mt-1 d-flex align-items-center justify-content-center gap-1"
                style={{ fontSize: '0.785rem' }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
