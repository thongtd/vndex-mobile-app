import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import ButtonWithTitle from './ButtonWithTitle';
import Icon from '../Icon';
import TextFnx from '../Text/TextFnx';
import { pop } from '../../navigation/Navigation';
import colors from '../../configs/styles/colors';

const ButtonBack = ({
    componentId,
}) => (
    <ButtonWithTitle
        space={10}
        onPress={() => pop(componentId)}
        style={[stylest.textRegister, { alignItems: 'center', }]}>
        <Icon name="arrow-left" color={colors.background} />
        <TextFnx value={` ${"BACK".t()}`} />
      </ButtonWithTitle>
);
const stylest = StyleSheet.create({
    textRegister: {
        flexDirection: "row",
        justifyContent: "center",
        // marginVertical: 10
      }
})
export default ButtonBack;
