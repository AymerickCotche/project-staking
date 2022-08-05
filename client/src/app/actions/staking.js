import { createAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';

import AlyraToken from '../../contracts/AlyraToken.json';
import Staking from '../../contracts/Staking.json';

export const getAyaInstance = createAsyncThunk('staking/getAyaInstance', async () => {
  const web3 = new Web3(window.ethereum);
  const ayaInstance = new web3.eth.Contract(AlyraToken.abi, AlyraToken.networks[42].address);
  return ayaInstance;
});

export const setAyaBalance = createAction('staking/setAyaBalance');

export const getStakingInstance = createAsyncThunk('staking/getStakingInstance', async () => {
  const web3 = new Web3(window.ethereum);
  const stakingInstance = new web3.eth.Contract(Staking.abi, Staking.networks[42].address);
  return stakingInstance;
})

export const setInputQuantity = createAction('staking/setInputQuantity');
