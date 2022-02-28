const env = 'dev';
// const MARKET_WATCH_URL = 'http://54.169.27.91:6873/';

const MARKET_WATCH_URL =
  env === 'uat'
    ? 'http://54.169.221.223:8870/'
    : env == 'dev'
    ? 'http://54.169.221.223:6870/'
    : 'http://13.229.182.120:8870/';
export const CALLBACK_REG =
  env === 'uat'
    ? 'http://54.169.221.223:8868/confirm-email'
    : env == 'dev'
    ? 'http://54.169.221.223:6868/confirm-email'
    : 'https://vndex.io/confirm-email';

export const MARKET_API = {
  GET_MARKET_WATCH: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-watch`, //GET
  ORDER_BOOK: `${MARKET_WATCH_URL}api/v1/market-watch/get-top-price-by-pair`, //GET
  GET_TRADE_HISTORIES: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-trade-histories`, //GET
};

//Exchange
const EXCHANGE_URL =
  env === 'uat'
    ? 'http://54.169.221.223:8870/'
    : env == 'dev'
    ? 'http://54.169.221.223:6870/'
    : 'http://13.229.182.120:8870/';
// const EXCHANGE_URL = 'http://dev-api.financex.io/';
export const P2P_API = {
  GET_ALL_CUSTOMER_TYPE:`${EXCHANGE_URL}api/CustomerType/get-all`,
  CREATE_CUSTOMER_TYPE:`${EXCHANGE_URL}api/CustomerType/create`,
  VERIFY_2FA: `${EXCHANGE_URL}api/v1/user/validate-2fa-code`,
  advertisments: `${EXCHANGE_URL}api/v1/p2p-order/advertisments`,
  GET_TRADING_MARKETS: `${EXCHANGE_URL}api/v1/trade/get-trading-markets`,
  GET_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/advertisment`, //orderId,
  GET_PAYMENT_METHOD_BY_ACC: `${EXCHANGE_URL}api/v1/payment-methods/payment-methods-by-account`,
  GET_EXCHANGE_PAYMENT_METHOD: `${EXCHANGE_URL}api/v1/payment-methods/exchange-payment-methods`,
  ADD_PAYMENT_METHOD: `${EXCHANGE_URL}api/v1/payment-methods/add-payment-methods`,
  REMOVE_PAYMENT_METHOD: `${EXCHANGE_URL}api/v1/payment-methods/remove-payment-methods/`, //accountId
  GET_MY_ADVERTISEMENT: `${EXCHANGE_URL}api/v1/p2p-order/my-advertisments`,
  CREATE_OFFER_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/create-offer-advertisment`, //accountId
  GET_OFFER_ORDER: `${EXCHANGE_URL}api/v1/p2p-order/offer-order/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  CONFIRM_PAYMENT_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/confirm-payment-advertisment`,
  UNLOCK_OFFER_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/unlock-offer-advertisment/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_MARKET_INFO: `${EXCHANGE_URL}api/v1/p2p-order/market-info`,
  CREATE_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/create-advertisment`,
  UPDATE_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/update-advertisment/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  REMOVE_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/delete-advertisment/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  DETAIL_ADVERTISMENT: `${EXCHANGE_URL}api/v1/p2p-order/advertisment/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_HISTORY_ORDER: `${EXCHANGE_URL}api/v1/p2p-order/get-history-orders`,
  UPDATE_STATUS_ADV: `${EXCHANGE_URL}api/v1/p2p-order/update-status-advertisment/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6,
  CHAT_HISTORY: `${EXCHANGE_URL}api/v1/p2p-conversation/history/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6,
  CHAT_SEND_MESSAGE: `${EXCHANGE_URL}api/v1/p2p-conversation/send-message/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6,
  CHAT_INFO_P2P: `${EXCHANGE_URL}api/v1/p2p-conversation/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6,
  CREATE_COMPLAIN: `${EXCHANGE_URL}api/v1/p2p-order/create-complain`,
  GET_COMPLAIN: `${EXCHANGE_URL}api/v1/p2p-order/get-complain/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  CANCEL_COMPLAIN: `${EXCHANGE_URL}api/v1/p2p-order/cancel-complain/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_COMPLAIN_PROCESS: `${EXCHANGE_URL}api/v1/p2p-order/get-complain-process/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  CREATE_COMMENT_RATING: `${EXCHANGE_URL}api/v1/p2p-comment/create`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_COMMENTS_BY_USER: `${EXCHANGE_URL}api/v1/p2p-comment/get-comments-by-recipients-user/`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_ADV_INFO: `${EXCHANGE_URL}api/v1/p2p-order/advertisment-general-info`, //3fa85f64-5717-4562-b3fc-2c963f66afa6
  GET_FEE_TAX:`${EXCHANGE_URL}api/v1/p2p-order/get-tax-fee`//?quantity=100000&price=1000
};
export const EXCHANGE_API = {
  CHECK_API: `${EXCHANGE_URL}api/health-check`,

  //API for user
  GET_COUNTRIES: `${EXCHANGE_URL}api/v1/package/get-countries`, //POST
  CUSTOMER_REGISTER: `${EXCHANGE_URL}api/v1/user/register`, //POST: email, password, fromReferralId, countryCode, callbackUrl, ipAddress, city, userLocationRaw
  LOGIN: `${EXCHANGE_URL}api/v1/user/login`, //POST: email, password
  GET_USER_INFO: `${EXCHANGE_URL}api/v1/user/get-personal-info`, //
  SEND_2FA_CODE_VIA_EMAIL: `${EXCHANGE_URL}api/v1/user/send-2fa-code-via-email/`,
  ENABLE_2FA_EMAIL: `${EXCHANGE_URL}api/v1/user/enable-2fa-email`,
  DISABLE_2FA_EMAIL: `${EXCHANGE_URL}api/v1/user/disable-2fa-email`,
  VALIDATE_2FA_EMAIL_CODE: `${EXCHANGE_URL}api/v1/user/validate-2fa-code`,
  // ENABLE_GG_AUTH: `${EXCHANGE_URL}api/v1/user/setup-google-authen`,
  DISABLE_GG_AUTH: `${EXCHANGE_URL}api/v1/user/disable-google-2fa`,
  CHANGE_PASSWORD: `${EXCHANGE_URL}api/v1/user/change-passowrd`,
  REGISTER: `${EXCHANGE_URL}api/v1/user/register`, //POST
  CHECK_REGISTER: `${EXCHANGE_URL}api/v1/user/check-email-exists`, //POST

  KEEP_LOGIN: `${EXCHANGE_URL}api/v1/package/keep-login/`, //POST
  GET_QR_CODE_IMAGE_URL: `${EXCHANGE_URL}api/v1/package/generate-qr-code-image-url/`, //POST: {email}
  SETUP_GOOGLE_AUTH: `${EXCHANGE_URL}api/v1/user/setup-google-authen`,
  RESET_PASSWORD: `${EXCHANGE_URL}api/v1/user/reset-password/`,
  RESET_PASSWORD_BY_OTP: `${EXCHANGE_URL}api/v1/user/confirm-reset-password-by-otp`,

  //GET-BANNER
  GET_BANNER: `${EXCHANGE_URL}api/v1/package/get-advertisments/`,

  //Wallet
  GET_WALLET_BALANCES: `${EXCHANGE_URL}api/v1/user/get-wallets-balance/`,
  GET_WALLET_BALANCES_BY_CURRENCY: `${EXCHANGE_URL}api/v1/user/get-wallet-balance/`,

  //Account
  LAST_LOGIN: `${EXCHANGE_URL}api/v1/user/get-activity-logs/`,
  GET_USER_REFERRALS: `${EXCHANGE_URL}api/v1/user/get-referrals/`,
  GET_USER_COMMISSION: `${EXCHANGE_URL}api/v1/user/get-user-commissions/`,
  GET_USER_COMMISSION_SUMMARY: `${EXCHANGE_URL}api/v1/user/get-commission-summary/`,
  UPDATE_USER_INFO: `${EXCHANGE_URL}api/v1/user/update-personal-info`,
  GET_ASSET_SUMMARY: `${EXCHANGE_URL}api/v1/package/get-asset-summary/`, //{accId}
  SETUP_USE_FNX_FOR_FEE: `${EXCHANGE_URL}api/v1/user/setup-use-fnx-for-fee/`, // {accId}/{true}
  GET_EXCHANGE_TOKEN_DISCOUNT_FEE: `${EXCHANGE_URL}api/v1/package/get-exchange-token-discount-fee`,

  //API for trade
  CREATE_NEW_ORDER: `${EXCHANGE_URL}api/v1/trade/create-new-order`, //POST + Authen: coinSymbol, paymentUnit, quantity, price, orderType, side, customerEmail, accId, via
  CANCEL_ORDER: `${EXCHANGE_URL}api/v1/trade/cancel-orders`, //POST + Authen: accId, orderIds
  GET_ORDER_BOOKS: `${EXCHANGE_URL}api/v1/trade/get-order-books`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
  GET_OPEN_ORDER: `${EXCHANGE_URL}api/v1/trade/get-open-order`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
  GET_RECENT_ORDER: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-trade-histories/{symbol}/{paymentUnit}/{top}`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
  GET_CURRENCY_CONVERSION: `${EXCHANGE_URL}api/v1/package/get-currency-conversions`,
  GET_TRANS_FEE: `${EXCHANGE_URL}api/v1/trade/get-trans-fee/`, //{customerTypeId}/null
  GET_ORDER_DETAIL: `${EXCHANGE_URL}api/v1/trade/get-match-order-details/{orderId}`,
  GET_BUY_SELL_NEW_BY_PAIR: `${EXCHANGE_URL}api/v1/trade/get-buy-sell-now-by-pair/{symbol}/{paymentUnit}`,
  GET_SWAP_CONFIGS: `${EXCHANGE_URL}api/v1/trade/swap-configs`,
  GET_SWAP_TICKERS: `${EXCHANGE_URL}api/v1/trade/swap-tickers`,

  //API for Coin
  GET_CRYPTO_WALLET: `${EXCHANGE_URL}api/v1/package/get-crypto-wallets/`, // {customerId}
  GET_COIN_WITHDRAW_LOG: `${EXCHANGE_URL}api/v1/package/get-coin-withdrawals-logs/`, //{customerId}/{pageIndex}/{pageSize}
  GET_COIN_DEPOSIT_LOG: `${EXCHANGE_URL}api/v1/package/get-coin-deposit-logs/`, //{customerId}/{pageIndex}/{pageSize}
  GET_ASSET_REQUEST: `${EXCHANGE_URL}api/v1/package/get-asset-request/`, //{accId}/{id}
  CANCEL_WITHDRAW_COIN: `${EXCHANGE_URL}api/v1/package/cancel-coin-withdrawals-request/`, //{accId}/{requestId}/{verifyCode}/{sessionId?}
  CONFIRM_OPT_COIN: `${EXCHANGE_URL}api/v1/package/coin-withdrawals-confirm-by-otp/`,

  //API for Fiat
  GET_FIAT_WALLET: `${EXCHANGE_URL}api/v1/package/get-fiat-wallets/`, //{customerId}
  GET_FIAT_WALLET_DEPOSIT_BANK: `${EXCHANGE_URL}api/v1/package/get-deposit-bank-accounts/`, //{currencyCode}/{accId}
  GET_PAYMENT_GATEWAY: `${EXCHANGE_URL}api/v1/package/get-payment-gateways`,
  GET_BANK_BY_CURRENCY_CODE: `${EXCHANGE_URL}api/v1/package/get-banks-by-currency-code/`, //{currencyCode}
  GET_BANK_BRANCH: `${EXCHANGE_URL}api/v1/package/get-bank-branches/`, //{bankId}
  CONFIRM_OPT_FIAT: `${EXCHANGE_URL}api/v1/package/fiat-withdrawals-confirm-by-otp/`,
  CANCEL_WITHDRAW_FIAT: `${EXCHANGE_URL}api/v1/package/cancel-fiat-withdrawals-request/{accId}/{requestId}/{verifyCode}/{sessionId}`,

  GET_FIAT_WITHDRAW_LOGS: `${EXCHANGE_URL}api/v1/package/get-fiat-withdrawal-logs/`, //{accId}/{pageIndex}/{pageSize}
  GET_FIAT_DEPOSIT_LOGS: `${EXCHANGE_URL}api/v1/package/get-fiat-deposit-logs/`, //{accId}/{pageIndex}/{pageSize}
  CANCEL_FIAT_WITHDRAW: `${EXCHANGE_URL}api/v1/package/cancel-fiat-withdrawals-request/`, //{accId}/{requestId}/{verifyCode}/{sessionId?}
  GET_CUSTOMER_BANK_ACCOUNT: `${EXCHANGE_URL}api/v1/package/get-customer-bank-accounts/{accId}`, //{accId}
  CREATE_FIAT_DEPOSIT_REQUEST: `${EXCHANGE_URL}api/v1/package/create-fiat-deposit-request`,
  GET_FIAT_REQUEST: `${EXCHANGE_URL}api/v1/package/get-fiat-request/{accId}/{id}`,
  ADD_BANK_ACCOUNT: `${EXCHANGE_URL}api/v1/package/add-new-customer-bank-account`,
  CONFIRM_FIAT_DEPOSIT: `${EXCHANGE_URL}api/v1/package/upload-pop`,
  CANCEL_FIAT_DEPOSIT: `${EXCHANGE_URL}api/v1/package/cancel-deposit-request/{id}`,
  GET_CRYPTOS: `${EXCHANGE_URL}api/v1/package/get-cryptos`,
  //Request withdraw
  CREATE_FIAT_WITHDRAW_REQUEST: `${EXCHANGE_URL}api/v1/package/create-fiat-withdrawal-request?callback=http://dev.financex.io/fiat-withdrawals-confirm`,
  COIN_WITHDRAW_REQUEST: `${EXCHANGE_URL}api/v1/package/coin-withdrawals-request`,

  GET_CURENCIES: `${EXCHANGE_URL}api/v1/package/get-currencies`,
  PROMOTION: `${EXCHANGE_URL}api/v1/promotion/apply-promotion`,

  GET_OTP: `${EXCHANGE_URL}api/v1/package/generate-opt/`, //{email}/{feature}/{itemId}

  RESEND_CONFIRM_EMAIL: `${EXCHANGE_URL}api/v1/user/resend-confirm-email`, //{email},

  // NOTIFICATION

  GET_TOP_MAIL_BOX: `${EXCHANGE_URL}api/v1/notifications/get-top/{accId}`,
  GET_BY_ID_MAIL_BOX: `${EXCHANGE_URL}api/v1/notifications/get-by-id/{id}/{accId}`,
  PUSH_CONNECTION_BY_ID_MAIL_BOX: `${EXCHANGE_URL}api/v1/notifications/push-connection-by-user/{accId}/{connectionId}`,
  READ_BY_USER: `${EXCHANGE_URL}api/v1/notifications/read-by-user/{accId}`,
};

