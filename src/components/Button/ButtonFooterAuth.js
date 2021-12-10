import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ButtonWithTitle from './ButtonWithTitle';
import { Navigation } from 'react-native-navigation';
import { IdNavigation } from '../../configs/constant';
import { WALLET_SCREEN, RESET_SCREEN, pushSingleScreenApp, pushTabBasedApp, LOGIN_SCREEN } from '../../navigation';
import { hiddenTabbar, checkIndexSetting } from '../../configs/utils';
import { pop } from '../../navigation/Navigation';
import colors from '../../configs/styles/colors';

const ButtonFooterAuth = ({
    hasBack,
    componentId,
    IdNavigate = IdNavigation.Setting.menu,
    textRight = "SKIP".t(),
    textLeft = "FORGOT_PASSWORD".t(),
    onRight = () => {
        if (hasBack) {
            pop(componentId);
        } else {
            pushTabBasedApp(checkIndexSetting(IdNavigate))
        }
    },
    onLeft = () => pushSingleScreenApp(componentId, RESET_SCREEN, {}, hiddenTabbar()),
}) => (
        <View style={stylest.textBottom}>
            <ButtonWithTitle color={colors.subText} space={10} onPress={onLeft} title={textLeft} />
            <ButtonWithTitle color={colors.subText} space={10} onPress={onRight} title={textRight} />
        </View>
    );
const stylest = StyleSheet.create({
    textBottom: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        // left: "-10%"
    },
})
export default ButtonFooterAuth;
