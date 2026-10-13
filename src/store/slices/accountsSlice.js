import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

const initialAccounts = storageService.getAccounts();
const initialCards = storageService.getCards();

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: initialAccounts,
    selectedAccountId: initialAccounts[0]?.id || 'acc_chk_01',
    cards: initialCards
  },
  reducers: {
    selectAccount: (state, action) => {
      state.selectedAccountId = action.payload;
    },
    updateAccountBalance: (state, action) => {
      const { accountId, deltaAmount } = action.payload;
      const account = state.accounts.find(a => a.id === accountId);
      if (account) {
        account.balance = Math.max(0, parseFloat((account.balance + deltaAmount).toFixed(2)));
        storageService.saveAccounts(state.accounts);
      }
    },
    toggleCardFreeze: (state, action) => {
      const cardId = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.status = card.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
        storageService.saveCards(state.cards);
      }
    },
    updateCardControls: (state, action) => {
      const { cardId, ...controls } = action.payload;
      const cardIndex = state.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        state.cards[cardIndex] = { ...state.cards[cardIndex], ...controls };
        storageService.saveCards(state.cards);
      }
    },
    toggleAccountStatus: (state, action) => {
      // For Admin operations: freeze or activate account
      const accountId = action.payload;
      const account = state.accounts.find(a => a.id === accountId);
      if (account) {
        account.status = account.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
        storageService.saveAccounts(state.accounts);
      }
    },
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
      storageService.saveAccounts(state.accounts);
    },
    updateCardPin: (state, action) => {
      const { cardId, pin } = action.payload;
      const card = state.cards.find(c => c.id === cardId);
      if (card) {
        card.pin = pin;
        storageService.saveCards(state.cards);
      }
    },
    replaceCard: (state, action) => {
      const { cardId, newCardData } = action.payload;
      const idx = state.cards.findIndex(c => c.id === cardId);
      if (idx !== -1) {
        state.cards[idx] = { ...state.cards[idx], ...newCardData };
        storageService.saveCards(state.cards);
      }
    },
    resetAccounts: (state, action) => {
      state.accounts = action.payload.accounts;
      state.cards = action.payload.cards;
      state.selectedAccountId = action.payload.accounts[0]?.id || 'acc_chk_01';
    }
  }
});

export const {
  selectAccount,
  updateAccountBalance,
  toggleCardFreeze,
  updateCardControls,
  toggleAccountStatus,
  addAccount,
  updateCardPin,
  replaceCard,
  resetAccounts
} = accountsSlice.actions;

export default accountsSlice.reducer;
