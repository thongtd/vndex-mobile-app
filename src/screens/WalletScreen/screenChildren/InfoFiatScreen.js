import React from 'react';
import { Text, View } from 'react-native';
import LayoutInfoWallet from '../components/LayoutInfoWallet';

const InfoFiatScreen = ({
    item,
    componentId,
    isCoin
}) => (
        <LayoutInfoWallet
            item={item}
            componentId={componentId}
            isCoinData={isCoin}
        />
    );

export default InfoFiatScreen;
