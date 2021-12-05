import { httpService } from './http.service'
import { storageService } from './storage.service'
import { EXCHANGE_API, MARKET_API } from '../config/API'
import { constant } from "../config/constants";
import { jwtDecode } from "../config/utilities";

export const authService = {
    login: async (username, password, ipAddress, city, userLocationRaw) => {
        let login_data = {
            "email": username,
            "password": password,
            ipAddress,
            city,
            userLocationRaw
        }
        console.log(login_data,"login_data");
        return await httpService.post_without_token(EXCHANGE_API.LOGIN, login_data);
    },
    register: async (registerModel) => {
        return new Promise((resolve, reject) => {
            httpService.post_without_token(EXCHANGE_API.REGISTER, registerModel).then(res => {
                if (res.status) {
                    let result = {
                        data: null,
                        status: "OK",
                        message: "User register successfully"
                    }
                    resolve(result);
                } else {
                    let result = {
                        data: null,
                        status: "ERROR",
                        message: res.message
                    }
                    resolve(result);
                }

            })
                .catch((err) => {
                    let result = {
                        data: err,
                        status: "ERROR",
                        message: "UNKNOWN_ERROR"
                    }
                    reject(result);
                })
        })

    },
    checkRegister: async (email) => {
        // console.log(email,"email aside service");
        let emailInput={email}
        return await httpService.post_without_token(EXCHANGE_API.CHECK_REGISTER, emailInput);
    },
    saveToken: async (userinfo) => {
        let setSuccess = await storageService.setItem(constant.STORAGEKEY.AUTH_TOKEN, userinfo.token)
        return setSuccess
    },
    getToken:async ()=>{
        let getSuccess = await storageService.getItem(constant.STORAGEKEY.AUTH_TOKEN);
        console.log(getSuccess,"getSuccess");
        var time = new Date().getTime();
        if(getSuccess && getSuccess.expireWithDate){
            if(time > getSuccess.expireWithDate || time === getSuccess.expireWithDate){
                await storageService.removeItem(constant.STORAGEKEY.AUTH_TOKEN);
                return false
            }else{
                return getSuccess
            }
        }
    },
    setToken:async (userinfo)=>{
        var convertToMili = userinfo.token.expiresIn *1000;
        var time = new Date().getTime();
        var expireWithDate =time + convertToMili;
        userinfo.token.expireWithDate = expireWithDate;
        let setSuccess = await storageService.setItem(constant.STORAGEKEY.AUTH_TOKEN, userinfo.token);
        return setSuccess
    },
    setUserInfo: async (userInfo) => {
        let setSuccess = await storageService.setItem(constant.STORAGEKEY.USER_INFO, userInfo.identityUser);
        return setSuccess;
    },
    checkLogged: async () => {
        let self = this;
        return new Promise((resolve, reject) => {
            jwtDecode().then(acc => {
                if (acc) {
                    let accId = acc.id;
                    httpService.post(EXCHANGE_API.KEEP_LOGIN + accId).then(value => {
                        if (value.status == 200) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }

                    })
                        .catch(() => {
                            resolve(false);
                        })
                }
                else {
                    resolve(false);
                }
            })
        });
    },
    getCountry: async () => {
        return await httpService.post_without_token(EXCHANGE_API.GET_COUNTRIES);
    },
    getMarketWatch: async () => {
        return await httpService.get_without_token(MARKET_API.GET_MARKET_WATCH);
    },
    getBanner: async (adv) => {
        return await httpService.post_without_token(EXCHANGE_API.GET_BANNER + `${adv}/1`)
    },
    getUserInfo: async (identityUserId) => {
        let response = await httpService.post(EXCHANGE_API.GET_USER_INFO, { identityUserId })
        if (response.status == 200) {
            return response.data;
        }
    },
    getLastLogin: async (email) => {
        return await httpService.post(EXCHANGE_API.LAST_LOGIN + email, { email: email })
    },
    getUserReferrals: async (email, user_id, page_index, page_side) => {
        return await httpService.post(EXCHANGE_API.GET_USER_REFERRALS + `${user_id}/${page_index}/${page_side}`, {
            email,
            user_id,
            page_index,
            page_side
        })
    },
    getUserCommission: async (email, user_id, page_index, page_side) => {
        return await httpService.post(EXCHANGE_API.GET_USER_COMMISSION + `${user_id}/${page_index}/${page_side}`, {
            email,
            user_id,
            page_index,
            page_side
        })
    },
    getUserCommissionSummary: async (user_id) => {
        return await httpService.post(EXCHANGE_API.GET_USER_COMMISSION_SUMMARY + user_id, { user_id })
    },
    getTwoFactorEmailCode: async (email) => {
        return await httpService.post(EXCHANGE_API.SEND_2FA_CODE_VIA_EMAIL + email, { email })
    },
    enableEmail: async (password, email) => {
        return await httpService.post(EXCHANGE_API.ENABLE_2FA_EMAIL, { password, email })
    },
    disableEmail: async (password, email, verifyCode, sessionId) => {
        return await httpService.post(EXCHANGE_API.DISABLE_2FA_EMAIL, { password, email, verifyCode, sessionId })
    },
    validateEmailCode: async (verifyCode, email, sessionId,ipAddress,city,userLocationRaw) => {
        console.log( verifyCode,
            email,
            sessionId,
            ipAddress,
            city,
            userLocationRaw,"full verifile");
        return await httpService.post_without_token(EXCHANGE_API.VALIDATE_2FA_EMAIL_CODE, {
            verifyCode,
            email,
            sessionId,
            ipAddress,
            city,
            userLocationRaw
        })
    },
    disableGGAuth: async (email, password, verifyCode) => {
        return await httpService.post(EXCHANGE_API.DISABLE_GG_AUTH, { email, password, verifyCode })
    },
    changePassword: async (data) => {
        let response = await httpService.post(EXCHANGE_API.CHANGE_PASSWORD, data)
        if (response.data.code == 0) {
            return {
                status: 'ERROR',
                message: response.data.message
            }
        } else {
            return {
                status: 'OK',
                message: response.data.message
            }
        }
    },
    //wallet
    getCrytoWallet: async (customerId) => {
        let response = await httpService.post(EXCHANGE_API.GET_CRYPTO_WALLET + `${customerId}`);
        if (response.status === 200) {
            return response.data;
        }
    },
    getFiatWallet: async (customerId) => {
        let response = await httpService.post(EXCHANGE_API.GET_FIAT_WALLET + `${customerId}`);
        if (response.status === 200) {
            return response.data;
        }
    },
    getWalletBalances: async (userId) => {
        let response = await httpService.post(EXCHANGE_API.GET_WALLET_BALANCES + userId, { userId });
        if (response.status === 200) {
            return response.data
        }
    },
    getWalletBalanceByCurrency: async (userId, currency) => {
        let response = await httpService.post(EXCHANGE_API.GET_WALLET_BALANCES_BY_CURRENCY + `${userId}/${currency}`, {
            userId,
            currency
        });
        if (response.status === 200) {
            return response.data
        }
        else {
        }
    },
    getAssetRequest: async (accId, id) => {
        let response = await httpService.post(EXCHANGE_API.GET_ASSET_REQUEST + `${accId}/${id}`);
        if (response.status === 200) {
            return response.data
        }
    },
    getDepositCoinLog: async (customerId, pageIndex, pageSize) => {
        let res = await httpService.post(EXCHANGE_API.GET_COIN_DEPOSIT_LOG + `${customerId}/${pageIndex}/${pageSize}`, {
            customerId,
            pageIndex,
            pageSize
        });
        if (res.status === 200) {
            return res.data
        }
    },
    getDepositFiatLog: async (accId, pageIndex, pageSize) => {
        let res = await httpService.post(EXCHANGE_API.GET_FIAT_DEPOSIT_LOGS + `${accId}/${pageIndex}/${pageSize}`, {
            accId,
            pageIndex,
            pageSize
        });
        if (res.status === 200) {
            return res.data
        }
    },
    getWithdrawCoinLog: async (customerId, pageIndex, pageSize) => {
        let res = await httpService.post(EXCHANGE_API.GET_COIN_WITHDRAW_LOG + `${customerId}/${pageIndex}/${pageSize}`, {
            customerId,
            pageIndex,
            pageSize
        });
        if (res.status === 200) {
            return res.data.source
        }
    },
    getWithdrawFiatLog: async (accId, pageIndex, pageSize) => {
        let res = await httpService.post(EXCHANGE_API.GET_FIAT_WITHDRAW_LOGS + `${accId}/${pageIndex}/${pageSize}`, {
            accId,
            pageIndex,
            pageSize
        });
        if (res.status === 200) {
            return res.data
        }
    },
    getDepositBankAccount: async (currencyCode, accId) => {
        let res = await httpService.post(EXCHANGE_API.GET_FIAT_WALLET_DEPOSIT_BANK + `${accId}`);
        console.log(currencyCode, accId,res,"dataBankAccount");
        if (res.status === 200 && res.data &&  res.data.length > 0) {
            // return res.data
            let data =[]
            res.data.map((item,index)=>{
                if(item.currency === currencyCode){
                    data.push(item);
                }
            })
            return data
        }
    },
    getBankByCurrencyCode: async (currencyCode) => {
        let response = await httpService.post(EXCHANGE_API.GET_BANK_BY_CURRENCY_CODE + `${currencyCode}`);
        if (response.status === 200) {
            return response.data
        }
    },
    getFiatDepositRequest: async (accId, currency, amount, bankInfo) => {
        let postData = {
            accId: accId,
            currency: currency,
            amount: amount,
            bankId: bankInfo.bankId,
            bankName: bankInfo.bankName,
            bankBranchId: bankInfo.bankBranchId,
            bankBranchName: bankInfo.bankBranchName,
            bankAccountNo: bankInfo.bankAccountNo,
            bankAccountName: bankInfo.bankAccountName,
            transferDescription: bankInfo.transferDescription,
            sessionId: bankInfo.sessionId
        }
        let res = await httpService.post(EXCHANGE_API.CREATE_FIAT_DEPOSIT_REQUEST, postData);
        if (res.status === 200) {
            let data = res.data;
            if (data.status) {
                return {
                    status: "OK",
                    data: res.data,
                    message: ""
                };
            }
            else {
                return {
                    status: "ERROR",
                    data: data,
                    message: data.message
                };
            }
        }
        else {
            return {
                status: "ERROR",
                data: null,
                message: res.statusText
            };
        }
    },

    confirmDepositFiat: async (fileName, poPDesc, requestId, fileBytes) => {
        let data = {
            fileName,
            poPDesc,
            requestId,
            fileBytes
        }
        // console.log(data,"data depositFiat")
        let response = await httpService.post(EXCHANGE_API.CONFIRM_FIAT_DEPOSIT, data);
        console.log(response,"test depositFiat");
        if (response.status === 200) return response.data;
        return null;
    },

    cancelDepositFiat: async (id) => {
        let response = await httpService.post(EXCHANGE_API.CANCEL_FIAT_DEPOSIT.replace('{id}', id));
        if (response.status === 200) return response.data;
        return null;
    },

    updateUserInfo: async (data) => {
        // console.log(data);
        console.log(EXCHANGE_API.UPDATE_USER_INFO, data,"exchang data");
        let response = await httpService.post(EXCHANGE_API.UPDATE_USER_INFO, data);
        if (response.status === 200) {
            return response.data
        }
    },
    keepLogin: async (userId) => {
        let response = await httpService.post(EXCHANGE_API.KEEP_LOGIN + userId);
        if (response.status === 200) {
            if (response.data.status)
                return response.data.customerCacheModel
        }
    },
    createWithdrawalCoin: async (data) => {
        let response = await httpService.post(EXCHANGE_API.COIN_WITHDRAW_REQUEST, data);
        if (response.status === 200) {
            if (response.data.code === 1) {
                return {
                    status: 'OK',
                    data: response.data
                }
            } else {
                return {
                    status: 'ERROR',
                    message: response.data.message
                }
            }
        }
    },
    cancelWithdrawCoin: async (data) => {
        let response = await httpService.post(EXCHANGE_API.CANCEL_WITHDRAW_COIN + `${data.accId}/${data.requestId}/${data.verifyCode}/${data.sessionId}`, data);
        if (response.status === 200) {
            return response.data
        }
    },

    confirmOtpCoin: async (data) => {
        let response = await httpService.post(EXCHANGE_API.CONFIRM_OPT_COIN, data);
        if (response.status === 200) {
            return response.data
        }
    },
    getBankAccount: async (accId) => {
        const postUri = EXCHANGE_API.GET_CUSTOMER_BANK_ACCOUNT.replace("{accId}", accId);
        let response = await httpService.post(postUri);
        if (response.status === 200) {
            return response.data
        }
        return null;
    },
    getBankBranchByBankId: async (bankId) => {
        let response = await httpService.post_without_token(`${EXCHANGE_API.GET_BANK_BRANCH}${bankId}`);
        return response;
    },
    createFiatWithdrawalRequest: async (accId, currency, bankId, bankBranchId, receiveAccountName, receiveAccountNo,
        receiveAmount, verifyCode, paymentGatewayId, customerEmail, sessionId) => {
        const postData = {
            accId,
            currency: currency,
            bankId,
            bankBranchId,
            receiveAccountName,
            receiveAccountNo,
            receiveAmount,
            verifyCode,
            sessionId: sessionId,
            paymentGatewayId,
            conversionValue: 0,
            paymentGatewayFeeRate: 0,
            paymentGatewayFixedFee: 0,
            customerEmail,
            via: 2
        }
        console.log(postData,"postData")
        let response = await httpService.post(EXCHANGE_API.CREATE_FIAT_WITHDRAW_REQUEST, postData);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    },
    confirmFiatWithdrawByOTP: async (sessionId, requestId, code) => {
        const postData = { sessionId, requestId, code };
        let response = await httpService.post(EXCHANGE_API.CONFIRM_OPT_FIAT, postData);
        if (response.status === 200) {
            return response.data
        }
        return null;
    },
    cancelWithdrawFiat: async (accId, sessionId, requestId, verifyCode) => {
        const url = EXCHANGE_API.CANCEL_WITHDRAW_FIAT.replace("{sessionId}", sessionId)
            .replace("{requestId}", requestId)
            .replace("{verifyCode}", verifyCode)
            .replace("{accId}", accId);
        let response = await httpService.post(url);
        if (response.status === 200) {
            return response.data
        }
        return null
    },
    getFiatRequest: async (accId, requestId) => {
        const url = EXCHANGE_API.GET_FIAT_REQUEST
            .replace("{accId}", accId)
            .replace("{id}", requestId);
        let response = await httpService.post(url);
        if (response.status === 200) {
            return response.data
        }
        return null
    },
    getQrCode: async (email) => {
        let response = await httpService.post(EXCHANGE_API.GET_QR_CODE_IMAGE_URL + email);
        if (response.status === 200) {
            return response.data
        }
    },
    setupGoogleAuth: async (data) => {
        let response = await httpService.post(EXCHANGE_API.SETUP_GOOGLE_AUTH, data)
        if (response.status === 200) {
            return response.data
        }
    },
    getAssetSummary: async (accId) => {
        let response = await httpService.post(EXCHANGE_API.GET_ASSET_SUMMARY + accId);
        if (response.status === 200) {
            return response.data
        }
    },
    setupUseFnxForFee:async (accId,isUseFee)=>{
        let response = await httpService.post(`${EXCHANGE_API.SETUP_USE_FNX_FOR_FEE}${accId}/${isUseFee}`);
        if (response.status === 200) {
            return response.data
        }
    },
    getExchangeTokenForFee:async ()=>{
        let response = await httpService.post(`${EXCHANGE_API.GET_EXCHANGE_TOKEN_DISCOUNT_FEE}`);
        if (response.status === 200) {
            return response.data
        }
    },
    addBankAccount: async (accId, bankId, bankBranchId, bankAccountNo, bankAccountName, paymentGatewayId) => {
        let postData = {
            accId,
            bankId,
            bankBranchId,
            bankAccountNo,
            bankAccountName,
            paymentGatewayId
        }
        console.log(postData);
        let response = await httpService.post(EXCHANGE_API.ADD_BANK_ACCOUNT, postData);
        if (response.status === 200) {
            return response.data
        }
        return null;
    },
    resetPassword: async (email) => {
        let response = await httpService.post_without_token(EXCHANGE_API.RESET_PASSWORD + email + `?callback=&via=2`, email);
        return response
    },
    confirmResetPassword: async (data) => {
        let response = await httpService.post_without_token(EXCHANGE_API.RESET_PASSWORD_BY_OTP, data);
        return response
    },
    getPaymentGateway:async (unit)=>{
        let response = await httpService.post(EXCHANGE_API.GET_PAYMENT_GATEWAY);
        console.log(response,"payment gateway");
        if(response){
            let gw = response.data.filter(o=>o.key === unit);
            // console.log(gw,gw.value,"gw")
            return gw[0].value;

        }
        else{
            return null;
        }
    },
    applyPromotion: async (data) => {
        let response = await httpService.post(EXCHANGE_API.PROMOTION, data);
        if (response) {
            if (response.data.status) {
                return response.data.message
            }else {
                return response.data.message
            }
        }
    },
    getOtp: async (email, feature, itemId) => {
        console.log(itemId,"item Id");
        let response = await httpService.post(EXCHANGE_API.GET_OTP + email + `/${feature}/${itemId}`, {email, feature, itemId});
        if(response) {
            if(response.status == 200) {
                return response.data
            }
        }
    },
    resendConfirmEmail: async (email) => {
        console.log(EXCHANGE_API.RESEND_CONFIRM_EMAIL + email)
        let response = await httpService.post_without_token(EXCHANGE_API.RESEND_CONFIRM_EMAIL + email, {email});
        if(response) {
            if(response.data.status){
                return response.data.status
            }
        }
    }

}
