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
  GET_MY_ADVERTISMENTS,
} from './actions';

import {createAction, emitEventEmitter, get} from '../../../configs/utils';
import {P2pService} from '../../../services/p2p.service';
import {isArray, size} from 'lodash';

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
  } catch (e) {}
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

    if (get(res, 'success')) {
      yield put(
        actionsReducerP2p.getPaymentMethodByAccSuccess(get(res, 'data')),
      );
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
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

    if (get(res, 'success')) {
      yield put(createAction(GET_PAYMENT_METHOD_BY_ACC));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchRemovePaymentMethod() {
  while (true) {
    const action = yield take(REMOVE_PAYMENT_METHOD);
    yield* asyncRemovePaymentMethod(action);
  }
}
export function* asyncGetMyAdvertisment({payload}) {
  try {
    const res = yield call(P2pService.getMyAdvertisments, {
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
    if (res?.status == 200) {
      if (isArray(get(res.data, 'source'))) {
        res.data.source = res.data.source.map(item => {
          const isBankMomo = (get(item, 'paymentMethods') || []).find(
            i => i.code == 'MOMO',
          )
            ? true
            : false;
          const isBanking = (get(item, 'paymentMethods') || []).find(
            i => i.code == 'BANK_TRANSFER',
          )
            ? true
            : false;
          return {
            ...item,
            isBankMomo,
            isBanking,
          };
        });
        yield put(
          actionsReducerP2p.getMyAdvertismentsSuccess({
            ...get(res, 'data'),
            pageIndex: get(payload, 'pageIndex') || 1,
          }),
        );
      }
      emitEventEmitter('doneApi', true);
    } else {
      emitEventEmitter('doneApi', false);
    }
  } catch (e) {
    emitEventEmitter('doneApi', false);
  }
}

export function* watchGetMyAdvertisment() {
  while (true) {
    const action = yield take(GET_MY_ADVERTISMENTS);
    yield* asyncGetMyAdvertisment(action);
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
  yield all([fork(watchGetMyAdvertisment)]);
}
