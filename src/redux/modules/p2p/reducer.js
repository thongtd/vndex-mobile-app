// @flow

import { GET_ADVERTISMENTS_SUCCESS, GET_ADVERTISMENT_SUCCESS, GET_TRADING_SUCCESS } from './actions';
import { get, set } from '../../../configs/utils';
import i18n from "react-native-i18n"
export const DEFAULT = {
  advertisments: [],
  tradingMarket:{},
  advertisment:{}
};

export default p2p = (state = DEFAULT, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ADVERTISMENTS_SUCCESS:
      return {
        ...state,
        advertisments: payload,
      };
      case GET_ADVERTISMENT_SUCCESS:
      return {
        ...state,
        advertisment: payload,
      };
      case GET_TRADING_SUCCESS:
      return {
        ...state,
        tradingMarket: payload,
      };
    default:
      return state;
  }
}
