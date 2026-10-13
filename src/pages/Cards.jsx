import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  CreditCard,
  Globe,
  Wifi,
  Sliders,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Snowflake,
  KeyRound,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';
import {
  updateCardControls,
  toggleCardFreeze,
  updateCardPin,
  replaceCard
} from '../store/slices/accountsSlice';
import { addToast } from '../store/slices/uiSlice';
import { DebitCreditCard } from '../components/cards/DebitCreditCard';
import { formatCurrency } from '../services/transactionService';

export const Cards = () => {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.accounts.cards);
  const accounts = useSelector(state => state.accounts.accounts);

  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || 'crd_01');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replaceReason, setReplaceReason] = useState('lost');

  const activeCard = cards.find(c => c.id === selectedCardId) || cards[0];
  const associatedAccount = accounts.find(a => a.id === activeCard?.accountId);
  const isFrozen = activeCard?.status === 'FROZEN';

  const handleLimitChange = (field, value) => {
    dispatch(updateCardControls({
      cardId: activeCard.id,
      [field]: Number(value)
    }));
    dispatch(addToast({
      type: 'info',
      title: 'Limit Updated',
      message: `${field === 'dailyOnlineLimit' ? 'Online spend limit' : 'ATM withdrawal limit'} adjusted to ₹${Number(value).toLocaleString('en-IN')}.`
    }));
  };

  const handleToggleFeature = (field) => {
    const nextVal = !activeCard[field];
    dispatch(updateCardControls({
      cardId: activeCard.id,
      [field]: nextVal
    }));
    dispatch(addToast({
      type: nextVal ? 'success' : 'error',
      title: 'Security Preference Saved',
      message: `${field === 'internationalAllowed' ? 'International payments' : 'Contactless NFC'} ${nextVal ? 'enabled' : 'disabled'}.`
    }));
  };

  const handleToggleFreeze = () => {
    dispatch(toggleCardFreeze(activeCard.id));
    dispatch(addToast({
      type: isFrozen ? 'success' : 'error',
      title: isFrozen ? 'Card Unfrozen' : 'Card Locked & Frozen',
      message: `${activeCard.type} is now ${isFrozen ? 'active and ready for transactions' : 'locked against all unauthorized activity'}.`
    }));
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      alert('Please enter a valid 4-digit numeric PIN.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('PIN confirmation does not match.');
      return;
    }

    dispatch(updateCardPin({
      cardId: activeCard.id,
      pin: newPin
    }));
    dispatch(addToast({
      type: 'success',
      title: 'PIN Changed Successfully',
      message: `Card PIN updated for ${activeCard.type} (${activeCard.maskedNumber.slice(-4)}).`
    }));
    setNewPin('');
    setConfirmPin('');
    setPinModalOpen(false);
  };

  const handleRequestReplacement = () => {
    // Generate new card numbers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCardNumber = `4532 8920 ${Math.floor(1000 + Math.random() * 9000)} ${randomSuffix}`;
    const newCvv = Math.floor(100 + Math.random() * 900).toString();

    dispatch(replaceCard({
      cardId: activeCard.id,
      newCardData: {
        cardNumber: newCardNumber,
        maskedNumber: `•••• •••• •••• ${randomSuffix}`,
        cvv: newCvv,
        expiry: '10/31',
        status: 'ACTIVE'
      }
    }));

    dispatch(addToast({
      type: 'success',
      title: 'New Virtual Card Issued',
      message: `Your replacement card (${randomSuffix}) has been instantly provisioned and activated.`
    }));
    setReplaceModalOpen(false);
  };

  return (
    <div className="cards-content py-4 px-lg-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)', letterSpacing: '-0.02em' }}>
          Cards & Security Governance
        </h2>
        <p className="text-secondary small mb-0">
          Manage virtual and physical cards, adjust granular transaction ceilings, and toggle international routing.
        </p>
      </div>

      {/* Card Selector Tabs */}
      <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
        {cards.map(c => {
          const isSelected = c.id === selectedCardId;
          const cardFrozen = c.status === 'FROZEN';
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCardId(c.id)}
              className={`btn d-flex align-items-center gap-2 py-2 px-3 rounded-3 text-nowrap ${
                isSelected ? 'btn-aurora-primary' : 'btn-aurora-secondary'
              }`}
            >
              <CreditCard size={16} />
              <span>{c.type}</span>
              <span className="badge bg-light text-dark font-mono ms-1" style={{ fontSize: '0.7rem' }}>
                {c.maskedNumber.slice(-4)}
              </span>
              {cardFrozen && (
                <span className="badge bg-danger text-white py-0 px-1" style={{ fontSize: '0.62rem' }}>
                  FROZEN
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="row g-4">
        {/* Left Column: 3D Visual Card & Actions */}
        <div className="col-lg-5">
          <div className="aurora-card p-4 mb-4">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
              Interactive Card Preview
            </h5>
            <DebitCreditCard card={activeCard} account={associatedAccount} />

            <div className="mt-4 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Card Network:</span>
                <strong className="text-dark font-mono">{activeCard.network}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Linked Vault:</span>
                <strong className="text-dark">{associatedAccount?.name || 'Signature Checking'}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Card Status:</span>
                <span className={activeCard.status === 'ACTIVE' ? 'badge-aurora-emerald' : 'badge-aurora-crimson'}>
                  {activeCard.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Security Actions Card */}
          <div className="aurora-card p-4">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
              Security & Protection Actions
            </h5>

            <div className="d-flex flex-column gap-2">
              {/* Quick Freeze Toggle */}
              <button
                onClick={handleToggleFreeze}
                className={`btn d-flex align-items-center justify-content-between p-3 rounded-3 ${
                  isFrozen ? 'btn-outline-success' : 'btn-outline-danger'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Snowflake size={16} />
                  <span>{isFrozen ? 'Unfreeze Card' : 'Lock / Freeze Card'}</span>
                </div>
                <span className="badge bg-light text-dark font-mono" style={{ fontSize: '0.7rem' }}>
                  {isFrozen ? 'LOCKED' : 'ACTIVE'}
                </span>
              </button>

              {/* Reset PIN Button */}
              <button
                onClick={() => setPinModalOpen(true)}
                className="btn btn-outline-secondary d-flex align-items-center justify-content-between p-3 rounded-3"
                style={{ fontSize: '0.85rem' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <KeyRound size={16} />
                  <span>Reset 4-Digit Card PIN</span>
                </div>
                <RefreshCw size={14} className="text-muted" />
              </button>

              {/* Replace Card Button */}
              <button
                onClick={() => setReplaceModalOpen(true)}
                className="btn btn-outline-secondary d-flex align-items-center justify-content-between p-3 rounded-3"
                style={{ fontSize: '0.85rem' }}
              >
                <div className="d-flex align-items-center gap-2 text-danger">
                  <AlertTriangle size={16} />
                  <span>Report Lost or Damaged Card</span>
                </div>
                <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '0.7rem' }}>
                  Replace
                </span>
              </button>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="pt-3 mt-3 border-top d-flex flex-column gap-2 text-muted small" style={{ fontSize: '0.785rem' }}>
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} color="#059669" />
                <span>PCI-DSS Level 1 Certified Tokenization</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 size={16} color="#059669" />
                <span>Zero Liability Protection for Unauthorized Spends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Limit Sliders & Security Switches */}
        <div className="col-lg-7">
          {/* Spend Limits Control */}
          <div className="aurora-card p-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                <Sliders size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                  Granular Daily Ceilings
                </h5>
                <p className="text-muted small mb-0">Adjust real-time authorization thresholds</p>
              </div>
            </div>

            {/* Online Transactions Slider */}
            <div className="mb-4 p-3 rounded-3 bg-light border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span className="fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>
                    Online & E-Commerce Ceiling
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Spent today: <strong className="text-dark font-mono">{formatCurrency(activeCard.currentOnlineSpend)}</strong>
                  </span>
                </div>
                <div className="font-mono fw-bold text-primary fs-5">
                  {formatCurrency(activeCard.dailyOnlineLimit)}
                </div>
              </div>
              <input
                type="range"
                className="form-range"
                min="10000"
                max="500000"
                step="5000"
                value={activeCard.dailyOnlineLimit}
                onChange={(e) => handleLimitChange('dailyOnlineLimit', e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                <span>₹10,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* ATM Withdrawal Limit Slider */}
            <div className="mb-2 p-3 rounded-3 bg-light border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span className="fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>
                    Daily ATM Cash Withdrawal Limit
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Spent today: <strong className="text-dark font-mono">{formatCurrency(activeCard.currentAtmSpend)}</strong>
                  </span>
                </div>
                <div className="font-mono fw-bold text-dark fs-5">
                  {formatCurrency(activeCard.dailyAtmLimit)}
                </div>
              </div>
              <input
                type="range"
                className="form-range"
                min="5000"
                max="200000"
                step="5000"
                value={activeCard.dailyAtmLimit}
                onChange={(e) => handleLimitChange('dailyAtmLimit', e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                <span>₹5,00,00</span>
                <span>₹2,00,000</span>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="aurora-card p-4">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
              Channel Access Controls
            </h5>

            <div className="d-flex flex-column gap-3">
              {/* International Usage */}
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-light text-dark">
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                      International Currency Settlement
                    </div>
                    <div className="text-muted small">
                      Authorize cross-border transactions and foreign exchange
                    </div>
                  </div>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={activeCard.internationalAllowed}
                    onChange={() => handleToggleFeature('internationalAllowed')}
                    style={{ width: '42px', height: '22px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Contactless */}
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-light text-dark">
                    <Wifi size={20} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                      Contactless NFC Tap-to-Pay
                    </div>
                    <div className="text-muted small">
                      Enable contactless payments under ₹5,000 without PIN
                    </div>
                  </div>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={activeCard.contactlessAllowed}
                    onChange={() => handleToggleFeature('contactlessAllowed')}
                    style={{ width: '42px', height: '22px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset PIN Modal */}
      {pinModalOpen && (
        <div className="aurora-modal-backdrop" onClick={() => setPinModalOpen(false)}>
          <div
            className="aurora-modal-card p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <button
              onClick={() => setPinModalOpen(false)}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2"
            >
              <X size={18} />
            </button>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                <KeyRound size={20} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Set New Card PIN
              </h5>
            </div>
            <p className="text-muted small mb-4">
              Enter your new 4-digit security PIN for ATM withdrawals and POS swipes.
            </p>

            <form onSubmit={handleSavePin}>
              <div className="mb-3">
                <label className="aurora-label">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="aurora-input font-mono text-center fs-4"
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-4">
                <label className="aurora-label">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="aurora-input font-mono text-center fs-4"
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="btn btn-aurora-secondary flex-fill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-aurora-primary flex-fill"
                >
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replace Card Modal */}
      {replaceModalOpen && (
        <div className="aurora-modal-backdrop" onClick={() => setReplaceModalOpen(false)}>
          <div
            className="aurora-modal-card p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <button
              onClick={() => setReplaceModalOpen(false)}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2"
            >
              <X size={18} />
            </button>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                <ShieldAlert size={22} />
              </div>
              <h5 className="fw-bold mb-0 text-danger">
                Card Replacement Request
              </h5>
            </div>
            <p className="text-muted small mb-3">
              Existing card ending in <strong>{activeCard.maskedNumber.slice(-4)}</strong> will be permanently deactivated, and a new virtual card with updated PAN will be generated instantly.
            </p>

            <div className="mb-3">
              <label className="aurora-label">Reason for Replacement</label>
              <select
                className="aurora-select"
                value={replaceReason}
                onChange={(e) => setReplaceReason(e.target.value)}
              >
                <option value="lost">Lost or Stolen Physical Card</option>
                <option value="compromised">Suspicious / Unauthorized Transaction Observed</option>
                <option value="damaged">Damaged Chip / Card Renewal</option>
              </select>
            </div>

            <div className="p-3 rounded-3 bg-light border mb-4">
              <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
                <Check size={16} /> Instant Virtual Provisioning (Zero Delay)
              </div>
              <div className="text-muted small mt-1">
                Your new virtual card will be ready for online payments immediately.
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => setReplaceModalOpen(false)}
                className="btn btn-aurora-secondary flex-fill"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestReplacement}
                className="btn btn-danger flex-fill"
              >
                Deactivate & Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
