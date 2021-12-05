import moment from 'moment';
import { Dimensions, AsyncStorage, Alert } from 'react-native'
import jwt_decode from 'jwt-decode'
import { storageService } from "../services/storage.service";
import { tradeService } from "../services/trade.service";
import { constant } from "./constants";
import { marketService } from "../services/market.service";


export function formatCurrency(n, f = 8) {
    if (n === "undefined" || n === null) return 0;
    if (f > 0) return n.toFixed(f).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    else return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function resizeImageIOS(device) {
    switch (device) {
        case "iPhone 6s Plus":
            return 220
            break;
        case "iPhone 6 Plus":
            return 220
            break;
        case "iPhone 7 Plus":
            return 220
            break;
        case "iPhone 8 Plus":
            return 220
            break;
        case "iPhone 5s":
            return 170
            break;
        case "iPhone 5":
            return 170
            break;
        case "iPhone 4":
            return 170
            break;
        case "iPhone 4s":
            return 170
            break;
        case "iPhone SE":
            return 170
            break;

        default:
            return 200
            break;
    }
}
export const formatSCurrency = (cuList, n = 0, symbol, hasCoin = false) => {

    if (hasCoin) {
        let f = (symbol === null || symbol === undefined || cuList === null || cuList === undefined) ? 8 : getNFormat(cuList, symbol);
        let n2 = (n === null || n === undefined) ? 0 : n;
        return formatCurrency(n2, f);
    } else {
        if (n === "undefined" || n === null) return 0;
        let f = symbol ? getNFormat(cuList, symbol) : 2;
        return formatCurrency(n, f);
    }
}

export const spaceString = (total, str) => {
    for (var i; i <= total; i++) {
        total
    }
}

export const formatFloor = (n: Number) => {
    if (n === "undefined" || n === null) return 0;
    return formatCurrency(Math.floor(n), 0);
}

export const replaceLang = (lang: string) => {
    return lang.replace("-VN", "").replace("-US");
}

export const formatTrunc = (cuList, n, symbol, isCut) => {
    let f = symbol ? getNFormat(cuList, symbol) : 2;
    if (n === "undefined" || n === null) return 0;
    let n0 = n.toString();
    if (n0.indexOf(".") > -1) {
        let pos = n0.indexOf(".");
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
        n0 = formatCurrency(n1.str2Number(), 0) + (f > 0 ? "." + n2 : "") + n3;
        return n0;
    }
    else {
        return formatCurrency(n, 0);
    }
}
export function getDecimal(cuList, unit) {
    console.log(cuList, unit, "unit cuList");
    cuList.map((item, index) => {
        if (item.code == unit) {
            console.log("ok nhe");
            return item
        }
    })
}
export function formatNumberOnChange(cuList, text, unit) {
    if (text) {
        if (text.indexOf('.') === -1) {
            return formatTrunc(cuList, text.str2Number(), unit, true)
        }
        else {
            let f = getNFormat(cuList, unit);
            let strArr = text.split(".");
            if (strArr[1].length > f) {
                return strArr[0] + "." + strArr[1].substr(0, f);
            }
            return text;
        }
    }
    else {
        return ''
    }
}

export function formatNumberCurrency(cuList, text, symbol) {
    let f = symbol ? getNFormat(cuList, symbol) : 2;
    let num = Number(text)
    num = num.toFixed(f)
    let cents = (num - Math.floor(num)).toFixed(f);
    return Math.floor(num).toLocaleString() + '.' + cents.split('.')[1];
}

export function convertDatetime(timeStamp) {
    return moment.unix(timeStamp).format("YYYY-MM-DD HH:mm:ss");
}

export function timeStampToDateFomat(timeStamp, format) {
    return moment.unix(timeStamp).format(format);
}

export function convertDate(timeStamp) {
    return moment.unix(timeStamp).format("MM-DD-YYYY");
}

export function convertTimestampToDatetime(timeStamp) {
    return moment.unix(timeStamp);
}


export function convertTimeStamp(date) {
    return moment(date).format("X");
}

export function convertUTC(date) {
    return moment.utc(date).local().format('DD-MM-YYYY');
}

export function to_UTCDate(date, format) {
    return moment.utc(date).local().format(format);
}

export function to_UTCDate2(date, format) {
    console.log(date, format, "date format");
    return moment(date).format(format);
}


export function get_past_date(number, type, format) {
    return moment().add(number, type).format(format);
}

export const dimensions = {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
}

export async function jwtDecode() {
    let auth = await storageService.getItem(constant.STORAGEKEY.AUTH_TOKEN);
    if (auth) {
        let content = jwt_decode(auth.authToken)
        return content
    }
    return null;
}

export function getPairList(symbols, units) {
    let pairs = [];
    symbols.forEach((symbol) => {
        units.forEach(unit => {
            if (symbol.value != unit.value)
                pairs.push(symbol.value + "-" + unit.value)
        })
    })
    return pairs;
}

export function splitPair(pair, splitChar = '-') {
    let strArr = pair.split(splitChar);
    if (strArr.length > 1) {
        return {
            symbol: strArr[0],
            unit: strArr[1]
        }
    }
    else {
        return {
            symbol: '',
            unit: ''
        }
    }
}

export function formatSolution(solution) {
    switch (solution) {
        case "1":
            return solution + " " + "MINUTE".t();
        case "5":
        case "15":
        case "30":
            return solution + " " + "MINUTES".t();
        case "60":
            return solution / 60 + " " + "HOUR".t();
        case "120":
        case "240":
            return solution / 60 + " " + "HOURS".t();
        case 'D':
            return "1 " + " " + "DAY".t();
        case 'W':
            return "1" + " " + "WEEK".t();
        case 'M':
            return "1" + " " + "MONTH".t();
        default:
            return "1" + " " + "MINUTES".t()
    }
}

export function convertToUSD(symbol, currencyConversion, curList, price) {
    let usd = 0;
    let tradingCurrency = 'USD';

    currencyConversion.forEach(e => {
        //console.log(e.conversionFrom + "-" + e.conversionTo + ": " + e.conversionRatio + "/" + price);
        if (e.conversionFrom === symbol && e.conversionTo === tradingCurrency) {
            usd = formatTrunc(curList, e.conversionRatio * price, tradingCurrency)
            return usd
        }
        else if (e.conversionFrom === tradingCurrency && e.conversionTo === symbol) {
            usd = formatTrunc(curList, (1 / e.conversionRatio) * price, tradingCurrency)
            return usd
        }
    })
    return usd;
}

export function convertToCurr(symbol, currencyConversion, curList, totalAmount, curr) {
    let _curr = 0;
    let tradingCurrency = curr;
    currencyConversion.forEach(e => {
        if (e.conversionFrom === symbol && e.conversionTo === tradingCurrency) {
            _curr = e.conversionRatio * totalAmount
            return _curr
        }
        else if (e.conversionFrom === tradingCurrency && e.conversionTo === symbol) {
            _curr = 1 / e.conversionRatio * totalAmount
            return _curr
        }
    })
    return _curr;
}

export function fillTopOrder(fromData, toData, symbol, unit) {
    let fromCount = fromData.length;
    let toCount = toData.length;
    for (let i = 0; i < toCount; i++) {
        let existed = false;
        if (toData[i].paymentUnit === unit && toData.symbol === symbol && toData.index <= 10) {
            for (let j = 0; j < fromCount; j++) {
                if (toData[i].index && fromData[j].index) {
                    if (toData[i].index === fromData[j].index && fromData[j].symbol === symbol && fromData[j].paymentUnit === unit) {
                        existed = true;
                        if (toData[i].qtty == 0 && toData[i].amount == 0) {
                            fromData.splice(j, 1);
                        }
                        else {
                            Object.assign(fromData[j], {}, toData[i]);
                        }
                    }
                }
            }
            if (!existed) {
                fromData.push(toData[i]);
            }
        }
    }
    if (fromData.length > 10) {
        fromData = fromData.filter(o => o.index <= 10);
    }
    return fromData;
}

export const getNFormat = (currencyList, symbol) => {
    if (currencyList.length > 0) {
        let dt = currencyList.filter(o => o.code === symbol);
        if (dt.length > 0) {
            return dt[0].decimalFormat;
        }
        else {
            return 0;
        }
    }
    else {
        return 0;
    }
}

export function base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function formatMessageByArray(message, array) {
    console.log(message, "message inside");
    if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            message = message.replace(`{${i}}`, array[i]);
        }
    }
    return message;
}

export function alertError(errorText, callback) {
    Alert.alert(
        "WARNING".t(),
        errorText,
        [
            {
                text: 'CLOSE'.t(),
                style: 'cancel',
            },
            { cancelable: true },
        ],
    )
    if (callback) {
        callback();
    }
}

export function checkDimension(width) {
    if (width > 320) {
        return { fontSize: 14 }
    } else {
        return { fontSize: 12 }
    }
}
