// @flow

import {
  take, put, call, fork, all, actionChannel, takeEvery, select,takeLatest
} from 'redux-saga/effects';
import { GET_COUNTRIES, actionsReducerAuthen, CHECK_EMAIL, CHECK_LOGIN, CONFIRM_2FA_CODE, LOGIN_SUCCESS, GET_MARKET_WATCH, actionsReducerMarket, GET_CURRENCY_LIST, GET_CONVERSION, GET_SWAP_SUCCESS, GET_SWAP, GET_FIAT_WALLET, GET_CRYPTO_WALLET, GET_MARKET_WATCH_SUCCESS, GET_SWAP_ORDERS_BOOK } from './actions';
import { authService } from '../../../services/authentication.service';
import { toast, get, formatMessageByArray, emitEventEmitter, setTokenAndUserInfo, size, jwtDecode, listenerEventEmitter, createAction, isArray } from '../../../configs/utils';
import { pushSingleScreenApp, WALLET_SCREEN, CONFIRM_LOGIN_SCREEN, ALERT_ACCOUNT_ACTIVE } from '../../../navigation';
import { IdNavigation, constant } from '../../../configs/constant';
import { showModal, pushTabBasedApp } from '../../../navigation/Navigation';
import { marketService } from '../../../services/market.service';
import { useSelector } from "react-redux";
import { SOCKET_URL } from '../../../configs/api';
import { HubConnectionBuilder, JsonHubProtocol, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { eventChannel, END } from 'redux-saga'
import _, { orderBy } from "lodash";
import { actionsReducerWallet } from '../wallet';
import { GET_WITHDRAW_COIN_LOG, GET_DEPOSIT_FIAT_LOG, GET_WITHDRAW_FIAT_LOG } from '../wallet/actions';
var connection = null;
var connected = false;

export function* asyncGetMarketWatch() {
  try {
    const res = yield call(marketService.getMarketWatch);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");

        let _marketData = [];
        let _coin = [];
        for (let i in data) {
          let e = data[i];
          _coin.push({ symbol: get(e, "tradingCurrency"), name: get(e, "name") })
          _marketData = _marketData.concat(get(e, "tradingCoins"));
        }
        yield put(
          actionsReducerMarket.getMarketWatchSuccess(_marketData)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export function* asyncGetCurrencyList() {
  try {
    const res = yield call(marketService.getCurrencies);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");
        yield put(
          actionsReducerMarket.getCurrencyListSuccess(data)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}
export function* asyncGetConversion() {
  try {
    const res = yield call(marketService.getCurrencyConversion);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");
        yield put(
          actionsReducerMarket.getConversionSuccess(data)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export function* asyncGetSwapConfig() {
  try {
    const res = yield call(marketService.getSwapConfigs);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");
        yield put(
          actionsReducerMarket.getSwapSuccess(data)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export function* asyncGetFiatWallet({ payload }) {
  try {
    const res = yield call(marketService.getFiatWallet, payload);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");
        yield put(
          actionsReducerMarket.getFiatWalletSuccess(data)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export function* asyncGetCryptoWallet({ payload }) {
  try {
    const res = yield call(marketService.getCrytoWallet, payload);
    if (get(res, "result") === 'ok') {
      if (get(res, "data")) {
        let data = get(res, "data");
        emitEventEmitter("doneSwap", true)
        yield put(
          actionsReducerMarket.getCryptoWalletSuccess(data)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export function* watchGetMarketWatch() {
  while (true) {
    const action = yield take(GET_MARKET_WATCH);
    yield* asyncGetMarketWatch(action);
  }
}

export function* watchGetCurrencyList() {
  while (true) {
    const action = yield take(GET_CURRENCY_LIST);
    yield* asyncGetCurrencyList(action);
  }
}
export function* watchGetConversion() {
  while (true) {
    const action = yield take(GET_CONVERSION);
    yield* asyncGetConversion(action);
  }
}

export function* watchGetSwapConfig() {
  while (true) {
    const action = yield take(GET_SWAP);
    yield* asyncGetSwapConfig(action);
  }
}

export function* watchGetFiatWallet() {
  while (true) {
    const action = yield take(GET_FIAT_WALLET);
    yield* asyncGetFiatWallet(action);
  }
}

export function* watchGetCryptoWallet() {
  while (true) {
    const action = yield take(GET_CRYPTO_WALLET);
    yield* asyncGetCryptoWallet(action);
  }
}

function* createSocketChannel(socket, marketWatch) {
  var cryptoHub = [];
  var isSort = false;
  var sortCrypto;
  var coinsWalletType = yield select(state => state.wallet.coinsWalletType);
  listenerEventEmitter("assetsHub", (cryptosWallet) => cryptoHub = [...cryptosWallet])
  listenerEventEmitter("checkSort", (Sort) => isSort = Sort)
  var marketHub = [...marketWatch]
  return eventChannel(emit => {
    const marketWatchHandler = (marketData) => {
      if (size(cryptoHub) > 0 && _.isArray(cryptoHub)) {
        for (let j = 0; j <= size(cryptoHub); j++) {
          if (get(cryptoHub[j], "currency") === get(marketData, "symbol") && get(marketData, "paymentUnit") === "VND") {
            cryptoHub[j].lastestPrice = get(marketData, "lastestPrice");
            cryptoHub[j].priceChange = get(marketData, "priceChange");
          }
        }
        emit({
          cryptoHub: cryptoHub
        });
      }
      if (size(coinsWalletType) > 0 && _.isArray(coinsWalletType)) {
        for (let j = 0; j <= size(coinsWalletType); j++) {
          if (get(coinsWalletType[j], "currency") === get(marketData, "symbol") && get(marketData, "paymentUnit") === "VND") {
            coinsWalletType[j].lastestPrice = get(marketData, "lastestPrice");
            coinsWalletType[j].priceChange = get(marketData, "priceChange");
          }
        }
        emit({
          coinsWalletType: coinsWalletType
        });
      }
      if (size(marketHub) > 0 && _.isArray(marketHub)) {
        for (let i = 0; i <= marketHub.length; i++) {
          if (get(marketHub[i], "pair") == `${get(marketData, "symbol")}-${get(marketData, "paymentUnit")}`) {
            marketHub[i].lastestPrice = marketData.lastestPrice;
            marketHub[i].currencyVolume = marketData.currencyVolume;
            marketHub[i].highestPrice = marketData.highestPrice;
            marketHub[i].lowestPrice = marketData.lowestPrice
            marketHub[i].prevLastestPrice = marketData.prevLastestPrice
            marketHub[i].priceChange = marketData.priceChange
            marketHub[i].priceChangeVolume = marketData.priceChangeVolume
          }
        }
        emit({ marketHub });
      }
    }

    const priceChangeNotify = (priceChange) => {
      if (get(priceChange, "notityType") === 2) {
        emit({ priceChange: true, UserId: get(priceChange, "accId") });
      }
    }

    socket.on(constant.SOCKET_EVENT.MARKET_WATCH, marketWatchHandler)
    socket.on(constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY, priceChangeNotify)
    const unsubscribe = () => {
      socket.off(constant.SOCKET_EVENT.MARKET_WATCH, marketWatchHandler)
      socket.off(constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY, priceChangeNotify)
    }
    return unsubscribe
  })
}


export function* asyncConnectSocket({ payload }) {
  const socket = payload.connection;
  const socketChannel = yield call(createSocketChannel, socket, payload.marketWatch)
  while (true) {
    let payload = yield take(socketChannel);
    if (_.isArray(get(payload, "marketHub")) && size(get(payload, "marketHub")) > 0) {
      yield put({ type: GET_MARKET_WATCH_SUCCESS, payload: get(payload, "marketHub") })
    }
    if (_.isArray(get(payload, "cryptoHub")) && size(get(payload, "cryptoHub")) > 0) {
      yield put(actionsReducerWallet.getCryptoWalletsSuccess(get(payload, "cryptoHub")))
    }
    if (_.isArray(get(payload, "coinsWalletType")) && size(get(payload, "coinsWalletType")) > 0) {
      yield put(actionsReducerWallet.getCoinByTypeCoinsSuccess(get(payload, "coinsWalletType")))
    }
  }
}

export function* WatchSocket() {

  while (true) {
    const action = yield take('CONNECT_SOCKET');
    yield* asyncConnectSocket(action);
  }

}

function* asyncGetSwapOrderBook({ payload }) {
  try {

    const res = yield call(
      marketService.getSwapOrderBooks,
      get(payload, "UserId"),
      get(payload, "pageIndex"),
      get(payload, "pageSize"),
      get(payload, "fromDate"),
      get(payload, "toDate"),
      get(payload, "walletCurrency"),
      get(payload, "status"),
    );
    
    emitEventEmitter("doneSwapOrderBook")
    
    if (isArray(res.data)) {
      
      yield put(actionsReducerMarket.getSwapOrderBookSuccess({data:res.data,pageIndex:get(payload, "pageIndex")}))
    }
    console.log(res, "data swap order book")
  } catch (error) {
    emitEventEmitter("doneSwapOrderBook")
    console.log(error, "error get swap order Book")
  }
}

function* WatchGetSwapOrderBook() {
  yield takeLatest(GET_SWAP_ORDERS_BOOK, asyncGetSwapOrderBook);
}
export default function* () {
  yield all([
    fork(watchGetMarketWatch),
    fork(watchGetCurrencyList),
    fork(watchGetConversion),
    fork(watchGetSwapConfig),
    fork(watchGetFiatWallet),
    fork(watchGetCryptoWallet),
    fork(WatchSocket),
    fork(WatchGetSwapOrderBook)
  ]);
}
