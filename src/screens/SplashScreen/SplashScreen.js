import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LayoutSplashScreen, TextWhite } from '../../components';
import icons from '../../configs/icons';
import { pushTabBasedApp, PASSCODE_AUTH_SCREEN } from '../../navigation';
import { useDispatch, useSelector } from 'react-redux'
import { useActionsAuthen } from '../../redux/modules/authentication';
import { LANGUAGES, CHECK_PASSCODE } from '../../redux/modules/authentication/actions';
import i18n from "react-native-i18n"
import { createAction, size, jwtDecode, get, getCurrentDate, getOneMonthAgoDate, isArray } from '../../configs/utils';
import { storageService } from '../../services/storage.service';
import { constant } from '../../configs/constant';
import { showModal } from '../../navigation/Navigation';
import TextFnx from '../../components/Text/TextFnx';
import { useActionsMarket } from '../../redux/modules/market';
import { GET_ASSET_SUMARY, GET_WITHDRAW_COIN_LOG, GET_WITHDRAW_FIAT_LOG, GET_DEPOSIT_COIN_LOG, GET_DEPOSIT_FIAT_LOG, GET_DEPOSIT_BANK_ACCOUNT, GET_COIN_BY_TYPE } from '../../redux/modules/wallet/actions';
import { GET_SWAP_ORDERS_BOOK } from '../../redux/modules/market/actions';

const SplashScreen = () => {
    const lang = useSelector(state => state.authentication.lang);
    const marketWatch = useSelector(state => state.market.marketWatch);
    const logged = useSelector(state => state.authentication.logged);
    const [UserId, setUserId] = useState("");
    const dispatcher = useDispatch();

    useActionsAuthen().handleGetCountries();
    useActionsMarket().handleGetMarketWatch();
    useActionsMarket().handleGetCurrencyList();
    useActionsMarket().handleGetConversion();
    useActionsMarket().handleGetConfigSwap();
    useActionsMarket().handleGetCryptoWallet(UserId);
    useActionsMarket().handleGetFiatWallet(UserId);
    dispatcher(createAction(GET_WITHDRAW_COIN_LOG,{
        UserId,
        pageIndex:1
    }))
    dispatcher(createAction(GET_WITHDRAW_FIAT_LOG,{
        UserId,
        pageIndex:1
    }))
    dispatcher(createAction(GET_DEPOSIT_COIN_LOG,{
        UserId,
        pageIndex:1
    }))
    dispatcher(createAction(GET_DEPOSIT_FIAT_LOG,{
        UserId,
        pageIndex:1
    }))
    dispatcher(createAction(GET_SWAP_ORDERS_BOOK,{
        UserId,
        pageIndex:1,
        pageSize:15,
        fromDate:getOneMonthAgoDate(),
        toDate:getCurrentDate(),
        walletCurrency:"",
        status:""
    }))
    dispatcher(createAction(LANGUAGES, lang));
    if (isArray(marketWatch) && size(marketWatch) > 0 && size(UserId) > 0) {
        dispatcher(createAction(GET_ASSET_SUMARY, {
            UserId,
            marketWatch
        }))
    }
    useEffect(() => {
        i18n.locale = lang;
        const timer = setTimeout(() => {
            pushTabBasedApp();
        }, 1000);
        return () => clearTimeout(timer);
    }, [lang]);
    useEffect(() => {
        jwtDecode().then(user => {
            if(get(user,"id")){
                setUserId(get(user, "id"))
            }
            
        })
        dispatcher(createAction(GET_COIN_BY_TYPE,{
            walletType:1
        }))
        dispatcher(createAction(GET_COIN_BY_TYPE,{
            walletType:2
        }))
        storageService.getItem(constant.STORAGEKEY.PASSCODE).then(passcode => {
            if (size(passcode) > 0) {
                dispatcher(createAction(CHECK_PASSCODE, {
                    is: true
                }))

            } else {
                dispatcher(createAction(CHECK_PASSCODE, {
                    is: false
                }))
            }
        })
        return () => {

        }
    }, [])
    return (
        <LayoutSplashScreen
            isSplashScreen
        >
            <View style={stylest.blockLogoWallet}>
                <Image resizeMode="contain" source={icons.logoXwallet} style={stylest.logoXwallet} />
            </View>
            <View style={stylest.coppyRight}>
                <TextFnx space={5} align="center" value={"© 2018 FinanceX.com. All Rights Reserved"} />
            </View>
        </LayoutSplashScreen>
        // <HistoryTransactions />
    );
}
const stylest = StyleSheet.create({
    coppyRight: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "2%"
    },
    logoXwallet: {
        width: 90,
        height: 90,
    },
    blockLogoWallet: {
        alignItems: "center",
        position: "absolute",
        height: "100%",
        width: "100%",
        paddingTop: "65%",
    }
});
export default SplashScreen;


// 'use strict';

// import React, { Component } from 'react';

// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';

// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera as Camera } from 'react-native-camera';
// class SplashScreen extends Component {
//   onSuccess = (e) => {
//     Linking
//       .openURL(e.data)
//       .catch(err => console.error('An error occured', err));
//   }

//   render() {
//     return (
//       <QRCodeScanner
//         onRead={this.onSuccess}    
//         topContent={
//           <Text style={styles.centerText}>
//             Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
//           </Text>
//         }
//         bottomContent={
//           <TouchableOpacity style={styles.buttonTouchable}>
//             <Text style={styles.buttonText}>OK. Got it!</Text>
//           </TouchableOpacity>
//         }
//       />
//     );
//   }
// }

// const styles = StyleSheet.create({
//   centerText: {
//     flex: 1,
//     fontSize: 18,
//     padding: 32,
//     color: '#777',
//   },
//   textBold: {
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonText: {
//     fontSize: 21,
//     color: 'rgb(0,122,255)',
//   },
//   buttonTouchable: {
//     padding: 16,
//   },
// });
// export default SplashScreen;