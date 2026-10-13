import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { loginAs } from '../../store/slices/authSlice';
import { resetAccounts } from '../../store/slices/accountsSlice';
import { resetTransactions } from '../../store/slices/transactionsSlice';
import { resetPayees } from '../../store/slices/payeesSlice';
import { addToast } from '../../store/slices/uiSlice';
import { storageService } from '../../services/storageService';

export const DisclaimerBanner = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);

  const handleResetData = () => {
    if (window.confirm('Reset all demo balances, transactions, and settings to original pristine state?')) {
      const reset = storageService.resetAll();
      dispatch(resetAccounts({ accounts: reset.accounts, cards: reset.cards }));
      dispatch(resetTransactions(reset.transactions));
      dispatch(resetPayees(reset.payees));
      dispatch(loginAs('customer'));
      dispatch(addToast({
        type: 'info',
        title: 'Demo Environment Reset',
        message: 'All accounts, cards, and transaction records restored to initial state.'
      }));
    }
  };

  const handleToggleRole = () => {
    const nextRole = currentUser?.role === 'admin' ? 'customer' : 'admin';
    dispatch(loginAs(nextRole));
    dispatch(addToast({
      type: 'info',
      title: `Switched Persona to ${nextRole === 'admin' ? 'Elena Rostova (Admin)' : 'Alex Morgan (Customer)'}`,
      message: `You now have ${nextRole === 'admin' ? 'Administrative Operations' : 'Personal Banking'} privileges.`
    }));
  };

  return (
    <aside aria-label="Simulated Environment Disclaimer" className="no-print" style={{
      backgroundColor: '#070e1c',
      color: '#CBD5E1',
      fontSize: '0.815rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0.45rem 1rem'
    }}>
      <div className="container-fluid px-lg-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge-aurora-gold px-2 py-0" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
            <ShieldAlert size={12} className="me-1" />
            SIMULATED DEMO
          </span>
          <span className="d-none d-md-inline" style={{ color: '#94A3B8' }}>
            Portfolio Prototype: Educational banking simulation. No real funds or fiat transfers occur.
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
          <button
            onClick={handleToggleRole}
            className="btn btn-sm text-nowrap d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: currentUser?.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              color: currentUser?.role === 'admin' ? '#FCA5A5' : '#6EE7B7',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem'
            }}
            title="Switch demo role"
          >
            <ArrowRightLeft size={12} />
            Active Role: <strong className="text-white text-capitalize">{currentUser?.role || 'Guest'}</strong> ({currentUser?.name?.split(' ')[0]})
          </button>

          <button
            onClick={handleResetData}
            className="btn btn-sm text-nowrap d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#CBD5E1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem'
            }}
            title="Reset demo data to initial balances"
          >
            <RefreshCw size={12} />
            Reset Data
          </button>
        </div>
      </div>
    </aside>
  );
};
