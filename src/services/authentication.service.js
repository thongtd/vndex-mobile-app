import {httpService} from './http.service';
import {EXCHANGE_API} from '../configs/api';
import {size} from 'lodash';
import {storageService} from './storage.service';
import {constant} from '../configs/constant';
import {get} from '../configs/utils';
import axios from 'axios';

export const authService = {
  getUserInfo: async identityUserId => {
    let response = await httpService.post(EXCHANGE_API.GET_USER_INFO, {
      identityUserId,
    });
    console.log('response: ', response);
    if (response.status == 200) {
      return response.data;
    }
  },
  getLastLogin: async email => {
    return await httpService.post(EXCHANGE_API.LAST_LOGIN + email, {
      email: email,
    });
  },
  resendConfirmEmail: async email => {
    let response = await httpService.post_without_token(
      EXCHANGE_API.RESEND_CONFIRM_EMAIL,
      {email, callback: 'string'},
    );

    return get(response, 'status');
  },
  getUserReferrals: async (email, user_id, page_index, page_side) => {
    return await httpService.post(
      EXCHANGE_API.GET_USER_REFERRALS + `${user_id}/${page_index}/${page_side}`,
      {
        email,
        user_id,
        page_index,
        page_side,
      },
    );
  },
  getUserCommission: async (email, user_id, page_index, page_side) => {
    return await httpService.post(
      EXCHANGE_API.GET_USER_COMMISSION +
        `${user_id}/${page_index}/${page_side}`,
      {
        email,
        user_id,
        page_index,
        page_side,
      },
    );
  },
  getUserCommissionSummary: async user_id => {
    return await httpService.post(
      EXCHANGE_API.GET_USER_COMMISSION_SUMMARY + user_id,
      {user_id},
    );
  },
  updateUserInfo: async data => {
    //
    //
    let response = await httpService.post(EXCHANGE_API.UPDATE_USER_INFO, data);

    if (response.status === 200) {
      return response.data;
    }
  },
  getAssetSummary: async accId => {
    let response = await httpService.post(
      EXCHANGE_API.GET_ASSET_SUMMARY + accId,
    );
    if (response.status === 200) {
      return response.data;
    }
  },
  setupGoogleAuth: async data => {
    let response = await httpService.post(EXCHANGE_API.SETUP_GOOGLE_AUTH, data);
    if (response.status === 200) {
      return response.data;
    }
  },
  getQrCode: async email => {
    let response = await httpService.post(EXCHANGE_API.GET_QR_CODE_IMAGE_URL, {
      email,
    });

    if (response.status === 200) {
      return response.data;
    }
  },
  getTwoFactorEmailCode: async email => {
    return await httpService.post(
      EXCHANGE_API.SEND_2FA_CODE_VIA_EMAIL + email,
      {email},
    );
  },
  enableEmail: async (password, email) => {
    return await httpService.post(EXCHANGE_API.ENABLE_2FA_EMAIL, {
      password,
      email,
    });
  },
  disableEmail: async (password, email, verifyCode, sessionId) => {
    return await httpService.post(EXCHANGE_API.DISABLE_2FA_EMAIL, {
      password,
      email,
      verifyCode,
      sessionId,
    });
  },
  disableGGAuth: async (email, password, verifyCode) => {
    return await httpService.post(EXCHANGE_API.DISABLE_GG_AUTH, {
      email,
      password,
      verifyCode,
    });
  },
  keepLogin: async userId => {
    let response = await httpService.post(EXCHANGE_API.KEEP_LOGIN + userId);
    if (response.status === 200) {
      if (
        get(response, 'data.status') &&
        get(response, 'data.customerCacheModel')
      ) {
        return get(response, 'data.customerCacheModel');
      } else {
        return null;
      }
    }
  },
  changePassword: async data => {
    let response = await httpService.post(EXCHANGE_API.CHANGE_PASSWORD, data);

    if (response.data.code == 0) {
      return {
        status: 'err',
        message: response.data.message,
      };
    } else {
      return {
        status: 'ok',
        message: response.data.message,
      };
    }
  },
  validateEmailCode: async (verifyCode, email, sessionId, ipAddress) => {
    try {
      let data = await httpService.post_without_token(
        EXCHANGE_API.VALIDATE_2FA_EMAIL_CODE,
        {
          verifyCode,
          email,
          sessionId,
          ipAddress,
        },
      );
      return {
        result: 'ok',
        data,
      };
    } catch (error) {
      return {
        result: 'err',
        message: 'Please check your internet connection!',
      };
    }
  },
  getTwoFactorEmailCode: async email => {
    return await httpService.post(
      EXCHANGE_API.SEND_2FA_CODE_VIA_EMAIL + email,
      {email},
    );
  },
  saveToken: async userinfo => {
    let setSuccess = await storageService.setItem(
      constant.STORAGEKEY.AUTH_TOKEN,
      userinfo.token,
    );
    return setSuccess;
  },
  getToken: async () => {
    let getSuccess = await storageService.getItem(
      constant.STORAGEKEY.AUTH_TOKEN,
    );
    return getSuccess;
  },
  removeToken: async () => {
    let removeSuccess = await storageService.removeItem(
      constant.STORAGEKEY.AUTH_TOKEN,
    );
    return removeSuccess;
  },
  login: async (username, password, ipAddress) => {
    try {
      let login_data = {
        email: username,
        password: password,
        ipAddress,
      };
      let data = await httpService.post_without_token(
        EXCHANGE_API.LOGIN,
        login_data,
      );
      console.log('data: ', data);
      return {
        result: 'ok',
        data,
      };
    } catch (error) {
      return {
        result: 'err',
        message: 'Please check your internet connection!',
      };
    }
  },
  getCountry: async () => {
    try {
      let data = await httpService.post_without_token(
        EXCHANGE_API.GET_COUNTRIES,
      );

      if (size(data) > 0) {
        return {
          result: 'ok',
          data,
        };
      } else {
        return {
          result: 'ok',
          data: [],
        };
      }
    } catch (error) {
      return {
        result: 'err',
        message: 'Please check your internet connection!',
      };
    }
  },
  checkRegister: async email => {
    let emailInput = {email};

    try {
      let data = await httpService.post_without_token(
        EXCHANGE_API.CHECK_REGISTER,
        emailInput,
      );

      return {
        result: 'ok',
        data,
      };
    } catch (error) {
      return {
        result: 'err',
        message: 'Please check your internet connection!',
      };
    }
  },
  register: async registerModel => {
    return new Promise((resolve, reject) => {
      httpService
        .post_without_token(EXCHANGE_API.REGISTER, registerModel)
        .then(res => {
          if (res.status) {
            let result = {
              data: null,
              status: 'OK',
              message: 'User register successfully',
            };
            resolve(result);
          } else {
            let result = {
              data: null,
              status: 'ERROR',
              message: res.message,
            };
            resolve(result);
          }
        })
        .catch(err => {
          let result = {
            data: err,
            status: 'ERROR',
            message: 'UNKNOWN_ERROR',
          };
          reject(result);
        });
    });
  },
  resetPassword: async email => {
    try {
      let response = await httpService.post_without_token(
        EXCHANGE_API.RESET_PASSWORD,
        {
          email,
          callback: '',
          via: 2,
        },
      );

      return response;
    } catch (error) {}
  },
  confirmResetPassword: async data => {
    try {
      let response = await httpService.post_without_token(
        EXCHANGE_API.RESET_PASSWORD_BY_OTP,
        data,
      );
      return response;
    } catch (error) {}
  },
  checkIsLogin: async userId => {
    try {
      let token = await storageService.getItem('auth_token');
      let headers = new Headers({
        Authorization: 'Bearer ' + get(token,"authToken"),
        'Content-Type': 'application/json',
      });
      console.log(token, 'token check');
      if (get(token, 'authToken')) {
        
        let url = `${EXCHANGE_API.KEEP_LOGIN}${userId}`;
        console.log('url check: ', url);
        // console.log(url, data, 'url,data autoken');
        return axios.post(url, null, {
          headers: headers.map,
        });
      }
      return null;
    } catch (error) {
      console.log('error check: ', error);
      
    }
   
  },
};
