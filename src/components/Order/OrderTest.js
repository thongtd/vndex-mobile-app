import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ListView,
    Alert,
    RefreshControl,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform,
    Animated
} from 'react-native';
import {
    Container,
    Content,
    Item,
    Left,
    Right,
    CheckBox,
    Button,
    Tabs,
    Tab,
    TabHeading,
    Body,
    ListItem,
    Switch,
    List, Picker
} from 'native-base';
import { styles } from "./styles"

import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import { EXCHANGE_API } from "../../config/API";
import {
    convertDate,
    convertDatetime,
    convertTimeStamp,
    convertUTC, dimensions,
    formatCurrency,
    jwtDecode,
    formatSCurrency, to_UTCDate, checkDimension
} from "../../config/utilities";
import { tradeService } from "../../services/trade.service";
import { SwipeListView } from 'react-native-swipe-list-view';
import ModalDropdown from 'react-native-modal-dropdown';
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux'
import { authService } from "../../services/authenticate.service";
import ConfirmModal from "../Shared/ConfirmModal";
import ContainerApp from "../Shared/ContainerApp"
import { constant } from "../../config/constants";
import SignalRService from "../../services/signalr.service";
import _ from "lodash"
import TableOrder from "./components/TableOrder"
const { width, height } = Dimensions.get('window')

