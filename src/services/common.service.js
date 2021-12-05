import { storageService } from "./storage.service";
import { constant } from "../config/constants";
import { httpService } from "./http.service";
import { EXCHANGE_API } from "../config/API";
import { authService } from "./authenticate.service";

export const commonService = {
    setLanguage: async (lang) => {
        return await storageService.setItem(constant.STORAGEKEY.LANGUAGE, lang);
    },
    getLanguage: async () => {
        return await storageService.getItem(constant.STORAGEKEY.LANGUAGE);
    },
    checkHealthy: () => {
        return httpService.post_without_token(EXCHANGE_API.CHECK_API);
    },
    saveMarketData: async (marketData, coin) => {
        try {
            const coinRes = await storageService.setItem(constant.STORAGEKEY.UNIT_LIST, coin);
            const marketRes = await storageService.setItem(constant.STORAGEKEY.MARKET_WATCH, marketData);
            return coinRes && marketRes;
        }
        catch (e) {
            return false;
        }
    },
    saveFiatList: async (list) => {
        const res = await storageService.setItem(constant.STORAGEKEY.FIAT_LIST, list);
        return res;
    },
    getCoinList: async () => {
        return await storageService.getItem(constant.STORAGEKEY.UNIT_LIST);
    },
    getFiatList: async () => {
        return await storageService.getItem(constant.STORAGEKEY.FIAT_LIST);
    },
    getItemDepositCast: async (currency, accId, bankId) => {
        console.log(currency, accId,bankId, "bankIddata");
        try {
            let depositBank = await authService.getDepositBankAccount(currency, accId);
            console.log(depositBank, "depositBank");
            // return depositBank;
            if (depositBank.length > 0) {
                let bankIdData;
                depositBank.map((item, index) => {
                    if (item.bankId === bankId) {
                        bankIdData = item;
                    }
                })
                return bankIdData;
            }
        } catch (error) {
            console.log(error)
        }


    }
}
