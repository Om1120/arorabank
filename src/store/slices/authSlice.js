import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import { initialUsers } from '../../services/initialData';

const initialUser = storageService.getUser();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: initialUser,
    isAuthenticated: true,
    availablePersonas: initialUsers
  },
  reducers: {
    loginAs: (state, action) => {
      const personaKey = action.payload; // 'customer' | 'admin'
      const user = initialUsers[personaKey] || initialUsers.customer;
      state.currentUser = user;
      state.isAuthenticated = true;
      storageService.setUser(user);
    },
    updateProfile: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      storageService.setUser(state.currentUser);
    },
    toggle2FA: (state) => {
      if (state.currentUser) {
        state.currentUser.twoFactorEnabled = !state.currentUser.twoFactorEnabled;
        storageService.setUser(state.currentUser);
      }
    },
    logout: (state) => {
      // Set to guest or re-init
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem('aurora_bank_active_user');
    }
  }
});

export const { loginAs, updateProfile, toggle2FA, logout } = authSlice.actions;
export default authSlice.reducer;
