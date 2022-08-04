import { createAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const checkMetamaskInstall = createAction('web3/checkMetamaskInstall');
export const checkMetamaskInit = createAction('web3/checkMetamaskInit');
export const saveChainId = createAction('web3/saveChainId');
export const saveWeb3 = createAction('web3/saveWeb3');
export const saveInstance = createAction('web3/saveInstance');

export const saveAccountAddress = createAsyncThunk('web3/saveAccountAddress', async () => {
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
  return accounts[0];
});


export const connectMetamask = createAsyncThunk('web3/connectMetamask', async () => {
  const provider = window.ethereum;
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const chainId = await provider.request({ method: 'eth_chainId' });
    if(chainId === '0x2A'){
      return accounts[0];
    } else {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2A'}],
        });
        return accounts[0];
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          console.log("This network is not available in your metamask, please add it")
        }
        console.log("Failed to switch to the network")
      }
    }
});

export const checkChainId = createAsyncThunk('web3/checkChainId', async () => {
  const provider = window.ethereum;
  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const chainId = await provider.request({ method: 'eth_chainId' });
    if(chainId === '0x2A'){
      return accounts[0];
    } else {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2A'}],
        });
        
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          console.log("This network is not available in your metamask, please add it")
        }
        console.log("Failed to switch to the network")
      }
    }
});