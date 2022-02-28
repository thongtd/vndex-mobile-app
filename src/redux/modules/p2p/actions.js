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
export const GET_MARKET_INFO = `${CONTEXT}/GET_MARKET_INFO`;
export const GET_MARKET_INFO_SUCCESS = `${CONTEXT}/GET_MARKET_INFO_SUCCESS`;
export const GET_HISTORY_ORDER = `${CONTEXT}/GET_HISTORY_ORDER`;
export const GET_HISTORY_ORDER_SUCCESS = `${CONTEXT}/GET_HISTORY_ORDER_SUCCESS`;
export const CREATE_ADVERTISMENT = `${CONTEXT}/CREATE_ADVERTISMENT`;
export const CREATE_ADVERTISMENT_SUCCESS = `${CONTEXT}/CREATE_ADVERTISMENT_SUCCESS`;

export const UPDATE_ADVERTISMENT = `${CONTEXT}/UPDATE_ADVERTISMENT`;
export const UPDATE_ADVERTISMENT_SUCCESS = `${CONTEXT}/UPDATE_ADVERTISMENT_SUCCESS`;
export const REMOVE_ADVERTISMENT = `${CONTEXT}/REMOVE_ADVERTISMENT`;
export const REMOVE_ADVERTISMENT_SUCCESS = `${CONTEXT}/REMOVE_ADVERTISMENT_SUCCESS`;
export const UPDATE_STATUS_ADV = `${CONTEXT}/UPDATE_STATUS_ADV`;
export const UPDATE_STATUS_ADV_SUCCESS = `${CONTEXT}/UPDATE_STATUS_ADV_SUCCESS`;

export const GET_CHAT_HISTORY = `${CONTEXT}/GET_CHAT_HISTORY`;
export const GET_CHAT_HISTORY_SUCCESS = `${CONTEXT}/GET_CHAT_HISTORY_SUCCESS`;
export const GET_CHAT_INFO_P2P = `${CONTEXT}/GET_CHAT_INFO_P2P`;
export const GET_CHAT_INFO_P2P_SUCCESS = `${CONTEXT}/GET_CHAT_INFO_P2P_SUCCESS`;
export const SEND_CHAT_MESSAGE = `${CONTEXT}/SEND_CHAT_MESSAGE`;

export const GET_COMPLAIN = `${CONTEXT}/GET_COMPLAIN`;
export const GET_COMPLAIN_SUCCESS = `${CONTEXT}/GET_COMPLAIN_SUCCESS`;
export const CANCEL_COMPLAIN = `${CONTEXT}/CANCEL_COMPLAIN`;
export const CANCEL_COMPLAIN_SUCCESS = `${CONTEXT}/CANCEL_COMPLAIN_SUCCESS`;
export const GET_COMPLAIN_PROCESS = `${CONTEXT}/GET_COMPLAIN_PROCESS`;
export const GET_COMPLAIN_PROCESS_SUCCESS = `${CONTEXT}/GET_COMPLAIN_PROCESS_SUCCESS`;
export const CREATE_COMPLAIN = `${CONTEXT}/CREATE_COMPLAIN`;

export const CREATE_OFFER_ADVERTISMENT = `${CONTEXT}/CREATE_OFFER_ADVERTISMENT`;
export const GET_DETIAL_ADVERTISMENT = `${CONTEXT}/GET_DETIAL_ADVERTISMENT`;

