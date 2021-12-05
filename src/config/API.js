
const env = "live"
// const MARKET_WATCH_URL = 'http://54.169.27.91:6873/';


const MARKET_WATCH_URL = env === "dev" ? 'http://54.169.27.91:6873/' : 'https://market-watch.financex.io/';

export const MARKET_API = {
    GET_MARKET_WATCH: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-watch`, //GET
    ORDER_BOOK: `${MARKET_WATCH_URL}api/v1/market-watch/get-top-price-by-pair`, //GET
    GET_TRADE_HISTORIES: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-trade-histories`, //GET
}

//chart endpoint
// const CHART_DEV_URL = 'https://market-watch.financex.io/';
const CHART_DEV_URL = 'https://market-watch.financex.io/';
const CHART_URL = 'https://financex.io/';
export const CHART_TEST = 'https://client-chart.financex.io/';

export const CHART_API = {
    GLOBAL_CONFIG: `${CHART_URL}api/chart/config`,
    CONFIG_BY_SYMBOL: `${CHART_URL}api/chart/symbols`,//GET
    //TRADE_HISTORIES: `${CHART_URL}api/chart/history?symbol=`,//GET: api/chart/history?symbol=?&resolution=?&from=?&to=?
    TRADE_HISTORIES: `${CHART_URL}api/chart/history`,
    GET_SERVER_TIME: `${CHART_URL}api/chart/time`,//GET
    DEPTH_CHART: `${CHART_DEV_URL}api/v1/market-watch/depth` //GET: http://dev-market-watch.financex.io/api/v1/market-watch/depth/{symbol}/{paymentUnit}/{top}`,

}

//Exchange
const EXCHANGE_URL = env === "dev" ? 'http://dev-api.financex.io/' : 'https://api.financex.io/';
// const EXCHANGE_URL = 'http://dev-api.financex.io/';
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
    SETUP_USE_FNX_FOR_FEE:`${EXCHANGE_URL}api/v1/user/setup-use-fnx-for-fee/`, // {accId}/{true}
    GET_EXCHANGE_TOKEN_DISCOUNT_FEE:`${EXCHANGE_URL}api/v1/package/get-exchange-token-discount-fee`, 
    

    //API for trade
    CREATE_NEW_ORDER: `${EXCHANGE_URL}api/v1/trade/create-new-order`, //POST + Authen: coinSymbol, paymentUnit, quantity, price, orderType, side, customerEmail, accId, via
    CANCEL_ORDER: `${EXCHANGE_URL}api/v1/trade/cancel-orders`, //POST + Authen: accId, orderIds
    GET_ORDER_BOOKS: `${EXCHANGE_URL}api/v1/trade/get-order-books`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
    GET_OPEN_ORDER: `${EXCHANGE_URL}api/v1/trade/get-open-order`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
    GET_RECENT_ORDER: `${MARKET_WATCH_URL}api/v1/market-watch/get-market-trade-histories/{symbol}/{paymentUnit}/{top}`, //POST + Authen: accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
    GET_CURRENCY_CONVERSION: `${EXCHANGE_URL}api/v1/package/get-currency-conversions`,
    GET_TRANS_FEE: `${EXCHANGE_URL}api/v1/trade/get-trans-fee/`, //{customerTypeId}/null
    GET_ORDER_DETAIL: `${EXCHANGE_URL}api/v1/trade/get-match-order-details/{orderId}`,
    GET_BUY_SELL_NEW_BY_PAIR:`${EXCHANGE_URL}api/v1/trade/get-buy-sell-now-by-pair/{symbol}/{paymentUnit}`,

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

    //Request withdraw
    CREATE_FIAT_WITHDRAW_REQUEST: `${EXCHANGE_URL}api/v1/package/create-fiat-withdrawal-request?callback=http://dev.financex.io/fiat-withdrawals-confirm`,
    COIN_WITHDRAW_REQUEST: `${EXCHANGE_URL}api/v1/package/coin-withdrawals-request`,

    GET_CURENCIES: `${EXCHANGE_URL}api/v1/package/get-currencies`,
    PROMOTION: `${EXCHANGE_URL}api/v1/promotion/apply-promotion`,

    GET_OTP: `${EXCHANGE_URL}api/v1/package/generate-opt/`, //{email}/{feature}/{itemId}

    RESEND_CONFIRM_EMAIL: `${EXCHANGE_URL}api/v1/user/resend-confirm-email/`, //{email},
}

//Socket API
export const SOCKET_URL = env === "dev" ? 'https://dev-market-watch.financex.io/signalrHub?uid=' : 'https://market-watch.financex.io/signalrHub?uid=' //uid is user id response when user login
// export const SOCKET_URL = 'http://dev-market-watch.financex.io/signalrHub?uid=' //uid is user id response when user login
export const SOCKET_EVENT = {
    timeServiceNotifyListener: 'timeServiceNotifyListener',
    priceChangeNotifyListener: 'priceChangeNotifyListener',
    marketWatchListener: 'marketWatchListener',
}
export const APP_STORE_URL = "https://play.google.com/store/apps/details?id=com.financex"