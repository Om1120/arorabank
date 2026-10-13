import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

const initialPayees = storageService.getPayees();

const payeesSlice = createSlice({
  name: 'payees',
  initialState: {
    payees: initialPayees
  },
  reducers: {
    addPayee: (state, action) => {
      state.payees = [action.payload, ...state.payees];
      storageService.savePayees(state.payees);
    },
    removePayee: (state, action) => {
      state.payees = state.payees.filter(p => p.id !== action.payload);
      storageService.savePayees(state.payees);
    },
    resetPayees: (state, action) => {
      state.payees = action.payload;
    }
  }
});

export const { addPayee, removePayee, resetPayees } = payeesSlice.actions;
export default payeesSlice.reducer;
