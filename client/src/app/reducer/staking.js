import { createReducer } from '@reduxjs/toolkit';
import { setAyaBalance, getAyaInstance, getStakingInstance, setIsAdmin, setInputContractOwner, setAyaStaked5s, setAyaStaked1d, setAyaStaked3m, setInputQuantity5s, setInputQuantity1d, setInputQuantity3m, setAyaRewards5s, setAyaRewards1d, setAyaRewards3m, setAyaUnlock5s, setAyaUnlock1d, setAyaReUnlock3m } from '../actions/staking';


const initialState = {
  isAdmin: false,
  ayaInstance: null,
  ayaBalance: 0,
  ayaStaked5s: 0,
  ayaStaked1d: 0,
  ayaStaked3m: 0,
  ayaRewards5s: 0,
  ayaRewards1d: 0,
  ayaRewards3m: 0,
  ayaUnlock5s: 0,
  ayaUnlock1d: 0,
  ayaUnlock3m: 0,
  ayaUnlockIn: null,
  inputQuantity5s: '',
  inputQuantity1d: '',
  inputQuantity3m: '',
  inputContractOwner: '',
  stakingInstance: null,
};

export const stakingReducer = createReducer(initialState, (builder) => {
  builder
  .addCase(setIsAdmin, (state, action) => {
    state.isAdmin = action.payload;
  })
  .addCase(getAyaInstance.fulfilled, (state, action) => {
    state.ayaInstance = action.payload;
  })
  .addCase(setAyaBalance, (state, action) => {
    state.ayaBalance = action.payload;
  })
  .addCase(setAyaStaked5s, (state, action) => {
    state.ayaStaked5s = action.payload;
  })
  .addCase(setAyaStaked1d, (state, action) => {
    state.ayaStaked1d = action.payload;
  })
  .addCase(setAyaStaked3m, (state, action) => {
    state.ayaStaked3m = action.payload;
  })
  .addCase(setInputQuantity5s, (state, action) => {
    state.inputQuantity5s = action.payload;
  })
  .addCase(setInputQuantity1d, (state, action) => {
    state.inputQuantity1d = action.payload;
  })
  .addCase(setInputQuantity3m, (state, action) => {
    state.inputQuantity3m = action.payload;
  })
  .addCase(setAyaRewards5s, (state, action) => {
    state.ayaRewards5s = action.payload;
  })
  .addCase(setAyaRewards1d, (state, action) => {
    state.ayaRewards1d = action.payload;
  })
  .addCase(setAyaRewards3m, (state, action) => {
    state.ayaRewards3m = action.payload;
  })
  .addCase(setAyaUnlock5s, (state, action) => {
    state.ayaUnlock5s = action.payload;
  })
  .addCase(setAyaUnlock1d, (state, action) => {
    state.ayaUnlock1d = action.payload;
  })
  .addCase(setAyaReUnlock3m, (state, action) => {
    state.ayaUnlock3m = action.payload;
  })
  .addCase(setInputContractOwner, (state, action) => {
    state.inputContractOwner = action.payload;
  })
  .addCase(getStakingInstance.fulfilled, (state, action) => {
    state.stakingInstance = action.payload;
  })
});

export default stakingReducer;