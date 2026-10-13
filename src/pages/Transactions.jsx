import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Download,
  Printer,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Copy,
  AlertCircle
} from 'lucide-react';
import { openReceiptModal, openStatementModal, addToast } from '../store/slices/uiSlice';
import { formatCurrency, formatDate, exportTransactionsToCSV } from '../services/transactionService';

export const Transactions = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions.transactions);
  const accounts = useSelector(state => state.accounts.accounts);

  // Local Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Filter logic
  const filtered = transactions.filter(t => {
    if (accountFilter !== 'ALL' && t.accountId !== accountFilter) return false;
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCounter = t.counterparty?.toLowerCase().includes(q);
      const matchRef = t.referenceId?.toLowerCase().includes(q);
      if (!matchDesc && !matchCounter && !matchRef) return false;
    }
    return true;
  });

  const totalCredits = filtered
    .filter(t => t.type === 'CREDIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebits = filtered
    .filter(t => t.type === 'DEBIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCopy = (refId) => {
    navigator.clipboard.writeText(refId);
    dispatch(addToast({
      type: 'info',
      title: 'Reference Copied',
      message: `${refId} copied to clipboard.`
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setAccountFilter('ALL');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
  };

  return (
    <div className="transactions-content py-4 px-lg-4">
      {/* Header & Export Actions */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)', letterSpacing: '-0.02em' }}>
            Ledger & Transaction History
          </h2>
          <p className="text-secondary small mb-0">
            Certified cryptographic audit trail across all personal and vault accounts.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => exportTransactionsToCSV(filtered, 'Aurora_Ledger_Export')}
            className="btn btn-aurora-secondary py-2 px-3 shadow-sm"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={() => dispatch(openStatementModal())}
            className="btn btn-aurora-primary py-2 px-3 shadow-sm"
          >
            <Printer size={15} />
            Statement Generator
          </button>
        </div>
      </div>

      {/* Summary Volume Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="aurora-card p-3">
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Filtered Transactions
            </span>
            <div className="font-mono fw-bold fs-4 text-dark my-1">
              {filtered.length} <span className="small text-muted fs-6">entries</span>
            </div>
            <div className="text-muted small">Total recorded in ledger</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="aurora-card p-3" style={{ borderLeft: '4px solid var(--aurora-emerald)' }}>
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Total Inflow (Credits)
            </span>
            <div className="font-mono fw-bold fs-4 text-success my-1">
              +{formatCurrency(totalCredits)}
            </div>
            <div className="text-muted small">Income, deposits, dividends</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="aurora-card p-3" style={{ borderLeft: '4px solid #EF4444' }}>
            <span className="text-muted small fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Total Outflow (Debits)
            </span>
            <div className="font-mono fw-bold fs-4 text-danger my-1">
              -{formatCurrency(totalDebits)}
            </div>
            <div className="text-muted small">Transfers, expenses, bills</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="aurora-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search Box */}
          <div className="col-lg-4 col-md-6">
            <div className="position-relative">
              <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="aurora-input ps-5"
                placeholder="Search counterparty, description, or ref ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Account Filter */}
          <div className="col-lg-3 col-md-6">
            <select
              className="aurora-select"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="ALL">All Consolidated Accounts</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="col-lg-2 col-md-4">
            <select
              className="aurora-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="CREDIT">Inflow (+ Credits)</option>
              <option value="DEBIT">Outflow (- Debits)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="col-lg-2 col-md-4">
            <select
              className="aurora-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Dining">Dining</option>
              <option value="Groceries">Groceries</option>
              <option value="Investments">Investments</option>
              <option value="Tech & Cloud">Tech & Cloud</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="col-lg-1 col-md-4 text-end">
            <button
              onClick={handleClearFilters}
              className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center"
              title="Reset Filters"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="aurora-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <div className="p-3 rounded-circle bg-light d-inline-flex mb-3 text-muted">
              <AlertCircle size={32} />
            </div>
            <h5 className="fw-bold mb-1">No Transactions Found</h5>
            <p className="text-muted small mb-3">No ledger records matched your active filter criteria.</p>
            <button onClick={handleClearFilters} className="btn btn-aurora-secondary py-1 px-3">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="aurora-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Reference ID</th>
                  <th>Transaction / Counterparty</th>
                  <th>Category</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="text-end">Amount</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(txn => {
                  const isCredit = txn.type === 'CREDIT';
                  return (
                    <tr key={txn.id}>
                      <td className="text-muted font-mono" style={{ fontSize: '0.825rem' }}>
                        {formatDate(txn.date)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleCopy(txn.referenceId)}
                          className="btn btn-sm btn-light border font-mono p-1 px-2 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '0.72rem' }}
                          title="Click to copy Reference ID"
                        >
                          <span>{txn.referenceId}</span>
                          <Copy size={11} className="text-muted" />
                        </button>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: isCredit ? '#ECFDF5' : '#F1F5F9',
                              color: isCredit ? '#059669' : '#475569'
                            }}
                          >
                            {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                          </div>
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: '0.875rem' }}>
                              {txn.counterparty}
                            </div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              {txn.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.72rem' }}>
                          {txn.category}
                        </span>
                      </td>
                      <td className="text-muted small font-mono">
                        {txn.method || 'Standard'}
                      </td>
                      <td>
                        <span className={txn.status === 'COMPLETED' ? 'badge-aurora-emerald' : 'badge-aurora-gold'}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="text-end font-mono fw-bold" style={{
                        color: isCredit ? 'var(--aurora-emerald)' : 'var(--aurora-navy)',
                        fontSize: '0.925rem'
                      }}>
                        {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => dispatch(openReceiptModal(txn))}
                          className="btn btn-sm btn-outline-secondary p-1 px-2"
                          style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                          title="View official slip"
                        >
                          <Receipt size={13} className="me-1" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
