import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import TextFnx from '../../../components/Text/TextFnx';
import Icon from '../../../components/Icon';
import colors from '../../../configs/styles/colors';
import Button from '../../../components/Button/Button';

const ItemChildrenFilter = ({
    icon = "calendar",
    placeholder = "From".t(),
    space,
    onPress,
    isValue,
    isSubmit
}) => {
    return (
        <View style={stylest.containerButton}>

            {isSubmit ? <Button
                onSubmit={onPress}
                isSubmit
                textSubmit={"Search".t()}
                isButtonCircle={false}
                style={{
                    borderRadius:5
                }}
            /> : <TouchablePreview
                onPress={onPress}
            >
                <Layout
                    space={space}
                    spaceHorizontal={10}
                    isSpaceBetween
                    style={stylest.layoutItem}
                >
                    <TextFnx color={isValue?colors.text:colors.description} value={placeholder} />
                    <Icon name={icon} size={16} color={colors.description} />
                </Layout>
            </TouchablePreview>}

        </View>


    )
}
const stylest = StyleSheet.create({
    containerButton: {
        height: 40,
        width: "49%",
    },
    layoutItem: {
        borderWidth: 0.5,
        borderColor: colors.line,
        borderRadius: 5,
        height: "100%",
        width: "100%",
        alignItems: 'center',
    },
});
export default ItemChildrenFilter;
