// @flow

import {GET_MY_ADVERTISMENT_SUCCESS, GET_ADVERTISMENTS_SUCCESS, GET_ADVERTISMENT_SUCCESS, GET_EXCHANGE_PAYMENT_METHOD_SUCCESS, GET_OFFER_ORDER_SUCCESS, GET_PAYMENT_METHOD_BY_ACC_SUCCESS, GET_TRADING_SUCCESS, GET_MARKET_INFO_SUCCESS } from './actions';
import { get, set } from '../../../configs/utils';
import i18n from "react-native-i18n"
export const DEFAULT = {
  advertisments: [],
  myAdvertisments: {
    source:[]
  },
  tradingMarket:{},
  advertisment:{
  },
  paymentMethods:[],
  exchangePaymentMethod:[],
  offerOrder:{},
  offerOrderId:"",
  marketInfo:{}
};

export default p2p = (state = DEFAULT, action = {}) => {
  const {type, payload} = action;
  switch (type) {
    case GET_ADVERTISMENTS_SUCCESS:
      return {
        ...state,
        advertisments: payload,
      };
      case GET_MARKET_INFO_SUCCESS:
      return {
        ...state,
        marketInfo: payload,
      };
    case GET_MY_ADVERTISMENT_SUCCESS:
      if (get(payload, 'pageIndex') == 1) {
        state.myAdvertisments.source = [];
        // return {
        //   ...state,
        //   myAdvertisments: {
        //     ...state.myAdvertisments,
        //     source:[]
        //   },
        // };
      };

      // const myAdvertisments = [
      //   ...(state.myAdvertisments.source || []),
      //   ...payload,
      // ];
      // let data = state.myAdvertisments.source || [];
      // console.log(data,"dataaaa");
      // data.push(get(payload,"source"));
      return {
        ...state,
        myAdvertisments: {
          ...state.myAdvertisments,
          ...payload,
          source: [...state.myAdvertisments.source,...get(payload,"source")]
        },
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
