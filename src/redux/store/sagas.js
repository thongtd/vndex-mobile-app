// @flow

import { fork, all } from 'redux-saga/effects';
import { authSaga, marketSaga,WalletSaga, p2pSaga } from '../modules';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(marketSaga),
    fork(WalletSaga),
    fork(p2pSaga)
  ]);
}
