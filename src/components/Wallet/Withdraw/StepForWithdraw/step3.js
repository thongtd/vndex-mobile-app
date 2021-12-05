/**
 * Withdraw Step 3
 * QuyetHS edited at 22-01-2019
 *
 * @format
 * @flow
 */
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { style } from "../../../../config/style";
import CountDown from "react-native-countdown-component";
import { constant } from "../../../../config/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";
import { Item, Left, Right } from "native-base";
import { dimensions, formatSCurrency, formatTrunc } from "../../../../config/utilities";
import WithdrawInfo from "../WithdrawInfo";
import {styles} from "react-native-theme";
type Props = {
    currentRequest: any,
    request: any,
    currencyList: Array,
    selectedUnit: String
}

export default class Step3 extends React.Component<Props> {
    constructor(props) {
        super(props);
        let estimatedTime = [];
        if (this.props.currentRequest.data) {
            estimatedTime = this.props.currentRequest.estimatedTime.split(':');
        }
        else if (this.props.request) {
            console.log('request', this.props.request)
            estimatedTime = this.props.request.estimatedTime.split(':');
        }
        console.log('request', estimatedTime)

        this.state = {
            h: estimatedTime.length > 0 ? Number(estimatedTime[0]) : 0,
            m: estimatedTime.length > 0 ? Number(estimatedTime[1]) : 0,
            s: estimatedTime.length > 0 ? Number(estimatedTime[2]) : 0,
            contact: false
        }
    }

    componentDidMount() {

    }

    render() {
        let { currentRequest, request, selectedUnit, currencyList } = this.props;
        return (
            <View>
                <View style={{
                    backgroundColor: styles.bgSub.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    paddingBottom: 0,
                    borderWidth: 0.5,
                    borderColor: style.colorBorderBox,
                    borderRadius: 2.5
                }}>
                    <Text style={[styles.txtMainTitle,]}>{'TIME_COMPLETE'.t()}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <CountDown
                            until={60 * this.state.m + this.state.s}
                            size={18}
                            onFinish={() => this.setState({ contact: true })}
                            digitBgColor={'transparent'}
                            digitTxtColor={styles.textWhite.color}
                            timeToShow={['H']}
                            labelH={''}
                            labelM={''}
                            labelS={''}
                        />
                        <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                        <CountDown
                            until={60 * this.state.m + this.state.s}
                            size={18}
                            onFinish={() => this.setState({ contact: true })}
                            digitBgColor={'transparent'}
                            digitTxtColor={styles.textWhite.color}
                            timeToShow={['M']}
                            labelH={''}
                            labelM={''}
                            labelS={''}
                        />
                        <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                        <CountDown
                            until={60 * this.state.m + this.state.s}
                            size={18}
                            onFinish={() => this.setState({ contact: true })}
                            digitBgColor={'transparent'}
                            digitTxtColor={styles.textWhite.color}
                            timeToShow={['S']}
                            labelH={''}
                            labelM={''}
                            labelS={''}
                        />
                    </View>
                    {
                        this.state.contact ?
                            <View style={{ marginTop: -10 }}>
                                <Text style={[styles.bgSellOldNew, {
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }]}>{'WITHDRAWAL_SUPPORT'.t()}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 15, paddingTop: 10 }}>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.MAIL)
                                        }}
                                    >
                                        <Icon name={'envelope'} size={14} color={'#456edd'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.TELEGRAM)
                                        }}
                                    >
                                        <Icon name={'telegram'} size={14} color={'#456edd'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.FACEBOOK)
                                        }}
                                    >
                                        <Icon name={'facebook'} size={14} color={'#456edd'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    }
                </View>
                <WithdrawInfo
                    currentRequest={currentRequest}
                    request={request}
                    selectedUnit={selectedUnit}
                    currencyList={currencyList} />
                <Item style={[style.item, { marginTop: 20, marginBottom: 10 }]}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon name={'warning'} size={16} color={'orange'} />
                        <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                    </Left>
                </Item>
                <Text style={[styles.bgSellOldNew]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
            </View>
        );
    }
}
