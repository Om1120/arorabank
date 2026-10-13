import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeStatementModal } from '../../store/slices/uiSlice';
import { exportTransactionsToCSV } from '../../services/transactionService';
import { FileSpreadsheet, Printer, X, Download } from 'lucide-react';

export const StatementModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.activeStatementModal);
  const transactions = useSelector(state => state.transactions.transactions);
  const accounts = useSelector(state => state.accounts.accounts);

  const [selectedAcc, setSelectedAcc] = useState('ALL');
  const [datePeriod, setDatePeriod] = useState('ALL');

  if (!isOpen) return null;

  const filteredTxns = transactions.filter(t => {
    if (selectedAcc !== 'ALL' && t.accountId !== selectedAcc) return false;
    return true;
  });

  const handleExportCSV = () => {
    const accObj = accounts.find(a => a.id === selectedAcc);
    const label = accObj ? accObj.name.replace(/\s+/g, '_') : 'Aurora_All_Accounts';
    exportTransactionsToCSV(filteredTxns, label);
    dispatch(closeStatementModal());
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="aurora-modal-backdrop" onClick={() => dispatch(closeStatementModal())}>
      <div
        className="aurora-modal-card p-4 p-md-5 position-relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <button
          onClick={() => dispatch(closeStatementModal())}
          className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2 no-print"
        >
          <X size={18} />
        </button>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="p-3 rounded-3 bg-primary-subtle text-primary">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
              Generate Official Statement
            </h5>
            <p className="text-muted small mb-0">
              Download certified electronic ledger statements
            </p>
          </div>
        </div>

        <div className="mb-3">
          <label className="aurora-label">Account</label>
          <select
            className="aurora-select"
            value={selectedAcc}
            onChange={(e) => setSelectedAcc(e.target.value)}
          >
            <option value="ALL">All Consolidated Accounts ({accounts.length})</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.accountNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="aurora-label">Statement Period</label>
          <select
            className="aurora-select"
            value={datePeriod}
            onChange={(e) => setDatePeriod(e.target.value)}
          >
            <option value="ALL">Entire Transaction History (All Time)</option>
            <option value="30D">Last 30 Days (Current Cycle)</option>
            <option value="90D">Last Quarter (90 Days)</option>
            <option value="YTD">Current Financial Year (FY 2026-27)</option>
          </select>
        </div>

        <div className="p-3 rounded-3 bg-light border mb-4">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Matching Transactions:</span>
            <strong className="text-dark">{filteredTxns.length} records</strong>
          </div>
          <div className="d-flex justify-content-between small text-muted">
            <span>Format:</span>
            <strong className="text-dark">CSV Ledger & Print-Ready PDF</strong>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={handleExportCSV}
            className="btn btn-aurora-emerald flex-fill py-2"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={handlePrintStatement}
            className="btn btn-aurora-secondary flex-fill py-2"
          >
            <Printer size={16} />
            Print Statement
          </button>
        </div>
      </div>
    </div>
  );
};
