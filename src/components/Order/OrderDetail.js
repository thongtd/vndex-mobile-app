import React from 'react'
import {View, Text, Modal, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import {Item, Left, Right, Body, Container} from "native-base";
import {dimensions, formatSCurrency, to_UTCDate} from "../../config/utilities";
import {style} from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {tradeService} from "../../services/trade.service";
import {connect} from "react-redux";

class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDetail: []
        }
    }

    componentDidMount() {
        const {orderId} = this.props.navigation.state.params;
        tradeService.getOrderDetail(orderId).then(res => {
            this.setState({orderDetail: res})
        })
    }

    render() {
        const {orderDetail} = this.state
        const {navigation, currencyList} = this.props;
        const {symbol, paymentUnit} = this.props.navigation.state.params;
        return (
            <Container style={style.container}>
                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={this.props.visible}
                    onRequestClose={() => navigation.goBack()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.activityIndicatorWrapper, {height: dimensions.height / 1.2}]}>
                            <Item style={styles.item}>
                                <Left>
                                    <View style={[style.row, {alignItems: 'flex-end'}]}>
                                        <Text style={[style.textWhite, {fontSize: 18}]}>{symbol}</Text>
                                        <Text style={[style.textMain, {fontSize: 14, justifyContent:'space-between'}]}>/{paymentUnit}</Text>
                                    </View>
                                </Left>
                                <Right>
                                    <TouchableOpacity style={style.btnCloseModal}
                                                      onPress={() => this.props.navigation.goBack()}>
                                        <Icon name={"times"} style={style.textWhite}/>
                                    </TouchableOpacity>
                                </Right>
                            </Item>
                            <View style={{marginTop: 20, flex: 1}}>
                                <Item style={styles.item}>
                                    <Left>
                                        <Text style={style.textMain}>{"TIME".t()}</Text>
                                    </Left>
                                    <Body>
                                    <Text style={style.textMain}>{"PRICE".t()}</Text>
                                    </Body>
                                    <Right>
                                        <Text style={style.textMain}>{"EXEC".t()}</Text>
                                    </Right>
                                </Item>
                                <FlatList
                                    data={orderDetail}
                                    renderItem={({item, index}) => (
                                        <Item style={styles.item}>
                                            <Left>
                                                <Text style={style.textWhiteOp}>{to_UTCDate(item.createdDate,'DD-MM HH:mm:ss')}</Text>
                                            </Left>
                                            <Body>
                                            <Text style={style.textWhiteOp}>{formatSCurrency(currencyList, item.price, paymentUnit)}</Text>
                                            </Body>
                                            <Right>
                                                <Text style={style.textWhiteOp}>{formatSCurrency(currencyList,item.qtty,symbol)}</Text>
                                            </Right>
                                        </Item>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    extraData={this.state}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#0e1021',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#192240',
        width: dimensions.width - 20,
        height: dimensions.height / 1.2,
        padding: 10,
        display: 'flex',
    },
    item: {
        borderBottomWidth: 0
    },
    input: {
        backgroundColor: '#1d314a',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5
    }
})

const mapStateToProps = state => {
    return{
        currencyList: state.commonReducer.currencyList
    }
}
export default connect(mapStateToProps)(OrderDetail);
