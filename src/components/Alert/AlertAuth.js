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
import Button from '../Button/Button';

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
               
                {isTitle && <TextFnx style={stylest.textTitle} value={title} />}
                {customView}
                <Button spaceVertical={10} onSubmit={dismissModal} textSubmit={"I understand".t()} isSubmit 
        isButtonCircle={false} />
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
        backgroundColor: colors.text,
        position: "absolute",
        width: "90%",
        alignSelf: "center",
        // top: "30%"
    },
    layoutSpace: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },
    textTitle: { paddingBottom: 10, color: colors.black }
})
export default AlertAuth;
