// @flow

import {
  useDispatch,
} from 'react-redux';
import { createAction } from '../../../configs/utils';
const CONTEXT = '@MARKET';
// declare var
export const GET_MARKET_WATCH = `${CONTEXT}/GET_MARKET_WATCH`;
export const GET_CURRENCY_LIST = `${CONTEXT}/GET_CURRENCY_LIST`;
export const GET_CONVERSION = `${CONTEXT}/GET_CONVERSION`;
export const GET_MARKET_WATCH_SUCCESS = `${CONTEXT}/GET_MARKET_WATCH_SUCCESS`;
export const GET_CURRENCY_LIST_SUCCESS = `${CONTEXT}/GET_CURRENCY_LIST_SUCCESS`;
export const GET_CONVERSION_SUCCESS = `${CONTEXT}/GET_CONVERSION_SUCCESS`;
export const GET_SWAP = `${CONTEXT}/GET_SWAP`;
export const GET_SWAP_SUCCESS = `${CONTEXT}/GET_SWAP_SUCCESS`;
export const GET_FIAT_WALLET = `${CONTEXT}/GET_FIAT_WALLET`;
export const GET_FIAT_WALLET_SUCCESS = `${CONTEXT}/GET_FIAT_WALLET_SUCCESS`;
export const GET_CRYPTO_WALLET = `${CONTEXT}/GET_CRYPTO_WALLET`;
export const GET_CRYPTO_WALLET_SUCCESS = `${CONTEXT}/GET_CRYPTO_WALLET_SUCCESS`;
export const GET_SWAP_ORDERS_BOOK = `${CONTEXT}/GET_SWAP_ORDERS_BOOK`;
export const GET_SWAP_ORDERS_BOOK_SUCCESS = `${CONTEXT}/GET_SWAP_ORDERS_BOOK_SUCCESS`;


//function hook useActions
export function useActionsMarket() {
  const dispatch = useDispatch();
  return {
    handleGetMarketWatch: () => dispatch(createAction(GET_MARKET_WATCH)),
    handleGetCurrencyList: () => dispatch(createAction(GET_CURRENCY_LIST)),
    handleGetConversion: () => dispatch(createAction(GET_CONVERSION)),
    handleGetConfigSwap: () => dispatch(createAction(GET_SWAP)),
    handleGetFiatWallet: (userId) => {
      if (userId) {
        dispatch(createAction(GET_FIAT_WALLET, userId))
      }
    },
    handleGetCryptoWallet: (userId) => {
      if (userId) {
        dispatch(createAction(GET_CRYPTO_WALLET, userId))
      }
    },
  }
};
// function checkLogin(dispatch,data){
// //  return dispatch(createAction(CHECK_LOGIN,data))
// }

//function handle Reducer
export const actionsReducerMarket = {
  getMarketWatchSuccess: (marketWatch) => createAction(GET_MARKET_WATCH_SUCCESS, marketWatch),
  getCurrencyListSuccess: (currencyList) => createAction(GET_CURRENCY_LIST_SUCCESS, currencyList),
  getConversionSuccess: (conversions) => createAction(GET_CONVERSION_SUCCESS, conversions),
  getSwapSuccess: (configSwap) => createAction(GET_SWAP_SUCCESS, configSwap),
  getFiatWalletSuccess: (userId) => createAction(GET_FIAT_WALLET_SUCCESS, userId),
  getCryptoWalletSuccess: (userId) => createAction(GET_CRYPTO_WALLET_SUCCESS, userId),
  getSwapOrderBookSuccess:(ordersBook)=>createAction(GET_SWAP_ORDERS_BOOK_SUCCESS,ordersBook)
}