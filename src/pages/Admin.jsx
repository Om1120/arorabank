import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Lock,
  Unlock,
  CheckCircle2,
  PlusCircle,
  Flag,
  RotateCcw,
  RefreshCw,
  Server,
  Zap,
  AlertTriangle,
  X
} from 'lucide-react';
import {
  toggleAccountStatus,
  updateAccountBalance,
  addAccount,
  resetAccounts
} from '../store/slices/accountsSlice';
import {
  flagTransaction,
  approveTransaction,
  addTransaction,
  resetTransactions
} from '../store/slices/transactionsSlice';
import { addToast } from '../store/slices/uiSlice';
import { formatCurrency, formatDate, generateReferenceId } from '../services/transactionService';
import { storageService } from '../services/storageService';

function createAdminDepositTransaction(accId, refId, amount, newBal) {
  const now = new Date();
  return {
    id: `txn_${now.getTime()}`,
    referenceId: refId,
    accountId: accId,
    date: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),
    type: 'CREDIT',
    amount: amount,
    category: 'Investments',
    description: 'Admin Capital Credit / Liquidity Injection',
    counterparty: 'Aurora Operations Clearing Core',
    counterpartyAccount: 'AUR-ADMIN-CORE-001',
    method: 'RTGS Gross',
    status: 'COMPLETED',
    balanceAfter: newBal,
    notes: 'Administrative sandbox liquidity allotment'
  };
}

