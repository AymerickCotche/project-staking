import { combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import stakingReducer from './staking';
import web3Reducer from './web3';


const rootReducer = combineReducers({
  web3: web3Reducer,
  staking: stakingReducer
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export default rootReducer;
