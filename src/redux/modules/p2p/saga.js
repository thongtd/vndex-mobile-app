// @flow

import {take, put, call, fork, all, takeEvery} from 'redux-saga/effects';
import {
  GET_COUNTRIES,
  actionsReducerP2p,
  GET_ADVERTISMENTS,
  GET_TRADING,
  GET_ADVERTISMENT,
  GET_PAYMENT_METHOD_BY_ACC,
  GET_EXCHANGE_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD,
  REMOVE_PAYMENT_METHOD,
  GET_OFFER_ORDER,
  CREATE_OFFER_ADVERTISMENT,
  GET_OFFER_ORDER_SUCCESS,
} from './actions';

import {
  createAction,
  emitEventEmitter,
  get,
  toast,
} from '../../../configs/utils';
import {P2pService} from '../../../services/p2p.service';
import {size} from 'lodash';

export function* asyncGetAdvertisments({payload}) {
  try {
    const res = yield call(P2pService.getAdvertisments, {
      pageIndex: get(payload, 'pageIndex') || 1,
      pageSize: get(payload, 'pageSize') || 15,
      side: get(payload, 'side') || '',
      coinSymbol: get(payload, 'coinSymbol') || '',
      paymentUnit: get(payload, 'paymentUnit') || '',
      priceType: get(payload, 'priceType') || '',
      orderAmount: get(payload, 'orderAmount') || '',
      exPaymentMethodIds: get(payload, 'exPaymentMethodIds') || '',
      requiredKyc: get(payload, 'requiredKyc') || '',
      requiredAgeInday: get(payload, 'requiredAgeInday') || '',
      createdFrom: get(payload, 'createdFrom') || '',
      createdTo: get(payload, 'createdTo') || '',
      status: get(payload, 'status') || '',
    });
    emitEventEmitter('doneApi', true);
    yield put(actionsReducerP2p.getAdvertismentsSuccess(get(res, 'source')));
  } catch (e) {
    emitEventEmitter('doneApi', true);
    console.log('e: ', e);
  }
}
export function* watchGetAdvertisments() {
  while (true) {
    const action = yield take(GET_ADVERTISMENTS);
    yield* asyncGetAdvertisments(action);
  }
}
export function* asyncGetTrading({payload}) {
  try {
    const res = yield call(P2pService.getTradingMarket);
    console.log('res: ', res);
    let symbolArr = [];

    let currencyArr = [];
    if (size(res) > 0) {
      res.map((item, index) => {
        currencyArr.push(get(item, 'tradingCurrency'));
        if (get(item, 'tradingCoins') && size(get(item, 'tradingCoins')) > 0) {
          get(item, 'tradingCoins').map((item2, index2) => {
            symbolArr.push(get(item2, 'symbol'));
          });
        }
      });
    }
    let symbolArrFiltered = symbolArr.filter(
      (v, i, a) => a.findIndex(t => t === v) === i,
    );
    let currencyArrFiltered = currencyArr.filter(
      (v, i, a) => a.findIndex(t => t === v) === i,
    );
    let resData = {
      assets: symbolArrFiltered,
      paymentUnit: currencyArrFiltered,
    };

    yield put(actionsReducerP2p.getTradingSuccess(resData));
  } catch (e) {
    console.log('e: ', e);
  }
}
export function* watchGetTrading() {
  while (true) {
    const action = yield take(GET_TRADING);
    yield* asyncGetTrading(action);
  }
}
export function* asyncGetAdvertisment({payload}) {
  try {
    const res = yield call(P2pService.getAdvertisment, payload);
    emitEventEmitter('doneApi', true);
    yield put(actionsReducerP2p.getAdvertismentSuccess(res));
  } catch (e) {
    emitEventEmitter('doneApi', true);
    console.log('e: ', e);
  }
}
export function* watchGetAdvertisment() {
  while (true) {
    const action = yield take(GET_ADVERTISMENT);
    yield* asyncGetAdvertisment(action);
  }
}
export function* asyncGetExchangePaymentMethod({payload}) {
  try {
    const res = yield call(P2pService.getExchangePaymentMethod);
    emitEventEmitter('doneApi', true);

    yield put(actionsReducerP2p.getExchangePaymentMethodSuccess(res));
  } catch (e) {
    emitEventEmitter('doneApi', true);
    console.log('e: ', e);
  }
}
export function* watchGetExchangePaymentMethod() {
  while (true) {
    const action = yield take(GET_EXCHANGE_PAYMENT_METHOD);
    yield* asyncGetExchangePaymentMethod(action);
  }
}
export function* asyncGetPaymentMethod({payload}) {
  try {
    const res = yield call(P2pService.getPaymentMethodByAcc);
    emitEventEmitter('doneApi', true);
    console.log('easyncGetPaymentMethod: ', res);
    if (get(res, 'success')) {
      yield put(
        actionsReducerP2p.getPaymentMethodByAccSuccess(get(res, 'data')),
      );
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
    console.log('easyncGetPaymentMethod: ', e);
  }
}
export function* watchGetPaymentMethod() {
  while (true) {
    const action = yield take(GET_PAYMENT_METHOD_BY_ACC);
    yield* asyncGetPaymentMethod(action);
  }
}
export function* asyncAddPaymentMethod({payload}) {
  try {
    const res = yield call(P2pService.addPaymentMethod, payload);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success')) {
      yield put(createAction(GET_PAYMENT_METHOD_BY_ACC));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchAddPaymentMethod() {
  while (true) {
    const action = yield take(ADD_PAYMENT_METHOD);
    yield* asyncAddPaymentMethod(action);
  }
}
export function* asyncRemovePaymentMethod({payload}) {
  try {
    const res = yield call(
      P2pService.removePaymentMethod,
      get(payload, 'data'),
      get(payload, 'accId'),
    );
    emitEventEmitter('doneApi', true);
    console.log('easyncGetPaymentMethod: ', res);
    if (get(res, 'success')) {
      yield put(createAction(GET_PAYMENT_METHOD_BY_ACC));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
    console.log('easyncGetPaymentMethod: ', e);
  }
}
export function* watchRemovePaymentMethod() {
  while (true) {
    const action = yield take(REMOVE_PAYMENT_METHOD);
    yield* asyncRemovePaymentMethod(action);
  }
}
export function* asyncGetOfferOrder({payload}) {
  try {
    const res = yield call(P2pService.getOfferOrder, payload);
    emitEventEmitter('doneApi', true);

    if (get(res, 'success')) {
      yield put(
        actionsReducerP2p.getOfferOrderSuccess(get(res, 'data')),
      );
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetOfferOrder() {
  while (true) {
    const action = yield take(GET_OFFER_ORDER);
    yield* asyncGetOfferOrder(action);
  }
}
export function* asyncCreateOfferOrder({payload}) {
  try {
    const res = yield call(P2pService.createOfferOrderAdvertisment, payload);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'data.status')) {
      // yield put(createAction(GET));
      emitEventEmitter('pushOfferOrder', get(res, 'data.offerOrderId'));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchCreateOfferOrder() {
  while (true) {
    const action = yield take(CREATE_OFFER_ADVERTISMENT);
    yield* asyncCreateOfferOrder(action);
  }
}
export default function* () {
  yield all([fork(watchGetAdvertisments)]);
  yield all([fork(watchGetTrading)]);
  yield all([fork(watchGetAdvertisment)]);
  yield all([fork(watchGetPaymentMethod)]);
  yield all([fork(watchGetExchangePaymentMethod)]);
  yield all([fork(watchAddPaymentMethod)]);
  yield all([fork(watchRemovePaymentMethod)]);
  yield all([fork(watchGetOfferOrder)]);
  yield all([fork(watchCreateOfferOrder)]);
}
