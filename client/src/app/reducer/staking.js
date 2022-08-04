import { createReducer } from '@reduxjs/toolkit';
import { setAyaBalance, getAyaInstance } from '../actions/staking';


const initialState = {
  ayaInstance: null,
  ayaBalance: null,
  ayaStacked: null,
  ayaRewards: null,
  ayaUnlockIn: null
};

export const stakingReducer = createReducer(initialState, (builder) => {
  builder
  .addCase(getAyaInstance.fulfilled, (state, action) => {
    state.ayaInstance = action.payload;
  })
  .addCase(setAyaBalance, (state, action) => {
    state.ayaBalance = action.payload;
  })
});

export default stakingReducer;