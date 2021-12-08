import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';

const HeaderFilter = ({
    onButtonRight
}) => (
        <Layout
            isSpaceBetween
            style={stylest.containerHeader}>
            <ButtonIcon
                space={10}
                styleBlockIcon={{ alignItems: 'flex-start' }}
                isHidden={true}
            />
            <TextFnx size={16} isDart weight={"bold"} value={"Swap History".t()} />
            <ButtonIcon
                onPress={onButtonRight}
                size={16}
                space={10}
                styleBlockIcon={{ alignItems: 'flex-end' }}
                name={"filter"}
                color={colors.iconButton}
            />
        </Layout>
    );
const stylest = StyleSheet.create({
    containerHeader: {
        height: 45,
        alignItems: 'center',
    }
});
export default HeaderFilter;
