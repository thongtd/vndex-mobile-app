import React from 'react';
import RN, { Text, View } from 'react-native';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';

const ButtonSortSymbol = ({
    onCheck,
    isCheck
}) => {
    
    return (
        <TouchablePreview
            onPress={onCheck}
        >
            <TextFnx
                color={colors.tabbarActive}
            >
                {"Symbol"}{" "}
                <Icon name={isCheck ? "arrow-up" : "arrow-down"} />
            </TextFnx>
        </TouchablePreview>
    );
}

export default ButtonSortSymbol;
