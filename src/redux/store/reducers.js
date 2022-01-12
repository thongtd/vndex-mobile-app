// @flow

// import { persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-community/async-storage';

import { authentication, wallet, p2p } from '../modules';
import market from '../modules/market/reducer';
// const config = {
//   key: 'LIFTED_REDUX_STORE',
//   storage: AsyncStorage
// };
export default rootReducer = {
  authentication,
  market,
  wallet,
  p2p
};

// export default function rootReducer(state, action) {
//   return appReducer(state, action);
// }
