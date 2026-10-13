import { updateAccountBalance } from '../store/slices/accountsSlice';
import { addTransaction } from '../store/slices/transactionsSlice';
import { addToast } from '../store/slices/uiSlice';
import confetti from 'canvas-confetti';

export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateReferenceId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `AUR-TXN-2026-${randomNum}`;
};

export const executeSimulatedTransfer = async (dispatch, getState, transferData) => {
  const {
    sourceAccountId,
    targetAccountId,
    recipientName,
    recipientAccount,
    amount,
    method = 'IMPS',
    category = 'Transfer',
    notes = 'Fund Transfer'
  } = transferData;

  const state = getState();
  const sourceAccount = state.accounts.accounts.find(a => a.id === sourceAccountId);

  if (!sourceAccount) {
    throw new Error('Source account not found.');
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Please enter a valid transfer amount.');
  }

  if (sourceAccount.balance < numAmount) {
    throw new Error(`Insufficient funds. Available balance: ${formatCurrency(sourceAccount.balance)}`);
  }

  // Simulated settlement latency (400ms for realistic responsiveness)
  await new Promise(resolve => setTimeout(resolve, 400));

  const refId = generateReferenceId();
  const now = new Date();
  const balanceAfter = parseFloat((sourceAccount.balance - numAmount).toFixed(2));

  // 1. Debit Source Account
  dispatch(updateAccountBalance({
    accountId: sourceAccountId,
    deltaAmount: -numAmount
  }));

  // 2. Create Debit Transaction Record
  const debitTxn = {
    id: `txn_${Date.now()}`,
    referenceId: refId,
    accountId: sourceAccountId,
    date: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),
    type: 'DEBIT',
    amount: numAmount,
    category: category,
    description: `Transfer to ${recipientName}`,
    counterparty: recipientName,
    counterpartyAccount: recipientAccount,
    method: method,
    status: 'COMPLETED',
    balanceAfter: balanceAfter,
    notes: notes
  };

  dispatch(addTransaction(debitTxn));

  // 3. If Internal transfer between Alex's own accounts, credit target account
  if (targetAccountId && targetAccountId !== sourceAccountId) {
    const targetAccount = state.accounts.accounts.find(a => a.id === targetAccountId);
    if (targetAccount) {
      const targetBalanceAfter = parseFloat((targetAccount.balance + numAmount).toFixed(2));
      dispatch(updateAccountBalance({
        accountId: targetAccountId,
        deltaAmount: numAmount
      }));

      const creditTxn = {
        id: `txn_${Date.now() + 1}`,
        referenceId: `${refId}-CR`,
        accountId: targetAccountId,
        date: now.toISOString().split('T')[0],
        timestamp: now.toISOString(),
        type: 'CREDIT',
        amount: numAmount,
        category: 'Internal Transfer',
        description: `Transfer from ${sourceAccount.name}`,
        counterparty: sourceAccount.name,
        counterpartyAccount: sourceAccount.accountNumber,
        method: 'Internal',
        status: 'COMPLETED',
        balanceAfter: targetBalanceAfter,
        notes: notes
      };
      dispatch(addTransaction(creditTxn));
    }
  }

  // Delightful confetti burst
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#0F172A', '#F59E0B']
    });
  } catch {
    // Ignore confetti errors if headless
  }

  dispatch(addToast({
    type: 'success',
    title: 'Transfer Successful',
    message: `₹${numAmount.toLocaleString('en-IN')} sent to ${recipientName}. Ref: ${refId}`
  }));

  return debitTxn;
};

// CSV Statement Exporter
export const exportTransactionsToCSV = (transactions, accountName = 'Aurora_Bank_Statement') => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = ['Reference ID', 'Date', 'Type', 'Amount (INR)', 'Category', 'Description', 'Counterparty', 'Method', 'Status', 'Balance After'];
  const rows = transactions.map(t => [
    t.referenceId,
    t.date,
    t.type,
    t.amount,
    `"${t.category}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.counterparty.replace(/"/g, '""')}"`,
    t.method,
    t.status,
    t.balanceAfter
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${accountName}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
