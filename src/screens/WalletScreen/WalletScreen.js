import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet,BackHandler } from 'react-native';
import TopBarWallet from '../../components/TopBarWallet';
import Container from '../../components/Container';
import colors from '../../configs/styles/colors';
import { TextWhite } from '../../components';
import TextSeparators from '../../components/Text/TextSeparators';
import ButtonTypeWallet from '../../components/Button/ButtonTypeWallet';
import I18n from "react-native-i18n";
import { Navigation } from 'react-native-navigation';
import { switchLangTabbar } from '../../navigation/helpers';
import SearchInput from './components/SearchInput';
import CheckBox from 'react-native-check-box'
import ButtonSortSymbol from './components/ButtonSortSymbol';
import LayoutSpaceBetween from '../../components/LayoutSpaceBetween';
import TextFnx from '../../components/Text/TextFnx';
import HeaderWalletScreen from './components/HeaderWalletScreen';
import ListCoin from './components/ListCoin';
import ListFiat from './components/ListFiat';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { pushSingleScreenApp, LOGIN_SCREEN, PASSCODE_SCREEN, PASSCODE_AUTH_SCREEN, TRANSACTION_HISTORY } from '../../navigation';
import { IdNavigation } from '../../configs/constant';
import { hiddenTabbar, listenerEventEmitter, removeEventEmitter, createAction, get, emitEventEmitter, backHandler, resetScreenGlobal } from '../../configs/utils';
import useAppState from 'react-native-appstate-hook';
import { showModal } from '../../navigation/Navigation';
import { useDispatch, useSelector } from "react-redux"
import GuideSetupGG from '../SecurityScreen/GuideSetupGG';
import SignalRService from '../../services/signalr.service';
import { orderBy } from "lodash";
import { GET_ASSET_CRYPTO_WALLETS_SUCCESS, GET_ASSET_FIAT_WALLET_SUCCESS, GET_COIN_BY_TYPE_COIN_SUCCESS, GET_COIN_BY_TYPE_FIATS_SUCCESS } from '../../redux/modules/wallet/actions';
const WalletScreen = ({
    componentId
}) => {
    const logged = useSelector(state=>state.authentication.logged);
    const [i18n, setI18n] = useState(I18n)
    const [isCheck, setCheck] = useState(true);
    const [Timer, setTimer] = useState(60);
    const langGlobal = useSelector(state => state.authentication.lang);
    const isPasscode = useSelector(state => state.authentication.isPasscode);
    const [IsActive, setIsActive] = useState("C");
    const [isSort, setSort] = React.useState(false);
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
    const dispatcher = useDispatch();
    const [HiddenCrypto, setHiddenCrypto] = useState(cryptoWallet.filter((item,index)=>get(item,"available")+get(item,"pending") !== 0));
    const [HiddenFiat, setHiddenFiat] = useState(fiatsWallet.filter((item,index)=>get(item,"available")+get(item,"pending") !== 0));
    const fiatsWalletType = useSelector(state => state.wallet.fiatsWalletType);
    const coinsWalletType = useSelector(state => state.wallet.coinsWalletType);
    useEffect(() => {
        backHandler(()=>resetScreenGlobal())
        switchLangTabbar();
        if (isPasscode && Timer == 60) {
            showModal(PASSCODE_AUTH_SCREEN)
        }
    }, []);
    useEffect(() => {
        let availableZeroCrypto =cryptoWallet.filter((item,index)=>get(item,"available")+get(item,"pending") !== 0);
        let availableZeroFiat =fiatsWallet.filter((item,index)=>get(item,"available")+get(item,"pending") !== 0);
        setHiddenCrypto(availableZeroCrypto)
        setHiddenFiat(availableZeroFiat)
    }, [cryptoWallet,fiatsWallet])
    const { appState } = useAppState({
        onChange: (newAppState) => {

        },
        onForeground: () => console.log('App went to Foreground'),
        onBackground: () => console.log('App went to background'),
    });
    useEffect(() => {
        listenerEventEmitter('timer', (timer) => {
            setTimer(timer - 1);
        })
        if (appState === "background") {
            if (isPasscode && Timer == 60) {
                showModal(PASSCODE_AUTH_SCREEN);
            }
        }
        return () => {
            removeEventEmitter('timer')
        };
    }, [appState, isPasscode]);
    const onSort = (log) => {
        var sortCrypto;
        var sortFiat;
        if(log){
            if (isSort) {
                sortCrypto = orderBy(cryptoWallet, ['currency'], ['asc']);
                sortFiat = orderBy(fiatsWallet,['currency'], ['asc'])
            } else {
                sortCrypto = orderBy(cryptoWallet, ['currency'], ['desc']);
                sortFiat = orderBy(fiatsWallet,['currency'], ['desc'])
            }
            dispatcher(createAction(GET_ASSET_CRYPTO_WALLETS_SUCCESS, sortCrypto))
            dispatcher(createAction(GET_ASSET_FIAT_WALLET_SUCCESS,sortFiat))
        }else{
            if (isSort) {
                sortCrypto = orderBy(coinsWalletType, ['symbol'], ['asc']);
                sortFiat = orderBy(fiatsWalletType,['symbol'], ['asc'])
            } else {
                sortCrypto = orderBy(coinsWalletType, ['symbol'], ['desc']);
                sortFiat = orderBy(fiatsWalletType,['symbol'], ['desc'])
            }
            dispatcher(createAction(GET_COIN_BY_TYPE_COIN_SUCCESS, sortCrypto))
            dispatcher(createAction(GET_COIN_BY_TYPE_FIATS_SUCCESS,sortFiat))
        }
        
        setSort(!isSort);
        emitEventEmitter("checkSort",!isSort)
    }
    
    const onHidden = () => {
        setCheck(!isCheck)
    }
    return (
        <Container
            onClickLeft={() => {}}
            isTopBar={false}
            customTopBar={
                <HeaderWalletScreen componentId={componentId} />
            }
        >
            <SignalRService />
            <View style={stylest.blockTopWallet}>
                <ButtonTypeWallet
                    IsActive={IsActive}
                    onIsActive={(active) => {
                        emitEventEmitter("textSearch","")
                        setIsActive(active)}}
                />
                <SearchInput 
                 />
            </View>
            {logged && <CheckBox
                onClick={onHidden}
                checkBoxColor={colors.green}
                isChecked={isCheck}
                rightText={"HIDE_BALANCE".t()}
            />}
            
            <LayoutSpaceBetween style={stylest.spaceSorting}>
                <ButtonSortSymbol
                    onCheck={()=>onSort(logged)}
                    isCheck={isSort}
                />
                <TextFnx
                    color={colors.description}
                    value={"AVAILABLE".t()} />
            </LayoutSpaceBetween>
            {IsActive === "C" ?
                <ListCoin componentId={componentId} isCheck={isCheck} 
                data={HiddenCrypto} 
                /> :
                <ListFiat componentId={componentId} isCheck={isCheck} data={HiddenFiat} />}

        </Container>
    );
}
const stylest = StyleSheet.create({
    blockTopWallet: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50,
        alignItems: "center"
    },
    spaceSorting: { paddingVertical: 5, }
})
export default WalletScreen;
