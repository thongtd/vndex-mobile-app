import { httpService } from "./http.service";
import { EXCHANGE_API, XWALLET_API } from "../configs/api";
import { size } from "lodash"
import { storageService } from "./storage.service";
import { constant, BankTransfer } from "../configs/constant";
import { get, isArray, getOneMonthAgoDate, getCurrentDate } from "../configs/utils";

export const WalletService = {
    getPaymentGateway: async (unit) => {
        let response = await httpService.post(EXCHANGE_API.GET_PAYMENT_GATEWAY);
        if (response) {
            let gw = response.data.filter(o => o.key === unit);
            return gw[0].value;
        }
        else {
            return null;
        }
    },
    getBankByCurrencyCode: async (currencyCode) => {
        let response = await httpService.post(EXCHANGE_API.GET_BANK_BY_CURRENCY_CODE + `${currencyCode}`);
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
        try {
            let response = await httpService.post(EXCHANGE_API.CREATE_FIAT_WITHDRAW_REQUEST, postData);
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            return error
        }

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
    addBankAccount: async (accId, bankId, bankBranchId, bankAccountNo, bankAccountName, paymentGatewayId) => {
        let postData = {
            accId,
            bankId,
            bankBranchId,
            bankAccountNo,
            bankAccountName,
            paymentGatewayId
        }
        let response = await httpService.post(EXCHANGE_API.ADD_BANK_ACCOUNT, postData);
        if (response.status === 200) {
            return response.data
        }
        return null;
    },
    getPaymentGateway: async (unit) => {
        try {
            let response = await httpService.post(EXCHANGE_API.GET_PAYMENT_GATEWAY);
            if (response) {
                let gw = response.data.filter(o => get(o, "key") === unit);
                if (isArray(gw) && size(gw) > 0) {
                    let payment = get(gw[0], "value") && get(gw[0], "value").filter((item, index) => get(item, "code") === BankTransfer);
                    if (isArray(payment) && size(payment) > 0) {
                        return payment[0];
                    }
                }
            }
            else {
                return null;
            }
        } catch (error) {
            console.log(error)
        }

    },
    getOtp: async (email, feature, itemId) => {
        try {
            let response = await httpService.post(EXCHANGE_API.GET_OTP + email + `/${feature}/${itemId}`, { email, feature, itemId });
            if (response) {
                if (response.status == 200) {
                    return response.data
                }
            }
        } catch (error) {
            return error
        }

    },
    confirmOtpCoin: async (data) => {
        try {
            let response = await httpService.post(EXCHANGE_API.CONFIRM_OPT_COIN, data);
            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            return error
        }

    },
    createWithdrawalCoin: async (data) => {
        try {
            let response = await httpService.post(EXCHANGE_API.COIN_WITHDRAW_REQUEST, data);
            console.log(response,"response");
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
        } catch (error) {
            return error
        }

    },
    confirmDepositFiat: async (fileName, poPDesc, requestId, fileBytes) => {
        let data = {
            fileName,
            poPDesc,
            requestId,
            fileBytes
        }

        let response = await httpService.post(EXCHANGE_API.CONFIRM_FIAT_DEPOSIT, data);
        if (response.status === 200) return response.data;
        return null;
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
    getDepositBankAccount: async (currencyCode, accId) => {
        try {
            let res = await httpService.post(EXCHANGE_API.GET_FIAT_WALLET_DEPOSIT_BANK + `${accId}`);
            if (res.status === 200 && res.data && res.data.length > 0) {
                let data = []
                res.data.map((item, index) => {
                    if (item.currency === currencyCode) {
                        data.push(item);
                    }
                })
                return {
                    data,
                    result: 'ok'
                }
            } else {
                return {
                    result: 'err'
                }
            }
        } catch (error) {
            return {
                result: 'err'
            }
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
    },
    cancelDepositFiat: async (id) => {
        let response = await httpService.post(EXCHANGE_API.CANCEL_FIAT_DEPOSIT.replace('{id}', id));
        if (response.status === 200) return response.data;
        return null;
    },
    cancelWithdrawCoin: async (data) => {
        let response = await httpService.post(EXCHANGE_API.CANCEL_WITHDRAW_COIN + `${data.accId}/${data.requestId}/${data.verifyCode}/${data.sessionId}`, data);
        if (response.status === 200) {
            return response.data
        }
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
    getAssetSummary: async (accId) => {
        try {
            let response = await httpService.post(EXCHANGE_API.GET_ASSET_SUMMARY + accId);
            if (response.status === 200) {
                let data = response.data;
                return {
                    result: 'ok',
                    data,
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }
    },
    getDepositCoinLog: async (
        customerId,
        pageIndex=1,
        pageSize,
        fromDate = "",
        toDate = "",
        walletCurrency = "",
        status = ""
    ) => {
        try {
            // console.log(XWALLET_API.GET_COIN_DEPOSIT_LOG + `${customerId}/${pageIndex}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}&walletCurrency=${walletCurrency}&status=${status}`,"link");
            let res = await httpService.post(XWALLET_API.GET_COIN_DEPOSIT_LOG + `${customerId}/${pageIndex}/${pageSize}`);
            
            console.log(res,"res tren deposit log");
            if (res.status === 200) {
                console.log(res,"res deposit log");
                let data = res.data.source;
                return {
                    result: 'ok',
                    data,
                };
            } else {
                return {
                    result: 'err',
                    message: 'Please check your internet connection!',
                };
            }
        } catch (error) {
            console.log(error,"error deposit log");
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }

    },
    getDepositFiatLog: async (
        customerId,
        pageIndex,
        pageSize,
        fromDate = "",
        toDate = "",
        walletCurrency = "",
        status = ""
    ) => {
        try {
            let res = await httpService.get(XWALLET_API.GET_FIAT_DEPOSIT_LOGS + `${customerId}/${pageIndex}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}&walletCurrency=${walletCurrency}&status=${status}`);
            if (res.status === 200) {
                let data = res.data.source;
                return {
                    result: 'ok',
                    data,
                };

            } else {
                return {
                    result: 'err',
                    message: 'Please check your internet connection!',
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }

    },
    getWithdrawCoinLog: async (
        customerId,
        pageIndex,
        pageSize,
        fromDate = "",
        toDate = "",
        currency = "",
        status = ""
    ) => {
        try {
            let res = await httpService.post(XWALLET_API.GET_COIN_WITHDRAW_LOG + `${customerId}/${pageIndex}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}&currency=${currency}&status=${status}`);
            if (res.status === 200) {
                let data = res.data.source;
                return {
                    result: 'ok',
                    data,
                };
            } else {
                return {
                    result: 'err',
                    message: 'Please check your internet connection!',
                };
            }
        } catch (error) {

            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }

    },
    getWithdrawFiatLog: async (
        customerId,
        pageIndex,
        pageSize,
        fromDate = getOneMonthAgoDate(),
        toDate = getCurrentDate(),
        walletCurrency = "",
        status = ""
    ) => {
        try {
            let res = await httpService.get(XWALLET_API.GET_FIAT_WITHDRAW_LOGS + `${customerId}/${pageIndex}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}&walletCurrency=${walletCurrency}&status=${status}`);
            if (res.status === 200) {
                let data = res.data.source;
                return {
                    result: 'ok',
                    data,
                };
            } else {
                return {
                    result: 'err',
                    message: 'Please check your internet connection!',
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }
    },
    getCoinByType: async (walletType = 1) => {
        try {
            let res = await httpService.get_without_token(`${XWALLET_API.GET_COIN_BY_TYPE}${walletType}`);

            if (res) {
                let data = res;
                return {
                    result: 'ok',
                    data,
                };
            }
        } catch (error) {

            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }
    },
    
}