import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeReceiptModal, addToast } from '../../store/slices/uiSlice';
import { Printer, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../services/transactionService';

export const ReceiptModal = () => {
  const dispatch = useDispatch();
  const txn = useSelector(state => state.ui.activeReceiptModal);
  const accounts = useSelector(state => state.accounts.accounts);

  if (!txn) return null;

  const sourceAccount = accounts.find(a => a.id === txn.accountId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptText = `
========================================
           AURORA BANK LIMITED
   Official Transaction Clearance Receipt
========================================
Reference ID    : ${txn.referenceId}
Status          : ${txn.status} (SETTLED)
Timestamp       : ${txn.timestamp || txn.date}
Amount          : INR ${txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Type            : ${txn.type} (${txn.method || 'Standard'})
Category        : ${txn.category}
Source Account  : ${sourceAccount?.name || 'Aurora Checking'} (${sourceAccount?.accountNumber || 'AUR-8829-4102-991'})
Beneficiary     : ${txn.counterparty} (${txn.counterpartyAccount || 'N/A'})
Description     : ${txn.description}
Transfer Fee    : INR 0.00 (Zero Fee Waiver)
Balance After   : INR ${txn.balanceAfter ? txn.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 'N/A'}
Auth Algorithm  : RSA-PSS 4096-bit Digital Signature
Simulated Core  : Aurora Settlement Engine v4.2
========================================
Notice: This is a verified simulated ledger receipt.
========================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aurora_Receipt_${txn.referenceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    dispatch(addToast({
      type: 'info',
      title: 'Receipt Downloaded',
      message: `Receipt text saved for ${txn.referenceId}`
    }));
  };

  return (
    <div className="aurora-modal-backdrop" onClick={() => dispatch(closeReceiptModal())}>
      <div
        className="aurora-modal-card p-3 p-md-4 position-relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px', maxHeight: '88vh', overflowY: 'auto' }}
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeReceiptModal())}
          className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2 no-print"
          style={{ width: '36px', height: '36px', zIndex: 10 }}
          aria-label="Close receipt"
        >
          <X size={18} />
        </button>

        {/* Bank Header */}
        <div className="text-center mb-3">
          <div className="d-inline-flex align-items-center justify-content-center p-2 rounded-circle bg-success-subtle mb-2">
            <CheckCircle size={32} color="#059669" />
          </div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)', fontSize: '1.25rem' }}>
            Transaction Cleared
          </h4>
          <span className="badge-aurora-emerald py-1 px-3" style={{ fontSize: '0.75rem' }}>
            <ShieldCheck size={13} className="me-1" />
            Institutional Settlement Verified
          </span>
        </div>

        {/* Amount Big Display */}
        <div className="text-center py-2 px-3 my-2 rounded-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
          <div className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.05em', fontSize: '0.72rem' }}>
            Amount Transferred
          </div>
          <div className="font-mono fw-bold text-dark my-1" style={{ fontSize: '1.75rem' }}>
            {formatCurrency(txn.amount)}
          </div>
          <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
            Transfer Fee: <strong className="text-success">₹0.00 (Zero Fee Waiver)</strong>
          </div>
        </div>

        {/* Metadata Details List */}
        <div className="d-flex flex-column gap-1 my-3" style={{ fontSize: '0.825rem' }}>
          <div className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Reference ID</span>
            <span className="font-mono fw-bold text-dark">{txn.referenceId}</span>
          </div>

          <div className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Date & Time</span>
            <span className="text-dark fw-semibold">
              {formatDate(txn.timestamp || txn.date)} at {formatTime(txn.timestamp) || '12:00 PM'}
            </span>
          </div>

          <div className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Debited From</span>
            <span className="text-end">
              <strong className="d-block text-dark">{sourceAccount?.name || 'Primary Checking'}</strong>
              <span className="font-mono text-muted small">{sourceAccount?.accountNumber || 'AUR-8829-4102-991'}</span>
            </span>
          </div>

          <div className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Beneficiary</span>
            <span className="text-end">
              <strong className="d-block text-dark">{txn.counterparty}</strong>
              <span className="font-mono text-muted small">{txn.counterpartyAccount || 'UPI / Instant Cleared'}</span>
            </span>
          </div>

          <div className="d-flex justify-content-between py-1 border-bottom">
            <span className="text-muted">Payment Rail</span>
            <span className="badge bg-light text-dark border px-2 py-0 fw-semibold" style={{ fontSize: '0.72rem' }}>
              {txn.method || 'IMPS Instant'}
            </span>
          </div>

          {txn.balanceAfter !== undefined && (
            <div className="d-flex justify-content-between py-1 border-bottom">
              <span className="text-muted">Balance After</span>
              <span className="font-mono fw-bold text-success">
                {formatCurrency(txn.balanceAfter)}
              </span>
            </div>
          )}

          {txn.notes && (
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted">Remarks</span>
              <span className="text-dark">{txn.notes}</span>
            </div>
          )}
        </div>

        {/* Digital Seal */}
        <div className="p-2 rounded-2 text-center text-muted small mb-3" style={{ backgroundColor: '#F1F5F9', fontSize: '0.72rem' }}>
          Aurora Bank Core Token: <span className="font-mono">AUR-SEC-{txn.referenceId.slice(-6)}</span>
        </div>

        {/* Modal Buttons */}
        <div className="d-flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="btn btn-aurora-secondary flex-fill py-2"
            style={{ fontSize: '0.85rem' }}
          >
            <Printer size={15} />
            Print Slip
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-aurora-primary flex-fill py-2"
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={15} />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};
