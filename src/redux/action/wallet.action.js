import { jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";

export function getWithdrawLog(pageIndex, pageSize, symbol) {
    return (dispatch) => jwtDecode().then(acc => {
        authService.getWithdrawFiatLog(acc.id, pageIndex, pageSize).then(withdrawRes => {
            if (withdrawRes) {
                let withdrawLog = withdrawRes.source.filter(e => e.walletCurrency === symbol);
                dispatch({
                    type: 'GET_WITHDRAW_LOG',
                    payload: withdrawLog
                });
            }
            else {
                dispatch({
                    type: 'GET_WITHDRAW_LOG',
                    payload: []
                });
            }
        })

    })
}

export function getDepositLog(pageIndex, pageSize, symbol) {
    return (dispatch) => jwtDecode().then(acc => {
        dispatch({
            type: 'GET_DEPOSIT_LOG',
            payload: []
        });
        authService.getDepositFiatLog(acc.id, pageIndex, pageSize).then(depositRes => {
            if (depositRes) {
                let depositLog = depositRes.source.filter(e => e.walletCurrency === symbol);
                dispatch({
                    type: 'GET_DEPOSIT_LOG',
                    payload: depositLog
                });
            }
            else {
                dispatch({
                    type: 'GET_DEPOSIT_LOG',
                    payload: []
                });
            }
        })

    })
}

export function getBanner() {
    return (dispatch) => authService.getBanner(1).then(banner => {
        if(banner){
                dispatch({
                    type: 'GET_BANNER',
                    payload: banner
                });
        }
    })
}

export function setCurrencyWithdrawFiat(currency) {
    return {
        type: "SET_CURRENCY_WITHDRAW_FIAT",
        payload: currency
    }
}

