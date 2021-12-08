// @flow

import { GET_MARKET_WATCH_SUCCESS, GET_CONVERSION_SUCCESS, GET_CURRENCY_LIST_SUCCESS, GET_SWAP_SUCCESS, GET_FIAT_WALLET_SUCCESS, GET_CRYPTO_WALLET_SUCCESS, GET_SWAP_ORDERS_BOOK_SUCCESS } from './actions';
import _,{orderBy,uniqBy} from "lodash"
export const DEFAULT = {
  marketWatch: [],
  conversion: [],
  currencyList: [],
  swapConfig: null,
  fiatWallet: [],
  cryptoWallet: [],
  orderBook:[]
};

export default function marketReducer(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case GET_MARKET_WATCH_SUCCESS:
      return {
        ...state,
        marketWatch: [...payload],
      };
    case GET_CONVERSION_SUCCESS:
      return {
        ...state,
        conversion: payload,
      };
    case GET_CURRENCY_LIST_SUCCESS:
      return {
        ...state,
        currencyList: payload,
      };

    case GET_SWAP_SUCCESS:
      return {
        ...state,
        swapConfig: payload,
      };
    case GET_FIAT_WALLET_SUCCESS:
      return {
        ...state,
        fiatWallet: payload,
      };
    case GET_CRYPTO_WALLET_SUCCESS:
      return {
        ...state,
        cryptoWallet: payload,
      };
    case GET_SWAP_ORDERS_BOOK_SUCCESS:
      if(payload.pageIndex === 1){
        return {
          ...state,
          orderBook:payload.data
        }
      }else{
        return {
          ...state,
          orderBook:orderBy(uniqBy([...state.orderBook,...payload.data], 'orderId'), ['createdDate'], ['desc'])
        }
      }
      
    default:
      return state;
  }
}
