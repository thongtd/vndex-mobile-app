// @flow

import {
  useDispatch,
} from 'react-redux';
import { createAction } from '../../../configs/utils';
const CONTEXT = '@WALLET';
// declare var
export const GET_ASSET_FIAT_WALLET_SUCCESS = `${CONTEXT}/GET_FIAT_WALLETS_SUCCESS`;
export const GET_ASSET_CRYPTO_WALLETS_SUCCESS = `${CONTEXT}/GET_CRYPTO_WALLETS_SUCCESS`;
export const GET_ASSET_SUMARY = `${CONTEXT}/GET_ASSET_SUMARY`;
export const GET_WITHDRAW_COIN_LOG = `${CONTEXT}/GET_WITHDRAW_COIN_LOG`;
export const GET_WITHDRAW_COIN_LOG_SUCCESS = `${CONTEXT}/GET_WITHDRAW_COIN_LOG_SUCCESS`;
export const GET_WITHDRAW_FIAT_LOG = `${CONTEXT}/GET_WITHDRAW_FIAT_LOG`;
export const GET_WITHDRAW_FIAT_LOG_SUCCESS = `${CONTEXT}/GET_WITHDRAW_FIAT_LOG_SUCCESS`;
export const GET_DEPOSIT_COIN_LOG = `${CONTEXT}/GET_DEPOSIT_COIN_LOG`;
export const GET_DEPOSIT_COIN_LOG_SUCCESS = `${CONTEXT}/GET_DEPOSIT_COIN_LOG_SUCCESS`;
export const GET_DEPOSIT_FIAT_LOG = `${CONTEXT}/GET_DEPOSIT_FIAT_LOG`;
export const GET_DEPOSIT_FIAT_LOG_SUCCESS = `${CONTEXT}/GET_DEPOSIT_FIAT_LOG_SUCCESS`;
export const GET_DEPOSIT_BANK_ACCOUNT = `${CONTEXT}/GET_DEPOSIT_BANK_ACCOUNT`;
export const GET_DEPOSIT_BANK_ACCOUNT_SUCCESS = `${CONTEXT}/GET_DEPOSIT_BANK_ACCOUNT_SUCCESS`;
export const GET_BALANCE_BY_CURRENCY = `${CONTEXT}/GET_BALANCE_BY_CURRENCY`;
export const GET_BALANCE_BY_CURRENCY_SUCCESS = `${CONTEXT}/GET_BALANCE_BY_CURRENCY_SUCCESS`;
export const GET_COIN_BY_TYPE = `${CONTEXT}/GET_COIN_BY_TYPE`;
export const GET_COIN_BY_TYPE_FIATS_SUCCESS = `${CONTEXT}/GET_COIN_BY_TYPE_FIATS_SUCCESS`;
export const GET_COIN_BY_TYPE_COIN_SUCCESS = `${CONTEXT}/GET_COIN_BY_TYPE_COIN_SUCCESS`;


//function handle Reducer
export const actionsReducerWallet = {
  getFiatWalletsSuccess: (fiatWallet) => createAction(GET_ASSET_FIAT_WALLET_SUCCESS, fiatWallet),
  getCryptoWalletsSuccess: (coinsWallet) => createAction(GET_ASSET_CRYPTO_WALLETS_SUCCESS, coinsWallet),
  getDepositCoinsSuccess: (depositCoin) => createAction(GET_DEPOSIT_COIN_LOG_SUCCESS, depositCoin),
  getDepositFiatsSuccess: (depositFiat) => createAction(GET_DEPOSIT_FIAT_LOG_SUCCESS, depositFiat),
  getWithdrawCoinsSuccess: (withdrawCoin) => createAction(GET_WITHDRAW_COIN_LOG_SUCCESS, withdrawCoin),
  getWithdrawFiatsSuccess: (withdrawFiat) => createAction(GET_WITHDRAW_FIAT_LOG_SUCCESS, withdrawFiat),
  getDepositBankAccountSuccess: (listBank) => createAction(GET_DEPOSIT_BANK_ACCOUNT_SUCCESS, listBank),
  getBalanceByCurrencySuccess: (infoCoin) => createAction(GET_BALANCE_BY_CURRENCY_SUCCESS, infoCoin), 
  getCoinByTypeFiatsSuccess: (walletType) => createAction(GET_COIN_BY_TYPE_FIATS_SUCCESS, walletType),
  getCoinByTypeCoinsSuccess: (walletType) => createAction(GET_COIN_BY_TYPE_COIN_SUCCESS, walletType),  
}