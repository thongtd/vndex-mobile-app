import ReactNative, {
  DeviceEventEmitter,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import {_t} from '../../i18n/i18n';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import {Navigation} from 'react-native-navigation';
import {ALERT_NOTICE_PASSWORD} from '../../navigation';
import jwt_decode from 'jwt-decode';
import {useSelector} from 'react-redux';
import {authService} from '../../services/authentication.service';
import {IdNavigation, constant} from '../constant';
import {storageService} from '../../services/storage.service';
import {hasNotch} from 'react-native-device-info';
import {useMemo} from 'react';
import moment from 'moment';
import ItemList from '../../components/Item/ItemList';
import Layout from '../../components/Layout/Layout';
import Image from '../../components/Image/Image';
import TextFnx from '../../components/Text/TextFnx';
import React from 'react';
import colors from '../styles/colors';

export const fullWidth = ReactNative.Dimensions.get('window').width;
export const fullHeight = ReactNative.Dimensions.get('window').height;
export const checkFullHeight = hasNotch
  ? fullHeight - 60
  : isAndroid() && StatusBar.currentHeight > 24
  ? fullHeight - 50
  : fullHeight;
export const isArray = arr => {
  return _.isArray(arr);
};
var screenCurrent = '';
export const isSameScreen = screen => {
  if (screen != screenCurrent) {
    screenCurrent = screen;
    return false;
  } else {
    return true;
  }
};
export const resetScreenGlobal = () => {
  screenCurrent = '';
};
export const backHandler = cb => {
  return BackHandler.addEventListener('hardwareBackPress', e => cb(e));
};
export const removeBackHandler = () => {
  return BackHandler.removeEventListener('hardwareBackPress');
};
export function convertUTC(date) {
  return moment.utc(date).local().format('DD-MM-YYYY');
}


export const checkPlaceHolder = boo => {
  if (!boo) {
    return true;
  } else {
    return false;
  }
};
export const getInfoCoinFull = (cryptosWallet, currency) => {
  if (isArray(cryptosWallet) && size(cryptosWallet) > 0) {
    let infoCoin = cryptosWallet.filter(
      (item, index) => get(item, 'symbol') == currency,
    );
    if (isArray(infoCoin) && size(infoCoin) > 0) {
      return infoCoin[0];
    }
  }
};
export function convertToUSD(symbol, currencyConversion, curList, price) {
  let usd = 0;
  let tradingCurrency = 'USDT';
  currencyConversion.forEach(e => {
    if (e.conversionFrom === symbol && e.conversionTo === tradingCurrency) {
      usd = formatTrunc(curList, e.conversionRatio * price, tradingCurrency);
      return usd;
    } else if (
      e.conversionFrom === tradingCurrency &&
      e.conversionTo === symbol
    ) {
      usd = formatTrunc(
        curList,
        (1 / e.conversionRatio) * price,
        tradingCurrency,
      );
      return usd;
    }
  });
  return usd;
}

export const getCurrentDate = isShow => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = isShow ? `${dd}-${mm}-${yyyy}` : `${yyyy}-${mm}-${dd}`;
  return today;
};

export function to_UTCDate(date, format) {
  return moment.utc(date).local().format(format);
}
export function getMarketWatchByCurrency(
  marketWatch,
  currency,
  paymentUnit = 'VND',
) {
  if (isArray(marketWatch) && size(marketWatch) > 0) {
    let getCurrency = marketWatch.filter(
      (item, index) => get(item, 'pair') == `${currency}-${paymentUnit}`,
    );
    if (isArray(getCurrency) && size(getCurrency) > 0) {
      return getCurrency[0];
    }
  }
}
export const getOneMonthAgoDate = isShow => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = isShow
    ? `${dd}-${mm == '01' ? 12 : mm - 1}-${mm == '01' ? yyyy - 1 : yyyy}`
    : `${mm == '01' ? yyyy - 1 : yyyy}-${mm == '01' ? 12 : mm - 1}-${dd}`;
  return today;
};
export function formatNumberOnChange(cuList, text, unit) {
  var num = text;
  if (num) {
    if (text.toString().split('.').length > 1) {
      num = text.toString().split('.')[0] + '.' + text.toString().split('.')[1];
    }
    if (num.indexOf('.') === -1) {
      return formatTrunc(cuList, num.str2Number(), unit, true);
    } else {
      let f = getNFormat(cuList, unit);
      let strArr = num.split('.');
      if (strArr[1].length > f) {
        return strArr[0] + '.' + strArr[1].substr(0, f);
      }
      return num;
    }
  } else {
    return '0';
  }
}

