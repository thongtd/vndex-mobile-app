import React from 'react';
import RN, { Text, TouchableOpacity, View } from 'react-native';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
// import { TouchablePreview } from 'react-native-navigation';

const ButtonSortSymbol = ({
    onCheck,
    isCheck
}) => {
    
    return (
        <TouchableOpacity
            onPress={onCheck}
        >
            <TextFnx
                color={colors.tabbarActive}
            >
                {"Symbol"}{" "}
                <Icon name={isCheck ? "arrow-up" : "arrow-down"} />
            </TextFnx>
        </TouchableOpacity>
    );
}

export default ButtonSortSymbol;
