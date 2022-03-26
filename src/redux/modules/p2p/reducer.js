// @flow

import {
  GET_MY_ADVERTISMENT_SUCCESS,
  GET_ADVERTISMENTS_SUCCESS,
  GET_ADVERTISMENT_SUCCESS,
  GET_EXCHANGE_PAYMENT_METHOD_SUCCESS,
  GET_OFFER_ORDER_SUCCESS,
  GET_PAYMENT_METHOD_BY_ACC_SUCCESS,
  GET_TRADING_SUCCESS,
  GET_MARKET_INFO_SUCCESS,
  GET_HISTORY_ORDER_SUCCESS,
  GET_DETIAL_ADVERTISMENT_SUCCESS,
  GET_CHAT_INFO_P2P_SUCCESS,
  GET_CHAT_HISTORY_SUCCESS,
  GET_COMPLAIN_SUCCESS,
  GET_COMPLAIN_PROCESS_SUCCESS,
  GET_ADV_INFO_SUCCESS,
  GET_COMMENTS_BY_USER,
  GET_COMMENTS_BY_USER_SUCCESS,
  GET_FEE_TAX_SUCCESS,
  GET_ALL_CUSTOMER_TYPE_SUCCESS,
  GET_DETAIL_CUSTOMER_TYPE_SUCCESS,
  GET_COMPLAIN_REASON_SUCCESS
} from './actions';
import {get, set} from '../../../configs/utils';
import i18n from 'react-native-i18n';
import _ from 'lodash';
export const DEFAULT = {
  advertisments: {},
  myAdvertisments: {
    source: [],
  },
  tradingMarket: {},
  advertisment: {},
  paymentMethods: [],
  exchangePaymentMethod: [],
  offerOrder: {},
  offerOrderId: '',
  marketInfo: {},
  historyOrders: {
    source: [],
  },
  advertismentDetails: {},
  chatInfoP2p: {},
  chatHistory: {},
  complainInfo: {},
  complainProcess: {},
  advInfo: {},
  commentsByUser: [],
  feeTax: {},
  allCustomerType: [],
  detailCustomertype: {},
};

export default p2p = (state = DEFAULT, action = {}) => {
  const {type, payload} = action;
  switch (type) {
    case GET_ADVERTISMENTS_SUCCESS:
      if (get(payload, 'pageIndex') == 1) {
        set(state, 'advertisments.source', []);
      }
      return {
        ...state,
        advertisments: {
          ...state.advertisments,
          ...payload,
          source: [
            ...get(state.advertisments, 'source'),
            ...get(payload, 'source'),
          ],
        },
      };
    case GET_MARKET_INFO_SUCCESS:
      return {
        ...state,
        marketInfo: {
          ...payload,
          lastestPrice:
            get(state.advertismentDetails, 'price') ||
            get(payload, 'lastestPrice'),
        },
      };

    case GET_MY_ADVERTISMENT_SUCCESS:
      if (get(payload, 'pageIndex') == 1) {
        set(state, 'myAdvertisments.source', []);
      }
      return {
        ...state,
        myAdvertisments: {
          ...state.myAdvertisments,
          ...payload,
          source: [
            ...get(state.myAdvertisments, 'source'),
            ...get(payload, 'source'),
          ],
        },
      };
    case GET_HISTORY_ORDER_SUCCESS:
      if (get(payload, 'pageIndex') == 1) {
        set(state, 'historyOrders.source', []);
      }
      return {
        ...state,
        historyOrders: {
          ...state.historyOrders,
          ...payload,
          source: [
            ...get(state.historyOrders, 'source'),
            ...get(payload, 'source'),
          ],
        },
      };
    case GET_FEE_TAX_SUCCESS:
      return {
        ...state,
        feeTax: payload,
      };
    case GET_DETAIL_CUSTOMER_TYPE_SUCCESS:
      return {
        ...state,
        detailCustomertype: payload,
      };
    case GET_ALL_CUSTOMER_TYPE_SUCCESS:
      return {
        ...state,
        allCustomerType: payload,
      };
    case GET_OFFER_ORDER_SUCCESS:
      return {
        ...state,
        offerOrder: payload,
      };
    case GET_COMPLAIN_REASON_SUCCESS:
      return {
        ...state,
        complainReason: payload,
      };
    case GET_COMPLAIN_SUCCESS:
      return {
        ...state,
        complainInfo: payload,
      };
    case GET_COMPLAIN_PROCESS_SUCCESS:
      return {
        ...state,
        complainProcess: payload,
      };
    case GET_CHAT_INFO_P2P_SUCCESS:
      return {
        ...state,
        chatInfoP2p: payload,
      };
    case GET_CHAT_HISTORY_SUCCESS:
      if (get(payload, 'skip') == 0 && !get(payload, 'isLoadmore')) {
        set(state, 'chatHistory.source', []);
      }
      if (get(payload, 'isLoadmore')) {
        return {
          ...state,
          chatHistory: {
            ...state.chatHistory,
            source: _.uniqBy(
              [...get(payload, 'source'), ...get(state.chatHistory, 'source')],
              'id',
            ),
          },
        };
      }
      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          ...payload,
          source: [
            ...get(state.chatHistory, 'source'),
            ...get(payload, 'source'),
          ],
        },
      };
    case 'GET_OFFER_ORDER_ID_SUCCESS':
      return {
        ...state,
        offerOrderId: payload,
      };
    case GET_ADV_INFO_SUCCESS:
      return {
        ...state,
        advInfo: payload,
      };
    case GET_COMMENTS_BY_USER_SUCCESS:
      return {
        ...state,
        commentsByUser: payload,
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
    case GET_DETIAL_ADVERTISMENT_SUCCESS:
      return {
        ...state,
        advertismentDetails: {...payload},
      };
    default:
      return state;
  }
};
