import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { Container, Content, Item, Input, Button, Icon } from 'native-base';
import { style } from "../../config/style";
import { jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import ConfirmModal from "../Shared/ConfirmModal"
import ModalInfoRegister from './components/ModalInfoRegister';
import IconAlertInfoRule from '../Shared/IconAlertInfoRule';
import { constant } from '../../config/constants';
import {styles} from 'react-native-theme';
class VerifyReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            otpCode: '',
            sessionId: '',
            newPassword: '',
            reNewPassword: '',
            msg: '',
            timer: 60,
            seconds: 9,
            checked: false,
            is_confirm: false,
            title: null,
            content: null,
            ButtonOKText: null,
            isModalInfoRegister: false
        }
        this.confirmResetPassword = this.confirmResetPassword.bind(this);
        this.resendMail = this.resendMail.bind(this);
    }

    componentDidMount() {
        const { sessionId, email } = this.props.navigation.state.params;
        this.setState({ sessionId, email })
        this.setTimeplay()
    }

     resendMail =async () => {
        // let timerActive = new Date().getTime();
        const { email } = this.state;
        this.setTimeplay();
        let res = await authService.resetPassword(email);
        if (res.status) {
            this.setState({ sessionId: res.otpToken.sessionId })
        }
    }
    setTimeplay=()=>{

        this.setState({checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60,
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
    }
    confirmResetPassword() {
        const { email, otpCode, sessionId, newPassword, reNewPassword } = this.state;
        const passRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
        if (newPassword == reNewPassword && passRegex.test(newPassword)) {
            this.handleReset(email, otpCode, sessionId, newPassword);
        } else {
            this.setState({ is_confirm:true,title:"WARNING".t(), content: 'PASSWORD_NOT_MATCH'.t(),ButtonOKText: null })
        }
    }

    handleReset = async (email, otpCode, sessionId, newPassword) => {
        const user = await jwtDecode();
        let data = { email, otpCode, sessionId, newPassword };
        let res = await authService.confirmResetPassword(data);
        if (res.status) {
            this.setState({
                is_confirm: true,
                title: "ALERT".t(),
                content: `${res.message}`.t(),
                ButtonOKText: 'OK'.t()
            })
            // Alert.alert("ALERT".t(), `${res.message}`.t(), [{ text: 'OK'.t(), onPress: () => { this.props.navigation.navigate('Login') } }])
        } else {
            this.setState({
                is_confirm:true,
                title:"WARNING".t(), 
                content: `${res.message}`.t(),
                ButtonOKText: null
                  })
        }
    }


    render() {
        const { navigation } = this.props;
        const { msg, is_confirm, title, content, ButtonOKText, isModalInfoRegister } = this.state;
        return (
            <Container style={styles.backgroundMain}>
                <View style={stylest.content}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[style.textMain, { textAlign: 'right' }]}>{'CANCEL'.t()}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={[style.textTitle, { marginTop: 20, marginBottom: 50 }]}>{'RESET_PASSWORD'.t()}</Text>
                        <Text style={[styles.textWhite, { fontWeight: 'bold' }]}>{'NEW_PASSWORD'.t()}</Text>
                        {/* <Text style={style.textRed}>{msg && msg}</Text> */}
                        <Item style={stylest.inputStyle}>
                            <Icon style={[style.iconMain, style.fontSize16]} active name='lock' />
                            <Input
                                allowFontScaling={false}
                                onChangeText={(newPassword) => this.setState({ newPassword })}
                                placeholder={'NEW_PASSWORD'.t()}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                style={[styles.textWhite, ]}
                                secureTextEntry={true}
                            />
                            <IconAlertInfoRule
                                onInfoAlert={() => this.setState({
                                    isModalInfoRegister: true
                                })}
                            />

                        </Item>
                        <Item style={stylest.inputStyle}>
                            <Icon style={[style.iconMain, style.fontSize16]} active name='lock' />
                            <Input
                                allowFontScaling={false}
                                onChangeText={(reNewPassword) => this.setState({ reNewPassword })}
                                placeholder={'CONFIRM_NEW_PASSWORD'.t()}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                style={[styles.textWhite, {  }]}
                                secureTextEntry={true}
                            />
                        </Item>
                        <Item style={[stylest.inputStyle, {}]}>
                            <Input
                                keyboardType={"numeric"}
                            maxLength={constant.MAX_OTP}
                                allowFontScaling={false}
                                onChangeText={(otpCode) => this.setState({ otpCode })}
                                placeholder={'OTP'.t()}
                                placeholderTextColor={[styles.textPlaceHolder.color,]}
                                style={[styles.textWhite, { flex: 1, marginLeft: Platform.OS === 'ios' ? 0 : -5,  }]}
                            />
                            <Button style={{ width: 100, justifyContent: 'center', borderRadius: 20, backgroundColor: styles.bgButton.color, height: 30, marginTop: 7.5 }}
                                onPress={this.resendMail}
                                disabled={this.state.checked}
                            >
                                <Text style={style.textWhite}>{this.state.checked ? this.state.timer+ "s" : 'RESEND_EMAIL'.t()}</Text>
                            </Button>
                        </Item>
                        <Button
                            block warning style={[style.btnSubmit, style.buttonHeight, { marginLeft: 2, marginBottom: 5,backgroundColor:styles.bgButton.color }]}
                            onPress={this.confirmResetPassword}
                        >
                            <Text style={{ color: '#fff' }}>{'NEXT'.t()}</Text>
                        </Button>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ height: 10, width: 20, tintColor: '#486db5' }}
                                source={require('../../assets/img/ic_backlogin.png')}
                            />
                            <Text style={{ color: '#486db5', marginLeft: 10 }}>{"BACK".t()}</Text>
                        </TouchableOpacity>
                    </View>
                    <ModalInfoRegister
                        isModalInfoRegister={isModalInfoRegister}
                        onModalInfoRegister={() => this.setState({
                            isModalInfoRegister: false
                        })}
                    />
                </View>
                <ConfirmModal visible={is_confirm} title={title} content={content}
                    onClose={() => {
                        this.setState({
                            is_confirm: false,
                            ButtonOKText: null
                        })
                    }}
                    onOK={() => {
                        this.props.navigation.navigate('Login')

                        this.setState({
                            is_confirm: false,
                        })
                    }
                    }
                    // resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}
                />
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20
    },
    inputStyle: {
        marginTop: 5,
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c'
    }
})

export default VerifyReset;
