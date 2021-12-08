import React, { memo, useState, useEffect } from 'react';
import { Text, View, Devi } from 'react-native';
import Container from '../../components/Container';
import { useDispatch, useSelector } from "react-redux"
import BlockSwap from './components/BlockSwap';
import icons from '../../configs/icons';
import Layout from '../../components/Layout/Layout';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';
import Button from '../../components/Button/Button';
import NoteImportant from '../../components/Text/NoteImportant';
import { pushSingleScreenApp, SWAP_CONFIRM_SCREEN, PICKER_SEARCH, SWAP_SCREEN, LOGIN_SCREEN, HISTORY_SWAP_SCREEN } from '../../navigation';
import { showModal, dismissAllModal } from '../../navigation/Navigation';
import ItemList from '../../components/Item/ItemList';
import { get, formatCurrency, thousandsSeparators, formatNumberOnChange, formatSCurrency, formatTrunc, toast, createAction, jwtDecode, listenerEventEmitter, removeEventEmitter } from '../../configs/utils';
import { orderBy, uniqBy } from "lodash"
import Icon from '../../components/Icon';
import TextFnx from '../../components/Text/TextFnx';
import useAppState from 'react-native-appstate-hook';
import Image from '../../components/Image/Image';
import _, { isArray, size } from "lodash"
import colors from '../../configs/styles/colors';
import { GET_MARKET_WATCH, GET_SWAP, GET_CRYPTO_WALLET, GET_FIAT_WALLET } from '../../redux/modules/market/actions';
import HistorySwapScreen from './childrensScreens/HistorySwapScreen';
import { marketService } from '../../services/market.service';

