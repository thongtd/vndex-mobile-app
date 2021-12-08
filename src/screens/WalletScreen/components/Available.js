import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import { formatCurrencyFnx, formatCurrency, get } from '../../../configs/utils';
import { useDispatch, useSelector } from "react-redux";
import colors from '../../../configs/styles/colors';

const Available = ({
    data,
}) => {
    const currencyList = useSelector(state => state.market.currencyList);
    return (
        <Layout
            space={10}
            isCenter
            type={"column"}
        >
            <TextFnx space={5} color={colors.subText} value={"AVAILABLE".t().toUpperCase()} />
            <TextFnx color={colors.green} space={5} isDart size={16} weight={"600"} value={`${formatCurrency(get(data, "amount"), get(data, "currency"), currencyList)} ${get(data, "currency")}`} />
        </Layout>
    );
}

export default Available;
