import { storageService } from "./storage.service";
import { constant } from "../configs/constant";
import { httpService } from "./http.service";
import { EXCHANGE_API } from "../config/api";
import { authService } from "./authenticate.service";

export const commonService = {
    checkHealthy: () => {
        try {
            let data= await httpService.post_without_token(EXCHANGE_API.CHECK_API);
            return {
                result: 'ok',
                data,
              };
        } catch (error) {
            return {
                result: 'error',
                message: 'Please check your internet connection!',
              };
        }
        
    },
    getItemDepositCast: async (currency, accId, bankId) => {
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
