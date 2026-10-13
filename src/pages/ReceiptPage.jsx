import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../services/transactionService';

export const ReceiptPage = () => {
  const { id } = useParams();
  const transactions = useSelector(state => state.transactions.transactions);
  const accounts = useSelector(state => state.accounts.accounts);

  const txn = transactions.find(t => t.id === id || t.referenceId === id) || transactions[0];
  const sourceAccount = accounts.find(a => a.id === txn?.accountId);

  if (!txn) {
    return (
      <div className="container py-5 text-center">
        <h4>Transaction not found</h4>
        <Link to="/transactions" className="btn btn-aurora-primary mt-3">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ minHeight: '85vh', backgroundColor: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 no-print">
          <Link to="/transactions" className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <ArrowLeft size={16} />
            Back to Ledger
          </Link>
          <button onClick={() => window.print()} className="btn btn-aurora-primary d-flex align-items-center gap-2">
            <Printer size={16} />
            Print Receipt
          </button>
        </div>

        {/* Printable Card */}
        <div className="aurora-card p-4 p-md-5 bg-white shadow-sm border" style={{ borderRadius: '20px' }}>
          <div className="d-flex justify-content-between align-items-center pb-4 mb-4 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
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
                <span className="fw-bold fs-5 tracking-tight" style={{ color: 'var(--aurora-navy)' }}>
                  AURORA BANK LIMITED
                </span>
              </div>
              <div className="text-muted small">Electronic Clearance & Settlement Slip</div>
            </div>

            <div className="text-end">
              <span className="badge-aurora-emerald py-1 px-3">
                <ShieldCheck size={13} className="me-1" />
                SETTLED
              </span>
            </div>
          </div>

          <div className="text-center py-4 my-2 rounded-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
            <div className="text-muted small text-uppercase fw-semibold mb-1">Amount Transferred</div>
            <div className="font-mono fw-bold fs-2 text-dark">
              {formatCurrency(txn.amount)}
            </div>
            <div className="text-success small">Zero Processing Fee Applied</div>
          </div>

          <div className="d-flex flex-column gap-2 my-4" style={{ fontSize: '0.9rem' }}>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Transaction Reference:</span>
              <span className="font-mono fw-bold text-dark">{txn.referenceId}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Execution Timestamp:</span>
              <span className="text-dark fw-semibold">{formatDate(txn.timestamp || txn.date)} at {formatTime(txn.timestamp) || '12:00 PM'}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Debited Account:</span>
              <span className="text-end">
                <strong className="d-block text-dark">{sourceAccount?.name || 'Primary Checking'}</strong>
                <span className="font-mono text-muted small">{sourceAccount?.accountNumber}</span>
              </span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Beneficiary:</span>
              <span className="text-end">
                <strong className="d-block text-dark">{txn.counterparty}</strong>
                <span className="font-mono text-muted small">{txn.counterpartyAccount || 'Instant IMPS'}</span>
              </span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Settlement Rail:</span>
              <span className="badge bg-light text-dark border">{txn.method || 'IMPS'}</span>
            </div>
            {txn.balanceAfter !== undefined && (
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Running Balance After:</span>
                <span className="font-mono fw-bold text-success">{formatCurrency(txn.balanceAfter)}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-2 text-center text-muted small bg-light" style={{ fontSize: '0.75rem' }}>
            Aurora Bank Settlement Core v4.2 &bull; RSA-PSS 4096-bit Certified
            <br />
            Simulated demonstration ledger document.
          </div>
        </div>
      </div>
    </div>
  );
};
