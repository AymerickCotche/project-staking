import { createReducer } from '@reduxjs/toolkit';
import { setAyaBalance, getAyaInstance, setInputQuantity } from '../actions/staking';


const initialState = {
  ayaInstance: null,
  ayaBalance: 0,
  ayaStacked: null,
  ayaRewards: null,
  ayaUnlockIn: null,
  inputQuantity: '',
};

export const stakingReducer = createReducer(initialState, (builder) => {
  builder
  .addCase(getAyaInstance.fulfilled, (state, action) => {
    state.ayaInstance = action.payload;
  })
  .addCase(setAyaBalance, (state, action) => {
    state.ayaBalance = action.payload;
  })
  .addCase(setInputQuantity, (state, action) => {
    state.inputQuantity = action.payload;
  })
});

export default stakingReducer;