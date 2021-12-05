import React from 'react';
import { View, ListView, RefreshControl, ScrollView, Animated, TouchableWithoutFeedback, Platform,AppState,DeviceEventEmitter } from 'react-native';
import { Container } from 'native-base';
import { style } from "../../config/style";
import { convertDate, convertTimeStamp, jwtDecode, to_UTCDate, to_UTCDate2 } from "../../config/utilities";
import { tradeService } from "../../services/trade.service";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux'
import { authService } from "../../services/authenticate.service";
import ConfirmModal from "../Shared/ConfirmModal";
import ContainerApp from "../Shared/ContainerApp"
import { constant } from "../../config/constants";
import SignalRService from "../../services/signalr.service";
import _ from "lodash"
import TableOrder from "./components/TableOrder"
import { setStatusBar, offEvent, getListenEvent } from "../../redux/action/common.action"
import Title from './components/Title';
import CheckBoxOrder from './components/CheckBoxOrder';
import OpenOrder from './components/OpenOrder';
import OrderHistory from './components/OrderHistory';
import ModalFilter from './components/ModalFilter';
import stylest from './styles';
import Logout from '../Shared/Logout';
import PickerSearch from '../Shared/PickerSearch';
import {styles} from "react-native-theme";
const date = new Date();
const prevDate = new Date(date);
prevDate.setMonth(prevDate.getMonth() - 1);
const _toDate = convertTimeStamp(date);
const _fromDate = convertTimeStamp(prevDate);
const toDate = convertDate(_toDate);
const fromDate = convertDate(_fromDate);

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.onEndReachedCalledDuringMomentum = true;
        this.page = 1;
        this.state = {
            isDateTimePickerVisible: false,
            isDateTimeToPickerVisible: false,
            openOrder: [],
            orderBook: [],
            allOrderBook: [],
            startDate: fromDate,
            endDate: toDate,
            paymentUnit: '',
            symbol: '',
            isCheckBuy: true,
            isCheckSell: true,
            initialPage: 0,
            side: null,
            sideBuy: 'B',
            sideSell: 'S',
            loading: true,
            isSwitch: false,
            activeTab: "O",
            symbolCoin: [],
            currency: [],
            totalPage: 0,
            page: 1,
            pageO: 1,
            is_confirm: false,
            is_confirm_all: false,
            orderIds: null,
            orderDetail: [],
            _i: null,
            expand: false,
            activeSymbol: null,
            orderDetails: [],
            title: null,
            content: null,
            ButtonOKText: null,
            isRefreshHistory: false,
            forPass: this.page === 1 ? true : false,
            isFilter: false,
            isNested: false,
            isOff: false,
            isNested2: false,
            isOff2: false,

        }
        this.endDate = to_UTCDate2(date, 'YYYY-MM-DD');
        this.startDate = to_UTCDate2(prevDate, 'YYYY-MM-DD');
        this.handleCheckBuy = this.handleCheckBuy.bind(this);
        this.handleCheckSell = this.handleCheckSell.bind(this)
    }

    //picker date from
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let _date = convertTimeStamp(date);
        let dateHuman = convertDate(_date);
        this.startDate = to_UTCDate(date, 'YYYY-MM-DD');
        this.setState({ startDate: dateHuman })
        this._hideDateTimePicker();
    };
    //picker date to
    _showDateTimeToPicker = () => this.setState({ isDateTimeToPickerVisible: true });

    _hideDateTimeToPicker = () => this.setState({ isDateTimeToPickerVisible: false });

    _handleDateToPicked = (date) => {
        let _date = convertTimeStamp(date);
        let dateHuman = convertDate(_date);
        this.endDate = to_UTCDate(date, 'YYYY-MM-DD');
        this.setState({ endDate: dateHuman })
        this._hideDateTimeToPicker();
    };
    //pair
    onChangeSymbol = (symbol) => {
        this.setState({
            symbol: symbol === 'ALL'.t() ? '' : symbol,
            isNested: false,
            isFilter: true
        })
    }

    onChangeCurrency = (paymentUnit) => {
        this.setState({
            paymentUnit: paymentUnit === 'ALL'.t() ? '' : paymentUnit,
            isNested2: false,
            isFilter: true
        })
    }

    //check side
    handleCheckBuy = () => {
        if (!this.state.isCheckBuy) {
            this.setState({ isCheckBuy: !this.state.isCheckBuy, sideBuy: 'B' })
        } else {
            this.setState({ isCheckBuy: !this.state.isCheckBuy, sideBuy: null })
        }
    }
    handleCheckSell = () => {
        if (!this.state.isCheckSell) {
            this.setState({ isCheckSell: !this.state.isCheckSell, sideSell: 'S' })
        } else {
            this.setState({ isCheckSell: !this.state.isCheckSell, sideSell: null })
        }
    }
    //handle search
    handleSearch = () => {
        let { symbol, paymentUnit, sideBuy, sideSell, activeTab } = this.state;
        this.setState({ loading: true, page: 1, pageO: 1 });
        let side;
        if (sideSell && sideBuy) {
            side = ''
            this.setState({ side })
        } else {
            side = sideSell || sideBuy;
            this.setState({ side })
        }
        if (activeTab === 'O') {
            this.getOpenOrder(1, this.startDate, this.endDate, symbol, paymentUnit, side);
            this.setState({
                isFilter: !this.state.isFilter,
                isOff: true,
                isOff2: true
            })
        } else {
            this.setState({
                isFilter: !this.state.isFilter,
                isOff: true,
                isOff2: true
            })
            this.getOrderBooks(1, this.startDate, this.endDate, symbol, paymentUnit, side)
        }
    }

    getOpenOrder = async (page, startDate, endDate, symbol, paymentUnit, side) => {
        let content = await jwtDecode();
        let accId = content.id;
        let response = await tradeService.getOpenOrder(accId, startDate, endDate, symbol, paymentUnit, side, page, 15);
        if (response.status === 200) {
            if (response.data.source) {
                this.setState({ openOrder: response.data.source, loading: false, page: this.state.page + 1 })
            }
        }
    }
    getOrderBooks = async (page, startDate, endDate, symbol, paymentUnit, side) => {
        let content = await jwtDecode();
        let accId = content.id;
        let response = await tradeService.getOrderBooks(accId, startDate, endDate, symbol, paymentUnit, side, page, 15);
        if (response.status === 200 && response.data.source) {
            this.setState({
                orderBook: response.data.source,
                allOrderBook: response.data.source,
                loading: false,
                totalPage: response.data.pages,
                pageO: this.state.pageO + 1,
                isRefreshHistory: false
            })
            if (response.data.source.length < 15) {
                this.setState({
                    forPass: false
                })
            } else if (response.data.source.length === 15) {
                this.setState({
                    forPass: true
                })
            }

        } else {
            this.setState({ loading: false, isRefreshHistory: false })
        }
    }
    _onEndReached = (startDate, endDate, symbol, paymentUnit, side) => {
        const { forPass } = this.state;
        if (!this.state.isRefreshHistory && forPass === true) {
            this.setState({
                forPass: false
            }, () => {
                console.log("roi vao trong roi")
                this.page = this.page + 1; // increase page by 1
                this.fetchOrderBook(startDate, endDate, symbol, paymentUnit, side, this.page) // method for API call )

            })

        }
    }
    fetchOrderBook = async (startDate, endDate, symbol, paymentUnit, side, page) => {
        this.setState({
            isRefreshHistory: true
        })
        var self = this;
        try {
            let content = await jwtDecode();
            let accId = content.id;
            let response = await tradeService.getOrderBooks(accId, startDate, endDate, symbol, paymentUnit, side, page, 15);
            if (response.status === 200 && response.data.source.length > 0 && this.state.orderBook.length > 0) {
                var { orderBook, allOrderBook } = await self.state;
                var orders = await orderBook.concat(response.data.source);
                var allOrders = await allOrderBook.concat(response.data.source)
                self.setState({
                    orderBook: orders,
                    allOrderBook: allOrders,
                    isRefreshHistory: false,
                    forPass: true
                })
            }
        } catch (error) {
            self.setState({
                isRefreshHistory: false
            })
        }

    }

    _onEndReachedO = async (startDate, endDate, symbol, paymentUnit, side) => {
        let openOrder = [];
        let content = await jwtDecode();
        let accId = content.id;
        let response = await tradeService.getOpenOrder(accId, startDate, endDate, symbol, paymentUnit, side, this.state.pageO, 15);
        if (response.status === 200 && response.data.source) {
            openOrder = response.data.source;
            this.setState({ openOrder: this.state.openOrder.concat(openOrder), pageO: this.state.pageO + 1 })
        }

    }

    openConfirm = (data, rowMap, secId, rowId) => {
        this.cancelOrder(data.id)
        setTimeout(() => {
            if (rowMap[`${secId}${rowId}`] !== null) {
                rowMap[`${secId}${rowId}`].closeRow()
            }
        }, 200)
    }


    async cancelOrder(ids) {
        let orderIds = [ids];
        let content = await jwtDecode();
        let accId = content.id;
        let res = await tradeService.cancel_order(accId, orderIds);
        if (res.status == 200) {
            this.setState({ is_confirm: false })
            this.getOpenOrder();
            this.getOrderBooks();
        } else {
            this.setState({
                is_confirm: true,
                content: res.message.t(),
                title: "ERROR".t()
            })
        }
    }

    cancelAll = async () => {
        let orderIds = [];
        this.state.openOrder.forEach(e => {
            orderIds.push(e.id)
        })
        let content = await jwtDecode();
        let accId = content.id;
        let res = await tradeService.cancel_order(accId, orderIds);
        if (res.status == 200) {
            this.setState({ is_confirm_all: false })
            this.getOpenOrder();
            this.getOrderBooks();
        } else {
            this.setState({ is_confirm_all: false })
        }
    }

    handleSwitch = () => {
        let isSwitch = !this.state.isSwitch;
        this.setState({ isSwitch });
    }

    onRefresh = () => {
        this.setState({
            startDate: fromDate,
            endDate: toDate,
            symbol: '',
            paymentUnit: '',
            page: 1,
            pageO: 1,
            isCheckBuy: true,
            isCheckSell: true,
            forPass: true
        }, () => {
            this.startDate = to_UTCDate2(prevDate, 'YYYY-MM-DD');
            this.endDate = to_UTCDate2(date, 'YYYY-MM-DD');
            this.page = 1;
            this.getOpenOrder(1, this.startDate, this.endDate);
            this.getOrderBooks(1, this.startDate, this.endDate);
        });
    }

    async getWalletInfo() {
        let symbolCoin = [], currency = [];
        let user = await jwtDecode();
        let cryptoWallet = await authService.getCrytoWallet(user.id);
        let fiatWallet = await authService.getFiatWallet(user.id);
        cryptoWallet.forEach(e => {
            symbolCoin.push({ value: e.symbol })
        })
        fiatWallet.forEach(e => {
            currency.push({ value: e.currency })
        })
        this.setState({ symbolCoin, currency });
    }

    getOrderDetail = (orderId, index, activeSymbol) => {
        const { orderDetails } = this.state;
        this.setState({ activeSymbol, orderDetail: [] });
        if (index === this.state._i) {
            this.setState({ expand: false })
        }
        else {
            if (!orderDetails[index]) {
                tradeService.getOrderDetail(orderId).then(res => {
                    orderDetails[index] = res;
                    this.setState({
                        orderDetail: res,
                        orderDetails,
                    })
                })
            }
            this.setState({
                _i: index,
                expand: true
            })
        }
    }

    componentWillMount() {
         this.getOpenOrder(1, this.startDate, this.endDate);
         this.getWalletInfo();
         this.getOrderBooks(1, this.startDate, this.endDate);
    }
    componentDidMount = () => {
      AppState.addEventListener("change",this.handleChange)
    };
    handleChange=(AppState)=>{
        if(AppState === "active"){
            this.onRefresh();
        }
    }
    componentWillUnmount() {
        AppState.removeEventListener("change",this.handleChange)
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.walletBalanceChange.walletBalances !== this.props.walletBalanceChange.walletBalances) {
            console.log("da vao roi2");
            this.getOpenOrder(1, this.startDate, this.endDate);
            this.getOrderBooks(1, this.startDate, this.endDate);
        }
    };

     componentDidUpdate(prevProps, prevState) {
        if (prevProps.tradingMatchOrder !== this.props.tradingMatchOrder) {
            this.getOpenOrder(1, this.startDate, this.endDate);
            this.getOrderBooks(1, this.startDate, this.endDate);
        }
    }


    render() {
        const { currencyList, navigation,offEvent,getListenEvent } = this.props;
        const {
            loading, openOrder, orderBook, activeTab, startDate, endDate, symbol, paymentUnit, isCheckBuy, isCheckSell, isSwitch, symbolCoin, currency, is_confirm, side, is_confirm_all, orderDetail, activeSymbol, content, title, ButtonOKText, isRefreshHistory,
        } = this.state;
        let date = new Date();
        let fromDate = new Date(date);
        fromDate.setMonth(fromDate.getMonth() - 1);
        return (
            <Container style={[{ paddingBottom: 0, backgroundColor: styles.bgMain.color }]}>
                <NavigationEvents
                    onDidFocus={(payload) => {
                        DeviceEventEmitter.emit('eventScreen', {name:"ORDERS"});
                      
                    }}
                    onWillFocus={() => {
                        this.props.setStatusBar(style.colorWithdraw)
                        this.onRefresh();
                        offEvent(true)

                        getListenEvent([]);
                    }}
                    onWillBlur={()=>{
                        offEvent(true);
                        getListenEvent([]);
                    }}
                />
                <Logout
                    navigation={navigation}
                />
                {/* <SignalRService
                    listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
                <Title
                    onPress={() => this.setState({
                        isFilter: !this.state.isFilter
                    })}
                    isFilter={this.state.isFilter}
                />
                <ModalFilter
                    visible={this.state.isFilter}
                    onRequestClose={
                        () => this.setState({
                            isFilter: false,
                        })}
                    onDismiss={() => {
                        if (!this.state.isOff) {
                            this.setState({
                                isNested: true,
                            })
                        } else if (!this.state.isOff2) {
                            this.setState({
                                isNested2: true,
                            })
                        }
                    }}
                    isView={
                        <View style={{ flex: 1, }}>
                            <TouchableWithoutFeedback
                                style={stylest.ModalFilter}
                                onPress={
                                    () => this.setState({
                                        isFilter: false,
                                        isOff: true,
                                        isOff2: true
                                    })
                                }
                            >
                                <View style={stylest.ModalFilter} />
                            </TouchableWithoutFeedback>
                            <Title
                                onPress={() => this.setState({
                                    isFilter: !this.state.isFilter,
                                    isOff: true,
                                    isOff2: true
                                })}
                                isFilter={this.state.isFilter}
                            />
                            <TableOrder
                                _showDateTimePicker={this._showDateTimePicker}
                                startDate={startDate}
                                isDateTimePickerVisible={this.state.isDateTimePickerVisible}
                                _handleDatePicked={this._handleDatePicked}
                                _hideDateTimePicker={this._hideDateTimePicker}
                                fromDate={fromDate}
                                _showDateTimeToPicker={this._showDateTimeToPicker}
                                endDate={endDate}
                                isDateTimeToPickerVisible={this.state.isDateTimeToPickerVisible}
                                _handleDateToPicked={this._handleDateToPicked}
                                _hideDateTimeToPicker={this._hideDateTimeToPicker}
                                symbol={symbol}
                                onChangeSymbol={this.onChangeSymbol}
                                symbolCoin={symbolCoin}
                                paymentUnit={paymentUnit}
                                onChangeCurrency={this.onChangeCurrency}
                                currency={currency}
                                isCheckBuy={isCheckBuy}
                                handleCheckBuy={this.handleCheckBuy}
                                isCheckSell={isCheckSell}
                                handleCheckSell={this.handleCheckSell}
                                handleSearch={this.handleSearch}
                                onPressChange={(data) => this.setState({
                                    isFilter: false,
                                    isOff: false,
                                    isOff2: true,

                                })}
                                onBackChange={(data) => this.setState({
                                    isFilter: true,
                                    isOff: false,
                                })}
                                onPressChange2={() => this.setState({
                                    isOff2: false,
                                    isOff: true,
                                    isFilter: false,
                                })}
                            />
                        </View>
                    }
                />
                <View style={{
                    flex: 1
                }}>
                    <ContainerApp backgroundStyle={null} styled={{ marginVertical: 10, backgroundColor: styles.bgMain.color }}>
                        <CheckBoxOrder
                            onCheckB={() => {
                                this.setState({ activeTab: "O", isCheckBuy: true, isCheckSell: true })
                            }}
                            activeTab={activeTab}
                            onCheckS={() => {
                                this.setState({ activeTab: "R", isCheckBuy: true, isCheckSell: true })
                            }}
                            onCancelAll={() => {
                                this.setState({ is_confirm_all: true })
                            }}
                            isSwitch={isSwitch}
                            handleSwitch={this.handleSwitch}
                        />
                        {Platform.OS === "ios" && <PickerSearch
                            textCenter={" - "}
                            headerItem={{id:null, value: "ALL".t() }}
                            hiddenBtn={true}
                            isNested={this.state.isNested}
                            label={["value"]}
                            value={"value"}
                            onValueChange={this.onChangeSymbol}
                            selectedValue={symbol}
                            source={symbolCoin}
                            placeholder={'ALL'.t()}
                            textStyle={style.textMain}
                            caretStyle={{
                                color: style.textMain.color,
                                fontSize: 18
                            }}
                            hasNested={Platform.OS === "ios" ? true : false}
                            onPressChange={(data) => this.setState({
                                isFilter: false,
                                isOff: false
                            })}
                            onBackChange={(data) => this.setState({
                                isFilter: true,
                                isOff: false,
                                isNested: false,
                            })}
                            onDismiss={() => {
                                this.setState({
                                    isNested: false,
                                    isFilter: true,
                                    isOff: false
                                })
                            }}
                        />}

                        {Platform.OS === "ios" && <PickerSearch
                            textCenter={" - "}
                            headerItem={{value: "ALL".t()}}
                            hiddenBtn={true}
                            isNested={this.state.isNested2}
                            label={["value"]}
                            value={"value"}
                            onValueChange={this.onChangeCurrency}
                            selectedValue={paymentUnit}
                            source={currency}
                            placeholder={'ALL'.t()}
                            textStyle={style.textMain}
                            caretStyle={{
                                color: style.textMain.color,
                                fontSize: 18
                            }}
                            hasNested={Platform.OS === "ios" ? true : false}
                            onPressChange={(data) => this.setState({
                                isFilter: false,
                                isOff2: false
                            })}
                            onBackChange={(data) => this.setState({
                                isFilter: true,
                                isOff2: false,
                                isNested2: false,
                            })}
                            onDismiss={() => {
                                this.setState({
                                    isNested2: false,
                                    isFilter: true,
                                    isOff2: false
                                })
                            }}
                        />}

                        <OpenOrder
                            loading={loading}
                            onRefresh={this.onRefresh}
                            activeTab={activeTab}
                            openOrder={openOrder}
                            dataSource={this.ds.cloneWithRows(openOrder)}
                            currencyList={currencyList}
                            onCancel={(data, rowMap, secId, rowId) => this.openConfirm(data, rowMap, secId, rowId)}
                        />
                        <OrderHistory
                            paymentUnit={paymentUnit}
                            loading={loading}
                            onRefresh={this.onRefresh}
                            orderBook={orderBook}
                            activeTab={activeTab}
                            isSwitch={this.state.isSwitch}
                            getOrderDetail={(orderId, index, symbol) => this.getOrderDetail(orderId, index, symbol)}
                            currencyList={currencyList}
                            orderDetails={this.state.orderDetails}
                            _i={this.state._i}
                            expand={this.state.expand}
                            activeSymbol={activeSymbol}
                            extraData={this.state}
                            isRefreshHistory={isRefreshHistory}
                            onEndReached={() => {
                                if (activeTab === "O") {
                                    this._onEndReachedO(this.startDate, this.endDate, symbol, paymentUnit, side)
                                } else {
                                    this._onEndReached(this.startDate, this.endDate, symbol, paymentUnit, side)
                                }
                            }}
                        />
                    </ContainerApp>
                </View>
                {/* </ScrollView> */}
                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => this.cancelOrder()}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText} ButtonCloseText={"CLOSE".t()}
                />
                <ConfirmModal
                    visible={is_confirm_all} title={"CANCEL_ORDERS".t()} content={"CANCEL_ALL_CONFIRM".t()}
                    onClose={() => this.setState({ is_confirm_all: false, resultType: "", resultText: "" })}
                    onOK={() => this.cancelAll()}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={"OK".t()} ButtonCloseText={"CLOSE".t()}
                />
            </Container>
        )
    }
}


const mapStateToProps = state => {
    return {
        currencyList: state.commonReducer.currencyList,
        tradingMatchOrder: state.tradeReducer.tradingMatchOrder,
        walletBalanceChange: state.tradeReducer.walletBalanceChange
    }
}
export default connect(mapStateToProps, { setStatusBar,offEvent,getListenEvent })(Order);
