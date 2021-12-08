import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import { CheckColorStatus } from '../../../configs/utils';

const ItemHistorySwap = ({
    titleStart,
    valueStart,
    titleCenter,
    valueCenter,
    titleEnd,
    valueEnd,
    style = stylest.container,
    isWallet
}) => {
    return (
        <Layout style={style}>
            <ItemChildren isWallet={isWallet} isFirst flex={1.2} title={titleStart} value={valueStart} />
            <ItemChildren isWallet={isWallet} isCenter title={titleCenter} value={valueCenter} />
            <ItemChildren isWallet={isWallet} isLast title={titleEnd} value={valueEnd} />
        </Layout>
    );
}
const stylest = StyleSheet.create({
    container: {
        borderBottomColor: colors.line,
        borderBottomWidth: 0.5,
    }
});

const ItemChildren = ({
    isFirst,
    isLast,
    title,
    value,
    flex,
    isWallet,
    isCenter,
}) => {
    return (
        <>
            {isWallet ? (
                <Layout
                    type={"column"}
                    style={[stylestItemChildren(flex), isLast && { alignItems: 'flex-end', }]}>
                    <TextFnx space={1} weight={!isLast ? "normal" : "bold"} isDart value={title} />
                    <TextFnx space={1} weight={!isLast ? "normal" : "500"} color={isCenter ? CheckColorStatus(value) : colors.text} isDart value={value} />
                </Layout>
            ) : (
                    <Layout
                        type={"column"}
                        style={[stylestItemChildren(flex), isLast && { alignItems: 'flex-end', }]}>
                        <TextFnx space={1} weight={isFirst ? "normal" : "bold"} isDart value={title} />
                        <TextFnx space={1} isDart value={value} />
                    </Layout>
                )}

        </>

    )
}

const stylestItemChildren = (flex = 1) => {
    return {
        flex: flex,
        height: 60,
        justifyContent: 'center',
    }
}

export default ItemHistorySwap;
