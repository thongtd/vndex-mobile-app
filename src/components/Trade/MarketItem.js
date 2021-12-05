import React from "react";
import { Body, Button, Left, ListItem, Right, Thumbnail } from "native-base";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { style } from "../../config/style";
import { checkDimension, convertToUSD, dimensions, formatCurrency, formatSCurrency } from "../../config/utilities";
import { marketService } from "../../services/market.service";
import { connect } from 'react-redux'
import { getCurrency, getLanguage } from "../../redux/action/common.action";
import { getConversion } from "../../redux/action/trade.action";
import Icon from 'react-native-vector-icons/FontAwesome';
import { tradeService } from "../../services/trade.service";
import theme,{ styles } from 'react-native-theme';
import TouchableOpacityFnx from "../Shared/TouchableOpacityFnx";

class MarketItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currencyList: [],
            is_favorite:false
        }
    }
    componentDidMount = () => {
        const item = this.props.data;
      this.checkFavorite(item.pair);
      theme.setRoot(this)
    };
    
    checkFavorite(pair) {
        tradeService.checkFavorite(pair).then((is_favorite) => {
            this.setState({ is_favorite })
        })
    }
    componentWillReceiveProps = (nextProps) => {
      this.checkFavorite(nextProps.data.pair)
    };
    
    render() {
        const item = this.props.data;
        const { index, currencyConversion, navigation, currencyList, _i,notFavorite,length } = this.props;
        // console.log(index,length,"length va i");
        return (
            <React.Fragment>
                <View style={{
                    overflow: "hidden"
                }}>
                    {this.state.is_favorite && !notFavorite && (
                        <View style={{
                        width: 40,
                        height: 20,
                        backgroundColor: style.bgHeader.backgroundColor,
                        position: "absolute",
                        left: -13,
                        top: -8,
                        transform: [ { rotateZ: '-45deg' }],
                    }}>
                        <Icon style={{
                            paddingLeft:10,
                            paddingTop:7
                        }} name="star" size={12} color="yellow" />

                    </View>
                    )}
                    
                    <TouchableOpacityFnx
                        style={{ overflow: "hidden", paddingHorizontal:notFavorite?0:10, borderBottomWidth:(length && index === length)?0:0.5,paddingVertical:10, borderBottomColor: styles.borderBottomItem.color, flexDirection: 'row',}}
                        key={index}
                        onPress={() => navigation.navigate('Trade', { tradingCoin: item, _i: _i })}
                    >
                        <Left style={{ flex: 0.4 }}>
                            <Thumbnail small source={{ uri: item.image }}
                                style={{ width: 16, height: 16 }} square />
                        </Left>
                        <View style={{ borderBottomWidth: 0, flex: 1.4 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.textWhite,styles.M_fontSize15,{fontWeight:"600"} ]}>{item.symbol}</Text>
                                <Text style={[styles.textWhiteOp, { fontSize: 12, alignSelf: "flex-end" }]}>{" "}/{" "}{item.tradingCurrency}</Text>
                            </View>
                            <Text style={[styles.textMain, styles.M_fontSize]}>
                                {formatSCurrency(currencyList, item.currencyVolume, item.tradingCurrency)}
                            </Text>
                        </View>
                        <View style={{ borderBottomWidth: 0, flex: 1.6 }}>
                        <Text style={[item.priceChange < 0 ? styles.bgSellOldNew : (item.priceChange > 0 ? styles.bgBuyOldNew : styles.textWhite), checkDimension(dimensions.width),styles.M_fontSize15]}
                            >{formatSCurrency(currencyList, item.lastestPrice, item.tradingCurrency)}
                            </Text>
                            <Text style={[styles.textMain, styles.M_fontSize]}>{"$ "} {convertToUSD(item.tradingCurrency, currencyConversion, currencyList, item.lastestPrice)}</Text>
                        </View>
                        <Right style={{ borderBottomWidth: 0,  alignItems: 'flex-end' }}>
                            <TouchableOpacity style={[{
                               backgroundColor: item.priceChange < 0 ? '#ff315d' : (item.priceChange ? '#00d154' : '#486db4'),
                               width: 80, justifyContent: 'center',alignItems:"center", height: 30, borderRadius: 2
                            }]} disabled>
                                <Text
                                    style={[item.priceChange != 0 ? style.textWhite : { color: '#fff' },styles.M_fontSize15]}>{item.priceChange > 0 && '+'}{formatSCurrency(currencyList, item.priceChange, '')} %</Text>
                            </TouchableOpacity>
                        </Right>
                    </TouchableOpacityFnx>
                </View>
            </React.Fragment>

        );
    }
}

// const styles = StyleSheet.create({
//     fontSize: {
//         fontSize: 12,paddingTop:4
//     },
//     fontSize15:{
//         fontSize: 15
//     },
// })
const mapStateToProps = (state) => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        currencyList: state.commonReducer.currencyList
    }
}

export default connect(mapStateToProps, {})(MarketItem);
