import {useDispatch} from 'react-redux';
import {createAction} from '../../../configs/utils';
const CONTEXT = '@P2P';
export const GET_ADVERTISMENTS = `${CONTEXT}/GET_ADVERTISMENTS`;
export const GET_ADVERTISMENT = `${CONTEXT}/GET_ADVERTISMENT`;
export const GET_TRADING = `${CONTEXT}/GET_TRADING`;
export const GET_TRADING_SUCCESS = `${CONTEXT}/GET_TRADING_SUCCESS`;
export const GET_ADVERTISMENTS_SUCCESS = `${CONTEXT}/GET_ADVERTISMENTS_SUCCESS`;
export const GET_ADVERTISMENT_SUCCESS = `${CONTEXT}/GET_ADVERTISMENT_SUCCESS`;

export function useActionsP2p(dispatch) {
    if(!dispatch) {dispatch = useDispatch()}
  return {
    handleGetAdvertisments: data =>
      dispatch(createAction(GET_ADVERTISMENTS, data)),
    handleGetTradingMarket: () => dispatch(createAction(GET_TRADING)),
    handleGetAdvertisment: (orderId) => dispatch(createAction(GET_ADVERTISMENT,orderId)),
  };
}
export const actionsReducerP2p = {
  getAdvertismentsSuccess: advertisment =>
    createAction(GET_ADVERTISMENTS_SUCCESS, advertisment),
  getTradingSuccess: data => createAction(GET_TRADING_SUCCESS, data),
  getAdvertismentSuccess: data => createAction(GET_ADVERTISMENT_SUCCESS, data),
};