function createNewAccountPayload(name, type, balance) {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newAccNumber = `AUR-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;
  const newAccId = `acc_${type.toLowerCase().slice(0, 3)}_${Date.now()}`;
  return {
    id: newAccId,
    name: name.trim(),
    accountNumber: newAccNumber,
    type: type,
    currency: 'INR',
    symbol: '₹',
    balance: balance,
    status: 'ACTIVE',
    ifsc: 'AURB0002941',
    branch: 'Bandra Kurla Complex, Mumbai',
    color: type === 'Checking' ? '#0F172A' : type === 'Savings' ? '#059669' : '#D97706',
    tag: 'Admin Provisioned'
  };
}

export const Admin = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(state => state.accounts.accounts);
  const transactions = useSelector(state => state.transactions.transactions);
  const currentUser = useSelector(state => state.auth.currentUser);

  const [simAmount, setSimAmount] = useState('50000');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newAccountModalOpen, setNewAccountModalOpen] = useState(false);

  // New Account form state
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState('Checking');
  const [accBal, setAccBal] = useState('100000');

  // Admin Account Action: Freeze or Activate
  const handleToggleFreezeAccount = (acc) => {
    dispatch(toggleAccountStatus(acc.id));
    dispatch(addToast({
      type: acc.status === 'FROZEN' ? 'success' : 'error',
      title: 'Administrative Account Action',
      message: `${acc.name} has been ${acc.status === 'FROZEN' ? 'RESTORED to ACTIVE' : 'FROZEN for compliance review'}.`
    }));
  };

  // Admin Action: Inject Funds / Deposit Simulation
  const handleSimulateDeposit = (accId) => {
    const amount = parseFloat(simAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid injection amount');
      return;
    }

    const acc = accounts.find(a => a.id === accId);
    if (!acc) return;

    const refId = generateReferenceId();
    const newBal = parseFloat((acc.balance + amount).toFixed(2));

    // Update account balance
    dispatch(updateAccountBalance({
      accountId: accId,
      deltaAmount: amount
    }));

    // Record credit transaction using pure external helper
    const depositTxn = createAdminDepositTransaction(accId, refId, amount, newBal);
    dispatch(addTransaction(depositTxn));

    dispatch(addToast({
      type: 'success',
      title: 'Admin Liquidity Injected',
      message: `Successfully credited ${formatCurrency(amount)} to ${acc.name}. Ref: ${refId}`
    }));
  };

  // Flag or approve transaction
  const handleToggleFlag = (txn) => {
    if (txn.status === 'FLAGGED') {
      dispatch(approveTransaction(txn.id));
      dispatch(addToast({
        type: 'success',
        title: 'Compliance Cleared',
        message: `Transaction ${txn.referenceId} marked as COMPLETED and cleared.`
      }));
    } else {
      dispatch(flagTransaction(txn.id));
      dispatch(addToast({
        type: 'error',
        title: 'Transaction Flagged',
        message: `Transaction ${txn.referenceId} flagged for audit review.`
      }));
    }
  };

  // Reset to Factory Default
  const handleConfirmReset = () => {
    const initialData = storageService.resetAll();
    dispatch(resetAccounts({
      accounts: initialData.accounts,
      cards: initialData.cards
    }));
    dispatch(resetTransactions(initialData.transactions));
    setResetModalOpen(false);
    dispatch(addToast({
      type: 'info',
      title: 'Ledger Reset Complete',
      message: 'Aurora Bank demonstration environment restored to clean factory state.'
    }));
  };

  // Provision New Account
  const handleCreateNewAccount = (e) => {
    e.preventDefault();
    if (!accName.trim()) {
      alert('Please enter an account name');
      return;
    }
    const balanceNum = parseFloat(accBal) || 0;
    const newAccObj = createNewAccountPayload(accName, accType, balanceNum);
    dispatch(addAccount(newAccObj));
    dispatch(addToast({
      type: 'success',
      title: 'New Account Provisioned',
      message: `${accName} (${newAccNumber}) opened with ${formatCurrency(balanceNum)} balance.`
    }));

    setAccName('');
    setAccBal('100000');
    setNewAccountModalOpen(false);
  };

  return (
    <div className="admin-content py-4 px-lg-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0 text-danger" style={{ letterSpacing: '-0.02em' }}>
              Bank Operations & Risk Console
            </h2>
            <span className="badge bg-danger py-1 px-2">ELEVATED PRIVILEGES</span>
          </div>
          <p className="text-secondary small mb-0">
            Real-time multi-account governance, compliance audit queues, and liquidity simulation engines.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Create Account Button */}
          <button
            onClick={() => setNewAccountModalOpen(true)}
            className="btn btn-aurora-primary py-2 px-3 shadow-sm d-flex align-items-center gap-2"
            style={{ fontSize: '0.85rem' }}
          >
            <PlusCircle size={15} />
            <span>Provision Account</span>
          </button>

          {/* Factory Reset Button */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="btn btn-outline-danger py-2 px-3 shadow-sm d-flex align-items-center gap-2"
            style={{ fontSize: '0.85rem' }}
            title="Reset sandbox state to factory initial balances"
          >
            <RotateCcw size={15} />
            <span>Reset Demo State</span>
          </button>

          <div className="p-2 px-3 rounded-pill bg-danger-subtle text-danger border border-danger-subtle small fw-bold d-flex align-items-center gap-2">
            <Server size={14} />
            <span>Operator: {currentUser?.name || 'Elena Rostova'}</span>
          </div>
        </div>
      </div>

      {/* Operations Telemetry Bar */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Settlement Engine
            </span>
            <div className="d-flex align-items-center gap-2 my-1">
              <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
              <span className="fw-bold text-success fs-5">100% OPERATIONAL</span>
            </div>
            <div className="text-muted small">0ms Simulated Latency</div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Total Ledger Records
            </span>
            <div className="font-mono fw-bold fs-4 text-dark my-1">
              {transactions.length} <span className="small text-muted fs-6">txns</span>
            </div>
            <div className="text-muted small">Persisted in client storage</div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Flagged Transactions
            </span>
            <div className="font-mono fw-bold fs-4 text-danger my-1">
              {transactions.filter(t => t.status === 'FLAGGED').length}
            </div>
            <div className="text-muted small">Requiring risk officer clearance</div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Security Protocol
            </span>
            <div className="fw-bold fs-5 text-dark my-1">
              AES-256-GCM
            </div>
            <div className="text-muted small">Full TLS 1.3 payload encryption</div>
          </div>
        </div>
      </div>

      {/* Account Management & Liquidity Injection */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="aurora-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Client Accounts Oversight & Status Controls
              </h5>
              <span className="badge bg-light text-dark border">
                {accounts.length} Active Vaults
              </span>
            </div>

            <div className="table-responsive">
              <table className="aurora-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => {
                    const isFrozen = acc.status === 'FROZEN';
                    return (
                      <tr key={acc.id}>
                        <td>
                          <div className="fw-bold text-dark">{acc.name}</div>
                          <div className="text-muted small">{acc.type}</div>
                        </td>
                        <td className="font-mono text-muted small">{acc.accountNumber}</td>
                        <td className="font-mono fw-bold text-dark">{formatCurrency(acc.balance)}</td>
                        <td>
                          {isFrozen ? (
                            <span className="badge bg-danger py-1 px-2">FROZEN</span>
                          ) : (
                            <span className="badge bg-success py-1 px-2">ACTIVE</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleToggleFreezeAccount(acc)}
                            className={`btn btn-sm py-1 px-2 ${isFrozen ? 'btn-outline-success' : 'btn-outline-danger'}`}
                            style={{ fontSize: '0.785rem' }}
                          >
                            {isFrozen ? <Unlock size={13} className="me-1" /> : <Lock size={13} className="me-1" />}
                            {isFrozen ? 'Restore' : 'Freeze'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-time Liquidity Injection Tool */}
        <div className="col-lg-4">
          <div className="aurora-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                <Zap size={20} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Liquidity Injection
              </h5>
            </div>
            <p className="text-muted small mb-3">
              Directly credit simulated capital to any client vault for stress testing.
            </p>

            <div className="mb-3">
              <label className="aurora-label">Injection Amount (INR)</label>
              <input
                type="number"
                className="aurora-input font-mono"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
              />
            </div>

            <div className="d-flex flex-column gap-2">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => handleSimulateDeposit(acc.id)}
                  className="btn btn-outline-secondary d-flex justify-content-between align-items-center p-2 text-start"
                  style={{ fontSize: '0.825rem', borderRadius: '8px' }}
                >
                  <span className="text-truncate">{acc.name}</span>
                  <span className="badge bg-success text-white">+ Inject</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Transaction Compliance & Flagging Queue */}
      <div className="aurora-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
              Global Transaction Compliance & Audit Queue
            </h5>
            <p className="text-muted small mb-0">Flag suspicious transfers or clear pending compliance flags</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="aurora-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference ID</th>
                <th>Counterparty</th>
                <th>Method</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
                <th className="text-end">Risk Control</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(txn => {
                const isFlagged = txn.status === 'FLAGGED';
                return (
                  <tr key={txn.id} style={{ backgroundColor: isFlagged ? '#FEF2F2' : 'transparent' }}>
                    <td className="font-mono text-muted small">{formatDate(txn.date)}</td>
                    <td className="font-mono small">{txn.referenceId}</td>
                    <td className="fw-semibold text-dark">{txn.counterparty}</td>
                    <td className="text-muted small">{txn.method}</td>
                    <td className="text-end font-mono fw-bold text-dark">{formatCurrency(txn.amount)}</td>
                    <td>
                      {isFlagged ? (
                        <span className="badge bg-danger">FLAGGED</span>
                      ) : (
                        <span className="badge bg-success">CLEARED</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleToggleFlag(txn)}
                        className={`btn btn-sm py-1 px-2 ${isFlagged ? 'btn-success' : 'btn-outline-danger'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {isFlagged ? (
                          <>
                            <CheckCircle2 size={13} className="me-1" />
                            Approve
                          </>
                        ) : (
                          <>
                            <Flag size={13} className="me-1" />
                            Flag
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="aurora-modal-backdrop" onClick={() => setResetModalOpen(false)}>
          <div
            className="aurora-modal-card p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '460px' }}
          >
            <button
              onClick={() => setResetModalOpen(false)}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2"
            >
              <X size={18} />
            </button>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                <AlertTriangle size={24} />
              </div>
              <h5 className="fw-bold mb-0 text-danger">
                Restore Factory Demo State?
              </h5>
            </div>
            <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
              This will wipe all injected transactions and restore the standard simulated accounts, cards, and starting balances.
            </p>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="btn btn-aurora-secondary flex-fill"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="btn btn-danger flex-fill d-flex align-items-center justify-content-center gap-2"
              >
                <RefreshCw size={15} />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision New Account Modal */}
      {newAccountModalOpen && (
        <div className="aurora-modal-backdrop" onClick={() => setNewAccountModalOpen(false)}>
          <div
            className="aurora-modal-card p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <button
              onClick={() => setNewAccountModalOpen(false)}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2"
            >
              <X size={18} />
            </button>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-success-subtle text-success">
                <PlusCircle size={22} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Provision New Client Vault
              </h5>
            </div>
            <p className="text-muted small mb-4">
              Create an institutional checking, savings, or term vault linked to the client's master profile.
            </p>

            <form onSubmit={handleCreateNewAccount}>
              <div className="mb-3">
                <label className="aurora-label">Vault Name</label>
                <input
                  type="text"
                  className="aurora-input"
                  placeholder="e.g. European Treasury Vault EUR"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="aurora-label">Vault Classification</label>
                <select
                  className="aurora-select"
                  value={accType}
                  onChange={(e) => setAccType(e.target.value)}
                >
                  <option value="Checking">Liquid Checking (0.0% Yield)</option>
                  <option value="Savings">High-Yield Reserve (6.85% APY)</option>
                  <option value="Vault">Term Growth Vault (7.40% Fixed)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="aurora-label">Initial Balance (INR)</label>
                <input
                  type="number"
                  className="aurora-input font-mono"
                  placeholder="100000"
                  value={accBal}
                  onChange={(e) => setAccBal(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewAccountModalOpen(false)}
                  className="btn btn-aurora-secondary flex-fill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-aurora-emerald flex-fill"
                >
                  Provision & Allocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
