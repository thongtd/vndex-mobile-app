// @flow

import {
  take,
  put,
  call,
  fork,
  all,
  takeEvery,
  select,
  takeLatest,
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
  CREATE_ADVERTISMENT,
  UPDATE_ADVERTISMENT,
  REMOVE_ADVERTISMENT,
  GET_HISTORY_ORDER,
  GET_DETIAL_ADVERTISMENT,
  UPDATE_STATUS_ADV,
  GET_CHAT_HISTORY,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_INFO_P2P,
  SEND_CHAT_MESSAGE,
  GET_COMPLAIN,
  GET_COMPLAIN_PROCESS,
  CANCEL_COMPLAIN,
  CREATE_COMPLAIN,
  CREATE_RATING_COMMENT,
  GET_COMMENTS_BY_USER,
  GET_ADV_INFO,
  GET_COMMENTS_BY_USER_SUCCESS,
  GET_ADV_INFO_SUCCESS,
  GET_FEE_TAX,
  GET_FEE_TAX_SUCCESS,
  GET_ALL_CUSTOMER_TYPE,
  CREATE_CUSTOMER_TYPE,
} from './actions';

import {
  createAction,
  emitEventEmitter,
  get,
  toast,
} from '../../../configs/utils';
import {P2pService} from '../../../services/p2p.service';
import {ceil, isArray, size} from 'lodash';

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
      isProfessional: get(payload, 'isProfessional') || false
    });
    emitEventEmitter('doneApi', true);

    if (res && isArray(get(res, 'source'))) {
      yield put(
        actionsReducerP2p.getAdvertismentsSuccess({
          ...res,
          pageIndex: get(payload, 'pageIndex') || 1,
          pages: ceil(get(res, 'totalRecords') / get(payload, 'pageSize')),
        }),
      );
    } else {
      actionsReducerP2p.getAdvertismentsSuccess({
        source: [],
        pageIndex: 1,
        pages: 0,
      });
    }
    emitEventEmitter('doneApi', true);
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetAdvertisments() {
  yield takeEvery(GET_ADVERTISMENTS, asyncGetAdvertisments);
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
        yield put(
          actionsReducerP2p.getMyAdvertismentsSuccess({
            ...get(res, 'data'),
            pageIndex: get(payload, 'pageIndex') || 1,
            pages: ceil(
              get(res, 'data.totalRecords') / get(payload, 'pageSize'),
            ),
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
  yield takeEvery(GET_MY_ADVERTISMENTS, asyncGetMyAdvertisment);
}
export function* asyncGetOfferOrder({payload}) {
  try {
    const offerOrderData = yield select(state => state.p2p.offerOrder);
    const res = yield call(P2pService.getOfferOrder, payload);
    console.log('res: ', res);
    emitEventEmitter('doneApi', true);

    if (get(res, 'success')) {
      yield put(
        createAction('GET_OFFER_ORDER_ID_SUCCESS', get(res, 'data.id')),
      );
      yield put(actionsReducerP2p.getOfferOrderSuccess(get(res, 'data')));
      // yield put(
      //   createAction(GET_ADVERTISMENT, get(res, 'data.p2PTradingOrderId')),
      // );
    }
  } catch (e) {
    console.log(e, 'errkaka');
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
    console.log('resk: ', res);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'data.status')) {
      yield put(
        createAction(
          'GET_OFFER_ORDER_ID_SUCCESS',
          get(res, 'data.offerOrderId'),
        ),
      );

      emitEventEmitter('pushOfferOrder', {
        paymentMethodData: get(payload, 'paymentMethodData'),
        offerOrder: get(res, 'data'),
      });
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
    const res = yield call(P2pService.getMarketInfo, payload);
    emitEventEmitter('doneApi', true);
    console.log('res: ', res);
    if (isArray(res) && size(res) > 0) {
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
export function* asyncGetHistoryOrder({payload}) {
  try {
    const res = yield call(P2pService.getHistoryOrder, payload);
    console.log('History: ', res);
    emitEventEmitter('doneApi', true);

    if (isArray(get(res, 'source'))) {
      yield put(
        actionsReducerP2p.getHistoryOrderSuccess({
          ...res,
          pageIndex: get(payload, 'pageIndex') || 1,
          pages: ceil(get(res, 'totalRecords') / get(payload, 'pageSize')),
        }),
      );
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetHistoryOrder() {
  yield takeEvery(GET_HISTORY_ORDER, asyncGetHistoryOrder);
}
export function* asyncCreateAdvertisment({payload}) {
  try {
    const res = yield call(P2pService.createAdvertisment, payload);
    emitEventEmitter('doneApi', true);

    if (get(res, 'success') && get(res, 'data.status')) {
      toast(get(res, 'message'));
      emitEventEmitter('successCreateAds', true);
      yield put(createAction(GET_MY_ADVERTISMENTS));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchCreateAdvertisment() {
  while (true) {
    const action = yield take(CREATE_ADVERTISMENT);
    yield* asyncCreateAdvertisment(action);
  }
}
export function* asyncUpdateAdvertisment({payload}) {
  try {
    const res = yield call(
      P2pService.updateAdvertisment,
      payload,
      get(payload, 'tradingOrderId'),
    );
    console.log('___________res: ', res);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'status')) {
      emitEventEmitter('successCreateAds', true);
      toast(get(res, 'message'));
      yield put(createAction(GET_MY_ADVERTISMENTS));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchUpdateAdvertisment() {
  while (true) {
    const action = yield take(UPDATE_ADVERTISMENT);
    yield* asyncUpdateAdvertisment(action);
  }
}
export function* asyncDeleteAdvertisment({payload}) {
  try {
    const res = yield call(P2pService.removeAdvertisment, payload);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success') && get(res, 'status')) {
      toast(get(res, 'message'));
      yield put(createAction(GET_MY_ADVERTISMENTS));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchDeleteAdvertisment() {
  while (true) {
    const action = yield take(REMOVE_ADVERTISMENT);
    yield* asyncDeleteAdvertisment(action);
  }
}

export function* asyncDetailsItemAdvertisment(payload) {
  try {
    if (get(payload, 'orderId')) {
      const res = yield call(
        P2pService.removeAdvertisment,
        get(payload, 'orderId'),
      );
      emitEventEmitter('doneApi', true);
      if (get(res, 'success') && get(res, 'status')) {
        toast(get(res, 'message'));
        yield put(createAction(GET_MY_ADVERTISMENTS));
      } else {
        toast(get(res, 'message'));
      }
    } else {
      yield put(actionsReducerP2p.getDetailItemAdvertismentsSuccess({}));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchDetailsItemAdvertisment() {
  while (true) {
    const action = yield take(GET_DETIAL_ADVERTISMENT);
    yield* asyncDetailsItemAdvertisment(action);
  }
}
export function* asyncUpdateStatusAdv({payload}) {
  try {
    const res = yield call(
      P2pService.updateStatusAdv,
      get(payload, 'data'),
      get(payload, 'orderId'),
    );
    emitEventEmitter('doneApi', true);
    if (get(res, 'success')) {
      yield put(createAction(GET_MY_ADVERTISMENTS));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchUpdateStatusAdv() {
  while (true) {
    const action = yield take(UPDATE_STATUS_ADV);
    yield* asyncUpdateStatusAdv(action);
  }
}
export function* asyncGetChatHistory({payload}) {
  try {
    const res = yield call(
      P2pService.chatHistory,
      get(payload, 'data'),
      get(payload, 'orderId'),
    );
    console.log('reshi: ', get(payload, 'orderId'), res);
    emitEventEmitter('doneApi', true);
    emitEventEmitter('doneChatHistory', true);
    yield put(
      actionsReducerP2p.getChatHistorySuccess({
        ...res,
        isLoadmore: get(payload, 'isLoadmore'),
        skip: get(payload, 'data.skip'),
        pages: ceil(get(res, 'totalRecords') / get(payload, 'data.take')),
      }),
    );
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetChatHistory() {
  yield takeEvery(GET_CHAT_HISTORY, asyncGetChatHistory);
}
export function* asyncGetChatInfoP2p({payload}) {
  try {
    const res = yield call(P2pService.chatInfoP2p, payload);
    console.log('res chatInfoP2p: ', res);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success')) {
      yield put(actionsReducerP2p.getChatInfoP2pSuccess(get(res, 'data')));
      // yield put(actionsReducerP2p.getChatHistorySuccess({
      //   ...get(res,'data.p2PConversationMessagePaging'),
      //   skip:0,
      //   pages: ceil(get(res, 'data.p2PConversationMessagePaging.totalRecords') / 10),
      // }))
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetChatInfoP2p() {
  yield takeEvery(GET_CHAT_INFO_P2P, asyncGetChatInfoP2p);
}
export function* asyncSendMessage({payload}) {
  try {
    const res = yield call(
      P2pService.chatSendMessage,
      get(payload, 'formData'),
      get(payload, 'orderId'),
    );
    console.log('res: ', res);
    emitEventEmitter('doneApi', true);
    if (!get(res, 'status')) {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchSendMessage() {
  yield takeEvery(SEND_CHAT_MESSAGE, asyncSendMessage);
}
export function* asyncGetComplain({payload}) {
  try {
    const res = yield call(P2pService.getComplain, get(payload, 'orderId'));
    console.log(res, 'resGetComplain2');
    emitEventEmitter('doneApi', true);
    // yield put(actionsReducerP2p.getComplainSuccess(get(res, 'data')));
    if (get(res, 'success')) {
      if (!get(payload, 'isStop')) {
        emitEventEmitter('doneGetComplain', {
          type: get(payload, 'type'),
          data: get(res, 'data'),
        });
      }

      console.log(res, 'resGetComplain');
      yield put(actionsReducerP2p.getComplainSuccess(get(res, 'data')));
    } else {
      toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetComplain() {
  yield takeEvery(GET_COMPLAIN, asyncGetComplain);
}
export function* asyncGetComplainProcess({payload}) {
  try {
    const res = yield call(P2pService.getComplainProcess, payload);
    emitEventEmitter('doneApi', true);
    if (!get(res, 'success')) {
      toast(get(res, 'message'));
    } else {
      yield put(actionsReducerP2p.getComplainProcessSuccess(get(res, 'data')));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetComplainProcess() {
  yield takeEvery(GET_COMPLAIN_PROCESS, asyncGetComplainProcess);
}
export function* asyncCancelComplain({payload}) {
  try {
    const res = yield call(P2pService.getCancelComplain, payload);
    console.log('res cancel: ', res);
    emitEventEmitter('doneApi', true);
    if (!get(res, 'success')) {
      toast(get(res, 'message'));
    } else {
      emitEventEmitter('cancelSuccess', true);
      // toast(get(res, 'message'));
      // yield put(actionsReducerP2p.cancelComplainSuccess(get(res, 'data')));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchCancelComplain() {
  yield takeEvery(CANCEL_COMPLAIN, asyncCancelComplain);
}
export function* asyncCreateComplain({payload}) {
  try {
    const res = yield call(P2pService.createlComplain, payload);
    console.log('res Complain: ', res);
    emitEventEmitter('doneApi', true);
    if (get(res, 'success')) {
      emitEventEmitter('createSuccess', true);
      yield put(createAction(GET_COMPLAIN, get(res, 'data.orderId')));
    } else {
      toast(get(res, 'message'));
      // toast(get(res, 'message'));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchCreateComplain() {
  yield takeEvery(CREATE_COMPLAIN, asyncCreateComplain);
}

export function* asyncCreateCommentRating({payload}) {
  try {
    const res = yield call(P2pService.createRatingComment, {
      accountId: get(payload, 'accountId'),
      content: get(payload, 'content'),
      ratingStar: get(payload, 'ratingStar'),
    });
    emitEventEmitter('doneApi', true);
    console.log('res kaka: ', res);
    if (get(res, 'success')) {
      toast(get(res, 'message'));
      emitEventEmitter('successCreateCommentRating', true);
    } else {
      toast('Đã xảy ra lỗi xin vui lòng thử lại sau!');
    }
    emitEventEmitter('doneApi', true);
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}

export function* watchCreateCommentRating() {
  yield takeEvery(CREATE_RATING_COMMENT, asyncCreateCommentRating);
}
export function* asyncGetCommentsByUser({payload}) {
  try {
    const res = yield call(P2pService.getCommentByUser, payload);
    emitEventEmitter('doneApi', true);

    if (res) {
      // gọi lại danh sách rating ở đây nếu cần
      yield put(createAction(GET_COMMENTS_BY_USER_SUCCESS, get(res, 'source')));
    }
    emitEventEmitter('doneApi', true);
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}

export function* watchGetCommentsByUser() {
  yield takeEvery(GET_COMMENTS_BY_USER, asyncGetCommentsByUser);
}

export function* asyncGetAdvInfo({payload}) {
  try {
    const res = yield call(P2pService.getAdvInfo,payload);
    emitEventEmitter('doneApi', true);

    if (res) {
      // gọi lại danh sách rating ở đây nếu cần
      yield put(createAction(GET_ADV_INFO_SUCCESS, res));
    }
    emitEventEmitter('doneApi', true);
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}

export function* watchGetAdvInfo() {
  yield takeEvery(GET_ADV_INFO, asyncGetAdvInfo);
}
export function* asyncGetFeeTax({payload}) {
  try {
    const res = yield call(P2pService.getFeeTax, {
      quantity: get(payload, 'quantity'),
      price: get(payload, 'price'),
    });
    emitEventEmitter('doneApi', true);
    if (get(res, 'success')) {
      // gọi lại danh sách rating ở đây nếu cần
      yield put(createAction(GET_FEE_TAX_SUCCESS, get(res, 'data')));
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}

export function* watchGetFeeTax() {
  yield takeLatest(GET_FEE_TAX, asyncGetFeeTax);
}
export function* asyncGetAllCustomerType({payload}) {
  try {
    const res = yield call(P2pService.getAllCustomerType);
    emitEventEmitter('doneApi', true);
    yield put(actionsReducerP2p.getAllCustomerTypeSuccess(res));
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchGetAllCustomerType() {
  yield takeLatest(GET_ALL_CUSTOMER_TYPE, asyncGetAllCustomerType);
}
export function* asyncCreateCustomerType({payload}) {
  try {
    const res = yield call(P2pService.createCustomerType, payload);
    if (get(res, 'success')) {
      emitEventEmitter('doneApi', true);
      return toast('Bạn đã gửi lên thành công, vui lòng chờ xác thực');
    }
  } catch (e) {
    emitEventEmitter('doneApi', true);
  }
}
export function* watchCreateCustomerType() {
  yield takeLatest(CREATE_CUSTOMER_TYPE, asyncCreateCustomerType);
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
  yield all([fork(watchGetHistoryOrder)]);
  yield all([fork(watchCreateAdvertisment)]);
  yield all([fork(watchUpdateAdvertisment)]);
  yield all([fork(watchDeleteAdvertisment)]);
  yield all([fork(watchUpdateStatusAdv)]);
  yield all([fork(watchGetChatHistory)]);
  yield all([fork(watchGetChatInfoP2p)]);
  yield all([fork(watchSendMessage)]);
  yield all([fork(watchGetComplain)]);
  yield all([fork(watchGetComplainProcess)]);
  yield all([fork(watchCancelComplain)]);
  yield all([fork(watchCreateComplain)]);
  yield all([fork(watchCreateCommentRating)]);
  yield all([fork(watchGetCommentsByUser)]);
  yield all([fork(watchGetAdvInfo)]);
  yield all([fork(watchGetFeeTax)]);
  yield all([fork(watchGetAllCustomerType)]);
  yield all([fork(watchCreateCustomerType)]);
}
