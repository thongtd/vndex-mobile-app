// @flow

import {
  take, put, call, fork, all, actionChannel, takeEvery, select
} from 'redux-saga/effects';
import { GET_ASSET_SUMARY, actionsReducerWallet, GET_WITHDRAW_COIN_LOG, GET_WITHDRAW_FIAT_LOG_SUCCESS, GET_DEPOSIT_COIN_LOG_SUCCESS, GET_DEPOSIT_FIAT_LOG_SUCCESS, GET_DEPOSIT_FIAT_LOG, GET_DEPOSIT_COIN_LOG, GET_WITHDRAW_FIAT_LOG, GET_DEPOSIT_BANK_ACCOUNT, GET_BALANCE_BY_CURRENCY, GET_COIN_BY_TYPE } from './actions';
import { authService } from '../../../services/authentication.service';
import { toast, get, formatMessageByArray, emitEventEmitter, setTokenAndUserInfo, size, jwtDecode, isArray, createAction } from '../../../configs/utils';
import _, { orderBy } from "lodash";
import { WalletService } from '../../../services/wallet.service';

export function* asyncGetAssetSumary({ payload }) {
  try {
    if (payload) {
      const { UserId } = payload;
      const marketWatch = yield select(state => state.market.marketWatch);

      const res = yield call(WalletService.getAssetSummary, UserId);
      if (res.result === "ok") {
        if (size(res.data) > 0 && size(marketWatch) > 0 && isArray(marketWatch)) {
          let cryptoWallet = res.data.filter((item, index) => get(item, "walletType") === 2);
          let fiatWallet = res.data.filter((item, index) => get(item, "walletType") === 1);
          let getMarketVND = marketWatch.filter((item, index) => get(item, "tradingCurrency") === "VND");
          if (size(getMarketVND) > 0 && isArray(getMarketVND) && size(cryptoWallet) > 0 && isArray(cryptoWallet)) {
            for (let i = 0; i <= size(getMarketVND); i++) {
              for (let j = 0; j <= size(cryptoWallet); j++) {
                if (get(getMarketVND[i], "symbol") && get(cryptoWallet[j], "currency") && get(getMarketVND[i], "symbol") === get(cryptoWallet[j], "currency")) {
                  cryptoWallet[j].lastestPrice = get(getMarketVND[i], "lastestPrice")
                  cryptoWallet[j].priceChange = get(getMarketVND[i], "priceChange")
                }
              }
            }
            emitEventEmitter("assetsHub", cryptoWallet);
            emitEventEmitter("fiatsHub", fiatWallet);
            yield put(actionsReducerWallet.getFiatWalletsSuccess([...fiatWallet]));
            yield put(actionsReducerWallet.getCryptoWalletsSuccess([...cryptoWallet]))
            emitEventEmitter("doneAssets", true)
          }
        }
      } else {
        emitEventEmitter("doneAssets", true)
      }
    }
  } catch (error) {
    emitEventEmitter("doneAssets", true)
  }
}

export function* WatchGetAssetSumary() {
  yield takeEvery(GET_ASSET_SUMARY, asyncGetAssetSumary);

}

