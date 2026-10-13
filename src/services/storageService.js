import { initialUsers, initialAccounts, initialCards, initialTransactions, initialPayees } from './initialData';

const STORAGE_KEYS = {
  USER: 'aurora_bank_active_user',
  ACCOUNTS: 'aurora_bank_accounts',
  CARDS: 'aurora_bank_cards',
  TRANSACTIONS: 'aurora_bank_transactions',
  PAYEES: 'aurora_bank_payees',
  ADMIN_LOGS: 'aurora_bank_admin_logs'
};

export const storageService = {
  getUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : initialUsers.customer;
    } catch {
      return initialUsers.customer;
    }
  },
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getAccounts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return stored ? JSON.parse(stored) : initialAccounts;
    } catch {
      return initialAccounts;
    }
  },
  saveAccounts: (accounts) => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  getCards: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CARDS);
      return stored ? JSON.parse(stored) : initialCards;
    } catch {
      return initialCards;
    }
  },
  saveCards: (cards) => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  },

  getTransactions: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  },
  saveTransactions: (txns) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
  },

  getPayees: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAYEES);
      return stored ? JSON.parse(stored) : initialPayees;
    } catch {
      return initialPayees;
    }
  },
  savePayees: (payees) => {
    localStorage.setItem(STORAGE_KEYS.PAYEES, JSON.stringify(payees));
  },

  resetAll: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.CARDS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.PAYEES);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGS);
    return {
      user: initialUsers.customer,
      accounts: initialAccounts,
      cards: initialCards,
      transactions: initialTransactions,
      payees: initialPayees
    };
  }
};
