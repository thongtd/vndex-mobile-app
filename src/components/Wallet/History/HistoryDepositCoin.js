import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, StatusBar } from 'react-native';
import { Button, Container, Header, Item, Left, Right } from 'native-base';
import { style } from "../../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatCurrency, to_UTCDate } from "../../../config/utilities";
import { HeaderFnx } from '../../Shared'
import { setStatusBar } from "../../../redux/action/common.action"
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation"
import ContainerFnx from '../../Shared/ContainerFnx';
import {styles} from "react-native-theme";
// import console = require('console');
class HistoryDepositCoin extends React.Component {
    constructor(props) {
        super(props);
        const { data } = this.props.navigation.state.params;
        console.log(data, "data");
        this.state = {
            symbol: data.currency,
            createdDate: data.createdDate,
            status: data.statusLable,
            value: data.amount,
            address: data.address,
            txId: data.txId,
            blockchainScan: data.blockchainScan,
        }
    }

    render() {
        const { createdDate, symbol, status, value, blockchainScan, address, txId, tag } = this.state;
        const { navigation } = this.props;
        return (
            <ContainerFnx
            spaceTop={0}
                title={`${'DEPOSITS'.t()} ${symbol}`}
                hasBack
                navigation={navigation}
                style={style.bgHeader}
                colorStatus={style.bgHeader.backgroundColor}
            >
                <View
                    style={[{ flex: 1 }]}
                >
                    <View
                    >
                        <Item style={[stylest.itemTab, { paddingVertical: 20 }]}>
                            <Left>
                                <Text style={[styles.txtMainTitle, { marginLeft: -3 }]}>{to_UTCDate(createdDate, 'DD-MM-YYYY HH:MM:SS')}</Text>
                            </Left>
                        </Item>
                        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
                            <View>
                                <Text
                                    style={[styles.txtMainTitle, { marginBottom: 5 }]}>{'STATUS'.t()}</Text>
                                <Text
                                    style={[styles.textWhite, { fontWeight: 'bold' }]}>{`PAYMENT_STATUS.${status.toUpperCase()}`.t()}
                                </Text>
                            </View>
                            <View style={{ marginLeft: 40 }}>
                                <Text style={[styles.txtMainTitle, { marginBottom: 5 }]}>{'VALUE'.t()}</Text>
                                <Text
                                    style={[styles.textWhite, { fontWeight: 'bold' }]}>{formatCurrency(Number(value))}</Text>
                            </View>
                            <Right />
                        </View>
                        <Text style={[styles.txtMainTitle, { marginBottom: 15 }]}>{'ADDRESS'.t()}</Text>
                        <Text style={{ marginBottom: 10, color: styles.txtHl.color }}
                            onPress={() => Linking.openURL(blockchainScan.address)}>{address}</Text>
                        <Text style={styles.txtMainTitle}>TxId</Text>
                        <Text style={{ color: styles.txtHl.color, marginBottom: 40, marginTop: 10 }}
                            onPress={() => Linking.openURL(blockchainScan.tx)}>{txId}</Text>
                    </View>
                </View>
            </ContainerFnx>

        );
    }
}
const stylest = StyleSheet.create({
    itemTab: {
        borderBottomWidth: 0
    },
    input: {
        backgroundColor: '#19243a',
        borderRadius: 2,
        height: 40,
        justifyContent: 'center'
    }
})

export default connect(null, { setStatusBar })(HistoryDepositCoin);
