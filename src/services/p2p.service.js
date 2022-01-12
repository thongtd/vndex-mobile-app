import {httpService} from './http.service';
import {EXCHANGE_API, XWALLET_API, P2P_API} from '../configs/api';
import {size} from 'lodash';
import {storageService} from './storage.service';
import {constant, BankTransfer} from '../configs/constant';
import {
  get,
  isArray,
  getOneMonthAgoDate,
  getCurrentDate,
  removeEmptyUrl,
} from '../configs/utils';
var qs = require('qs');
export const P2pService = {
  getAdvertisments: async data => {
    let dataRemoved = removeEmptyUrl(
      `side=${data.side}&coinSymbol=${data.coinSymbol}&paymentUnit=${data.paymentUnit}&priceType=${data.priceType}&orderAmount=${data.orderAmount}&exPaymentMethodIds=${data.exPaymentMethodIds}&requiredKyc=${data.requiredKyc}&requiredAgeInday=${data.requiredAgeInday}&createdFrom=${data.createdFrom}&createdTo=${data.createdTo}&status=${data.status}&pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`,
    );
    let urlGetAdvertisments = `${P2P_API.advertisments}?${dataRemoved}`;

    let response = await httpService.get_without_token(urlGetAdvertisments);

    return response;
  },
  getAdvertisment: async orderId => {
    let urlGetAdvertisment = `${P2P_API.GET_ADVERTISMENT}/${orderId}`;
    let response = await httpService.get_without_token(urlGetAdvertisment);
    return response;
  },
  getTradingMarket: async () => {
    let urlGetTradingMarket = `${P2P_API.GET_TRADING_MARKETS}`;
    let response = await httpService.post_without_token(urlGetTradingMarket);
    return response;
  },
  getPaymentMethodByAcc: async () => {
    let url = `${P2P_API.GET_PAYMENT_METHOD_BY_ACC}`;
    let response = await httpService.get(url);
    return response.data;
  },
  getExchangePaymentMethod: async () => {
    let url = `${P2P_API.GET_EXCHANGE_PAYMENT_METHOD}`;
    let response = await httpService.get_without_token(url);
    return response;
  },
  addPaymentMethod: async (data) => {
    let url = `${P2P_API.ADD_PAYMENT_METHOD}`;
    let response = await httpService.post(url,data);
    return response.data;
  },
  removePaymentMethod: async (data,accId) => {
    let url = `${P2P_API.REMOVE_PAYMENT_METHOD}${accId}`;
    let response = await httpService.post(url,data);
    return response.data;
  },
  getOfferOrder: async (offerOrderId) => {
    let url = `${P2P_API.GET_OFFER_ORDER}${offerOrderId}`;
    let response = await httpService.get(url);
    return response.data;
  },
  createOfferOrderAdvertisment:async (data) => {
    let url = `${P2P_API.CREATE_OFFER_ADVERTISMENT}`;
    let response = await httpService.post(url,data);
    return response.data;
  },
};
