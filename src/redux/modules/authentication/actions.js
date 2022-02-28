// @flow

import {useDispatch} from 'react-redux';
import {createAction} from '../../../configs/utils';
const CONTEXT = '@AUTH';
// declare var
export const GET_COUNTRIES = `${CONTEXT}/GET_COUNTRIES`;
export const GET_USERS_KYC = `${CONTEXT}/GET_USERS_KYC`;
export const GET_USERS_KYC_SUCCESS = `${CONTEXT}/GET_USERS_KYC_SUCCESS`;
export const GET_COUNTRIES_SUCCSESS = `${CONTEXT}/GET_COUNTRIES_SUCCSESS`;
export const CHECK_LOGIN = `${CONTEXT}/CHECK_LOGIN`;
export const CONFIRM_2FA_CODE = `${CONTEXT}/CONFIRM_2FA_CODE`;
export const RESEND_2FA_CODE = `${CONTEXT}/RESEND_2FA_CODE`;
export const CHECK_STATE_LOGIN = `${CONTEXT}/CHECK_STATE_LOGIN`;
export const LANGUAGES = `${CONTEXT}/LANGUAGES`;
export const CHECK_PASSCODE = `${CONTEXT}/CHECK_PASSCODE`;
export const SET_USER_INFO = `${CONTEXT}/SET_USER_INFO`;
export const SET_FA_CODE = `${CONTEXT}/SET_FA_CODE`;
export const CHECK_IS_LOGIN = `${CONTEXT}/CHECK_IS_LOGIN`;

//function hook useActions
export function useActionsAuthen(dispatch) {
  if (!dispatch) {
    dispatch = useDispatch();
  }
  return {
    handleGetCountries: () => dispatch(createAction(GET_COUNTRIES)),
    handleGetUserKyc: userId => {
      if (userId) {
        dispatch(createAction(GET_USERS_KYC, userId));
      }
    },
    handleCheckLogin: data => checkLogin(dispatch, data),
  };
}
function checkLogin(dispatch, data) {
  return dispatch(createAction(CHECK_LOGIN, data));
}

//function handle Reducer
export const actionsReducerAuthen = {
  getCountriesSuccess: countries =>
    createAction(GET_COUNTRIES_SUCCSESS, countries),
  getUsersKycSuccess: userKyc => createAction(GET_USERS_KYC_SUCCESS, userKyc),
  confirm2FaCode: info => createAction(CONFIRM_2FA_CODE, info),
  checkStateLogin: logged => createAction(CHECK_STATE_LOGIN, logged),
  setUserInfo: user => createAction(SET_USER_INFO, user),
};
