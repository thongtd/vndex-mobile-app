import React from 'react';
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native';
import { Container, Content, Item } from 'native-base';
import { style } from "../../config/style";
import { authService } from "../../services/authenticate.service";
import Icon from 'react-native-vector-icons/FontAwesome';
import MarketDataItem from '../Home/MarketInfoItem';
import { connect } from 'react-redux';
import throttle from "lodash/throttle";
import { constant } from "../../config/constants";
import SignalRService from "../../services/signalr.service";
import SearchBar from '../Shared/SearchBar';
import { NavigationEvents } from "react-navigation";
import MarketItem from '../Trade/MarketItem';
import { styles } from "react-native-theme";
import { offEvent, getListenEvent } from '../../redux/action/common.action';
class HomeSearch extends React.Component {
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 500;
        this.marketData = [];
        this.state = {
            marketData: [],
            text: '',
            isLeave: false
        }
        // this.onUpdateMarketData = throttle(this.getMarketData, 200, { leading: true, trailing: false });
    }

    async getMarketWatch() {
        let marketData = await authService.getMarketWatch();
        this.marketData = marketData;
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.marketData !== this.props.marketData) {
            this.getMarketData(nextProps.marketData)
        }
    };

    getMarketData = (data) => {
        if (data && this.state.text.length > 0) {
            let { marketData, activeUnit } = this.state;
            for (let i in marketData) {
                let item = marketData[i];
                if (item.symbol === data.symbol && item.tradingCurrency === data.paymentUnit) {
                    marketData[i] = Object.assign({}, item, data);
                    break;
                }
            }
            var d = new Date();
            var n = d.getTime();
            if (n > this.timerNow + this.timer) {
                this.timerNow = n;

                this.setState({ marketData: marketData })
            }
        }
    }
    
    onSearch = (text) => {
        this.setState({ text });
        let x = [];
        if (text.length > 0) {
            this.marketData.forEach(e => {
                e.tradingCoins.forEach(el => {
                    if (el.pair.toUpperCase().indexOf(text.toUpperCase()) > -1) {
                        x.push(el)
                    }
                })
                this.setState({ marketData: x })
            })
        } else {
            this.setState({ marketData: x })
        }
    }

    componentDidMount() {
        this.getMarketWatch();
    }

    render() {
        // text => this.onSearch(text)
        // () => navigation.goBack()
        const { text, marketData } = this.state;
        const { navigation, currencyConversion,offEvent,getListenEvent } = this.props;
        return (
            <Container style={styles.bgMain}>
                <NavigationEvents
                    onWillFocus={(payload) => {
                        offEvent(false);
                        getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH])
                    }}
                    onWillBlur={() => {
                        offEvent(true);
                        getListenEvent([]);
                    }}
                />
                {/* <SignalRService
                    // getMarketData={this.onUpdateMarketData}
                    listen_event={[constant.SOCKET_EVENT.MARKET_WATCH]}
                    offEvent={this.state.isLeave}
                    activeTab={null}
                /> */}
                <SearchBar
                    text={text}
                    onChangeText={text => this.onSearch(text)}
                    handleBack={() => navigation.goBack()}
                />
                {
                    marketData.length > 0 &&
                    <FlatList
                        data={marketData}
                        renderItem={({ item, index }) => (
                            <MarketItem
                                navigation={navigation} currencyConversion={currencyConversion} data={item} index={index}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                    />
                }
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        marketData: state.marketReducer.marketData
    }
}

export default connect(mapStateToProps,{offEvent,getListenEvent})(HomeSearch);