export const GET_ADVERTISMENTS_SUCCESS = `${CONTEXT}/GET_ADVERTISMENTS_SUCCESS`;
export const GET_DETIAL_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_DETIAL_ADVERTISMENT_SUCCESS`;
export const GET_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_ADVERTISMENT_SUCCESS`;
export const GET_MY_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_MY_ADVERTISMENT_SUCCESS`;

export const CREATE_RATING_COMMENT = `${CONTEXT}/CREATE_RATING_COMMENT`;
export const CREATE_RATING_COMMENT_SUCCESS = `${CONTEXT}/CREATE_RATING_COMMENT_SUCCESS`;
export const GET_COMMENTS_BY_USER = `${CONTEXT}/GET_COMMENTS_BY_USER`;
export const GET_COMMENTS_BY_USER_SUCCESS = `${CONTEXT}/GET_COMMENTS_BY_USER_SUCCESS`;
export const GET_ADV_INFO = `${CONTEXT}/GET_ADV_INFO`;
export const GET_ADV_INFO_SUCCESS = `${CONTEXT}/GET_ADV_INFO_SUCCESS`;
export const GET_FEE_TAX = `${CONTEXT}/GET_FEE_TAX`;
export const GET_FEE_TAX_SUCCESS = `${CONTEXT}/GET_FEE_TAX_SUCCESS`;
export const GET_ALL_CUSTOMER_TYPE = `${CONTEXT}/GET_ALL_CUSTOMER_TYPE`;
export const GET_ALL_CUSTOMER_TYPE_SUCCESS = `${CONTEXT}/GET_ALL_CUSTOMER_TYPE_SUCCESS`;
export const CREATE_CUSTOMER_TYPE = `${CONTEXT}/CREATE_CUSTOMER_TYPE`;

export function useActionsP2p(dispatch) {
  if (!dispatch) {
    dispatch = useDispatch();
  }
  return {
    handleCreateComplain: data => dispatch(createAction(CREATE_COMPLAIN, data)),
    handleGetAllCustomerType: () => dispatch(createAction(GET_ALL_CUSTOMER_TYPE)),
    handleCreateCustomerType: data => dispatch(createAction(CREATE_CUSTOMER_TYPE, data)),
    handleGetFeeTax: data => dispatch(createAction(GET_FEE_TAX, data)),
    handleGetComplain: orderId => dispatch(createAction(GET_COMPLAIN, orderId)),
    handleGetAdvInfo: () => dispatch(createAction(GET_ADV_INFO)),
    handleGetCommentsByUser: userId => dispatch(createAction(GET_COMMENTS_BY_USER, userId)),
    handleGetComplainProcess: complainId =>
      dispatch(createAction(GET_COMPLAIN_PROCESS, complainId)),
    handleCancelComplain: complainId =>
      dispatch(createAction(CANCEL_COMPLAIN, complainId)),
    handleGetAdvertisments: data =>
      dispatch(createAction(GET_ADVERTISMENTS, data)),
    handleGetChatHistory: data =>
      dispatch(createAction(GET_CHAT_HISTORY, data)),
    handleGetChatInfoP2p: data =>
      dispatch(createAction(GET_CHAT_INFO_P2P, data)),
    handleSendChatMessage: data =>
      dispatch(createAction(SEND_CHAT_MESSAGE, data)),

    handleUpdateStatusAdv: data =>
      dispatch(createAction(UPDATE_STATUS_ADV, data)),
    handleGetHistoryOrder: data =>
      dispatch(createAction(GET_HISTORY_ORDER, data)),
    handleGetMyAdvertisments: data =>
      dispatch(createAction(GET_MY_ADVERTISMENTS, data)),
    handleGetTradingMarket: () => dispatch(createAction(GET_TRADING)),
    handleGetMarketInfo: data => dispatch(createAction(GET_MARKET_INFO, data)),
    handleGetPaymentMethodByAcc: () =>
      dispatch(createAction(GET_PAYMENT_METHOD_BY_ACC)),
    handleGetExchangePaymentMethod: () =>
      dispatch(createAction(GET_EXCHANGE_PAYMENT_METHOD)),
    handleAddPaymentMethod: data =>
      dispatch(createAction(ADD_PAYMENT_METHOD, data)),
    handleRemovePaymentMethod: data =>
      dispatch(createAction(REMOVE_PAYMENT_METHOD, data)),
    handleGetAdvertisment: orderId =>
      dispatch(createAction(GET_ADVERTISMENT, orderId)),
    handleGetOfferOrder: orderId =>
      dispatch(createAction(GET_OFFER_ORDER, orderId)),
    handleCreateOfferOrder: data =>
      dispatch(createAction(CREATE_OFFER_ADVERTISMENT, data)),
    handleConfirmPaymentAdvertisment: data =>
      dispatch(createAction(CONFIRM_PAYMENT_ADVERTISMENT, data)),
    handleResetOffer: () => dispatch(createAction(GET_OFFER_ORDER_SUCCESS, {})),
    handleUnlockOfferAdvertisment: data =>
      dispatch(createAction(UNLOCK_OFFER_ADVERTISMENT, data)),
    handleCreateAdvertisment: data =>
      dispatch(createAction(CREATE_ADVERTISMENT, data)),
    handleUpdateAdvertisment: data =>
      dispatch(createAction(UPDATE_ADVERTISMENT, data)),
    handleRemoveAdvertisment: data =>
      dispatch(createAction(REMOVE_ADVERTISMENT, data)),
    handleItemDetailsAdvertisment: data =>
      dispatch(createAction(GET_DETIAL_ADVERTISMENT, data)),
    handleCreateCommentRating: data =>
      dispatch(createAction(CREATE_RATING_COMMENT, data)),
  };
}
export const actionsReducerP2p = {
  getMarketInfoSuccess: data => createAction(GET_MARKET_INFO_SUCCESS, data),
  getAllCustomerTypeSuccess: data => createAction(GET_ALL_CUSTOMER_TYPE_SUCCESS, data),
  getFeeTaxSuccess: data => createAction(GET_FEE_TAX_SUCCESS, data),
  getAdvInfoSuccess: data => createAction(GET_ADV_INFO_SUCCESS, data),
  getCommentsByUserSuccess: data => createAction(GET_COMMENTS_BY_USER_SUCCESS, data),
  getComplainSuccess: data => createAction(GET_COMPLAIN_SUCCESS, data),
  getComplainProcessSuccess: data =>
    createAction(GET_COMPLAIN_PROCESS_SUCCESS, data),
  cancelComplainSuccess: data => createAction(CANCEL_COMPLAIN_SUCCESS, data),

  getAdvertismentsSuccess: advertisment =>
    createAction(GET_ADVERTISMENTS_SUCCESS, advertisment),
  getDetailItemAdvertismentsSuccess: advertisment =>
    createAction(GET_DETIAL_ADVERTISMENT_SUCCESS, advertisment),
  getMyAdvertismentsSuccess: advertisment =>
    createAction(GET_MY_ADVERTISMENT_SUCCESS, advertisment),
  getTradingSuccess: data => createAction(GET_TRADING_SUCCESS, data),
  getAdvertismentSuccess: data => createAction(GET_ADVERTISMENT_SUCCESS, data),
  getPaymentMethodByAccSuccess: data =>
    createAction(GET_PAYMENT_METHOD_BY_ACC_SUCCESS, data),
  getExchangePaymentMethodSuccess: data =>
    createAction(GET_EXCHANGE_PAYMENT_METHOD_SUCCESS, data),
  getOfferOrderSuccess: data => createAction(GET_OFFER_ORDER_SUCCESS, data),
  getHistoryOrderSuccess: data => createAction(GET_HISTORY_ORDER_SUCCESS, data),
  unlockOfferAdvertismentSuccess: data =>
    createAction(UNLOCK_OFFER_ADVERTISMENT_SUCCESS, data),
  getChatHistorySuccess: data => createAction(GET_CHAT_HISTORY_SUCCESS, data),
  getChatInfoP2pSuccess: data => createAction(GET_CHAT_INFO_P2P_SUCCESS, data),
  createCommentRatingSuccess: data =>
    createAction(CREATE_RATING_COMMENT_SUCCESS, data),
};
