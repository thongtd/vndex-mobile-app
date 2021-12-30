import React from 'react';
import { Text, View } from 'react-native';
import ItemList from '../../../components/Item/ItemList';
import ItemSetting from '../../../components/Item/ItemSetting';
import { spacingApp } from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';

const ItemSecurity = ({
    onValueChange,
    IsSwitch,
    iconLeft,
    isBorder=false,
    iconLeftSvg,
    iconRight,
    onPress,
    hasSwitch,
    textLeft="Email Verification".t()
}) => (
        <ItemSetting iconLeftSvg={iconLeftSvg} height={90} sizeIconLeft={{
            width: 70,
            height: 70
        }}
            style={{
                backgroundColor:colors.app.backgroundLevel2,
                height:64,
                marginVertical:8,
                paddingHorizontal:20
            }}
            isBorder={isBorder}
            textLeft={textLeft}
            IsSwitch={IsSwitch}
            hasSwitch={hasSwitch}
            iconRight={iconRight}
            onValueChange={onValueChange}
            onPress={onPress}
        />
    );

export default ItemSecurity;