export const getNFormat = (currencyList, symbol) => {
  if (currencyList.length > 0) {
    let dt = currencyList.filter(o => o.code === symbol);
    if (dt.length > 0) {
      return dt[0].decimalFormat;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const formatTrunc = (cuList, n, symbol, isCut) => {
  let f = symbol ? getNFormat(cuList, symbol) : 2;

  if (n === 'undefined' || n === null) return 0;
  let n0 = n.toString();
  if (n0.indexOf('.') > -1) {
    let pos = n0.indexOf('.');
    let n1 = n0.substr(0, pos);
    let n2 = n0.substr(pos + 1, f);

    let zeroLength = f - n2.length;
    let n3 = '';
    if (!isCut) {
      if (zeroLength > 0) {
        for (let i = 0; i < zeroLength; i++) {
          n3 += '0';
        }
      }
    }
    n0 = formatCurrencyFnx(n1.str2Number(), 0) + (f > 0 ? '.' + n2 : '') + n3;
    // symbol === "BCH" && console.log(f,symbol,n0,pos,n1,n2,n0,"f,symbol,n0,pos,n1,n2,n0")
    return n0;
  } else {
    return formatCurrencyFnx(n, 0);
  }
};
export const formatSCurrency = (cuList, n = 0, symbol, hasCoin = false) => {
  if (hasCoin) {
    let f =
      symbol === null ||
      symbol === undefined ||
      cuList === null ||
      cuList === undefined
        ? 8
        : getNFormat(cuList, symbol);
    let n2 = n === null || n === undefined ? 0 : n;
    return formatCurrencyFnx(n2, f);
  } else {
    if (n === undefined || n === 'undefined' || n === null || n === 0)
      return '0';

    let f = symbol ? getNFormat(cuList, symbol) : 2;
    return formatCurrencyFnx(n, f);
  }
};

export function formatCurrencyFnx(n, f = 8) {
  if (n === 'undefined' || n === null || n === '' || n === undefined) return 0;

  if (f > 0) return n.toFixed(f).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  else return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const checkLang = lang => {
  if (lang === 'vi-VN' || lang === 'vi') {
    return 'vi-VN';
  } else if (lang === 'en-US' || lang === 'en') {
    return 'en-US';
  }
};
export const subString = (string, length = 6) => {
  return string.substring(0, length);
};
export const getDecimal = (symbol, currencyList) => {
  if (isArray(currencyList) && size(currencyList) > 0) {
    let currencyFilter = currencyList.filter(
      (item, index) => get(item, 'code') == symbol,
    );
    if (size(currencyFilter) > 0) {
      return get(currencyFilter[0], 'decimalFormat');
    }
  }
};
function truncate(num, places) {
  let strNumber = num && num.toString();
  let positionDot = strNumber && strNumber.indexOf('.');
  if (positionDot !== -1) {
    let numSecond =
      strNumber && strNumber.substring(positionDot + 1, size(strNumber));
    if (size(numSecond) < places) {
      let result = num.toFixed(places);
      return result;
    } else {
      return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
    }
  }
  if (num !== undefined && num !== null) {
    return num.toFixed(places);
  }
}

export function convertToCurr(symbol, currencyConversion, totalAmount, curr) {
  let _curr = 0;
  let tradingCurrency = curr;
  currencyConversion.forEach(e => {
    if (e.conversionFrom === symbol && e.conversionTo === tradingCurrency) {
      _curr = e.conversionRatio * totalAmount;
      return _curr;
    } else if (
      e.conversionFrom === tradingCurrency &&
      e.conversionTo === symbol
    ) {
      _curr = (1 / e.conversionRatio) * totalAmount;
      return _curr;
    }
  });
  return _curr;
}

export const formatCurrency = (price, code, currencyList) => {
  let decimal = getDecimal(code, currencyList);
  return thousandsSeparators(truncate(price, decimal));
};
export function thousandsSeparators(x) {
  let strNumber = x.toString();
  let positionDot = strNumber.indexOf('.');
  if (positionDot !== -1) {
    let numFirst = strNumber
      .substring(0, positionDot)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let numSecond = strNumber.substring(positionDot, size(strNumber));
    let result = numFirst.concat(numSecond);
    return result;
  }
  return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const setTokenAndUserInfo = res => {
  storageService
    .setItem(constant.STORAGEKEY.AUTH_TOKEN, get(res, 'data.token'))
    .then(() => {});
  storageService
    .setItem(constant.STORAGEKEY.USER_INFO, get(res, 'data.identityUser'))
    .then(() => {});
};
export const getUserInfo = async () => {
  return await storageService.getItem(constant.STORAGEKEY.USER_INFO);
};
export const setUserInfo = async data => {
  return await storageService.setItem(constant.STORAGEKEY.USER_INFO, data);
};
export const removeTokenAndUserInfo = () => {
  storageService.removeItem(constant.STORAGEKEY.AUTH_TOKEN);
  storageService.removeItem(constant.STORAGEKEY.USER_INFO);
};

export function checkIndexSetting(x) {
  let index;
  switch (x) {
    case IdNavigation.Setting.menu:
      index = 3;
      break;
    case IdNavigation.Dapp.menu:
      index = 2;
      break;
    case IdNavigation.Swap.menu:
      index = 1;
      break;
    case IdNavigation.Wallet.menu:
      index = 0;
      break;
  }
  return index;
}

export function isAndroid() {
  return Platform.OS === 'android' ? true : false;
}
export function isIos() {
  return Platform.OS === 'ios' ? true : false;
}

export const listenerEventEmitter = (listener, cb) => {
  return DeviceEventEmitter.addListener(listener, data => cb(data));
};

export const removeEventEmitter = listener => {
  return DeviceEventEmitter.removeListener(listener);
};

export const emitEventEmitter = (listener, params) => {
  return DeviceEventEmitter.emit(listener, params);
};

export const jwtDecode = async () => {
  try {
    let auth = await authService.getToken();
    if (get(auth, 'authToken')) {
      let content = jwt_decode(get(auth, 'authToken'));
      return content;
    }
    return null;
  } catch (error) {
    authService.removeToken();
  }
};

export function formatMessageByArray(message, array) {
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i++) {
      message = message.replace(`{${i}}`, array[i]);
    }
  }
  return message;
}

export const _validateAuth = (
  password,
  rePassword,
  verifyCode,
  isVerifyCode = false,
) => {
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/g;
  if (!password) {
    toast('Please enter Password'.t());
    return false;
  } else if (!rePassword) {
    toast('Please enter RePassword'.t());
    return false;
  } else if (!passRegex.test(password)) {
    Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
    return false;
  } else if (password !== rePassword) {
    toast('PASSWORD_NOT_MATCH'.t());
    return false;
  } else if (isVerifyCode && !verifyCode) {
    toast('Please enter your OTP'.t());
  }

  return true;
};
export function toast(val = '') {
  return Toast.showWithGravity(val, Toast.LONG, Toast.CENTER);
}
export function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export function get(obj, val) {
  return _.get(obj, val);
}
export function set(obj, path, val) {
  return _.set(obj, path, val);
}
export function size(val) {
  return _.size(val);
}

export function blockCharSpecical(val) {
  return val.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

export function createAction(type = '', payload = null) {
  if (payload) {
    return {type, payload};
  } else {
    return {type};
  }
}

export function checkStatusPlatform(ios, android) {
  if (ReactNative.Platform.OS === 'ios') {
    return ios;
  } else {
    return android;
  }
}
export function hiddenTabbarShowHeader(title) {
  return {
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
    statusBar: {
      backgroundColor: 'transparent',
      drawBehind: true,
      visible: true,
    },
    topBar: {
      visible: true,
      drawBehind: true,
      backButton: {
        visible: true,
        showTitle: false,
      },
      title: {
        text: title,
        color: colors.text,
      },
      background: {
        color: colors.red,
      },
    },
  };
}
export function hiddenTabbar() {
  return {
    animations: {
      setRoot: {
        waitForRender: true,
      },
      push: {
        waitForRender: true,
      },
      showModal: {
        waitForRender: true,
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
    statusBar: {
      backgroundColor: 'transparent',
      drawBehind: true,
      visible: true,
    },
  };
}
export function hiddenModal(nameScreen, props, isHiddenLayout = true) {
  if (isHiddenLayout) {
    return {
      component: {
        name: nameScreen,
        passProps: props,
        options: {
          layout: {backgroundColor: 'transparent',componentBackgroundColor: 'transparent'},
          screenBackgroundColor: 'transparent',
          modalPresentationStyle: 'overCurrentContext',
          topBar: {
              visible: false,
              animate: true,
          },
          statusBar: {
            backgroundColor: 'transparent',
            drawBehind: true,
            visible: true,
          },
        },
      },
    };
  } else {
    return {
      component: {
        name: nameScreen,
        passProps: props,
        options: {
          statusBar: {
            backgroundColor: 'transparent',
            drawBehind: true,
            visible: true,
          },
        },
      },
    };
  }
}

export const CheckColorStatus = (value, type) => {
  if (value === undefined) return colors.green;
  switch (value && value.toUpperCase()) {
    case 'Rejected'.t().toUpperCase():
      return colors.red;
    case 'Completed'.t().toUpperCase():
      return colors.green;
    case 'Email Sent'.t().toUpperCase():
      return colors.text;
    case 'Cancelled'.t().toUpperCase():
      return colors.red;
    case 'Processing'.t().toUpperCase():
      return type === 'W' ? colors.green : colors.yellow;
    default:
      return colors.text;
  }
};

export const CheckStepStatus = value => {
  switch (value && value.toUpperCase()) {
    case 'rejected'.toUpperCase():
      return 3;
    case 'completed'.toUpperCase():
      return 3;
    case 'Email Sent'.toUpperCase():
      return 2;
    case 'Cancelled'.toUpperCase():
      return 3;
    case 'Processing'.toUpperCase():
      return 3;
    default:
      return 3;
  }
};
export const CheckContentStatus = value => {
  switch (value) {
    case constant.STATUS_FUNDS.Rejected:
      return 'WITHDRAWALS_REJECT_MESSAGE'.t();
    case constant.STATUS_FUNDS.Completed:
      return 'WITHDRAWAL_SUCCESS'.t();
    case constant.STATUS_FUNDS.Cancelled:
      return 'WITHDRAWAL_CANCEL'.t();
    case constant.STATUS_FUNDS.Processing:
      return 'your withdraw order is being processed'.t();
    default:
      return 'your withdraw order is being processed'.t();
  }
};
export const CheckDisableStatus = value => {
  switch (value) {
    case constant.STATUS_FUNDS.Rejected:
      return true;
    case constant.STATUS_FUNDS.Completed:
      return true;
    case constant.STATUS_FUNDS.Cancelled:
      return true;
    case constant.STATUS_FUNDS.Processing:
      return true;
    default:
      return false;
  }
};

export const getPropsData = (
  data,
  image,
  value,
  Active,
  cb,
  isCustom = true,
) => {
  return {
    data: [...data],
    renderItem: ({item, key}) => {
      return (
        <ItemList
          customView={
            isCustom ? (
              <Layout>
                <Image
                  source={{
                    uri: get(item, image),
                  }}
                  style={{width: 17, height: 17}}
                />
                <TextFnx
                  isDart
                  weight={'500'}
                  value={`  ${get(item, value)}`}
                />
              </Layout>
            ) : (
              false
            )
          }
          onPress={() => cb(item)}
          value={get(item, value)}
          checked={get(item, value) === Active}
        />
      );
    },
    keywords: [value],
  };
};

String.prototype.t = function () {
  let str: String = _t(this);
  if (str) {
    str = str.replace('[missing "vi-VN.', '');
    str = str.replace('[missing "en-US.', '');
    str = str.replace('" translation]', '');
    return str;
  }
};
String.prototype.str2Number = function () {
  let target = this;
  return Number(target ? target.replace(new RegExp(',', 'g'), '') : '0');
};
