import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Send,
  Building2,
  ArrowRightLeft,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { executeSimulatedTransfer, formatCurrency } from '../services/transactionService';
import { addPayee, removePayee } from '../store/slices/payeesSlice';
import { openReceiptModal, addToast } from '../store/slices/uiSlice';

const TransferSchema = Yup.object().shape({
  sourceAccountId: Yup.string().required('Select source account'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .min(10, 'Minimum transfer amount is ₹10')
    .required('Amount is required'),
  recipientName: Yup.string().required('Recipient name is required'),
  recipientAccount: Yup.string().required('Account / UPI identifier is required'),
  method: Yup.string().required('Select payment method'),
  notes: Yup.string().max(100, 'Max 100 characters')
});

const NewPayeeSchema = Yup.object().shape({
  name: Yup.string().required('Payee name is required'),
  accountNumber: Yup.string().required('Account or UPI ID is required'),
  bankName: Yup.string().required('Bank name is required'),
  nickname: Yup.string()
});

export const Transfers = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector(state => state.accounts.accounts);
  const payees = useSelector(state => state.payees.payees);

  const [activeTab, setActiveTab] = useState('TRANSFER'); // 'TRANSFER' | 'INTERNAL' | 'PAYEES'
  const [reviewData, setReviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chosenPayee, setChosenPayee] = useState(null);

  // Derive pre-selected payee from URL if present
  const payeeQuery = new URLSearchParams(location.search).get('payee');
  const matchedPayee = payeeQuery ? payees.find(p => p.name.toLowerCase().includes(payeeQuery.toLowerCase())) : null;
  const selectedPayee = chosenPayee || matchedPayee;

  // Handle Review Stage submission
  const handleProceedToReview = (values) => {
    const srcAccount = accounts.find(a => a.id === values.sourceAccountId);
    if (!srcAccount) return;

    if (srcAccount.balance < Number(values.amount)) {
      alert(`Insufficient funds. Your available balance is ${formatCurrency(srcAccount.balance)}.`);
      return;
    }

    setReviewData(values);
  };

  // Handle Final Confirmed Execution
  const handleExecuteTransfer = async () => {
    if (!reviewData) return;
    setIsSubmitting(true);

    try {
      // Execute centralized simulated transaction
      const executedTxn = await executeSimulatedTransfer(
        dispatch,
        () => ({ accounts: { accounts } }),
        reviewData
      );

      setIsSubmitting(false);
      setReviewData(null);

      // Open printable receipt immediately
      dispatch(openReceiptModal(executedTxn));
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Transfer failed');
    }
  };

  // Handle Add New Payee
  const handleAddPayee = (values, { resetForm }) => {
    const newPayee = {
      id: `payee_${Date.now()}`,
      name: values.name,
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      nickname: values.nickname || values.name,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=100&auto=format&fit=crop&q=80`,
      type: values.bankName.toLowerCase().includes('aurora') ? 'Aurora Internal' : 'NEFT / IMPS',
      lastTransferred: 'Just added'
    };

    dispatch(addPayee(newPayee));
    dispatch(addToast({
      type: 'success',
      title: 'Payee Added',
      message: `${values.name} added to your beneficiaries list.`
    }));
    resetForm();
  };

  const handleDeletePayee = (payeeId, payeeName) => {
    if (window.confirm(`Remove beneficiary "${payeeName}"?`)) {
      dispatch(removePayee(payeeId));
      dispatch(addToast({
        type: 'info',
        title: 'Payee Removed',
        message: `${payeeName} removed from saved beneficiaries.`
      }));
    }
  };

  return (
    <div className="transfers-content py-4 px-lg-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)', letterSpacing: '-0.02em' }}>
          Transfer & Settlement Hub
        </h2>
        <p className="text-secondary small mb-0">
          Execute instant transfers with zero settlement fee and verified electronic ledger receipts.
        </p>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        <button
          onClick={() => { setActiveTab('TRANSFER'); setReviewData(null); }}
          className={`btn py-2 px-3 fw-semibold ${activeTab === 'TRANSFER' ? 'btn-aurora-primary' : 'btn-aurora-ghost'}`}
        >
          <Send size={15} />
          Send Funds
        </button>
        <button
          onClick={() => { setActiveTab('INTERNAL'); setReviewData(null); }}
          className={`btn py-2 px-3 fw-semibold ${activeTab === 'INTERNAL' ? 'btn-aurora-primary' : 'btn-aurora-ghost'}`}
        >
          <ArrowRightLeft size={15} />
          Internal Vault Transfer
        </button>
        <button
          onClick={() => { setActiveTab('PAYEES'); setReviewData(null); }}
          className={`btn py-2 px-3 fw-semibold ${activeTab === 'PAYEES' ? 'btn-aurora-primary' : 'btn-aurora-ghost'}`}
        >
          <Building2 size={15} />
          Beneficiaries ({payees.length})
        </button>
      </div>

      {/* Confirmation Review Modal / Overlay */}
      {reviewData && (
        <div className="aurora-modal-backdrop">
          <div className="aurora-modal-card p-4 p-md-5" style={{ maxWidth: '520px' }}>
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-success-subtle text-success mb-2">
                <ShieldCheck size={36} />
              </div>
              <h4 className="fw-bold mb-1" style={{ color: 'var(--aurora-navy)' }}>
                Confirm Transfer Details
              </h4>
              <p className="text-muted small">
                Verify beneficiary and clearance route before authorizing.
              </p>
            </div>

            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--aurora-border)' }}>
              <div className="text-muted small text-center text-uppercase fw-semibold mb-1">Total Debit Amount</div>
              <div className="font-mono fw-bold text-center fs-3 text-dark mb-1">
                {formatCurrency(reviewData.amount)}
              </div>
              <div className="text-center text-success small">
                Transfer Fee: <strong>₹0.00 (Zero Fee Waiver)</strong>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mb-4" style={{ fontSize: '0.875rem' }}>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">From Account</span>
                <span className="fw-semibold text-dark">
                  {accounts.find(a => a.id === reviewData.sourceAccountId)?.name}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">Beneficiary</span>
                <span className="fw-semibold text-dark">{reviewData.recipientName}</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">Account / UPI</span>
                <span className="font-mono text-dark">{reviewData.recipientAccount}</span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">Payment Protocol</span>
                <span className="badge bg-light text-dark border px-2 py-1">{reviewData.method}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-muted">Expected Clearance</span>
                <span className="text-success fw-bold">Instant (0s Latency)</span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setReviewData(null)}
                className="btn btn-aurora-secondary flex-fill py-2"
              >
                Back / Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteTransfer}
                className="btn btn-aurora-emerald flex-fill py-2"
              >
                {isSubmitting ? 'Authorizing...' : 'Authorize & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 1: General Fund Transfer */}
      {activeTab === 'TRANSFER' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="aurora-card p-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
                Transfer Details
              </h5>

              <Formik
                initialValues={{
                  sourceAccountId: accounts[0]?.id || 'acc_chk_01',
                  amount: '',
                  recipientName: selectedPayee?.name || '',
                  recipientAccount: selectedPayee?.accountNumber || selectedPayee?.upiId || '',
                  method: 'IMPS Instant',
                  notes: ''
                }}
                enableReinitialize
                validationSchema={TransferSchema}
                onSubmit={handleProceedToReview}
              >
                {({ values, setFieldValue }) => {
                  const currentSrc = accounts.find(a => a.id === values.sourceAccountId);
                  return (
                    <Form>
                      {/* Source Account */}
                      <div className="mb-3">
                        <label className="aurora-label">Debit From Account</label>
                        <Field as="select" name="sourceAccountId" className="aurora-select">
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name} — {formatCurrency(acc.balance)} (Available)
                            </option>
                          ))}
                        </Field>
                        <div className="d-flex justify-content-between align-items-center mt-1 text-muted small">
                          <span>Account Number: <strong className="font-mono text-dark">{currentSrc?.accountNumber}</strong></span>
                          <span>Available: <strong className="text-success font-mono">{formatCurrency(currentSrc?.balance || 0)}</strong></span>
                        </div>
                        <ErrorMessage name="sourceAccountId" component="div" className="aurora-error-text" />
                      </div>

                      {/* Quick Beneficiary Selector */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="aurora-label mb-0">Select Beneficiary</label>
                          <span className="text-muted small">Or type below</span>
                        </div>
                        <div className="d-flex gap-2 overflow-x-auto pb-2">
                          {payees.map(p => {
                            const isChosen = values.recipientName === p.name;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setFieldValue('recipientName', p.name);
                                  setFieldValue('recipientAccount', p.accountNumber || p.upiId);
                                }}
                                className={`btn btn-sm text-nowrap d-flex align-items-center gap-2 p-2 rounded-3 ${
                                  isChosen ? 'btn-success text-white' : 'btn-light border'
                                }`}
                                style={{ fontSize: '0.8rem' }}
                              >
                                <img
                                  src={p.avatar}
                                  alt={p.name}
                                  className="rounded-circle"
                                  style={{ width: '22px', height: '22px', objectFit: 'cover' }}
                                />
                                <span>{p.nickname || p.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recipient Name and Account */}
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="aurora-label">Recipient Legal Name</label>
                          <Field
                            type="text"
                            name="recipientName"
                            className="aurora-input"
                            placeholder="e.g. Sarah Jenkins"
                          />
                          <ErrorMessage name="recipientName" component="div" className="aurora-error-text" />
                        </div>

                        <div className="col-md-6">
                          <label className="aurora-label">Account Number / UPI ID</label>
                          <Field
                            type="text"
                            name="recipientAccount"
                            className="aurora-input font-mono"
                            placeholder="e.g. AUR-3341-9921 or name@upi"
                          />
                          <ErrorMessage name="recipientAccount" component="div" className="aurora-error-text" />
                        </div>
                      </div>

                      {/* Transfer Amount */}
                      <div className="mb-3">
                        <label className="aurora-label">Transfer Amount (INR)</label>
                        <div className="position-relative">
                          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted fw-bold">
                            ₹
                          </span>
                          <Field
                            type="number"
                            name="amount"
                            className="aurora-input font-mono fs-5 ps-5"
                            placeholder="0.00"
                            step="any"
                          />
                        </div>
                        {/* Quick preset chips */}
                        <div className="d-flex gap-2 mt-2">
                          {[5000, 10000, 25000, 50000].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setFieldValue('amount', preset)}
                              className="btn btn-sm btn-outline-secondary py-0 px-2"
                              style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                            >
                              +₹{preset.toLocaleString('en-IN')}
                            </button>
                          ))}
                        </div>
                        <ErrorMessage name="amount" component="div" className="aurora-error-text" />
                      </div>

                      {/* Method & Notes */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="aurora-label">Payment Rail</label>
                          <Field as="select" name="method" className="aurora-select">
                            <option value="IMPS Instant">IMPS Instant Settlement (24x7)</option>
                            <option value="UPI FastPay">UPI FastPay (Real-time)</option>
                            <option value="NEFT Scheduled">NEFT Batch Clearing</option>
                            <option value="RTGS Gross">RTGS High-Value Direct</option>
                          </Field>
                        </div>

                        <div className="col-md-6">
                          <label className="aurora-label">Transfer Purpose / Notes</label>
                          <Field
                            type="text"
                            name="notes"
                            className="aurora-input"
                            placeholder="e.g. Consulting Invoice"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-aurora-emerald w-100 py-3 justify-content-center"
                      >
                        <ShieldCheck size={18} />
                        Review Transfer Details
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>

          {/* Right Column: Transfer Limits & Guidance */}
          <div className="col-lg-5">
            <div className="aurora-card p-4 mb-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
                Transfer Protocol & Limits
              </h5>

              <div className="d-flex flex-column gap-3">
                <div className="p-3 rounded-3 bg-light border">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold text-dark small">IMPS / UPI Daily Limit</span>
                    <span className="font-mono text-success small fw-bold">₹5,00,000 / Day</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '15%' }}></div>
                  </div>
                  <div className="text-muted small mt-1" style={{ fontSize: '0.7rem' }}>
                    ₹33,450 utilized today &bull; ₹4,66,550 remaining
                  </div>
                </div>

                <div className="p-3 rounded-3 bg-light border">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-semibold text-dark small">RTGS Institutional Limit</span>
                    <span className="font-mono text-primary small fw-bold">₹25,00,000 / Day</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-muted small mt-1" style={{ fontSize: '0.7rem' }}>
                    Full headroom available
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <CheckCircle2 size={15} color="#059669" />
                  <span>Dual ledger consistency guarantee</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                  <CheckCircle2 size={15} color="#059669" />
                  <span>Instant downloadable and printable receipts</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <CheckCircle2 size={15} color="#059669" />
                  <span>Zero hidden service charges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Internal Vault Transfer */}
      {activeTab === 'INTERNAL' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="aurora-card p-4">
              <h5 className="fw-bold mb-2" style={{ color: 'var(--aurora-navy)' }}>
                Internal Multi-Vault Transfer
              </h5>
              <p className="text-secondary small mb-4">
                Shift liquidity between Checking, High-Yield Reserve, and Term Vault instantly.
              </p>

              <Formik
                initialValues={{
                  sourceAccountId: accounts[0]?.id,
                  targetAccountId: accounts[1]?.id,
                  amount: '',
                  notes: 'Internal Vault Rebalancing'
                }}
                validationSchema={Yup.object().shape({
                  sourceAccountId: Yup.string().required(),
                  targetAccountId: Yup.string()
                    .notOneOf([Yup.ref('sourceAccountId')], 'Target account must be different from source account')
                    .required('Select target account'),
                  amount: Yup.number().positive().min(10).required('Enter amount')
                })}
                onSubmit={(values) => {
                  const target = accounts.find(a => a.id === values.targetAccountId);
                  handleProceedToReview({
                    ...values,
                    recipientName: target?.name || 'Target Vault',
                    recipientAccount: target?.accountNumber || 'AUR-INTERNAL',
                    method: 'Internal Core Transfer'
                  });
                }}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="aurora-label">Source Vault</label>
                          <Field as="select" name="sourceAccountId" className="aurora-select">
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.name} ({formatCurrency(acc.balance)})
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div className="col-md-6">
                          <label className="aurora-label">Target Destination Vault</label>
                          <Field as="select" name="targetAccountId" className="aurora-select">
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id} disabled={acc.id === values.sourceAccountId}>
                                {acc.name} ({formatCurrency(acc.balance)})
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="targetAccountId" component="div" className="aurora-error-text" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="aurora-label">Transfer Amount</label>
                        <div className="position-relative">
                          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted fw-bold">
                            ₹
                          </span>
                          <Field
                            type="number"
                            name="amount"
                            className="aurora-input font-mono fs-5 ps-5"
                            placeholder="0.00"
                          />
                        </div>
                        <ErrorMessage name="amount" component="div" className="aurora-error-text" />
                      </div>

                      <button
                        type="submit"
                        className="btn-aurora-primary w-100 py-3 justify-content-center"
                      >
                        <ArrowRightLeft size={16} />
                        Confirm Vault Rebalancing
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Payees Management (CRUD) */}
      {activeTab === 'PAYEES' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="aurora-card p-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
                Saved Beneficiaries ({payees.length})
              </h5>

              <div className="d-flex flex-column gap-3">
                {payees.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="rounded-circle border"
                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold text-dark">{p.name}</div>
                        <div className="text-muted small">
                          {p.bankName} &bull; <span className="font-mono">{p.accountNumber || p.upiId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => {
                          setChosenPayee(p);
                          setActiveTab('TRANSFER');
                        }}
                        className="btn btn-sm btn-aurora-emerald py-1 px-3"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Send Money
                      </button>
                      <button
                        onClick={() => handleDeletePayee(p.id, p.name)}
                        className="btn btn-sm btn-outline-danger p-1 px-2"
                        title="Delete Beneficiary"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Payee Form */}
          <div className="col-lg-5">
            <div className="aurora-card p-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--aurora-navy)' }}>
                Add New Beneficiary
              </h5>

              <Formik
                initialValues={{ name: '', accountNumber: '', bankName: 'Aurora Bank', nickname: '' }}
                validationSchema={NewPayeeSchema}
                onSubmit={handleAddPayee}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="aurora-label">Beneficiary Full Name</label>
                      <Field type="text" name="name" className="aurora-input" placeholder="e.g. Ramesh Patel" />
                      <ErrorMessage name="name" component="div" className="aurora-error-text" />
                    </div>

                    <div className="mb-3">
                      <label className="aurora-label">Account Number / UPI ID</label>
                      <Field type="text" name="accountNumber" className="aurora-input font-mono" placeholder="AUR-XXXX or name@upi" />
                      <ErrorMessage name="accountNumber" component="div" className="aurora-error-text" />
                    </div>

                    <div className="mb-3">
                      <label className="aurora-label">Bank Institution</label>
                      <Field as="select" name="bankName" className="aurora-select">
                        <option value="Aurora Bank">Aurora Bank (Instant Internal)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                      </Field>
                    </div>

                    <div className="mb-4">
                      <label className="aurora-label">Nickname (Optional)</label>
                      <Field type="text" name="nickname" className="aurora-input" placeholder="e.g. Accountant" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-aurora-primary w-100 py-2 justify-content-center"
                    >
                      <Plus size={16} />
                      Save Beneficiary
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
