import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Send,
  Download,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { selectAccount, addAccount } from '../store/slices/accountsSlice';
import { openReceiptModal, openStatementModal, addToast } from '../store/slices/uiSlice';
import { DebitCreditCard } from '../components/cards/DebitCreditCard';
import { CashflowChart } from '../components/charts/CashflowChart';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { formatCurrency, formatDate } from '../services/transactionService';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);
  const accounts = useSelector(state => state.accounts.accounts);
  const selectedAccountId = useSelector(state => state.accounts.selectedAccountId);
  const cards = useSelector(state => state.accounts.cards);
  const transactions = useSelector(state => state.transactions.transactions);
  const payees = useSelector(state => state.payees.payees);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [openVaultModal, setOpenVaultModal] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultType, setNewVaultType] = useState('Savings');
  const [newVaultBalance, setNewVaultBalance] = useState('50000');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const activeCard = cards.find(c => c.accountId === selectedAccount?.id) || cards[0];

  const totalNetWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  // Filter recent transactions
  const filteredRecentTransactions = transactions
    .filter(t => {
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          t.description?.toLowerCase().includes(q) ||
          t.counterparty?.toLowerCase().includes(q) ||
          t.referenceId?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .slice(0, 6);

  const handleOpenReceipt = (txn) => {
    dispatch(openReceiptModal(txn));
  };

  const handleOpenStatement = () => {
    dispatch(openStatementModal());
  };

  const handleCreateVault = (e) => {
    e.preventDefault();
    if (!newVaultName.trim()) return;

    const numBal = parseFloat(newVaultBalance) || 0;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newVaultAccNum = `AUR-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;
    const newVaultId = `acc_${newVaultType.toLowerCase().slice(0, 3)}_${Date.now()}`;

    const newAcc = {
      id: newVaultId,
      name: newVaultName.trim(),
      accountNumber: newVaultAccNum,
      type: newVaultType,
      currency: 'INR',
      symbol: '₹',
      balance: numBal,
      status: 'ACTIVE',
      ifsc: 'AURB0002941',
      branch: 'Bandra Kurla Complex, Mumbai',
      color: newVaultType === 'Checking' ? '#0F172A' : newVaultType === 'Savings' ? '#059669' : '#D97706',
      tag: 'Custom Sub-Vault'
    };

    dispatch(addAccount(newAcc));
    dispatch(addToast({
      type: 'success',
      title: 'Sub-Vault Created',
      message: `${newVaultName} (${newVaultAccNum}) opened successfully.`
    }));

    setNewVaultName('');
    setNewVaultBalance('50000');
    setOpenVaultModal(false);
  };

  return (
    <div className="dashboard-content py-4 px-lg-4">
      {/* Top Welcome Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)', letterSpacing: '-0.02em' }}>
              Welcome, {currentUser?.name || 'Client'}
            </h2>
            <span className="badge-aurora-emerald">
              <CheckCircle2 size={12} className="me-1" />
              KYC {currentUser?.kycStatus || 'VERIFIED'}
            </span>
          </div>
          <p className="text-secondary small mb-0">
            {currentUser?.tier || 'Aurora Private Client'} &bull; Base Currency: <strong className="text-dark">INR (₹)</strong>
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            onClick={() => setOpenVaultModal(true)}
            className="btn btn-outline-secondary py-2 px-3 shadow-sm d-flex align-items-center gap-2"
          >
            <PlusCircle size={15} />
            New Vault
          </button>
          <button
            onClick={handleOpenStatement}
            className="btn btn-aurora-secondary py-2 px-3 shadow-sm"
          >
            <Download size={15} />
            Statements
          </button>
          <Link
            to="/transfers"
            className="btn btn-aurora-emerald py-2 px-4 shadow-sm text-decoration-none"
          >
            <Send size={15} />
            Transfer Funds
          </Link>
        </div>
      </div>

      {/* Financial Summary Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Net Worth Card */}
        <div className="col-xl-3 col-md-6">
          <div className="aurora-card p-3 h-100" style={{ borderLeft: '4px solid var(--aurora-emerald)' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Total Net Worth
              </span>
              <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.68rem' }}>
                +8.4% MoM
              </span>
            </div>
            <div className="font-mono fw-bold fs-4 mb-1" style={{ color: 'var(--aurora-navy)' }}>
              {formatCurrency(totalNetWorth)}
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Across {accounts.length} active multi-vault accounts
            </div>
          </div>
        </div>

        {/* Primary Checking */}
        <div className="col-xl-3 col-md-6">
          <div
            onClick={() => dispatch(selectAccount('acc_chk_01'))}
            className={`aurora-card p-3 h-100 cursor-pointer ${selectedAccountId === 'acc_chk_01' ? 'border-primary' : ''}`}
            style={{ borderLeft: '4px solid #2563EB', cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Checking Account
              </span>
              <span className="badge bg-light text-primary border py-0 px-2" style={{ fontSize: '0.68rem' }}>
                Liquid
              </span>
            </div>
            <div className="font-mono fw-bold fs-4 mb-1" style={{ color: 'var(--aurora-navy)' }}>
              {formatCurrency(accounts.find(a => a.id === 'acc_chk_01')?.balance || 0)}
            </div>
            <div className="text-muted small font-mono" style={{ fontSize: '0.72rem' }}>
              AUR-8829-4102-991
            </div>
          </div>
        </div>

        {/* High-Yield Reserve */}
        <div className="col-xl-3 col-md-6">
          <div
            onClick={() => dispatch(selectAccount('acc_sav_01'))}
            className={`aurora-card p-3 h-100 cursor-pointer ${selectedAccountId === 'acc_sav_01' ? 'border-success' : ''}`}
            style={{ borderLeft: '4px solid var(--aurora-emerald)', cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                High-Yield Reserve
              </span>
              <span className="badge-aurora-emerald py-0 px-2" style={{ fontSize: '0.68rem' }}>
                6.85% APY
              </span>
            </div>
            <div className="font-mono fw-bold fs-4 mb-1" style={{ color: 'var(--aurora-emerald-dark)' }}>
              {formatCurrency(accounts.find(a => a.id === 'acc_sav_01')?.balance || 0)}
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Interest compounded quarterly
            </div>
          </div>
        </div>

        {/* Term Vault */}
        <div className="col-xl-3 col-md-6">
          <div
            onClick={() => dispatch(selectAccount('acc_vlt_01'))}
            className={`aurora-card p-3 h-100 cursor-pointer ${selectedAccountId === 'acc_vlt_01' ? 'border-warning' : ''}`}
            style={{ borderLeft: '4px solid #D97706', cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Term Vault Deposit
              </span>
              <span className="badge-aurora-gold py-0 px-2" style={{ fontSize: '0.68rem' }}>
                7.40% Fixed
              </span>
            </div>
            <div className="font-mono fw-bold fs-4 mb-1" style={{ color: '#B45309' }}>
              {formatCurrency(accounts.find(a => a.id === 'acc_vlt_01')?.balance || 0)}
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Locked until Nov 2027
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Charts & Transactions, Right Card & Quick Payees */}
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Monthly Cashflow Chart Card */}
          <div className="aurora-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
                  Cashflow & Liquidity Dynamics
                </h5>
                <p className="text-muted small mb-0">Monthly consolidated credits vs debits</p>
              </div>
              <div className="badge-aurora-emerald">
                Net Positive Cashflow
              </div>
            </div>
            <CashflowChart />
          </div>

          {/* Recent Transactions Table Card */}
          <div className="aurora-card p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
                  Recent Transactions
                </h5>
                <p className="text-muted small mb-0">Simulated real-time transaction ledger</p>
              </div>
              <Link to="/transactions" className="btn-aurora-ghost text-decoration-none" style={{ fontSize: '0.825rem' }}>
                View All Ledger
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Quick Filter Bar */}
            <div className="row g-2 mb-3">
              <div className="col-md-7">
                <div className="position-relative">
                  <Search size={15} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <input
                    type="text"
                    className="aurora-input ps-5 py-1"
                    style={{ fontSize: '0.825rem' }}
                    placeholder="Search recent transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="position-relative">
                  <Filter size={15} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <select
                    className="aurora-select ps-5 py-1"
                    style={{ fontSize: '0.825rem' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Salary">Salary</option>
                    <option value="Investments">Investments</option>
                    <option value="Dining">Dining</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="aurora-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecentTransactions.map(txn => {
                    const isCredit = txn.type === 'CREDIT';
                    return (
                      <tr key={txn.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: isCredit ? '#ECFDF5' : '#F1F5F9',
                                color: isCredit ? '#059669' : '#475569'
                              }}
                            >
                              {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                            </div>
                            <div>
                              <div className="fw-bold" style={{ fontSize: '0.875rem' }}>
                                {txn.counterparty}
                              </div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
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
                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {formatDate(txn.date)}
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
                            onClick={() => handleOpenReceipt(txn)}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View official clearance receipt"
                            style={{ fontSize: '0.75rem', borderRadius: '6px' }}
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
          </div>
        </div>

        {/* Right Column: Virtual Card, Quick Payees, Spending Donut */}
        <div className="col-lg-4">
          {/* Card Component */}
          <div className="aurora-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Active Payment Card
              </h5>
              <Link to="/cards" className="text-muted small text-decoration-none">
                Manage Limits
              </Link>
            </div>
            {activeCard && <DebitCreditCard card={activeCard} account={selectedAccount} />}
          </div>

          {/* Quick Pay Beneficiaries Carousel */}
          <div className="aurora-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Quick Transfer
              </h5>
              <Link to="/transfers" className="text-muted small text-decoration-none">
                + Add Payee
              </Link>
            </div>

            <div className="d-flex gap-3 overflow-x-auto pb-2">
              {payees.map(payee => (
                <Link
                  key={payee.id}
                  to={`/transfers?payee=${encodeURIComponent(payee.name)}`}
                  className="text-decoration-none text-center d-flex flex-column align-items-center"
                  style={{ minWidth: '70px' }}
                >
                  <img
                    src={payee.avatar}
                    alt={payee.name}
                    className="rounded-circle mb-1 border"
                    style={{ width: '46px', height: '46px', objectFit: 'cover' }}
                  />
                  <span className="fw-semibold text-dark text-truncate d-block" style={{ fontSize: '0.75rem', maxWidth: '70px' }}>
                    {payee.name.split(' ')[0]}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                    {payee.bankName.split(' ')[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Spending Category Donut */}
          <div className="aurora-card p-4">
            <h5 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
              Outflow Breakdown
            </h5>
            <p className="text-muted small mb-3">Current month spending by category</p>
            <SpendingPieChart />
          </div>
        </div>
      </div>

      {/* Open Sub-Vault Modal */}
      {openVaultModal && (
        <div className="aurora-modal-backdrop" onClick={() => setOpenVaultModal(false)}>
          <div
            className="aurora-modal-card p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '460px' }}
          >
            <button
              onClick={() => setOpenVaultModal(false)}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2"
            >
              <X size={18} />
            </button>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-success-subtle text-success">
                <PlusCircle size={22} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--aurora-navy)' }}>
                Open New Sub-Vault
              </h5>
            </div>
            <p className="text-muted small mb-4">
              Allocate capital to a dedicated savings or fixed-deposit vault to grow compound interest.
            </p>

            <form onSubmit={handleCreateVault}>
              <div className="mb-3">
                <label className="aurora-label">Vault Name</label>
                <input
                  type="text"
                  className="aurora-input"
                  placeholder="e.g. Travel & Holiday Reserve"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="aurora-label">Vault Classification</label>
                <select
                  className="aurora-select"
                  value={newVaultType}
                  onChange={(e) => setNewVaultType(e.target.value)}
                >
                  <option value="Savings">High-Yield Reserve (6.85% APY)</option>
                  <option value="Vault">Term Growth Vault (7.40% Fixed)</option>
                  <option value="Checking">Liquid Checking (0.0% Yield)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="aurora-label">Initial Seed Deposit (INR)</label>
                <input
                  type="number"
                  className="aurora-input font-mono"
                  placeholder="50000"
                  value={newVaultBalance}
                  onChange={(e) => setNewVaultBalance(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpenVaultModal(false)}
                  className="btn btn-aurora-secondary flex-fill"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-aurora-emerald flex-fill"
                >
                  Create Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
