import React from 'react';
import { Text, View } from 'react-native';
import ItemList from '../../../components/Item/ItemList';
import ItemSetting from '../../../components/Item/ItemSetting';
import icons from '../../../configs/icons';

const ItemSecurity = ({
    onValueChange,
    IsSwitch,
    iconLeft,
    isBorder=true,
    iconLeftSvg,
    textLeft="Email Verification".t()
}) => (
        <ItemSetting iconLeftSvg={iconLeftSvg} height={90} sizeIconLeft={{
            width: 70,
            height: 70
        }}
            isBorder={isBorder}
            textLeft={textLeft}
            IsSwitch={IsSwitch}
            hasSwitch
            onValueChange={onValueChange}
        />
    );

export default ItemSecurity;
