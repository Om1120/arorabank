import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  ArrowRightLeft,
  ReceiptText,
  CreditCard,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { selectAccount } from '../../store/slices/accountsSlice';
import { addToast } from '../../store/slices/uiSlice';
import { formatCurrency } from '../../services/transactionService';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(state => state.accounts.accounts);
  const selectedAccountId = useSelector(state => state.accounts.selectedAccountId);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    dispatch(addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: `${label} (${text}) copied.`
    }));
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Money Transfers', path: '/transfers', icon: ArrowRightLeft },
    { name: 'Transaction History', path: '/transactions', icon: ReceiptText },
    { name: 'Cards & Security', path: '/cards', icon: CreditCard },
    { name: 'Financial Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Admin Portal', path: '/admin', icon: ShieldCheck, badge: 'Ops' }
  ];

  return (
    <aside aria-label="Primary Navigation" className="d-flex flex-column h-100 p-3 no-print" style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--aurora-border)'
    }}>
      {/* Navigation Links */}
      <div className="mb-4">
        <div className="text-uppercase fw-bold text-muted px-2 mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
          Menu
        </div>
        <div className="d-flex flex-column gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-decoration-none transition-all
                  ${isActive
                    ? 'bg-light text-success fw-bold border-start border-4 border-success'
                    : 'text-secondary fw-semibold'
                  }
                `}
                style={{
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Icon size={18} style={{ opacity: 0.85 }} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Account Quick Switcher */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between px-2 mb-2">
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
            Accounts
          </span>
          <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.65rem' }}>
            {accounts.length} Active
          </span>
        </div>

        <div className="d-flex flex-column gap-2">
          {accounts.map(acc => {
            const isSelected = acc.id === selectedAccountId;
            return (
              <div
                key={acc.id}
                onClick={() => dispatch(selectAccount(acc.id))}
                className="p-2 rounded-3 cursor-pointer"
                style={{
                  backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                  border: isSelected ? '1.5px solid var(--aurora-emerald)' : '1px solid var(--aurora-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-semibold text-truncate" style={{ fontSize: '0.785rem', color: 'var(--aurora-navy)', maxWidth: '140px' }}>
                    {acc.name}
                  </span>
                  {isSelected && <CheckCircle2 size={13} color="#059669" />}
                </div>
                <div className="font-mono fw-bold" style={{ fontSize: '0.9rem', color: isSelected ? 'var(--aurora-emerald)' : '#334155' }}>
                  {formatCurrency(acc.balance)}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
                    {acc.accountNumber.slice(-8)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(acc.accountNumber, 'Account Number');
                    }}
                    className="btn p-0 text-muted"
                    title="Copy Account Number"
                    style={{ fontSize: '0.7rem' }}
                  >
                    <Copy size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status Footer Box */}
      <div className="mt-auto p-3 rounded-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '8px', height: '8px' }} role="status"></span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Aurora Core v4.2</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
          Simulated Settlement: <strong className="text-success">0ms latency</strong>
        </div>
        <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px' }}>
          256-bit TLS Encrypted Session
        </div>
      </div>
    </aside>
  );
};