const SwapScreen = memo(({
    componentId,
}) => {
    const logged = useSelector(state => state.authentication.logged);
    // const marketWatch = useSelector(state => state.market.marketWatch);
    const [marketWatch, setMarketWatch] = useState([]);
    const currencyList = useSelector(state => state.market.currencyList);
    const langGlobal = useSelector(state => state.authentication.lang);
    const fiatWallet = useSelector(state => state.market.fiatWallet);
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const swapConfig = useSelector(state => state.market.swapConfig);
    const pairs = get(swapConfig, "pairs");
    const [ActivePair, setActivePair] = useState(getPairDefault(pairs));
    const [NameCoinGet, setNameCoinGet] = useState(get(ActivePair, "paymentUnit"));
    const [NameCoinPay, setNameCoinPay] = useState(get(ActivePair, "symbol"));
    const [Listget, setListget] = useState(getListYouGet(pairs, get(ActivePair, "symbol")));
    const [ListPay, setListPay] = useState(pairs);
    const [IconPay, setIconPay] = useState(get(ActivePair, "coinImage"));
    const [IconGet, setIconGet] = useState(get(ActivePair, "paymentImage"));
    const [IsSwitch, setIsSwitch] = useState(false);
    const [ValuePay, setValuePay] = useState("0");
    const [ValueGet, setValueGet] = useState("0");
    const [PairMarketWatch, setPairMarketWatch] = useState(getPairMarketWatch(marketWatch, `${NameCoinPay}-${NameCoinGet}`))
    const priceCaculator = (get(PairMarketWatch, "price") * get(swapConfig, "percentWithLastestPrice")) / 100;
    const availablePay = getAvailable(cryptoWallet, "symbol", NameCoinPay, currencyList);
    const availableGet = getAvailable(fiatWallet, "currency", NameCoinGet, currencyList);
    const swapBuy = get(PairMarketWatch, "price") + priceCaculator;
    const swapSell = get(PairMarketWatch, "price") - priceCaculator;
    
    const [Disabled, setDisabled] = useState(false)
    const [Refreshing, setRefreshing] = useState(false);
    const dispatcher = useDispatch();
    const { appState } = useAppState({
        onChange: (newAppState) => {
        },
        onForeground: () => console.log('App went to Foreground'),
        onBackground: () => console.log('App went to background'),
    });
    const getSwapTickers = () => {
        marketService.getSwapTickers().then(res => {
            if (isArray(res) && size(res) > 0) {
                setMarketWatch(res);
            }
        });
    }
    useEffect(() => {
        if (appState === "background") {
            if (logged) {
                jwtDecode().then(user => {
                    let userId = get(user, "id");
                    if (userId) {
                        dispatcher(createAction(GET_MARKET_WATCH));
                        // dispatcher(createAction(GET_SWAP));
                        dispatcher(createAction(GET_CRYPTO_WALLET, userId));
                        dispatcher(createAction(GET_FIAT_WALLET, userId))
                    }
                })
            }
            setPairMarket(marketWatch, NameCoinPay, NameCoinGet);
        }
    }, [logged, appState, marketWatch, NameCoinPay, NameCoinGet])
    useEffect(() => {
        setActivePair(getPairDefault(pairs));
        setListPay(pairs);
        let pair = getPairDefault(pairs);
        setNameCoinPay(get(pair, "symbol"));
        setIconPay(get(pair, "coinImage"));
        setListget(getListYouGet(pairs, get(pair, "symbol")))
        setNameCoinGet(get(pair, "paymentUnit"));
        setIconGet(get(pair, "paymentImage"));

        return () => {

        };
    }, [pairs])

    useEffect(() => {
        setPairMarket(marketWatch, NameCoinPay, NameCoinGet);
        return () => {

        };
    }, [marketWatch,NameCoinPay, NameCoinGet])
    useEffect(() => {
        getSwapTickers();
        listenerEventEmitter("doneSwap", () => setRefreshing(false));
        listenerEventEmitter("successSwap", () => {
            onRefresh(false);
        })
        return () => {
            removeEventEmitter("doneSwap");
            removeEventEmitter("successSwap")
        };
    }, [])
    const setPairMarket = (marketWatch, NameCoinPay, NameCoinGet) => {
        let pair = { ...getPairMarketWatch(marketWatch, `${NameCoinPay}-${NameCoinGet}`) };
        
        setPairMarketWatch(pair);
    }
    useEffect(() => {

        let sell = get(PairMarketWatch, "price") - priceCaculator;
        let buy = get(PairMarketWatch, "price") + priceCaculator;
        if (!IsSwitch) {
            if (_.isArray(currencyList) && size(currencyList) > 0 && size(marketWatch) > 0 && isArray(marketWatch)) {
                setValueGet(formatTrunc(currencyList, ValuePay.str2Number() * sell, NameCoinGet));
            }

        } else {
            let amountBuy = Math.trunc(ValuePay.str2Number()) / Math.trunc(swapBuy);
            setValueGet(formatSCurrency(currencyList, amountBuy, NameCoinPay));
        }
    }, [PairMarketWatch])
    const onSelectPay = () => {
        let data = orderBy(uniqBy(ListPay, 'symbol'), ['symbol'], ['asc']);
        let propsData = getPropData(data, "coinImage", "symbol", ActivePair, (item) => handleActivePay(item))
        showModal(PICKER_SEARCH, propsData)
    }

    const onSelectGet = () => {
        let data = orderBy(uniqBy(Listget, 'paymentUnit'), ['paymentUnit'], ['asc']);
        let propsData = getPropData(Listget, "paymentImage", "paymentUnit", ActivePair, (item) => handleActiveGet(item))
        showModal(PICKER_SEARCH, propsData)
    }


    const handleActivePay = (pair) => {
        // setActivePair(pair);
        
        setDisabled(false)
        if (get(pair, "symbol")) {
            setValuePay("0");
            setValueGet("0");
            setNameCoinPay(get(pair, "symbol"));
            setIconPay(get(pair, "coinImage"));
            checkListGet(pair,getListYouGet(pairs, get(pair, "symbol")));
            setListget(getListYouGet(pairs, get(pair, "symbol")))
        }
        dismissAllModal();
    }
    const checkListGet = (pair,listGet) => {
        if (size(listGet) > 0) {
            let getData = listGet.filter((item, index) => get(item, "paymentUnit") == NameCoinGet)
            
            if(size(getData) === 0){
                setActivePair(pair);
                setNameCoinGet(get(pair, "paymentUnit"));
                setIconGet(get(pair, "paymentImage"));
            }else if(size(getData) > 0){
                setActivePair(getData[0]);
            }
           
        }
    }
    const handleActiveGet = (pair) => {
        setActivePair(pair);
        setDisabled(false)
        if (get(pair, "paymentUnit")) {
            setValuePay("0");
            setValueGet("0");
            setNameCoinGet(get(pair, "paymentUnit"));
            setIconGet(get(pair, "paymentImage"));
            setPairMarketWatch(getPairMarketWatch(marketWatch, `${NameCoinPay}-${NameCoinGet}`))
        }
        dismissAllModal();
    }
    const handleSwitch = () => {
        setIsSwitch(!IsSwitch);
        setValuePay("0");
        setValueGet("0");
        setDisabled(false)
    }
    const onChangePay = (text) => {
        if (text.str2Number() > availablePay.str2Number()) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
        let qttyPay = formatNumberOnChange(currencyList, text, NameCoinPay);
        setValuePay(qttyPay);
        
        if (_.isArray(currencyList) && size(currencyList) > 0 && size(marketWatch) > 0 && isArray(marketWatch)) {
            setValueGet(formatTrunc(currencyList, qttyPay.str2Number() * swapSell, NameCoinGet));
        }
    }

    const onChangeGet = (text) => {
        let qttyGet = formatNumberOnChange(currencyList, text, NameCoinGet);
        let amountSell = Math.trunc(qttyGet.str2Number()) / Math.trunc(swapSell);
        let qttyPay = formatSCurrency(currencyList, amountSell, NameCoinPay);
        setValueGet(qttyGet);
        setValuePay(qttyPay);
        if (qttyPay.str2Number() > availablePay.str2Number()) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }
    const onChangePaySwitch = (text) => {
        let qttyPay = formatNumberOnChange(currencyList, text, NameCoinGet);
        setValuePay(qttyPay);
        let amountBuy = Math.trunc(qttyPay.str2Number()) / Math.trunc(swapBuy);
        if (_.isArray(currencyList) && size(currencyList) > 0 && size(marketWatch) > 0 && isArray(marketWatch)) {
            setValueGet(formatSCurrency(currencyList, amountBuy, NameCoinPay));
        }
        if (qttyPay.str2Number() > availableGet.str2Number()) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }
    const onChangeGetSwitch = (text) => {
        let qttyGet = formatNumberOnChange(currencyList, text, NameCoinPay);
        let qttyPay = formatSCurrency(currencyList, qttyGet.str2Number() * swapBuy, NameCoinGet);
        setValueGet(qttyGet);
        setValuePay(qttyPay);
        if (qttyPay.str2Number() > availableGet.str2Number()) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }
    const onMaxGet = () => {
        if (!IsSwitch) {
            setValueGet(availableGet);
            let amountSell = Math.trunc(availableGet.str2Number()) / Math.trunc(swapSell);
            let qttyPay = formatSCurrency(currencyList, amountSell, NameCoinPay);
            setValuePay(logged ? qttyPay : "0");
            if (qttyPay.str2Number() > availablePay.str2Number()) {
                setDisabled(true)
            } else {
                setDisabled(false)
            }
        } else {
            let qttyGet = formatNumberOnChange(currencyList, availablePay, NameCoinPay);
            let qttyPay = formatSCurrency(currencyList, qttyGet.str2Number() * swapBuy, NameCoinGet);
            setValueGet(qttyGet);
            setValuePay(qttyPay);
            if (qttyPay.str2Number() > availableGet.str2Number()) {
                setDisabled(true)
            } else {
                setDisabled(false)
            }
        }

    }
    const onMaxPay = () => {
        if (!IsSwitch) {
            setValuePay(availablePay)
            setValueGet(formatTrunc(currencyList, availablePay.str2Number() * swapSell, NameCoinGet));
        } else {
            let qttyPay = formatNumberOnChange(currencyList, availableGet, NameCoinGet);
            setValuePay(qttyPay);
            let amountBuy = Math.trunc(qttyPay.str2Number()) / Math.trunc(swapBuy);
            setValueGet(logged ? formatSCurrency(currencyList, amountBuy, NameCoinPay) : "0");
        }

    }
    const handleSubmit = () => {
        if (logged) {
            if (!ValuePay || !ValueGet || ValuePay == "0" || ValueGet == "0") {
                toast("Please enter your amount".t());
            } 
            // else if (!IsSwitch ? ValuePay.str2Number() > get(ActivePair, "maxQuantity") : ValueGet.str2Number() > get(ActivePair, "maxQuantity")) {
            //     toast(`${"Order quantity error".t()} ${get(ActivePair, "maxQuantity")}`);
            // }
             else {
                pushSingleScreenApp(componentId, SWAP_CONFIRM_SCREEN, {
                    ValuePay: !IsSwitch ? formatSCurrency(currencyList, ValuePay.str2Number(), NameCoinPay) : ValuePay,
                    ValueGet: IsSwitch ? formatSCurrency(currencyList, ValueGet.str2Number(), NameCoinPay) : ValueGet,
                    NameCoinGet,
                    NameCoinPay,
                    swapBuy,
                    swapSell,
                    IconPay,
                    IconGet,
                    delayEachPlaceOrder: get(swapConfig, "delayEachPlaceOrder"),
                    percentWithLastestPrice: get(swapConfig, "percentWithLastestPrice"),
                    IsSwitch,
                    lastestPrice: get(PairMarketWatch, "price"),
                    PairMarketWatch,
                    priceCaculator,
                    swapConfig
                })
            }

        } else {
            pushSingleScreenApp(componentId, LOGIN_SCREEN, {
                hasBack: true
            })
        }

    }
    const onRefresh = (isRefresh = true) => {
        dispatcher(createAction(GET_MARKET_WATCH));
        dispatcher(createAction(GET_SWAP));
        if (logged) {
            setRefreshing(isRefresh)
            jwtDecode().then(user => {
                let userId = get(user, "id");
                if (userId) {
                    dispatcher(createAction(GET_CRYPTO_WALLET, userId));
                    dispatcher(createAction(GET_FIAT_WALLET, userId))
                }
            })
        }
        setValuePay("0");
        setValueGet("0");
    }
    return (
        <Container
            nameLeft=""
            title={"SWAP".t()}
            textRight={"HISTORY".t()}
            onClickRight={() => {
                if (logged) {
                    pushSingleScreenApp(componentId, HISTORY_SWAP_SCREEN)
                } else {
                    pushSingleScreenApp(componentId, LOGIN_SCREEN, {
                        hasBack: true
                    })
                }
            }}
            refreshing={Refreshing}
            onRefresh={onRefresh}
            isScroll
        >
            <BlockSwap
                textIcon={!IsSwitch ? NameCoinPay : NameCoinGet}
                onSelect={!IsSwitch ? onSelectPay : onSelectGet}
                icon={!IsSwitch ? IconPay : IconGet}
                available={!IsSwitch ? availablePay : availableGet}
                value={ValuePay}
                onChangeText={!IsSwitch ? onChangePay : onChangePaySwitch}
                onMax={onMaxPay}
            />
            <Layout isCenter >
                <TouchablePreview onPress={handleSwitch}>
                    <Image style={{ width: 50, height: 50 }} source={icons.swap} resizeMode={"contain"} />
                </TouchablePreview>
            </Layout>
            <BlockSwap
                onChangeText={!IsSwitch ? onChangeGet : onChangeGetSwitch}
                textRightTop={"You Get".t()}
                textIcon={!IsSwitch ? NameCoinGet : NameCoinPay}
                onSelect={!IsSwitch ? onSelectGet : onSelectPay}
                icon={!IsSwitch ? IconGet : IconPay}
                available={!IsSwitch ? availableGet : availablePay}
                value={ValueGet}
                onMax={onMaxGet}
            />
            <Button
                disabled={logged ? Disabled : false}
                onSubmit={handleSubmit}
                isSubmit
                bgButtonColor={logged ? (Disabled ? colors.tabbar : colors.iconButton) : colors.iconButton}
                isButtonCircle={false}
                spaceVertical={10}
                textSubmit={logged ? (Disabled ? "Balance not enough".t() : "NEXT".t()) : "LoginToSwap".t()}
            />
            <NoteImportant
                hasDot
                arrNote={["NOTE_SWAP".t()]}
            />

        </Container>
    );
})

