// @flow

import {GET_MY_ADVERTISMENT_SUCCESS, GET_ADVERTISMENTS_SUCCESS, GET_ADVERTISMENT_SUCCESS, GET_EXCHANGE_PAYMENT_METHOD_SUCCESS, GET_OFFER_ORDER_SUCCESS, GET_PAYMENT_METHOD_BY_ACC_SUCCESS, GET_TRADING_SUCCESS } from './actions';
import { get, set } from '../../../configs/utils';
import i18n from "react-native-i18n"
export const DEFAULT = {
  advertisments: [],
  myAdvertisments: {},
  tradingMarket:{},
  advertisment:{},
  paymentMethods:[],
  exchangePaymentMethod:[],
  offerOrder:{},
  offerOrderId:""
};

export default p2p = (state = DEFAULT, action = {}) => {
  const {type, payload} = action;
  switch (type) {
    case GET_ADVERTISMENTS_SUCCESS:
      return {
        ...state,
        advertisments: payload,
      };
    case GET_MY_ADVERTISMENT_SUCCESS:
      if (get(payload, 'pageIndex') == 1) state.myAdvertisments.source = [];

      const myAdvertisments = {
        source: [
          ...(state.myAdvertisments.source || []),
          ...get(payload, 'source'),
        ],
        pages: get(payload, 'pages') || 0,
        totalRecords: get(payload, 'totalRecords') || 0,
      };
      return {
        ...state,
        myAdvertisments: {...myAdvertisments},
      };
      case GET_OFFER_ORDER_SUCCESS:
      return {
        ...state,
        offerOrder: payload,
      };
      case 'GET_OFFER_ORDER_ID_SUCCESS':
      return {
        ...state,
        offerOrderId: payload,
      };
      case GET_ADVERTISMENT_SUCCESS:
      return {
        ...state,
        advertisment: payload,
      };
    case GET_TRADING_SUCCESS:
      return {
        ...state,
        tradingMarket: {...payload},
      };
    case GET_EXCHANGE_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        exchangePaymentMethod: payload,
      };
    case GET_PAYMENT_METHOD_BY_ACC_SUCCESS:
      return {
        ...state,
        paymentMethods: payload,
      };
    default:
      return state;
  }
};