class OrderTest extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        isTabO:true
      }
    }
    
  render() {
    return (
        <Container style={[{ paddingBottom: 0, backgroundColor: '#171d2f' }]}>
        <NavigationEvents
            onDidFocus={(payload) => {
                // this.onRefresh()
            }}
        />
        {/* <SignalRService
            // manualStop={this.state.socketStopped}
            listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
        <Item style={[style.container, { padding: 12, borderBottomWidth: 0, backgroundColor: '#1e283e' }]}>
            <Left><Text
                style={[style.textWhite, style.fontSize18, { fontWeight: '500' }]}>{"ORDERS".t()}</Text></Left>
            <Right />
        </Item>
        <ScrollView
            style={{ flex: 1 }}
            // refreshControl={
            //     <RefreshControl refreshing={loading} onRefresh={this.onRefresh} />
            // }
            showsVerticalScrollIndicator={false}
            // onScrollEndDrag={}
            extraData={this.state}
        >
            <View>
                <TableOrder
                    // _showDateTimePicker={this._showDateTimePicker}
                    // startDate={startDate}
                    // isDateTimePickerVisible={this.state.isDateTimePickerVisible}
                    // _handleDatePicked={this._handleDatePicked}
                    // _hideDateTimePicker={this._hideDateTimePicker}
                    // fromDate={fromDate}
                    // _showDateTimeToPicker={this._showDateTimeToPicker}
                    // endDate={endDate}
                    // isDateTimeToPickerVisible={this.state.isDateTimeToPickerVisible}
                    // _handleDateToPicked={this._handleDateToPicked}
                    // _hideDateTimeToPicker={this._hideDateTimeToPicker}
                    // symbol={symbol}
                    // onChangeSymbol={this.onChangeSymbol}
                    // symbolCoin={symbolCoin}
                    // paymentUnit={paymentUnit}
                    // onChangeCurrency={this.onChangeCurrency}
                    // currency={currency}
                    // isCheckBuy={isCheckBuy}
                    // handleCheckBuy={this.handleCheckBuy}
                    // isCheckSell={isCheckSell}
                    // handleCheckSell={this.handleCheckSell}
                    // handleSearch={this.handleSearch}
                />

                <ContainerApp backgroundStyle={null} styled={{ marginVertical: 10, backgroundColor: '#171d2f', height: '100%' }}>
                    <Item style={styles.item}>
                        <Left style={{ flex: 3 }}>
                            <View style={[style.row, { justifyContent: 'center', alignItems: 'center', }]}>
                                <TouchableOpacity onPress={() => {
                                    // this.setState({ isTabO: "O", isCheckBuy: true, isCheckSell: true })
                                }}
                                    style={[style.tabOrderHeading,
                                    {
                                        borderBottomWidth: isTabO ? 2 : 1,
                                        borderBottomColor: isTabO ? '#4272ec' : '#193870'
                                    }]}>
                                    <Text style={isTabO  ? {
                                        color: '#78afff',
                                        fontSize: 13
                                    } : style.textMain}>{'OPEN_ORDERS'.t()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    // this.setState({ isTabO: "R", isCheckBuy: true, isCheckSell: true })
                                }}
                                    style={[style.tabOrderHeading,
                                    {
                                        borderBottomWidth: !isTabO  ? 2 : 1,
                                        borderBottomColor: !isTabO  ? '#4272ec' : '#193870'
                                    }]}>
                                    <Text style={!isTabO ? {
                                        color: '#78afff',
                                        fontSize: 13
                                    } : style.textMain}>{'ORDER_HISTORY'.t()}</Text>
                                </TouchableOpacity>
                            </View>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            {isTabO  ?
                                <Button onPress={() => {
                                    // this.setState({ is_confirm_all: true })
                                }} style={style.btnCancelAll}>
                                    <Text style={[style.textWhite, { fontSize: 12 }]}>{'CANCEL_ALL'.t()}</Text>
                                </Button>
                                :
                                <Switch value={} onValueChange={} />
                            }
                        </Right>
                    </Item>
                    {
                        isTabO ? (openOrder.length > 0 ?
                            <View>
                                <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={style.textMain}>{'PRICE'.t()}</Text>
                                    </View>
                                    <View style={{ flex: 1.5, alignItems: 'flex-end', paddingRight: 15 }}>
                                        <Text style={style.textMain}>{'AMOUNT'.t()}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={style.textMain}>{'TIME'.t()}</Text>
                                    </View>
                                </View>
                                <SwipeListView
                                    dataSource={}
                                    renderRow={(e, i) => (
                                        <Item style={{
                                            backgroundColor: '#1c2840',
                                            marginBottom: 2.5,
                                            flex: 1,
                                            paddingVertical: 7.5,
                                            paddingHorizontal: 15,
                                            marginTop: 2.5,
                                            borderBottomWidth: 0
                                        }} key={i}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={}>{}<Text
                                                        style={style.textMain}>/{}</Text></Text>
                                                <Text
                                                    style={style.textWhite}>{}</Text>
                                            </View>
                                            <View style={{
                                                flex: 1.5,
                                                alignItems: 'flex-end',
                                                paddingLeft: 5,
                                                paddingRight: 15
                                            }}>
                                                {/*<Text style={style.textMain}>{'AMOUNT'.t()}</Text>*/}
                                                <Text
                                                    style={[style.textWhite, checkDimension(width)]}>{}</Text>
                                                <Text
                                                    style={[style.textMain, checkDimension(width)]}>{}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Text
                                                    style={style.textWhite}>{}</Text>
                                                <Text
                                                    style={[style.textMain]}>{}</Text>
                                            </View>
                                        </Item>
                                    )}
                                    renderHiddenRow={(data, secId, rowId, rowMap) => (
                                        <Item style={style.btnTrash}
                                            onPress={
                                                // () => this.openConfirm(data, rowMap, secId, rowId)
                                            }
                                        >
                                            <View style={{
                                                width: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name={'trash'} color={'#fff'} size={20} />
                                            </View>
                                        </Item>
                                    )}
                                    rightOpenValue={-50}
                                    disableRightSwipe={true}
                                />
                            </View>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name={'file'} size={30} color={'#323232'} />
                                <Text style={{ color: '#323232' }}>{'NO_DATA_TO_EXPORT'.t()}</Text>
                            </View>) : null
                    }
                    {
                        !isTabO  ? (orderBook.length > 0 ?
                            <View style={{ paddingHorizontal: 0 }}>
                                <Item style={[styles.item, { marginHorizontal: 5 }]}>
                                    <Left style={{ flex: 1, paddingLeft: 5 }}>
                                        <Text style={style.textMain}>{'PAIR'.t()}</Text>
                                    </Left>
                                    <Body style={{ alignItems: 'flex-end', flex: 1.5, paddingLeft: 10 }}>
                                        <Text style={style.textMain}>{'AVG__PRICE'.t()}</Text>
                                    </Body>
                                    <Right style={{ alignItems: 'flex-end', flex: 2 }}>
                                        <Text style={style.textMain}>{'FILLED__AMOUNT'.t()}</Text>
                                    </Right>
                                </Item>
                                <FlatList
                                    data={!this.state.isSwitch ? orderBook : orderBook.filter(e => e.avgPrice !== 0 && e.orderPrice)}
                                    renderItem={({ item, index }) => (
                                        <View>
                                            <Item
                                                style={{
                                                    paddingVertical: 7.5,
                                                    paddingHorizontal: 15,
                                                    // height:50,
                                                    backgroundColor: item.orderPrice !== 0 ? '#1c2840' : "#162033",
                                                    marginBottom: 0,
                                                    marginTop: 5,
                                                    borderBottomWidth: 0,
                                                    flex: 1
                                                }}
                                                onPress={
                                                    // () => item.orderPrice !== 0 ? this.getOrderDetail(item.orderId, index, item.symbol) : null
                                                    }>
                                                <Left style={{
                                                    backgroundColor: 'transparent',
                                                    flex: 1.3,
                                                    // paddingRight: 15
                                                }}>
                                                    <Text
                                                        style={item.side === 'S' ? style.textRed : style.textGreen}>{item.symbol}<Text
                                                            style={style.textMain}>/{item.paymentUnit}</Text></Text>
                                                    <Text
                                                        style={[style.textMain, {
                                                            fontSize: 10,
                                                            lineHeight: 19
                                                        }]}>{
                                                            // convertUTC(item.createdDate)
                                                            }</Text>
                                                </Left>
                                                <Body style={{
                                                    alignItems: 'flex-end',
                                                    flex: 1.5,
                                                    paddingRight: 10
                                                }}>
                                                    <Text
                                                        style={[style.textWhite, checkDimension(width)]}>{
                                                            // item.avgPrice === 0 ? 0 : formatSCurrency(currencyList, item.avgPrice, item.paymentUnit)
                                                            }</Text>
                                                    <Text
                                                        style={[style.textMain, checkDimension(width)]}>
                                                        
                                                        {/* {item.orderPrice === 0 ? 0 : formatSCurrency(currencyList, item.orderPrice, item.paymentUnit)} */}
                                                        
                                                        </Text>
                                                </Body>
                                                <Right style={{ alignItems: 'flex-end', flex: 2 }}>
                                                    <Text
                                                        style={style.textWhite}>{
                                                            // formatSCurrency(currencyList, item.matchQtty, item.symbol)
                                                            }</Text>
                                                    <Text
                                                        style={style.textMain}>{
                                                            // formatSCurrency(currencyList, item.orderQtty, item.symbol)
                                                            }</Text>
                                                </Right>
                                            </Item>
                                            {
                                                // this.state.orderDetails[index] && this.state._i == index &&
                                                //     this.state.expand ?
                                                    <View style={{
                                                        margin: 0,
                                                        marginLeft: 2,
                                                        paddingBottom: 7.5,
                                                        flex: 1,
                                                        borderWidth: 1,
                                                        borderColor: '#1c2840',
                                                        borderTopWidth: 0
                                                    }}>
                                                        <Item style={[styles.item, {
                                                            paddingHorizontal: 5,
                                                            paddingBottom: 0,
                                                            paddingTop: 7.5
                                                        }]}>
                                                            <Left
                                                                style={{ flex: 1 }}>
                                                                <Text
                                                                    style={style.textMain}>{"TIME".t()}</Text>
                                                            </Left>
                                                            <Body
                                                                style={{
                                                                    flex: 1,
                                                                    alignItems: 'flex-end',
                                                                    alignSelf: 'flex-end'
                                                                }}>
                                                                <Text
                                                                    style={style.textMain}>{"PRICE".t()}</Text>
                                                            </Body>
                                                            <Right
                                                                style={{ flex: 1.25 }}>
                                                                <Text
                                                                    style={style.textMain}>{"EXEC".t()}</Text>
                                                            </Right>
                                                        </Item>
                                                        <FlatList
                                                            data={
                                                                // this.state.orderDetails[index]
                                                            }
                                                            renderItem={({ item }) => (
                                                                <Item style={{
                                                                    paddingHorizontal: 5,
                                                                    paddingBottom: 0,
                                                                    paddingTop: 5,
                                                                    borderBottomWidth: 0
                                                                }}>
                                                                    <Left
                                                                        style={{ flex: 1 }}>
                                                                        <Text
                                                                            style={style.textWhiteOp}
                                                                            numberOfLines={1}>{
                                                                                // to_UTCDate(item.createdDate, 'DD-MM HH:mm:ss')
                                                                                
                                                                                }</Text>
                                                                    </Left>
                                                                    <Body
                                                                        style={{
                                                                            flex: 1,
                                                                            alignItems: 'flex-end'
                                                                        }}>
                                                                        <Text
                                                                            style={style.textWhiteOp}>{
                                                                                // formatSCurrency(currencyList, item.price, paymentUnit)
                                                                                
                                                                                }</Text>
                                                                    </Body>
                                                                    <Right
                                                                        style={{ flex: 1.25 }}>
                                                                        <Text
                                                                            style={style.textWhiteOp}>{
                                                                                // formatSCurrency(currencyList, item.qtty, activeSymbol)
                                                                                }</Text>
                                                                    </Right>
                                                                </Item>
                                                            )}
                                                            keyExtractor={(item, index) => index.toString()}
                                                            extraData={this.state}
                                                        />
                                                    </View>
                                                    // :
                                                    // null
                                            }
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    extraData={this.state}
                                    // maxToRenderPerBatch={15}
                                    ListFooterComponent={() => {
                                        // if (!isRefreshHistory) return null;
                                        return (
                                            <ActivityIndicator size="small" color="#06ffff" />
                                        );
                                    }}
                                    onEndReachedThreshold={0.4}
                                    onEndReached={
                                        () => {
                                            
                                        }
                                    }

                                />

                            </View>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name={'file'} size={30} color={'#323232'} />
                                <Text style={{ color: '#323232' }}>{'NO_DATA_TO_EXPORT'.t()}</Text>
                            </View>
                        ) : null
                    }
                </ContainerApp>

                {/* </View> */}
            </View>
        </ScrollView>
        {/* <ConfirmModal
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
        /> */}
    </Container>
    )
  }
}
export default OrderTest;