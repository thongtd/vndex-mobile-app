import React from 'react';
import { Text, View ,StyleSheet} from 'react-native';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';
import LayoutSpaceBetween from '../LayoutSpaceBetween';
import TextFnx from '../Text/TextFnx';
import Icon from '../Icon';
import colors from '../../configs/styles/colors';

const ItemList = ({
    customView,
    value,
    onPress,
    checked
}) => {
    return (
        <TouchablePreview
        onPress={onPress}
        >
            <View style={stylest.blockItem}>
                <LayoutSpaceBetween style={stylest.layout}>
                    {customView || <TextFnx color={colors.text} value={value} />}
                    {checked? <Icon name="check" color={colors.green} />:<View /> }
                </LayoutSpaceBetween>
            </View>
        </TouchablePreview>
    )
}
const stylest = StyleSheet.create({
    blockItem:{
        paddingVertical:18,
        borderBottomColor:colors.line,
        borderBottomWidth:0.5,
        justifyContent:"center",
    },
    layout:{
        paddingHorizontal: 10,
        alignItems: 'center',
    }
})
export default ItemList;
