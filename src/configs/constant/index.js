export const constant = {
  TYPE_PAYMENT_SCREEN: {
    ADD_BANKING: 'ADD_BANKING',
    ADD_MOMO: 'ADD_MOMO',
    ADD_VIETTEL_PAY: 'ADD_VIETTEL_PAY',
  },
  CODE_PAYMENT_METHOD: {
    MOMO: 'MOMO',
    BANK_TRANSFER:"BANK_TRANSFER"
  },
  TYPE_ICON: {
    FontAwesome: 'FontAwesome',
    AntDesign: 'AntDesign',
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    Foundation: 'Foundation',
    Octicons: 'Octicons',
    Zocial: 'Zocial',
    Entypo: 'Entypo',
    EvilIcons: 'EvilIcons',
    Feather: 'Feather',
    Fontisto: 'Fontisto',
  },
  MAX_OTP: 6,
  STORAGEKEY: {
    AUTH_TOKEN: 'auth_token',
    USER_INFO: 'user_info',
    LANGUAGE: 'language',
    FEE: 'fee',
    CURRENCY: 'currency',
    FAVORITE: 'favorite_pair',
    MARKET_WATCH: 'market_data',
    UNIT_LIST: 'unit',
    FIAT_LIST: 'fiat_list',
    PASSCODE: 'passcode',
  },
  SOCKET_EVENT: {
    TIME_SERVICE_NOTIFY: 'timeServiceNotifyListener',
    PRICE_CHANGE_NOTIFY: 'priceChangeNotifyListener',
    MARKET_WATCH: 'marketWatchListener',
    TOP_SELL: 'topSellListener',
    TOP_BUY: 'topBuyListener',
    MATCH_ORDER: 'matchOrderListener',
    USER_NOTIFY: 'userNotifyListener',
  },
  PAYMENT_STATUS: {
    Open: 1,
    EmailSent: 2,
    Processing: 3,
    Completed: 4,
    Cancelled: 5,
    Rejected: 6,
    Pending: 7,
  },
  TWO_FACTOR_TYPE: {
    EMAIL_2FA: 'Email2FA',
    GG2FA: 'GA2FA',
  },
  LINK: {
    POLICY_EN: 'https://support.financex.io/privacy-policy-2/',
    POLICY_VN: 'https://support.financex.io/chinh-sach-bao-mat/?lang=vi',
  },
  IMAGE: {
    INTERNET_BANKING:
      'https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181112/62120025/internetBanking.jpg',
  },
  SHARE: {
    FACEBOOK:
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffinancex.io%2Fsign-up%3FreferralId',
    TWITTER:
      'https://twitter.com/intent/tweet?text=https://financex.io/sign-up?referralId=L7VVIXGET0',
  },
  SUPPORT: {
    MAIL: 'mailto:support@financex.io',
    FACEBOOK: 'https://www.facebook.com/FinanceX.io/',
    TELEGRAM: 'https://t.me/FinanceX_Vietnam',
  },
  BTC_WITHDRAWAL_LIMIT: 'BTC_WITHDRAWAL_LIMIT',
  STATUS_FUNDS: {
    Open: 1,
    EmailSent: 2,
    Processing: 3,
    Completed: 4,
    Cancelled: 5,
    Rejected: 6,
    Pending: 7,
  },
  GOOGLE_VERSION: '0.0.1',
  APPLE_VESION: '0.0.1',
  OTP_GENERATE_TYPE: {
    FIAT_WITHDRAWAL: 'FIAT_WITHDRAWAL',
    COIN_WITHDRAWAL: 'COIN_WITHDRAWAL',
  },
  EVENTS_DEVICE: {
    traddingMarketWatch: 'traddingMarketWatch',
    listentEvent: 'listentEvent',
    listenReadedMail: 'listenReadedMail',
    listentAmountMail: 'listentAmountMail',
    listenerChangePair: 'listenerChangePair',
    listenerPushDetailBox: 'listenerPushDetailBox',
    listenerLogout: 'listenerLogout',
    listenerGetDataWallet: 'listenerGetDataWallet',
    listenerGetCurrencyList: 'listenerGetCurrencyList',
    listenerStopSocket: 'listenerStopSocket',
    listenerRestartSocket: 'listenerRestartSocket',
    onAPI: 'onAPI',
  },
  NAVIGATE_MAILBOX: {
    TRADE: 'Trade'.toUpperCase(),
    ACCOUNT: 'Account'.toUpperCase(),
    ORDERS: 'Orders'.toUpperCase(),
    HOME: 'Home'.toUpperCase(),
    MARKET_WATCH: 'MarketWatch'.toUpperCase(),
    WALLET: 'Wallet'.toUpperCase(),
    DEPOSIT_COIN: 'DepositCoin'.toUpperCase(),
    DEPOSIT_FIAT: 'DepositFiat'.toUpperCase(),
    WITHDRAW_COIN: 'WithdrawCoin'.toUpperCase(),
    WITHDRAW_FIAT: 'WithdrawFiat'.toUpperCase(),
  },
  NAVIGATE_STACK: {
    TRADE: 'Trade',
    ACCOUNT: 'Account',
    ORDERS: 'Order',
    HOME: 'Home',
    MARKET_WATCH: 'MarketWatchSelect',
    WALLET: 'Wallet',
    DEPOSIT_COIN: 'DepositCoin',
    DEPOSIT_FIAT: 'FiatDeposit',
    WITHDRAW_COIN: 'WithdrawCoin',
    WITHDRAW_FIAT: 'WithdrawCast',
  },
};
export const IdNavigation = {
  Home: {
    Menu: 'Id.homeSwap',
    Login: 'Id.home.login',
  },
  Wallet: {
    menu: 'Id.wallet',
    Login: 'Id.wallet.login',
  },
  Sto: {
    menu: 'Id.Sto',
    Login: 'Id.Sto.loin',
  },
  LiquidSwap: {
    menu: 'Id.LiquidSwap',
    Login: 'Id.LiquidSwap.loin',
  },
  Command: {
    menu: 'Id.Command',
    Login: 'Id.Command.login',
    confirmLogin: 'Id.Command.confirmLogin',
  },
  Auth: {
    confirmLogin: 'Id.Auth.confirmLogin',
    login: 'Id.Auth.login',
  },
  PressIn: {
    historyTransaction: 'Id.PressIn.historyTransaction',
    filterTransaction: 'Id.PressIn.filterTransaction',
    notification: 'Id.PressIn.notification',
    menuLeft: 'Id.PressIn.menuLeft',
    profile: 'Id.PressIn.profile',
  },
};

export const BUY = 'B';
export const SELL = 'S';
export const via = 2;
export const ORDER_TYPE = {
  LIMIT_ORDER: 'LO',
};

export const symbolCoin = [
  {value: 'ETH'},
  {value: 'BCH'},
  {value: 'BTC'},
  {value: 'ETC'},
  {value: 'DTE'},
  {value: 'SET'},
  {value: 'LTC'},
];
export const symbolPair = ['ETH', 'BCH', 'BTC', 'ETC', 'DTE', 'SET', 'LTC'];
export const currency = [{value: 'VND'}, {value: 'IDR'}, {value: 'BTC'}];
export const currPair = ['VND', 'IDR', 'BTC'];
export const spacingApp = 16;
export const BankTransfer = 'BankTransfer';
export const fontSize = {
  f14: 14,
  f18: 18,
  f20: 20,
  f16: 16,
  f12: 12,
};
