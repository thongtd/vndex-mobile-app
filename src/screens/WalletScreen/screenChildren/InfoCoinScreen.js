import React from 'react';
import { Text, View } from 'react-native';
import LayoutInfoWallet from '../components/LayoutInfoWallet';
import TextFnx from '../../../components/Text/TextFnx';
import { get } from '../../../configs/utils';

const InfoCoinScreen = ({
    componentId,
    item,
    isCoin
}) => {
    return (
            <LayoutInfoWallet
            item={item}
            componentId={componentId}
            isCoinData={isCoin}
            title={get(item,"symbol")}
             />
    );
}

export default InfoCoinScreen;
