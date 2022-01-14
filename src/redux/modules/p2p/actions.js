import {useDispatch} from 'react-redux';
import {createAction} from '../../../configs/utils';
const CONTEXT = '@P2P';
export const GET_ADVERTISMENTS = `${CONTEXT}/GET_ADVERTISMENTS`;
export const GET_MY_ADVERTISMENTS = `${CONTEXT}/GET_MY_ADVERTISMENTS`;
export const GET_ADVERTISMENT = `${CONTEXT}/GET_ADVERTISMENT`;
export const GET_TRADING = `${CONTEXT}/GET_TRADING`;
export const GET_TRADING_SUCCESS = `${CONTEXT}/GET_TRADING_SUCCESS`;
export const GET_PAYMENT_METHOD_BY_ACC = `${CONTEXT}/GET_PAYMENT_METHOD_BY_ACC`;
export const GET_PAYMENT_METHOD_BY_ACC_SUCCESS = `${CONTEXT}/GET_PAYMENT_METHOD_BY_ACC_SUCCESS`;
export const GET_EXCHANGE_PAYMENT_METHOD = `${CONTEXT}/GET_EXCHANGE_PAYMENT_METHOD`;
export const GET_EXCHANGE_PAYMENT_METHOD_SUCCESS = `${CONTEXT}/GET_EXCHANGE_PAYMENT_METHOD_SUCCESS`;
export const ADD_PAYMENT_METHOD = `${CONTEXT}/ADD_PAYMENT_METHOD`;
export const ADD_PAYMENT_METHOD_SUCCESS = `${CONTEXT}/ADD_PAYMENT_METHOD_SUCCESS`;
export const REMOVE_PAYMENT_METHOD = `${CONTEXT}/REMOVE_PAYMENT_METHOD`;
export const REMOVE_PAYMENT_METHOD_SUCCESS = `${CONTEXT}/REMOVE_PAYMENT_METHOD_SUCCESS`;
export const GET_OFFER_ORDER = `${CONTEXT}/GET_OFFER_ORDER`;
export const GET_OFFER_ORDER_SUCCESS = `${CONTEXT}/GET_OFFER_ORDER_SUCCESS`;
export const CONFIRM_PAYMENT_ADVERTISMENT = `${CONTEXT}/CONFIRM_PAYMENT_ADVERTISMENT`;
export const CONFIRM_PAYMENT_ADVERTISMENT_SUCCESS = `${CONTEXT}/CONFIRM_PAYMENT_ADVERTISMENT_SUCCESS`;
export const UNLOCK_OFFER_ADVERTISMENT = `${CONTEXT}/UNLOCK_OFFER_ADVERTISMENT`;
export const UNLOCK_OFFER_ADVERTISMENT_SUCCESS = `${CONTEXT}/UNLOCK_OFFER_ADVERTISMENT_SUCCESS`;

export const CREATE_OFFER_ADVERTISMENT = `${CONTEXT}/CREATE_OFFER_ADVERTISMENT`;

export const GET_ADVERTISMENTS_SUCCESS = `${CONTEXT}/GET_ADVERTISMENTS_SUCCESS`;
export const GET_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_ADVERTISMENT_SUCCESS`;
export const GET_MY_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_MY_ADVERTISMENT_SUCCESS`;

export function useActionsP2p(dispatch) {
  if (!dispatch) {
    dispatch = useDispatch();
  }
  return {
    handleGetAdvertisments: data =>
      dispatch(createAction(GET_ADVERTISMENTS, data)),
    handleGetMyAdvertisments: data =>
      dispatch(createAction(GET_MY_ADVERTISMENTS, data)),
    handleGetTradingMarket: () => dispatch(createAction(GET_TRADING)),
    handleGetPaymentMethodByAcc: () => dispatch(createAction(GET_PAYMENT_METHOD_BY_ACC)),
    handleGetExchangePaymentMethod: () => dispatch(createAction(GET_EXCHANGE_PAYMENT_METHOD)),
    handleAddPaymentMethod: (data) => dispatch(createAction(ADD_PAYMENT_METHOD,data)),
    handleRemovePaymentMethod: (data) => dispatch(createAction(REMOVE_PAYMENT_METHOD,data)),
    handleGetAdvertisment: (orderId) => dispatch(createAction(GET_ADVERTISMENT,orderId)),
    handleGetOfferOrder: (orderId) => dispatch(createAction(GET_OFFER_ORDER,orderId)),
    handleCreateOfferOrder: (data) => dispatch(createAction(CREATE_OFFER_ADVERTISMENT,data)),
    handleConfirmPaymentAdvertisment: (data) => dispatch(createAction(CONFIRM_PAYMENT_ADVERTISMENT,data)),
    handleUnlockOfferAdvertisment: (data) => dispatch(createAction(UNLOCK_OFFER_ADVERTISMENT,data)),
  };
}
export const actionsReducerP2p = {
  getAdvertismentsSuccess: advertisment =>
    createAction(GET_ADVERTISMENTS_SUCCESS, advertisment),
  getMyAdvertismentsSuccess: advertisment =>
    createAction(GET_MY_ADVERTISMENT_SUCCESS, advertisment),
  getTradingSuccess: data => createAction(GET_TRADING_SUCCESS, data),
  getAdvertismentSuccess: data => createAction(GET_ADVERTISMENT_SUCCESS, data),
  getPaymentMethodByAccSuccess: data => createAction(GET_PAYMENT_METHOD_BY_ACC_SUCCESS, data),
  getExchangePaymentMethodSuccess: data => createAction(GET_EXCHANGE_PAYMENT_METHOD_SUCCESS, data),
  getOfferOrderSuccess: data => createAction(GET_OFFER_ORDER_SUCCESS, data),
  unlockOfferAdvertismentSuccess: data => createAction(UNLOCK_OFFER_ADVERTISMENT_SUCCESS, data),
};