export default SwapScreen;

const getPairMarketWatch = (marketWatch, pair) => {
    if (isArray(marketWatch) && size(marketWatch) > 0) {
        let marketWatchFilter = marketWatch.filter((item, index) => `${get(item, "symbol")}-${get(item,"paymentUnit")}` == pair);
        
        if (isArray(marketWatchFilter) && size(marketWatchFilter) > 0) {
            return marketWatchFilter[0]
        }
    }
}

const getPairDefault = (pairs) => {
    if (isArray(pairs) && size(pairs) > 0) {
        let pairFilter = pairs.filter((item, index) => get(item, "isDefault"));
        if (isArray(pairFilter) && size(pairFilter) > 0) {
            return pairFilter[0]
        }
    }
}

const getListYouGet = (pairs, valueGet) => {
    if (isArray(pairs) && size(pairs) > 0) {
        let list = pairs.filter((item, index) => get(item, "symbol") == valueGet);
        return list;
    }
}


const getPropData = (data, image, value, ActivePair, cb) => {
    return {
        data: [...data],
        renderItem: ({ item, key }) => {
            return (
                <ItemList
                    customView={
                        <Layout>
                            <Image source={{
                                uri: get(item, image)
                            }} style={{ width: 17, height: 17 }} />
                            <TextFnx isDart weight={"500"} value={`  ${get(item, value)}`} />
                        </Layout>}
                    onPress={() => cb(item)
                    }
                    value={get(item, value)}
                    checked={get(item, value) === get(ActivePair, value)}
                />
            )
        },
        keywords: [value]
    }
}

const getAvailable = (data, type, coin, currencyList) => {
    let dataFilter = data.filter((item, index) => get(item, type) == coin);
    if (size(dataFilter) > 0) {
        return `${formatCurrency(get(dataFilter[0], "available"), coin, currencyList)}`
    } else {
        return "0"
    }
}