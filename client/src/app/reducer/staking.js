import { createReducer } from '@reduxjs/toolkit';
import { setAyaBalance, getAyaInstance, setInputQuantity, getStakingInstance } from '../actions/staking';


const initialState = {
  ayaInstance: null,
  ayaBalance: 0,
  ayaStacked: null,
  ayaRewards: null,
  ayaUnlockIn: null,
  inputQuantity: '',
  stakingInstance: null,
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
  .addCase(getStakingInstance.fulfilled, (state, action) => {
    state.stakingInstance = action.payload;
  })
});

export default stakingReducer;