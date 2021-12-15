// @flow

import { GET_COUNTRIES, GET_COUNTRIES_SUCCSESS, EMAIL_EXIST, EMAIL_NOT_EXIST, LOGIN_SUCCSESS, SET_TOKEN, CHECK_STATE_LOGIN, LANGUAGES, CHECK_PASSCODE, SET_USER_INFO, SET_FA_CODE } from './actions';
import { get, set } from '../../../configs/utils';
import i18n from "react-native-i18n"
export const DEFAULT = {
  countries: [],
  logged: false,
  lang: i18n.currentLocale(),
  isPasscode: false,
  passPasscode: false,
  userInfo: ""
};

export default authentication = (state = DEFAULT, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case GET_COUNTRIES_SUCCSESS:
      return {
        ...state,
        countries: payload,
      };
    case CHECK_STATE_LOGIN:
      return {
        ...state,
        logged: payload,
      };
    case LANGUAGES:
      return {
        ...state,
        lang: payload,
      };
    case CHECK_PASSCODE:
      return {
        ...state,
        isPasscode: payload.is
      };
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: payload
      }
      case SET_FA_CODE:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          twoFactorService:payload.twoFactorService,
          twoFactorEnabled:payload.twoFactorEnabled
        }
      }
      
    default:
      return state;
  }
}
