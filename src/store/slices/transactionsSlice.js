import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

const initialTransactions = storageService.getTransactions();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: initialTransactions,
    lastExecutedTransaction: null,
    filters: {
      accountId: 'ALL',
      type: 'ALL',
      category: 'ALL',
      search: '',
      dateRange: 'ALL'
    }
  },
  reducers: {
    addTransaction: (state, action) => {
      const newTxn = action.payload;
      state.transactions = [newTxn, ...state.transactions];
      state.lastExecutedTransaction = newTxn;
      storageService.saveTransactions(state.transactions);
    },
    flagTransaction: (state, action) => {
      const txnId = action.payload;
      const txn = state.transactions.find(t => t.id === txnId);
      if (txn) {
        txn.status = txn.status === 'FLAGGED' ? 'COMPLETED' : 'FLAGGED';
        storageService.saveTransactions(state.transactions);
      }
    },
    approveTransaction: (state, action) => {
      const txnId = action.payload;
      const txn = state.transactions.find(t => t.id === txnId);
      if (txn) {
        txn.status = 'COMPLETED';
        storageService.saveTransactions(state.transactions);
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        accountId: 'ALL',
        type: 'ALL',
        category: 'ALL',
        search: '',
        dateRange: 'ALL'
      };
    },
    clearLastTransaction: (state) => {
      state.lastExecutedTransaction = null;
    },
    resetTransactions: (state, action) => {
      state.transactions = action.payload;
      state.lastExecutedTransaction = null;
    }
  }
});

export const {
  addTransaction,
  flagTransaction,
  approveTransaction,
  setFilters,
  resetFilters,
  clearLastTransaction,
  resetTransactions
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
