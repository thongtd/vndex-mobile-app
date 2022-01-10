// @flow

import {take, put, call, fork, all, takeEvery} from 'redux-saga/effects';
import {
  GET_COUNTRIES,
  actionsReducerP2p,
  GET_ADVERTISMENTS,
  GET_TRADING,
  GET_ADVERTISMENT,
} from './actions';

import {emitEventEmitter, get} from '../../../configs/utils';
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
    emitEventEmitter('doneApi',true);
    yield put(actionsReducerP2p.getAdvertismentsSuccess(get(res, 'source')));
  } catch (e) {
    emitEventEmitter('doneApi',true);
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
      emitEventEmitter('doneApi',true);
      yield put(actionsReducerP2p.getAdvertismentSuccess(res));
    } catch (e) {
      emitEventEmitter('doneApi',true);
      console.log('e: ', e);
    }
  }
export function* watchGetAdvertisment() {
    while (true) {
      const action = yield take(GET_ADVERTISMENT);
      yield* asyncGetAdvertisment(action);
    }
  }
export default function* () {
  yield all([fork(watchGetAdvertisments)]);
  yield all([fork(watchGetTrading)]);
  yield all([fork(watchGetAdvertisment)]);
}
