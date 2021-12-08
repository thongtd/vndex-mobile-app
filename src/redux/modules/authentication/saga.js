// @flow

import {
  take, put, call, fork, all, takeEvery
} from 'redux-saga/effects';
import { GET_COUNTRIES, actionsReducerAuthen, CHECK_EMAIL, CHECK_LOGIN, CONFIRM_2FA_CODE, LOGIN_SUCCESS } from './actions';
import { authService } from '../../../services/authentication.service';
import { toast, get, formatMessageByArray, emitEventEmitter, setTokenAndUserInfo } from '../../../configs/utils';
import { pushSingleScreenApp, WALLET_SCREEN, CONFIRM_LOGIN_SCREEN, ALERT_ACCOUNT_ACTIVE } from '../../../navigation';
import { IdNavigation, constant } from '../../../configs/constant';
import { showModal, pushTabBasedApp } from '../../../navigation/Navigation';

import { marketService } from '../../../services/market.service';
export function* asyncGetCountries() {
  try {
    const res = yield call(authService.getCountry);
    if (get(res, "result") === 'ok') {
      yield put(
        actionsReducerAuthen.getCountriesSuccess(get(res, "data"))
      );
    }
  } catch (e) {
    console.log(e);
  }
}

export function* asyncCheckLogin({ payload }) {
  try {

    if(get(payload,"isResend")){
      const res = yield call(authService.login,
        get(payload, "email"),
        get(payload, "password"),
        get(payload, "ipAddress")
      );
      emitEventEmitter(constant.EVENTS_DEVICE.onAPI,get(res,'data'))
      return;
    }
    const res = yield call(authService.login,
      get(payload, "email"),
      get(payload, "password"),
      get(payload, "ipAddress")
    );
    if (get(res, "result") === 'ok') {
     emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
      if (get(res, "data.succeeded") === false) {
        if (get(res, "data.requiresTwoFactor")) {
          let twoFa = {
            email:get(payload, "email"),
            ipAddress:get(payload, "ipAddress"),
            sessionId:get(res,'data.sessionId'),
            password:get(payload, "password"),
            twoFactorType:get(res,"data.twoFactorType")
          }
          pushSingleScreenApp(payload.componentId,CONFIRM_LOGIN_SCREEN,twoFa)
        } else if (get(res, "data.isNotAllowed")) {
          showModal(ALERT_ACCOUNT_ACTIVE, {
            email: get(payload, "email")
          },true);
        } else if (get(res, "data.message")) {
          toast(formatMessageByArray("wrong password {0} {1}".t(), get(res, "data.messageArray")))
        }
      } else if (get(res, "data.status") === false) {
        if (!get(res, "data.status") && get(res, "data.messageArray")) {
          toast(formatMessageByArray("Your account has been locked {0}".t(), get(res, "data.messageArray")))
        } else {
          toast(get(res, "data.message").t())
        }
      } else if (get(res, "data.succeeded") === true) {
        setTokenAndUserInfo(res);
        yield put(actionsReducerAuthen.setUserInfo(get(res, "data.identityUser")))
        pushTabBasedApp();
        yield put(actionsReducerAuthen.checkStateLogin(true))
      }
    }else{
      emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
    }

  } catch (e) {
    emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
    console.log(e);
  }
}

export function* asyncConfirm2fa({payload}){
  try {
    const res = yield call(authService.validateEmailCode,
      get(payload, "otp"),
      get(payload, "email"),
      get(payload, "sessionId"),
      get(payload, "ipAddress")
    );
    if (get(res, "result") === "ok" && get(res, "data.succeeded") === true) {
      emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
      setTokenAndUserInfo(res);
      pushTabBasedApp();
      yield put(actionsReducerAuthen.setUserInfo(get(res, "data.identityUser")))
      yield put(actionsReducerAuthen.checkStateLogin(true))
    }else{
      emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
      toast("2FA code invalid".t());
      return false
    }
  } catch (error) {
    emitEventEmitter(constant.EVENTS_DEVICE.onAPI,true)
  }
} 

export function* watchGetCountries() {
  while (true) {
    const action = yield take(GET_COUNTRIES);
    yield* asyncGetCountries(action);
  }
}

export function* watchAuthorize() {
  while (true) {
    const action = yield take(CHECK_LOGIN);
    yield* asyncCheckLogin(action);
  }
}
export function* watchConfirm2fa() {
  while (true) {
    const action = yield take(CONFIRM_2FA_CODE);
    yield* asyncConfirm2fa(action);
  }
}


export default function* () {
  yield all([
    fork(watchGetCountries), 
    fork(watchAuthorize),
    fork(watchConfirm2fa),
   
  ]);
}
