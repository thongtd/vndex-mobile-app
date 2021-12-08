import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import ItemChildrenFilter from './ItemChildrenFilter';
import Button from '../../../components/Button/Button';

const ItemFilter = ({
    iconFirst,
    iconSecond,
    placeholderFirst,
    placeholderSecond,
    onPressFirst,
    onPressSecond,
    valueFirst,
    valueSecond,
    buttonRight,
    onSubmit
}) => {
    return (
        <Layout
            isSpaceBetween
            space={5}
        >
            <ItemChildrenFilter
                isValue={valueFirst?true:false}
                icon={iconFirst}
                placeholder={valueFirst?valueFirst:placeholderFirst}
                onPress={onPressFirst}
            />
            <ItemChildrenFilter
                isSubmit={buttonRight?true:false}
                isValue={valueSecond?true:false}
                icon={iconSecond}
                placeholder={valueSecond?valueSecond:placeholderSecond}
                onPress={onPressSecond}
            />
        </Layout>
    )
}

export default ItemFilter;
