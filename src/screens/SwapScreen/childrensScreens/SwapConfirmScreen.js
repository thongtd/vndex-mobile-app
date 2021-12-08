import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import ItemConfirmSwap from '../components/ItemConfirmSwap';
import Container from '../../../components/Container';
import TextFnx from '../../../components/Text/TextFnx';
import icons from '../../../configs/icons';
import Layout from '../../../components/Layout/Layout';
import Button from '../../../components/Button/Button';
import { marketService } from '../../../services/market.service';
import { ORDER_TYPE } from '../../../configs/constant';
import { toast, formatMessageByArray, jwtDecode, emitEventEmitter, size, get, formatTrunc, formatSCurrency, createAction } from '../../../configs/utils';
import { pop } from '../../../navigation/Navigation';
import { useSelector, useDispatch } from "react-redux"
import { isArray } from "lodash"
import useAppState from 'react-native-appstate-hook';
import { GET_MARKET_WATCH } from '../../../redux/modules/market/actions';
import { GET_ASSET_SUMARY } from '../../../redux/modules/wallet/actions';
const SwapConfirmScreen = ({
    componentId,
    ValuePay,
    ValueGet,
    NameCoinGet,
    NameCoinPay,
    swapBuy,
    swapSell,
    IconPay,
    IconGet,
    delayEachPlaceOrder,
    percentWithLastestPrice,
    IsSwitch,
    PairMarketWatch,
    swapConfig
}) => {
    const [Disabled, setDisabled] = useState(false);
    const [ValueGetData, setValueGet] = useState(ValueGet);
    const [SwapBuy, setSwapBuy] = useState(swapBuy);
    const [SwapSell, setSwapSell] = useState(swapSell);
    const [activePair, setActivePair] = useState(PairMarketWatch)
    const marketWatch = useSelector(state => state.market.marketWatch);
    const priceCaculator = (get(activePair, "price") * get(swapConfig, "percentWithLastestPrice")) / 100;
    const currencyList = useSelector(state => state.market.currencyList);
    const PriceBuy = get(activePair, "price") + priceCaculator;
    const UserInfo = useSelector(state => state.authentication.userInfo)
    const dispatcher = useDispatch();

    const { appState } = useAppState({
        onChange: (newAppState) => {
            if (newAppState === "active") {
                dispatcher(createAction(GET_MARKET_WATCH))
            }
        },
        onForeground: () => console.log('App went to Foreground'),
        onBackground: () => console.log('App went to background'),
    });
   
    const createOrder = (side) => {
        setDisabled(true)
        jwtDecode().then(acc => {
            if (acc) {
                let accId = acc.id, customerEmail = acc.sub;
                marketService.create_new_order(
                    NameCoinPay,
                    NameCoinGet,
                    !IsSwitch ? ValuePay.str2Number() : ValueGetData.str2Number(),
                    !IsSwitch ? ValueGetData.str2Number() : PriceBuy,
                    ORDER_TYPE.LIMIT_ORDER,
                    side,
                    customerEmail,
                    accId,
                    2,
                    get(activePair, "price"),
                    percentWithLastestPrice
                )
                    .then(response => {
                        setDisabled(false)
                        if (get(response, "status") === "error") {
                            if (response.message.t() === "Exceeded limit".t()) {
                                toast(formatMessageByArray("Exceeded limit".t(), [delayEachPlaceOrder]))
                            } else if (get(response, "data.messageArray") && size(get(response, "data.messageArray")) > 0) {
                                toast(formatMessageByArray(get(response, "message").t(), get(response, "data.messageArray")))
                            } else {
                                toast(get(response, "message").t())
                            }
                        }
                        else {
                            toast(response.message.t())
                            pop(componentId);
                            emitEventEmitter("successSwap");
                            dispatcher(createAction(GET_ASSET_SUMARY, {
                                UserId: get(UserInfo, "id"),
                                marketWatch
                            }))
                        }
                    })
                    .catch(err => {
                        setDisabled(false);

                    })
            }
        })
    }
    const handleSubmit = () => {
        createOrder(IsSwitch ? "B" : "S")
    }
    return (
        <Container
            hasBack
            componentId={componentId}
            title={"Confirm Swap".t()}
        >
            <TextFnx space={10} value={"You are about to swap".t()} isDart />
            <Layout
                isSpaceBetween
            >
                <ItemConfirmSwap
                    Icon={!IsSwitch ? IconPay : IconGet}
                    Value={ValuePay}
                    NameCoin={!IsSwitch ? NameCoinPay : NameCoinGet}
                />
                <Image style={{ width: 30, alignSelf: "center" }} source={icons.swap_right} resizeMode={"contain"} />
                <ItemConfirmSwap
                    Icon={!IsSwitch ? IconGet : IconPay}
                    Value={ValueGetData}
                    NameCoin={!IsSwitch ? NameCoinGet : NameCoinPay}
                />
            </Layout>
            <Button
                disabled={Disabled}
                onSubmit={handleSubmit}
                isSubmit
                isButtonCircle={false}
                spaceVertical={10}
                textSubmit={"CONFIRM".t()}
            />
        </Container>
    );
}

export default SwapConfirmScreen;
const getPairMarketWatch = (marketWatch, pair) => {
    if (isArray(marketWatch) && size(marketWatch) > 0) {
        let marketWatchFilter = marketWatch.filter((item, index) => get(item, "pair") == pair);
        if (isArray(marketWatchFilter) && size(marketWatchFilter) > 0) {
            return marketWatchFilter[0]
        }
    }
}
