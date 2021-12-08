// @flow

import { fork, all } from 'redux-saga/effects';
import { authSaga, marketSaga,WalletSaga } from '../modules';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(marketSaga),
    fork(WalletSaga)
  ]);
}
