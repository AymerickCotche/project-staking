import { createAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';

import AlyraToken from '../../contracts/AlyraToken.json';
import Staking from '../../contracts/Staking.json';

export const setIsAdmin = createAction('staking/setIsAdmin');

export const getAyaInstance = createAsyncThunk('staking/getAyaInstance', async () => {
  const web3 = new Web3(window.ethereum);
  const ayaInstance = new web3.eth.Contract(AlyraToken.abi, AlyraToken.networks[42].address);
  return ayaInstance;
});

export const setAyaBalance = createAction('staking/setAyaBalance');

export const setAyaStaked5s = createAction('staking/setAyaStaked5s');
export const setAyaStaked1d = createAction('staking/setAyaStaked1d');
export const setAyaStaked3m = createAction('staking/setAyaStaked3m');

export const setAyaRewards5s = createAction('staking/setAyaRewards5s');
export const setAyaRewards1d = createAction('staking/setAyaRewards1d');
export const setAyaRewards3m = createAction('staking/setAyaRewards3m');

export const setAyaUnlock5s = createAction('staking/setAyaUnlock5s');
export const setAyaUnlock1d = createAction('staking/setAyUnlocks1d');
export const setAyaReUnlock3m = createAction('staking/setAyaUnlock3m');


export const getStakingInstance = createAsyncThunk('staking/getStakingInstance', async () => {
  const web3 = new Web3(window.ethereum);
  const stakingInstance = new web3.eth.Contract(Staking.abi, Staking.networks[42].address);
  return stakingInstance;
})

export const setInputQuantity5s = createAction('staking/setInputQuantity5s');
export const setInputQuantity1d = createAction('staking/setInputQuantity1d');
export const setInputQuantity3m = createAction('staking/setInputQuantity3m');


export const setInputContractOwner = createAction('staking/setInputContractOwner');

