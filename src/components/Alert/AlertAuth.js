import React,{useEffect} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LayoutSpaceBetween from '../LayoutSpaceBetween';
import Icon from '../Icon';
import colors from '../../configs/styles/colors';
import styles from '../../configs/styles/styles';
import LayoutSpaceHorizontal from '../Layout/LayoutSpaceHorizontal';
import TextDot from '../Text/TextDot';
import TextFnx from '../Text/TextFnx';
import ButtonIcon from '../Button/ButtonIcon';
import { Navigation } from 'react-native-navigation';
import { dismissAllModal } from '../../navigation/Navigation';

const AlertAuth = ({
    componentId,
    customView=<View />,
    title,
    isTitle=true,
    top="30%"
}) => {
    const dismissModal = () => {
        dismissAllModal();
        // Navigation.dismissModal(componentId);
    }
    return (<>
        <View style={stylest.container}
        onStartShouldSetResponder={dismissModal}
        >
        </View>
        <View style={[stylest.block,{top:top}]}>
            <LayoutSpaceHorizontal
                style={stylest.layoutSpace}
            >
                <LayoutSpaceBetween>
                    <View />
                    <ButtonIcon
                        onPress={dismissModal}
                        style={[styles.icon, { marginRight: -20 }]} color={colors.text} size={17} name="times" />
                </LayoutSpaceBetween>
                {isTitle && <TextFnx style={stylest.textTitle} value={title} />}
                {customView}
            </LayoutSpaceHorizontal>
        </View>
    </>
    );
}
const stylest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.transparent
    },
    block: {
        backgroundColor: colors.background,
        position: "absolute",
        width: "90%",
        alignSelf: "center",
        // top: "30%"
    },
    layoutSpace: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    textTitle: { paddingBottom: 10, color: colors.highlightTitle }
})
export default AlertAuth;
