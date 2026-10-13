import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    activeReceiptModal: null, // Holds txn object to view receipt
    activeStatementModal: false,
    notifications: [
      {
        id: 'notif_1',
        title: 'Settlement Cleared',
        message: 'IMPS transfer of ₹25,000 to Sarah Jenkins cleared with 0s latency.',
        time: '12m ago',
        read: false,
        type: 'success'
      },
      {
        id: 'notif_2',
        title: 'Security Preference Verified',
        message: 'Titanium Debit contactless NFC transaction ceiling adjusted.',
        time: '1h ago',
        read: false,
        type: 'info'
      },
      {
        id: 'notif_3',
        title: 'Quarterly Yield Accrued',
        message: 'High-Yield Reserve (6.85% APY) earned ₹4,820.50 interest.',
        time: '1d ago',
        read: true,
        type: 'success'
      }
    ],
    toasts: []
  },
  reducers: {
    toggleMobileMenu: (state, action) => {
      state.mobileMenuOpen = action.payload !== undefined ? action.payload : !state.mobileMenuOpen;
    },
    openReceiptModal: (state, action) => {
      state.activeReceiptModal = action.payload;
    },
    closeReceiptModal: (state) => {
      state.activeReceiptModal = null;
    },
    openStatementModal: (state) => {
      state.activeStatementModal = true;
    },
    closeStatementModal: (state) => {
      state.activeStatementModal = false;
    },
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    markNotificationAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  toggleMobileMenu,
  openReceiptModal,
  closeReceiptModal,
  openStatementModal,
  closeStatementModal,
  addToast,
  removeToast,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer;

