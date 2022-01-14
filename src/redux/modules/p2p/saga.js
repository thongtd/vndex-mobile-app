// @flow

import {
  take,
  put,
  call,
  fork,
  all,
  takeEvery,
  select,
} from 'redux-saga/effects';
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
  GET_OFFER_ORDER,
  CREATE_OFFER_ADVERTISMENT,
  GET_OFFER_ORDER_SUCCESS,
  CONFIRM_PAYMENT_ADVERTISMENT,
  UNLOCK_OFFER_ADVERTISMENT,
  GET_MARKET_INFO,
} from './actions';

import {
  createAction,
  emitEventEmitter,
  get,
  toast,
} from '../../../configs/utils';
import {P2pService} from '../../../services/p2p.service';
import {isArray, size} from 'lodash';
import { useActionsP2p } from '.';

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
export function* asyncGetOfferOrder({payload}) {
  try {
    const offerOrderData = yield select(state => state.p2p.offerOrder);
    const res = yield call(P2pService.getOfferOrder, payload);
    console.log('res: ', res);
    emitEventEmitter('doneApi', true);

    if (get(res, 'success')) {
        yield put(actionsReducerP2p.getOfferOrderSuccess(get(res, 'data')));
      
    }
  } catch (e) {
    console.log(e,"errkaka");
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
    const res = yield call(
      P2pService.createOfferOrderAdvertisment,
      get(payload, 'data'),
    );
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'data.status')) {
      yield put(
        createAction(
          'GET_OFFER_ORDER_ID_SUCCESS',
          get(res, 'data.offerOrderId'),
        ),
      );
      yield put(createAction(GET_OFFER_ORDER, get(res, 'data.offerOrderId')));
      emitEventEmitter('pushOfferOrder', {
        paymentMethodData: get(payload, 'paymentMethodData'),
        offerOrder: get(res, 'data'),
      });
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
export function* asyncConfirmPaymentAdvertisment({payload}) {
  try {
    const res = yield call(P2pService.confirmPaymentAdvertisment, payload);
    console.log('reskaka: ', res);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'data.status')) {
      // yield put(createAction(GET));
      emitEventEmitter('pushStep', payload);
      yield put(createAction(GET_OFFER_ORDER, get(res, 'data.offerOrderId')));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchConfirmPaymentAdvertisment() {
  while (true) {
    const action = yield take(CONFIRM_PAYMENT_ADVERTISMENT);
    yield* asyncConfirmPaymentAdvertisment(action);
  }
}
export function* asyncUnlockOfferAdvertisment({payload}) {
  try {
    const res = yield call(
      P2pService.unlockOfferAdvertisment,
      get(payload, 'data'),
      get(payload, 'offerOrderId'),
    );
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'data.status')) {
      yield put(createAction(GET_OFFER_ORDER, get(res, 'data.offerOrderId')));
      emitEventEmitter('successUnlock', true);
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchUnlockOfferAdvertisment() {
  while (true) {
    const action = yield take(UNLOCK_OFFER_ADVERTISMENT);
    yield* asyncUnlockOfferAdvertisment(action);
  }
}
export function* asyncGetMarketInfo({payload}) {
  try {
    const res = yield call(
      
      P2pService.getMarketInfo,payload
    );
    emitEventEmitter('doneApi', true);
    console.log('res: ', res);
    if(isArray(res) && size(res) > 0){
      yield put(actionsReducerP2p.getMarketInfoSuccess(res[0]));
    }
    
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetMarketInfo() {
  while (true) {
    const action = yield take(GET_MARKET_INFO);
    yield* asyncGetMarketInfo(action);
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
  yield all([fork(watchGetOfferOrder)]);
  yield all([fork(watchCreateOfferOrder)]);
  yield all([fork(watchUnlockOfferAdvertisment)]);
  yield all([fork(watchConfirmPaymentAdvertisment)]);
  yield all([fork(watchGetMarketInfo)]);
}
