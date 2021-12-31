import React, { useState, useEffect } from 'react';
import RN, { Text, View, StyleSheet } from 'react-native';
import TopBarWallet from '../../../components/TopBarWallet';
import { TextWhite } from '../../../components';
import TextSeparators from '../../../components/Text/TextSeparators';
import colors from '../../../configs/styles/colors';
import { useSelector } from "react-redux";
import { convertToCurr, isArray, size, get, formatCurrencyFnx, formatCurrency, convertToUSD } from '../../../configs/utils';
import TextFnx from '../../../components/Text/TextFnx';
import Button from '../../../components/Button/Button';
import { pushSingleScreenApp, LOGIN_SCREEN, TRANSACTION_HISTORY } from '../../../navigation';
const HeaderWalletScreen = ({
    componentId
}) => {
    const logged = useSelector(state => state.authentication.logged);
    const cryptos = useSelector(state => state.market.cryptoWallet);
    const fiats = useSelector(state => state.wallet.fiatsWallet);
    const conversion = useSelector(state => state.market.conversion)
    const currencyList = useSelector(state => state.market.currencyList)
    const [TotalValue, setTotalValue] = useState(0);
    const marketWatch = useSelector(state => state.market.marketWatch)
    var curr = "VND";
    useEffect(() => {
        if (isArray(cryptos) && size(cryptos) > 0 && isArray(fiats) && size(fiats) > 0) {
            calculateAsset(cryptos, fiats);
            // console.log(marketWatch,"marketWatchmarketWatch")
        }
    }, [cryptos, fiats, marketWatch])
    const calculateAsset = async (cryptos, fiats) => {
        var totalCryptoValue = 0;
        var totalFiatValue = 0;

        for (let i = 0; i <= size(cryptos); i++) {
            if (get(cryptos[i], "lastestPrice")) {
                totalCryptoValue += formatCurrencyFnx((get(cryptos[i], "available") + get(cryptos[i], "pending")) * get(cryptos[i], "lastestPrice"), 0).str2Number();
            }
        }

        for (let j = 0; j <= size(fiats); j++) {
            if (get(fiats[j], "currency") === curr) {
                totalFiatValue += get(fiats[j], "totalAmount");
            } else {
                totalFiatValue += convertToCurr(get(fiats[j], "currency"), conversion, get(fiats[j], "totalAmount"), curr)
            }
        }
        setTotalValue(totalFiatValue + totalCryptoValue);
    }
    return (
        <TopBarWallet
            styleCenter={{ width: "50%", height: "100%", justifyContent: "flex-start" }}
            styleLeft={stylest.icon}
            styleRight={[stylest.icon, {}]}
            renderItem={
                <View style={{
                    alignItems: "center",
                }}>
                    <View style={{
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text
                            style={stylest.textRenderItem}>
                            {"WALLET".t().toUpperCase()}
                        </Text>
                    </View>
                    <View style={stylest.blockTopbar}>
                        <View style={[stylest.blockChildTopBar,!logged && { width: "100%" } ]}>
                            <TextWhite>
                                {"ESTIMATE_TOTALS_ASSETS".t()}
                            </TextWhite>
                            {!logged ? (<Button
                                spaceVertical={20}
                                isSubmit
                                textSubmit={"LOGIN".t()}
                                onSubmit={() => pushSingleScreenApp(componentId, LOGIN_SCREEN, {
                                    hasBack: true
                                })}
                            />
                            ) : (
                                    <>
                                        <View style={stylest.price}>
                                            <TextWhite style={{ color: colors.background, fontSize: 18 }}>đ </TextWhite>
                                            <TextFnx
                                                color={colors.green} weight={"500"} size={20}
                                                value={logged ? formatCurrency(TotalValue, curr, currencyList) : 0}

                                            />
                                        </View>
                                        <View style={stylest.priceConvert}>
                                            <TextFnx>≈ $ </TextFnx>
                                            <TextFnx
                                                value={logged ? convertToUSD(curr, conversion, currencyList, TotalValue) : 0}
                                            />
                                        </View>
                                    </>
                                )}

                        </View>
                    </View>
                </View>
            }
            onClickRight={!logged?null:() => pushSingleScreenApp(componentId,TRANSACTION_HISTORY)}
            textRight={"HISTORY".t()}>

        </TopBarWallet>
    )
}
const stylest = StyleSheet.create({
    textRenderItem: {
        fontWeight: "bold",
        fontSize: 17,
        color: colors.background,
        // paddingBottom: 15
    },
    blockTopbar: {
        width: "100%"
    },
    priceConvert: {
        flexDirection: "row"
    },
    price: {
        flexDirection: "row",
        paddingVertical: 8
    },
    blockChildTopBar: {
        alignItems: "center",
        justifyContent: "center"
    },
    textPrice: {
        color: colors.green,
        fontWeight: "bold",
        fontSize: 18
    },
    icon: {
        paddingRight: 10,
        height: 45,
        width: "25%",
        justifyContent: "center"
    },
})
export default HeaderWalletScreen;
