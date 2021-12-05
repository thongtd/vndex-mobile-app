import React from "react";
import { Body, Button, Left, ListItem, Right, Thumbnail } from "native-base";
import { StyleSheet, Text, View, TouchableOpacity ,Platform} from "react-native";
import { style } from "../../config/style";
import {checkDimension, convertToUSD, dimensions, formatCurrency, formatSCurrency} from "../../config/utilities";
import { marketService } from "../../services/market.service";
import { connect } from 'react-redux'
import { getCurrency, getLanguage } from "../../redux/action/common.action";
import { getConversion } from "../../redux/action/trade.action";

class MarketDataItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currencyList: []
        }
    }

    render() {
        const item = this.props.data;
        const { index, currencyConversion, navigation, currencyList,_i } = this.props;
        return (
            <TouchableOpacity thumbnail
                style={{ marginBottom: 5, backgroundColor: '#1c2840', padding: 7.5, flexDirection: 'row', borderRadius: 2.5 }}
                key={index}
                onPress={() => navigation.navigate('Trade', { tradingCoin: item,_i:_i })}
            >
                <Left style={{ paddingLeft: 2, flex: 0.7 }}>
                    <View style={{
                        height: 36, width: 36, borderRadius: 18, backgroundColor: '#141d30',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Thumbnail small source={{ uri: item.image }}
                            style={{ width: 20, height: 20 }} square />
                    </View>
                </Left>
                <View style={{ borderBottomWidth: 0, flex: 3 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[style.textWhite, { fontWeight: 'bold' }]}>{item.symbol}</Text>
                        <Text style={[style.textMain,{fontSize:12,alignSelf:"flex-end"}]}>{" "}/{" "}{item.tradingCurrency}</Text>
                    </View>
                    <Text style={[item.priceChange < 0 ? style.textRed : (item.priceChange > 0 ? style.textGreen : style.textWhite), checkDimension(dimensions.width),Platform.OS === "ios" && styles.fontIOS]}>
                        {formatSCurrency(currencyList, item.lastestPrice, item.tradingCurrency)}
                        <Text style={[style.textMain,style.fontSize,Platform.OS === "ios" && styles.fontIOS]}>{" "}/{" "}$ {convertToUSD(item.tradingCurrency, currencyConversion, currencyList, item.lastestPrice)}</Text>
                    </Text>
                </View>
                <Right style={{ borderBottomWidth: 0, alignItems: 'center', marginRight: 15 }}>
                    <Button style={[{
                        backgroundColor: item.priceChange < 0 ? '#ff315d' : (item.priceChange ? '#00d154' : '#486db4'),
                        width: 80, justifyContent: 'center', height: 30, borderRadius: 2
                    }]} disabled>
                        <Text
                            style={[item.priceChange != 0 ? style.textWhite : { color: '#fff' },Platform.OS === "ios" && styles.fontIOS]}>{item.priceChange > 0 && '+'}{formatSCurrency(currencyList, item.priceChange, '')} %</Text>
                    </Button>
                </Right>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    fontSize:{
        fontSize:12,alignSelf:"flex-end"
    },
    fontIOS:{
        fontFamily:"Roboto"
    }
})
const mapStateToProps = (state) => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        currencyList: state.commonReducer.currencyList
    }
}

export default connect(mapStateToProps, {})(MarketDataItem);