export const XWALLET_API = {
  GET_FIAT_DEPOSIT_LOGS: `${EXCHANGE_URL}api/v1/package/get-fiat-deposit-logs/`, //{accId}/{pageIndex}/{pageSize}
  GET_COIN_DEPOSIT_LOG: `${EXCHANGE_URL}api/v1/package/get-coin-deposit-logs/`, //{accId}/{pageIndex}/{pageSize}
  GET_FIAT_WITHDRAW_LOGS: `${EXCHANGE_URL}api/v1/package/get-fiat-withdrawal-logs/`, //{accId}/{pageIndex}/{pageSize}
  GET_COIN_WITHDRAW_LOG: `${EXCHANGE_URL}api/v1/package/get-coin-withdrawals-logs/`, //{accId}/{pageIndex}/{pageSize}
  GET_COIN_BY_TYPE: `${EXCHANGE_URL}api/v1/package/get-coin-by-type/`, //{WalletType}
  GET_SWAP_ORDER_BOOKS: `${EXCHANGE_URL}api/v1/package/get-swap-order-books/`, //{accId}/{pageIndex}/{pageSize}
};
//Socket API
export const SOCKET_URL =
  env === 'dev'
    ? 'http://54.169.221.223:6870/chat-hub/negotiate?userId='
    : 'http://13.229.182.120:8870/chat-hub/negotiate?userId='; //uid is user id response when user login
// export const SOCKET_URL = 'http://dev-market-watch.financex.io/signalrHub?uid=' //uid is user id response when user login
export const SOCKET_EVENT = {
  timeServiceNotifyListener: 'timeServiceNotifyListener',
  priceChangeNotifyListener: 'priceChangeNotifyListener',
  marketWatchListener: 'marketWatchListener',
};
export const APP_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.financex';
