import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import colors from '../../../configs/styles/colors';
import icons from '../../../configs/icons';
import TextFnx from '../../../components/Text/TextFnx';
import Image from '../../../components/Image/Image';

const ItemConfirmSwap = ({
    Icon,
    Value,
    NameCoin
}) => (
    <View style={stylest.block}>
        <View style={stylest.ic}>
            <Image style={{width:20,height:20}} source={{uri:Icon}} />
        </View>
        <TextFnx isDart value={`${Value} ${NameCoin}`} weight={'400'} size={14} />
    </View>
);
const stylest = StyleSheet.create({
    ic:{
        backgroundColor:colors.btnBlur,
        width:35,
        height:35,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:35/2,
        marginBottom:10
    },
    block:{
        borderWidth:0.5,
        borderColor:colors.line,
        borderRadius:4,
        alignItems:"center",
        paddingVertical: 10,
        width:"43%",
        marginVertical:10
    }
})
export default ItemConfirmSwap;
