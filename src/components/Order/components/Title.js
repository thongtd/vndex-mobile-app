import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Item, Left, Right } from 'native-base';
import { style } from '../../../config/style';
import Icon from "react-native-vector-icons/FontAwesome5"
import theme,{styles} from "react-native-theme";
const Title = ({
    onPress,
    isFilter,
    title = "ORDERS".t()
}) => (
    <Item style={[style.container, { paddingHorizontal: 10, paddingVertical: 10, marginLeft: 0, borderBottomWidth: 0, backgroundColor:styles.backgroundSub.color,borderBottomWidth:theme.name === "light"?0.5:0 }]}>
        <Left>
            <Text style={[styles.textWhite, style.fontSize18, { fontWeight: '500' }]}>{"ORDERS".t()}</Text>
        </Left>
        <Right>
            <TouchableOpacity 
            onPress={onPress}
            style={{
                padding:10
            }}
            >
                <Icon name={"filter"} size={14} color={isFilter?styles.txtHl.color:styles.textWhite.color} />
            </TouchableOpacity>

        </Right>

    </Item>
);

export default Title;
