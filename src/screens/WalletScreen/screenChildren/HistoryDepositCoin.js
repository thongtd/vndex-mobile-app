import React from 'react';
import { Text, View } from 'react-native';
import Container from '../../../components/Container';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import Label from '../../../components/Text/Label';
import { get, CheckColorStatus, to_UTCDate, formatCurrency, convertToUSD, convertToCurr, getMarketWatchByCurrency, formatSCurrency, formatCurrencyFnx } from '../../../configs/utils';
import { useSelector } from "react-redux"
const HistoryDepositCoin = ({
    componentId,
    data
}) => {

    console.log(data, "dataaa");
    const currencyList = useSelector(state => state.market.currencyList)
    var curr = "VND";
    const conversion = useSelector(state => state.market.conversion)
    const marketWatch = useSelector(state => state.market.marketWatch);
    var marketByCurrency = getMarketWatchByCurrency(marketWatch,get(data,"currency"),curr)
    console.log(marketByCurrency,"marketByCurrency");
    return (
        <Container
            title={`${"Deposits".t()} ${get(data, "currency")}`}
            hasBack
            componentId={componentId}
        >
            <Layout
                space={10}
                isCenter
                type={"column"}
                style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.line,
                }}
            >
                <TextFnx space={5} isDart size={16} weight={"600"} value={`+${formatCurrency(get(data, "amount"), get(data, "currency"), currencyList)} ${get(data, "currency")}`} />
                {/* <TextFnx isDart value={`${formatCurrencyFnx(get(data, "amount")*get(marketByCurrency,"lastestPrice"),0)} ${curr}`} /> */}
            </Layout>
            <TextFnx spaceTop={25} space={15} isDart value={to_UTCDate(get(data, "createdDate"), "DD-MM-YYYY hh:mm:ss")} />
            <Label
                title={"Status".t()}
                value={get(data, "statusLable").t()}
                colorValue={CheckColorStatus(get(data, "statusLable").t())}
            />
            <Label
                title={"Address".t()}
                value={get(data, "address")}
            />
            <Label
                title={"TXID"}
                value={get(data, "txId")}
            />
        </Container>
    );
}

export default HistoryDepositCoin;