export function* asyncGetWithdrawCoinLog({ payload }) {
  try {
    if (payload) {
      const { pageIndex, UserId, loadMore, fromDate, toDate, walletCurrency, status } = payload;
      const res = yield call(WalletService.getWithdrawCoinLog, UserId, pageIndex, 15, fromDate, toDate, walletCurrency, status);
      emitEventEmitter("doneWCoinLog", true)
      if (res.result === "ok") {
        if (isArray(get(res, "data")) && size(get(res, "data")) > 0) {
          if (loadMore) {
            yield put(createAction("GET_COIN_WITHDRAW_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
          } else {
            yield put(createAction("GET_COIN_WITHDRAW_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
            yield put(actionsReducerWallet.getWithdrawCoinsSuccess(get(res, "data")));
          }
        } else {
          yield put(actionsReducerWallet.getWithdrawCoinsSuccess([]));
          yield put(createAction("GET_COIN_WITHDRAW_LOG_LOAD_MORE", { data: [], pageIndex }));
        }
      }
    }
  } catch (error) {
    emitEventEmitter("doneWCoinLog", true)
  }
}

export function* WatchWithdrawCoinLog() {
  yield takeEvery(GET_WITHDRAW_COIN_LOG, asyncGetWithdrawCoinLog);
}

export function* asyncGetWithdrawFiatLog({ payload }) {
  try {
    if (payload) {
      const { pageIndex, UserId, loadMore, fromDate, toDate, walletCurrency, status } = payload;
      const res = yield call(WalletService.getWithdrawFiatLog, UserId, pageIndex, 15, fromDate, toDate, walletCurrency, status);
      emitEventEmitter("doneWFiatLog", true)
      if (res.result === "ok") {
        if (isArray(get(res, "data")) && size(get(res, "data")) > 0) {
          if (loadMore) {
            yield put(createAction("GET_FIAT_WITHDRAW_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
          } else {
            yield put(actionsReducerWallet.getWithdrawFiatsSuccess(get(res, "data")));
            yield put(createAction("GET_FIAT_WITHDRAW_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
          }
        } else {
          yield put(actionsReducerWallet.getWithdrawFiatsSuccess([]));
          yield put(createAction("GET_FIAT_WITHDRAW_LOG_LOAD_MORE", { data: [], pageIndex }));
        }
      }
    }
  } catch (error) {
    emitEventEmitter("doneWFiatLog", true)
  }
}

export function* WatchWithdrawFiatLog() {
  yield takeEvery(GET_WITHDRAW_FIAT_LOG, asyncGetWithdrawFiatLog);
}

export function* asyncGetDepositCoinLog({ payload }) {
  try {
    if (payload) {
      const { pageIndex, UserId, loadMore, fromDate, toDate, walletCurrency, status } = payload;
      const res = yield call(WalletService.getDepositCoinLog, UserId, pageIndex, 15, fromDate, toDate, walletCurrency, status);
      emitEventEmitter("doneDCoinLog", true)
      if (res.result === "ok") {
        if (isArray(get(res, "data")) && size(get(res, "data")) > 0) {
          if (loadMore) {
            yield put(createAction("GET_COIN_DEPOSIT_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
          } else {
            yield put(createAction("GET_COIN_DEPOSIT_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
            yield put(actionsReducerWallet.getDepositCoinsSuccess(get(res, "data")));
          }
        } else {
          yield put(actionsReducerWallet.getDepositCoinsSuccess([]));
          yield put(createAction("GET_COIN_DEPOSIT_LOG_LOAD_MORE", { data: [], pageIndex }));
        }
      }
    }
  } catch (error) {
    emitEventEmitter("doneDCoinLog", true)
    console.log(error, "payload");
  }
}

export function* WatchDepositCoinLog() {
  yield takeEvery(GET_DEPOSIT_COIN_LOG, asyncGetDepositCoinLog);
}

export function* asyncGetDepositFiatLog({ payload }) {
  try {
    if (payload) {
      const { pageIndex, UserId, loadMore, fromDate, toDate, walletCurrency, status } = payload;
      const res = yield call(WalletService.getDepositFiatLog, UserId, pageIndex, 15, fromDate, toDate, walletCurrency, status);
      emitEventEmitter("doneDFiatLog", true)
      if (res.result === "ok") {
        if (isArray(get(res, "data")) && size(get(res, "data")) > 0) {
          if (loadMore) {
            yield put(createAction("GET_FIAT_DEPOSIT_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
          } else {
            yield put(createAction("GET_FIAT_DEPOSIT_LOG_LOAD_MORE", { data: get(res, "data"), pageIndex }));
            yield put(actionsReducerWallet.getDepositFiatsSuccess(get(res, "data")));
          }
        } else {
          yield put(actionsReducerWallet.getDepositFiatsSuccess([]));
          yield put(createAction("GET_FIAT_DEPOSIT_LOG_LOAD_MORE", { data: [], pageIndex }));
        }
      }
    }
  } catch (error) {
    emitEventEmitter("doneDFiatLog", true)
  }
}

export function* WatchDepositFiatLog() {
  yield takeEvery(GET_DEPOSIT_FIAT_LOG, asyncGetDepositFiatLog);
}

function* asyncGetDepositBankAccount({ payload }) {
  try {
    if (payload) {
      const { UserId, currency } = payload;

      const res = yield call(WalletService.getDepositBankAccount, currency, UserId);

      if (res.result === "ok") {
        if (isArray(get(res, "data")) && size(get(res, "data")) > 0) {
          yield put(actionsReducerWallet.getDepositBankAccountSuccess(get(res, "data")));
        } else {
          yield put(actionsReducerWallet.getDepositBankAccountSuccess([]));
        }
      }
    }
  } catch (error) {
    // emitEventEmitter("doneDFiatLog", true)
  }
}
export function* WatchGetDepositBankAccount() {
  yield takeEvery(GET_DEPOSIT_BANK_ACCOUNT, asyncGetDepositBankAccount);
}

function* asyncGetBalanceByCurrency({ payload }) {
  try {
    if (payload) {
      const { UserId, currency } = payload;
      const res = yield call(WalletService.getWalletBalanceByCurrency, UserId, currency);
      if (res) {
        yield put(actionsReducerWallet.getBalanceByCurrencySuccess(res));
      } else {
      }
    }
  } catch (error) {
    // emitEventEmitter("doneDFiatLog", true)
  }
}

function* asyncGetCoinByType({ payload }) {
  try {
    if (payload) {
      const { walletType } = payload;
      const res = yield call(WalletService.getCoinByType, walletType);
      var coinData = [...get(res, "data")];
      const marketWatch = yield select(state => state.market.marketWatch);
      emitEventEmitter("doneAssets");
      let getMarketVND = marketWatch.filter((item, index) => get(item, "tradingCurrency") === "VND");
      if (res.result === "ok") {
        if (walletType == 1) {
          yield put(actionsReducerWallet.getCoinByTypeFiatsSuccess([...orderBy(get(res, "data"), ['symbol'], ['asc'])]));
        } else {
          if (size(getMarketVND) > 0 && isArray(getMarketVND) && size(coinData) > 0 && isArray(coinData)) {
            for (let i = 0; i <= size(getMarketVND); i++) {
              for (let j = 0; j <= size(coinData); j++) {
                if (get(getMarketVND[i], "symbol") && get(coinData[j], "symbol") && get(getMarketVND[i], "symbol") === get(coinData[j], "symbol")) {
                  coinData[j].lastestPrice = get(getMarketVND[i], "lastestPrice")
                  coinData[j].priceChange = get(getMarketVND[i], "priceChange")
                }
              }
            }
          }
          console.log(coinData,"coinData");
          yield put(actionsReducerWallet.getCoinByTypeCoinsSuccess([...orderBy(coinData, ['symbol'], ['asc'])]));
        }

      } else {
        console.log(res, "by type")
      }
    }
  } catch (error) {
    console.log(error, "by type")
  }
}

export function* WatchGetBalanceByCurrency() {
  yield takeEvery(GET_BALANCE_BY_CURRENCY, asyncGetBalanceByCurrency);
}
export function* WatchGetCoinByType() {
  yield takeEvery(GET_COIN_BY_TYPE, asyncGetCoinByType);
}
export default function* () {
  yield all([
    fork(WatchGetAssetSumary),
    fork(WatchWithdrawCoinLog),
    fork(WatchWithdrawFiatLog),
    fork(WatchDepositCoinLog),
    fork(WatchDepositFiatLog),
    fork(WatchGetDepositBankAccount),
    fork(WatchGetBalanceByCurrency),
    fork(WatchGetCoinByType),
  ]);
}
