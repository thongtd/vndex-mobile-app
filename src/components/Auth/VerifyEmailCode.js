import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Content, Item, Input, Button, Form, Icon } from 'native-base';
import { style } from "../../config/style";
import { _t } from "../../language/i18n";
import TextField from "../Shared/TextField";
import { authService } from "../../services/authenticate.service";
import { connect } from 'react-redux';
import { checkLogin, getUserInfo } from "../../redux/action/common.action";
import { constant } from "../../config/constants";
import { storageService } from "../../services/storage.service";
import { tradeService } from "../../services/trade.service";
import { dimensions, alertError } from '../../config/utilities'
import ModalAlert from "../Shared/ModalAlert";
import {Spiner} from "../Shared"
import Welcome from './components/Welcome';
import {styles} from "react-native-theme";
class VerifyEmailCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verifyCode: '',
            isSpiner:false
        }
    }

    submitCode = async () => {
        const { sessionId, email, ipAddress,
            city,
            userLocationRaw } = this.props.navigation.state.params;
        this.setState({
            isSpiner:true
        })
        let response = await authService.validateEmailCode(this.state.verifyCode, email, sessionId, ipAddress,
            city,
            userLocationRaw);
        if (response.succeeded) {
            storageService.setItem(constant.BTC_WITHDRAWAL_LIMIT, response.btcDailyWithdrawLimit);
            authService.setToken(response)
                .then(res => {
                    console.log(res,response,"userInfo token");
                    if (res) {
                        this.setState({
                            isSpiner:false
                        })
                        this.setUserInfo(response);
                        this.props.checkLogin(true);
                    }
                    else {
                        this.modalError(res.message);
                    }
                })
        } else {
            this.modalError('2FA code invalid'.t())
        }
    }
    setUserInfo(userInfo) {
        authService.setUserInfo(userInfo).then(res => {
            if (res) {
                this.props.getUserInfo(userInfo);
                let customerTypeId = userInfo.identityUser.customerTypeId;
                this.setFee(customerTypeId);
            }
        })
    }

    setFee(cusTypeId) {
        tradeService.setTransFee(cusTypeId).then(val => {
            if (!val) {
                this._setError("SAVE_FEE_ERROR");
            }
            else {
                if (this.props.navigation.state.params.callback) {
                    let callBackScreen = this.props.navigation.state.params.callback
                    this.props.navigation.navigate(callBackScreen);
                }
                else {
                    this.props.navigation.navigate("Home");
                }

            }
        })
    }
    modalError(content,visible=true){
        this.setState({
            isSpiner:false,
            visible:visible,
            content:content,
        })
    }
    render() {
        const { navigation } = this.props;
        const { verifyCode,isSpiner } = this.state;
        let { type } = navigation.state.params;
        return (
            <Container style={[styles.backgroundMain, { flex: 1 }]}>
            <Spiner isVisible={isSpiner} />
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={[stylest.content]}>
                        <Welcome />
                        <View style={{flex: 1, justifyContent: 'center', paddingBottom: 58}}>
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <Text style={[style.textTitle, {fontSize: 22}]}>{type == constant.TWO_FACTOR_TYPE.EMAIL_2FA ? 'EMAIL_AUTHENTICATION_CODE'.t() : 'TWO_FACTOR_AUTHENTICATION'.t()}</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                            <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'padding' : ''} onPress={Keyboard.dismiss}>
                                <View style={[stylest.inputStyle]}>
                                    <Icon style={[style.iconMain, style.fontSize16, { alignSelf: 'center',}]} active name='lock' />
                                    
                                        <TextField
                                            value={verifyCode}
                                            onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                            placeholder={"2FA_REQUIRED".t()}
                                            style={{
                                                color:styles.textWhite.color,
                                                height:30
                                            }}
                                            keyboardType={'number-pad'}
                                            autoFocus={true}
                                            onEnter={() => this.submitCode()}
                                        />
                                    
                                </View>
                                </KeyboardAvoidingView>
                                <View style={{}}>
                                    <Button
                                        block warning style={[style.btnSubmit, style.buttonHeight,{
                                            backgroundColor:styles.bgButton.color
                                        }]}
                                        onPress={this.submitCode}
                                    >
                                        <Text style={{ color: '#fff' }}>{'SUBMIT'.t()}</Text>
                                    </Button>
                                </View>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={stylest.footerWelcome}>
                            <Text style={[styles.textMain, {flex: 1,textAlign: 'right'}]} onPress={() => navigation.goBack()}>{'SKIP'.t()}</Text>
                        </View>
                    </View>

                </ScrollView>
                <ModalAlert
                    content={this.state.content}
                    visible={this.state.visible}
                    onClose={()=> this.setState({visible:false})}
                />
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 50,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 20,
        minHeight: Platform.OS === 'ios' ? '100%' : dimensions.height - 25
    },
    t_LOGIN: {
        color: '#4061ac',
        fontSize: 30,
        fontWeight: 'bold'
    },
    inputStyle: {
        marginTop: 5,
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c',
        flexDirection: 'row'
    },
    logoWelcome: {
        width: '50%',
        flex: 1,
        flexDirection: 'row',
    },
    footerWelcome: {
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default connect(null, { checkLogin, getUserInfo })(VerifyEmailCode);
