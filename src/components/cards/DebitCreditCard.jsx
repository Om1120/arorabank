import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Snowflake, Wifi, Copy, Check } from 'lucide-react';
import { toggleCardFreeze } from '../../store/slices/accountsSlice';
import { addToast } from '../../store/slices/uiSlice';

export const DebitCreditCard = ({ card, account }) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFrozen = card?.status === 'FROZEN';

  const handleToggleFreeze = () => {
    dispatch(toggleCardFreeze(card.id));
    dispatch(addToast({
      type: isFrozen ? 'success' : 'error',
      title: isFrozen ? 'Card Unfrozen' : 'Card Frozen',
      message: `${card.type} is now ${isFrozen ? 'active and ready for transactions' : 'locked against all unauthorized activity'}.`
    }));
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(card.cardNumber.replace(/\s+/g, ''));
    setCopied(true);
    dispatch(addToast({
      type: 'info',
      title: 'Card Number Copied',
      message: 'Card number copied to clipboard.'
    }));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Visual Bank Card */}
      <div
        className={`virtual-bank-card ${card.theme || 'card-navy'} ${isFrozen ? 'opacity-75' : ''}`}
        style={{
          filter: isFrozen ? 'grayscale(0.6)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="card-pattern-overlay"></div>

        {/* Card Header */}
        <div className="d-flex justify-content-between align-items-center position-relative z-1">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.05em' }}>
              AURORA<span style={{ color: 'var(--aurora-emerald-light)' }}>.</span>
            </span>
            <span className="badge bg-white bg-opacity-25 text-white py-0 px-2" style={{ fontSize: '0.65rem' }}>
              {card.type}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Wifi size={18} style={{ transform: 'rotate(90deg)', opacity: 0.8 }} />
            {isFrozen ? (
              <span className="badge bg-danger py-1 px-2" style={{ fontSize: '0.68rem' }}>FROZEN</span>
            ) : (
              <span className="badge bg-success py-1 px-2" style={{ fontSize: '0.68rem' }}>ACTIVE</span>
            )}
          </div>
        </div>

        {/* Card Center: Chip & Contactless */}
        <div className="d-flex align-items-center justify-content-between my-3 position-relative z-1">
          <div className="card-chip"></div>
          <div className="text-end text-white-50" style={{ fontSize: '0.72rem' }}>
            {account?.name || 'Signature Checking'}
          </div>
        </div>

        {/* Card Number */}
        <div className="position-relative z-1 my-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="font-mono text-white fw-bold" style={{ fontSize: '1.2rem', letterSpacing: '0.12em' }}>
              {showDetails ? card.cardNumber : card.maskedNumber}
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-sm text-white-50 p-1 hover-white"
              title={showDetails ? 'Hide details' : 'Reveal details'}
              style={{ background: 'transparent', border: 'none' }}
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="d-flex justify-content-between align-items-end position-relative z-1 mt-2">
          <div>
            <div className="text-white-50 text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>CARDHOLDER</div>
            <div className="fw-bold text-white text-uppercase" style={{ fontSize: '0.85rem' }}>
              {card.cardHolder}
            </div>
          </div>

          <div className="d-flex gap-3 text-end">
            <div>
              <div className="text-white-50 text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>EXPIRES</div>
              <div className="font-mono fw-bold text-white" style={{ fontSize: '0.85rem' }}>
                {card.expiry}
              </div>
            </div>
            <div>
              <div className="text-white-50 text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>CVV</div>
              <div className="font-mono fw-bold text-white" style={{ fontSize: '0.85rem' }}>
                {showDetails ? card.cvv : '•••'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Quick Action Bar */}
      <div className="d-flex gap-2">
        <button
          onClick={handleToggleFreeze}
          className={`btn flex-fill d-flex align-items-center justify-content-center gap-1 py-2 ${
            isFrozen ? 'btn-outline-danger' : 'btn-outline-secondary'
          }`}
          style={{ fontSize: '0.825rem', borderRadius: '8px' }}
        >
          <Snowflake size={14} />
          {isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
        </button>

        <button
          onClick={handleCopyCard}
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-1 py-2 px-3"
          style={{ fontSize: '0.825rem', borderRadius: '8px' }}
          title="Copy Card Number"
        >
          {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
          <span className="d-none d-sm-inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
