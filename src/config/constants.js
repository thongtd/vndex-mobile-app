export  const constant = {
    MAX_OTP:6,
    STORAGEKEY:{
        AUTH_TOKEN:"auth_token",
        USER_INFO:"user_info",
        LANGUAGE:"language",
        FEE: 'fee',
        CURRENCY:"currency",
        FAVORITE:"favorite_pair",
        MARKET_WATCH: "market_data",
        UNIT_LIST:"unit",
        FIAT_LIST:'fiat_list'
    },
    SOCKET_EVENT:{
        TIME_SERVICE_NOTIFY:"timeServiceNotifyListener",
        PRICE_CHANGE_NOTIFY: "priceChangeNotifyListener",
        MARKET_WATCH: "marketWatchListener",
        TOP_SELL: "topSellListener",
        TOP_BUY: "topBuyListener",
        MATCH_ORDER: "matchOrderListener",
        USER_NOTIFY:"userNotifyListener"
    },
    PAYMENT_STATUS:{
        Open : 1,
        EmailSent : 2,
        Processing : 3,
        Completed : 4,
        Cancelled : 5,
        Rejected : 6,
        Pending : 7
    },
    TWO_FACTOR_TYPE:{
        EMAIL_2FA: "Email2FA",
        GG2FA: "GA2FA"
    },
    LINK:{
        POLICY_EN:"https://support.financex.io/privacy-policy-2/",
        POLICY_VN:"https://support.financex.io/chinh-sach-bao-mat/?lang=vi",
    },
    IMAGE: {
        INTERNET_BANKING: "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181112/62120025/internetBanking.jpg"
    },
    SHARE: {
        FACEBOOK: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffinancex.io%2Fsign-up%3FreferralId",
        TWITTER: "https://twitter.com/intent/tweet?text=https://financex.io/sign-up?referralId=L7VVIXGET0"
    },
    SUPPORT: {
        MAIL: 'mailto:support@financex.io',
        FACEBOOK: 'https://www.facebook.com/FinanceX.io/',
        TELEGRAM: 'https://t.me/FinanceX_Vietnam'
    },
    BTC_WITHDRAWAL_LIMIT: "BTC_WITHDRAWAL_LIMIT",
    STATUS_FUNDS: {
        Open : 1,
        EmailSent : 2,
        Processing : 3,
        Completed : 4,
        Cancelled : 5,
        Rejected : 6,
        Pending : 7
    },
    GOOGLE_VERSION: '1.1.2',
    APPLE_VESION: '1.1.2',
    OTP_GENERATE_TYPE:{
        FIAT_WITHDRAWAL: "FIAT_WITHDRAWAL",
        COIN_WITHDRAWAL:"COIN_WITHDRAWAL"
    },
    EVENTS_DEVICE:{
        traddingMarketWatch:"traddingMarketWatch",
        
    }
}

export const BUY = 'B';
export const SELL = 'S';
export const via = 2;
export const ORDER_TYPE = {
    LIMIT_ORDER: 'LO'
}

export const symbolCoin = [{value: 'ETH'}, {value: 'BCH'}, {value: 'BTC'}, {value: 'ETC'}, {value: 'DTE'}, {value: 'SET'}, {value: 'LTC'}];
export const symbolPair = ['ETH', 'BCH', 'BTC', 'ETC', 'DTE', 'SET', 'LTC'];
export const currency = [{value: 'VND'}, {value: 'IDR'}, {value: 'BTC'}];
export const currPair = ['VND', 'IDR', 'BTC'];

