// @flow
import _, { uniqBy, orderBy } from "lodash"
import { GET_ASSET_CRYPTO_WALLETS_SUCCESS, GET_ASSET_FIAT_WALLET_SUCCESS, GET_WITHDRAW_COIN_LOG_SUCCESS, GET_WITHDRAW_FIAT_LOG_SUCCESS, GET_DEPOSIT_COIN_LOG_SUCCESS, GET_DEPOSIT_FIAT_LOG_SUCCESS, GET_DEPOSIT_BANK_ACCOUNT_SUCCESS, GET_BALANCE_BY_CURRENCY_SUCCESS, GET_COIN_BY_TYPE_SUCCESS, GET_COIN_BY_TYPE_COIN_SUCCESS, GET_COIN_BY_TYPE_FIATS_SUCCESS } from './actions';
import { size, get } from "../../../configs/utils";

export const DEFAULT = {
  cryptoWallet: [],
  fiatsWallet: [],
  coinWithdrawLog: [],
  fiatWithdrawLog: [],
  coinDepositLog: [],
  fiatDepositLog: [],
  listBank: [],
  infoCoinCurrent: {},
  coinDepositLogLoadMore: [],
  fiatDepositLogLoadMore: [],
  fiatWithdrawLogLoadMore: [],
  coinWithdrawLogLoadMore: [],
  fiatsWalletType: [],
  coinsWalletType: [],
};

export default function WalletReducer(state = DEFAULT, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case GET_COIN_BY_TYPE_COIN_SUCCESS:
      return {
        ...state,
        coinsWalletType: [...payload],
      };
    case GET_COIN_BY_TYPE_FIATS_SUCCESS:
      return {
        ...state,
        fiatsWalletType: [...payload],
      };

    case "GET_COIN_DEPOSIT_LOG_LOAD_MORE":
      if (get(payload, "pageIndex") === 1) {
        return {
          ...state,
          coinDepositLogLoadMore: [...get(payload, "data")]
        }
      } else {
        let DCoinLoadMore = [...state.coinDepositLogLoadMore, ...get(payload, "data")];
        return {
          ...state,
          coinDepositLogLoadMore: orderBy(uniqBy(DCoinLoadMore, 'id'), ['createdDate'], ['desc'])
        }
      }
    case "GET_FIAT_DEPOSIT_LOG_LOAD_MORE":
      if (get(payload, "pageIndex") === 1) {
        return {
          ...state,
          fiatDepositLogLoadMore: [...get(payload, "data")]
        }
      } else {
        let DFiatLoadMore = [...state.fiatDepositLogLoadMore, ...get(payload, "data")];
        return {
          ...state,
          fiatDepositLogLoadMore: orderBy(uniqBy(DFiatLoadMore, 'id'), ['createdDate'], ['desc'])
        }
      }
    case "GET_FIAT_WITHDRAW_LOG_LOAD_MORE":
      if (get(payload, "pageIndex") === 1) {
        return {
          ...state,
          fiatWithdrawLogLoadMore: [...get(payload, "data")]
        }
      } else {
        let DFiatLoadMore = [...state.fiatWithdrawLogLoadMore, ...get(payload, "data")];
        return {
          ...state,
          fiatWithdrawLogLoadMore: orderBy(uniqBy(DFiatLoadMore, 'id'), ['createdDate'], ['desc'])
        }
      }
    case "GET_COIN_WITHDRAW_LOG_LOAD_MORE":
      if (get(payload, "pageIndex") === 1) {
        return {
          ...state,
          coinWithdrawLogLoadMore: [...get(payload, "data")]
        }
      } else {
        let DFiatLoadMore = [...state.coinWithdrawLogLoadMore, ...get(payload, "data")];
        return {
          ...state,
          coinWithdrawLogLoadMore: orderBy(uniqBy(DFiatLoadMore, 'id'), ['createdDate'], ['desc'])
        }
      }

    case GET_ASSET_CRYPTO_WALLETS_SUCCESS:
      return {
        ...state,
        cryptoWallet: [...payload],
      };
    case GET_ASSET_FIAT_WALLET_SUCCESS:
      return {
        ...state,
        fiatsWallet: [...payload],
      };
    case GET_WITHDRAW_COIN_LOG_SUCCESS:
      return {
        ...state,
        coinWithdrawLog: [...payload],
      };
    case GET_WITHDRAW_FIAT_LOG_SUCCESS:
      return {
        ...state,
        fiatWithdrawLog: [...payload],
      };
    case GET_DEPOSIT_COIN_LOG_SUCCESS:
      return {
        ...state,
        coinDepositLog: [...payload],
      };


    case GET_DEPOSIT_FIAT_LOG_SUCCESS:
      return {
        ...state,
        fiatDepositLog: [...payload],
      };

    case GET_DEPOSIT_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        listBank: [...payload],
      };
    case GET_BALANCE_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        infoCoinCurrent: payload,
      };

    default:
      return state;
  }
}
