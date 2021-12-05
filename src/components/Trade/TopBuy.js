import React from 'react'
import { Body, Item, Left, Right, View } from "native-base";
import { StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { style } from "../../config/style";
import {formatCurrency, formatSCurrency} from "../../config/utilities";
import { SELL } from "../../config/constants";
import connect from "react-redux/es/connect/connect";
import {styles} from "react-native-theme";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
class TopBuyItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.data, index = this.props.index;
        const { currencyList } = this.props;
        return (
            <TouchableOpacityFnx
            style={{
                height:30
            }}
            onPress={() => item.price ?this.props.setPrice(item.price):null}
        >
            <View style={stylest.item} key={item.index}>
                <Text style={[styles.textWhite,
                      !item.qtty ? {fontSize:20,marginTop:-5}:stylest.fontSize
                    ]}>{item.qtty?formatSCurrency(currencyList, item.qtty, item.symbol,true):"--"}</Text>
               
                    <Text
                        style={[styles.bgBuyOldNew,
                        !item.price ? {fontSize:20,marginTop:-5}: stylest.fontSize
                        ]}>{item.price?formatSCurrency(currencyList, item.price, item.paymentUnit):"--"}</Text>
               
            </View>
            </TouchableOpacityFnx>
        );
    }
}
const stylest = StyleSheet.create({
    fontSize: {
        fontSize: 13,
    },
    fontIOS:{
        fontFamily: 'Roboto'
    },
    item: {
        borderBottomWidth: 0,
        paddingLeft: 10,
        paddingRight: 2.5,
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    order: {
        flexDirection: 'row',
        // height: height/3
    },
});
const mapStateToProps = (state) => {
    return {
        currencyList: state.commonReducer.currencyList
    }
}

export default connect(mapStateToProps, {})(TopBuyItem);
