/**
 * Withdraw Step 2
 * QuyetHS edited at 22-01-2019
 *
 * @format
 * @flow
 */

import { Text, TextInput, View, Alert } from "react-native";
import React from "react";
import { Button, Item, Left, Right } from "native-base";
import { style } from "../../../../config/style";
import { dimensions, formatSCurrency, jwtDecode } from "../../../../config/utilities";
import ModalAlert from "../../../Shared/ModalAlert";
import WithdrawInfo from "../WithdrawInfo";
import Icon from "react-native-vector-icons/FontAwesome";
import { SendEmailField } from "../../../Shared"
import { authService } from "../../../../services/authenticate.service"
import _ from "lodash";
import { constant } from "../../../../config/constants";
import Toast from 'react-native-simple-toast';
import {styles} from "react-native-theme";
type Props = {
    currentRequest: any,
    selectedUnit: String,
    currencyList: Array,
    request: any
}

export default class Step2 extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            OTP: '',
            timer: 60,
            checked: false,
        }
    }

    confirmOTP() {
        if (this.state.OTP !== '') {
            this.props.submit(this.state.OTP, this.state.sessionId);
        } else {
            this.modalError('OTP'.t())
        }
    }
    modalError(content, visible = true) {
        this.setState({
            visible: visible,
            content: content,
        })
    }
    async onSentOpt() {
        Toast.showWithGravity("OTP code has been sent to your email".t(), Toast.LONG, Toast.CENTER);
        this.setState({ checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);


        // console.log(this.props.currentRequest.id,"props hihih");
        let { id } = await this.props.currentRequest;
        console.log(this.props.request, "request");
        let { requestId } = await this.props.request;
        let user = await jwtDecode();
        let response = await authService.getOtp(user.sub, 'FIAT_WITHDRAWAL', typeof id !== "undefined" ? id : requestId);
        console.log(response, "respon history draw");
        if (response) {
            this.setState({ sessionId: response.sessionId, requestId: id })
        }
    }
    componentDidMount = () => {
        let { request } = this.props;
        if (_.isEmpty(request) !== true) {
            Toast.showWithGravity("OTP code has been sent to your email".t(), Toast.LONG, Toast.CENTER);
            this.setState({ checked: true });
            let timerActive = new Date().getTime();
            this.interval = setInterval(() => {
                if (this.state.timer <= 0) {
                    clearInterval(this.interval);
                    this.setState({
                        checked: false,
                        timer: 60
                    })
                } else {
                    this.setState({
                        timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                    })
                }
            }, 1000);

        }
    }

    render() {
        let { currentRequest, selectedUnit, currencyList, request, } = this.props;
        const { visible, content } = this.state;
        // console.log(request, "this is request");
        // console.log(currentRequest,"this is currentRequest");

        return (
            <View>
                <View style={{ marginBottom: 30 }}>
                    <SendEmailField

                        maxLength={constant.MAX_OTP}
                        placeholder={'OTP'.t()}
                        disabled={this.state.submitting}
                        value={this.state.OTP}
                        onChangeText={(text) => {
                            this.setState({ OTP: text })
                        }}
                        titleBtn={"SEND_OTP".t()}
                        timer={this.state.timer}
                        checked={this.state.checked}
                        onSend={() => {
                            this.onSentOpt()
                            this.setState({
                                checked: true
                            })
                        }}
                    />
                </View>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button style={[{
                            borderRadius: 2.5,
                            borderWidth: 0,
                            backgroundColor: styles.bgBtnClose.color,
                            flex: 1,
                            marginRight: 5
                        }, style.buttonHeight]} transparent block
                            onPress={this.props.confirmCancel}>
                            <Text style={styles.textWhiteMain}>{'CANCEL'.t()}</Text>
                        </Button>
                        <Button style={[style.buttonNext, style.buttonHeight, {
                            flex: 1,
                            marginLeft: 5,
                            backgroundColor:styles.bgButton.color
                        }]} block
                            onPress={() => this.confirmOTP()}>
                            <Text style={style.textWhite}>{'CONFIRM'.t()}</Text>
                        </Button>
                    </View>
                    <WithdrawInfo currentRequest={currentRequest} request={request} selectedUnit={selectedUnit} currencyList={currencyList} />
                    <Item style={[style.item, { marginTop: 20, marginBottom: 10 }]}>
                        <Left style={{ flexDirection: 'row' }}>
                            <Icon name={'warning'} size={16} color={'orange'} />
                            <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                        </Left>
                    </Item>
                    <Text style={[styles.bgSellOldNew]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
                </View>
                <ModalAlert
                    content={content}
                    visible={visible}
                    onClose={() => this.setState({ visible: false })}
                />
            </View>
        );
    }
}
