// @flow

import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import { authentication, wallet } from '../modules';
import market from '../modules/market/reducer';
const config = {
  key: 'LIFTED_REDUX_STORE',
  storage: AsyncStorage
};
const appReducer = persistCombineReducers(config, {
  authentication,
  market,
  wallet
});

export default function rootReducer(state, action) {
  return appReducer(state, action);
}
