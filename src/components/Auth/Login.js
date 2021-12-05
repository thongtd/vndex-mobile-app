import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Input, Icon, Item, Button, Form } from 'native-base';
import { authService } from '../../services/authenticate.service'
import { style } from "../../config/style";
import TextField from '../Shared/TextField'
import { connect } from 'react-redux';
import { checkLogin, getUserInfo } from "../../redux/action/common.action";
import { constant } from "../../config/constants";
import SubmitButton from '../Shared/SubmitButton'
import { tradeService } from "../../services/trade.service";
import { storageService } from "../../services/storage.service";
import { formatMessageByArray, dimensions, alertError } from "../../config/utilities";
import { dim } from 'ansi-colors';
import { _t } from "../../language/i18n";
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import ModalAlert from "../Shared/ModalAlert";
import { Spiner } from "../Shared"
import Welcome from './components/Welcome';
import ModalInfoRegister from './components/ModalInfoRegister';
import StatusBarFnx from '../Shared/StatusBar';
import {styles} from "react-native-theme";
// import DeviceInfo from 'react-native-device-info';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            is_submit: false,
            is_error: false,
            error_message: "",
            ipAddress: '',
            city: '',
            userLocationRaw: '',
            secureTextEntry: true,
            timer: 60,
            hasTimer: false
        }
    }

    componentDidMount() {
        // console.log(DeviceInfo.getUserAgent(), "user agent");
        // this._setError("wrong password {0} {1}".t());
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        authService.checkLogged().then(res => {
            if (res) {
                this.props.navigation.navigate("Home")
            }
        })
        fetch("https://extreme-ip-lookup.com/json/")
            .then(response => response.json())
            .then(res => {
                console.log(res, "ip address");
                AsyncStorage.setItem("ipAddress", res.query)
                this.setState({
                    ipAddress: res.query,
                    city: res.city,
                    userLocationRaw: res.region
                }, () => console.log(this.state.ipAddress, this.state.city, this.state.userLocationRaw, "ipaddress2"))
            })
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        let params = this.props.navigation.state.params;
        // if(params !== undefined && params.changePass){
        if (params !== undefined && params.changePass) {
            console.log("vao account")
            this.props.navigation.navigate('Account');
            return true;
        } else {
            console.log("tro ve roi");
            this.props.navigation.goBack()
            return true;
        }
    }
    _validate() {
        let { username, password } = this.state;

        if (!username || !password) {
            this._setError("Enter your Email and Password to login".t());
            return false;
        }
        return true;
    }

    _setError(message, ButtonOKText, isView, viewContent) {
        this.modalError(message, true, ButtonOKText, isView, viewContent)
    }

    doLogin = () => {
        let { username, password, ipAddress, city, userLocationRaw } = this.state;
        console.log(ipAddress, city, userLocationRaw, "data get");
        if (!this._validate()) {
            return;
        }

        this.setState({
            is_submit: true
        })
        authService.login(username, password, ipAddress, city, userLocationRaw)
            .then(res => {
                console.log(res, "res login");
                this.setState({
                    is_submit: false
                })
                if (!res.succeeded) {
                    if (res.isNotAllowed) {
                        this.props.navigation.navigate('NotifyRegister', { email: this.state.username })
                    }
                    else if (res.requiresTwoFactor) {
                        this.props.navigation.navigate('VerifyEmailCode', {
                            sessionId: res.sessionId,
                            email: this.state.username,
                            type: res.twoFactorType,
                            ipAddress:this.state.ipAddress,
                            city:this.state.city,
                            userLocationRaw:this.state.userLocationRaw
                        })
                    } else if (res.message === "You've entered the wrong password {0} time(s). You have {1} times to retry") {
                        this._setError(formatMessageByArray("wrong password {0} {1}".t(), res.messageArray));
                    }
                    else {

                        this._setError(res.message.t(), res.messageArray);
                    }
                }
                else {
                    storageService.setItem(constant.BTC_WITHDRAWAL_LIMIT, res.btcDailyWithdrawLimit);
                    authService.setToken(res)
                        .then(tokenResult => {
                            console.log(tokenResult, "tokenResult");
                            if (tokenResult) {
                                this.setUserInfo(res);
                                this.props.checkLogin(true);
                            }
                            else {
                                this._setError(tokenResult.message);
                            }
                        })
                }

            })
            .catch(err => {
                this.setState({
                    is_submit: false
                })
                this._setError("UNKNOWN_ERROR".t())
            })
    }

    setUserInfo(userInfo) {
        console.log(userInfo, "userInfo login");
        authService.setUserInfo(userInfo).then(res => {
            if (res) {
                console.log(res, "userInfo login")
                this.props.getUserInfo(res.data);
                let customerTypeId = userInfo.identityUser.customerTypeId;
                tradeService.setTransFee(customerTypeId).then(val => {
                    if (!val) {
                        this._setError("SAVE_FEE_ERROR".t());
                    }
                    else {
                        if (this.props.navigation.state.params) {
                            let callBackScreen = this.props.navigation.state.params.callback;
                            this.props.navigation.navigate(callBackScreen);
                        }
                        else {
                            this.props.navigation.navigate("Home");
                        }
                    }
                })
            }
        })
    }
    modalError(content, visible = true, ButtonOKText = null, isViewContent = false, viewContent) {
        this.setState({
            visible: visible,
            content: content,
            is_submit: false,
            is_error: true,
            ButtonOKText,
            isViewContent,
            viewContent
        })
    }
    resendEmailConfirm = async () => {
        this.setState({
            hasTimer: true
        })
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer == 0) {
                clearInterval(this.interval);
                this.setState({
                    hasTimer: false,
                    timer: 60
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let res = await authService.resendConfirmEmail(this.state.username);

        console.log(res, "data send");

    }
    render() {

        const { navigation } = this.props
        const { username, password, is_error, error_message, secureTextEntry, content, visible, is_submit, ButtonOKText, hasTimer, timer, isViewContent, viewContent } = this.state;
        return (
            <Container style={[styles.bgMain, { flex: 1 }]}>
                <Spiner isVisible={is_submit} />
                <StatusBarFnx
                    color={style.container.backgroundColor}
                />
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={stylest.content}>

                        <Welcome />
                        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 58 }}>
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Text style={style.textTitle}>{'LOGIN'.t()}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <KeyboardAvoidingView onPress={() => alert("a")} enabled={true}>
                                    <View style={{}}>
                                        <View style={[stylest.inputStyle, { alignItems: 'center',borderBottomColor:styles.line.color }]}>
                                            <Icon style={[{
                                                marginTop: Platform.OS === 'ios' ? 10 : 0,
                                                color: "#486db4"
                                            }, Platform.OS === 'android' ? { fontSize: 16 } : {
                                                fontSize: 18,
                                                marginBottom: 10
                                            }]} active name='person' />
                                            <TextField
                                                value={username}
                                                onChangeText={(username) => this.setState({ username })}
                                                placeholder={'EMAIL'.t()}
                                                style={styles.textWhite}
                                                keyboardType={'email-address'}
                                                returnKeyType={"next"}
                                                onEnter={() => this.password.focus()}
                                                ref={(input) => this.username = input}
                                            />
                                        </View>
                                        <View style={[stylest.inputStyle, {borderBottomColor:styles.line.color, alignItems: 'center' }]}>
                                            <Icon style={[{
                                                marginTop: Platform.OS === 'ios' ? 10 : 0,
                                                color: "#486db4",
                                                marginRight: 2
                                            }, Platform.OS === 'android' ? { fontSize: 16 } : {
                                                fontSize: 18,
                                                marginBottom: 10
                                            }]} active name='lock' />
                                            <TextField
                                                value={password}
                                                onChangeText={(password) => this.setState({ password })}
                                                placeholder={'PASSWORD'.t()}
                                                style={styles.textWhite}
                                                placeholderTextColor={styles.textWhite}
                                                returnKeyType={"done"}
                                                secureTextEntry={secureTextEntry}
                                                onEnter={() => this.doLogin()}
                                                ref={(input) => this.password = input}
                                            />
                                            <TouchableOpacity style={{
                                                paddingRight: 10
                                            }} onPress={() => this.setState({ secureTextEntry: !secureTextEntry })}>
                                                <IconFontAwesome name={secureTextEntry ? 'eye' : 'eye-slash'} color={style.textMain.color} size={16} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                                <View style={{}}>
                                    <SubmitButton
                                        label={'LOGIN'.t()}
                                        style={[style.btnSubmit, style.buttonHeight]}
                                        onSubmit={this.doLogin}
                                        is_submit={this.state.is_submit}
                                        labelStyle={style.textWhite}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: -20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={[styles.textMain, { paddingTop: 5, marginRight: 5 }]}>{"REGISTER_ASK".t()}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('Register')
                                        }}
                                    >
                                        <Text style={{
                                            color: styles.txtHl.color,
                                            fontSize: 14,
                                            paddingLeft: 0,
                                            paddingTop: 5,
                                        }}>{"REGISTER_TEXT".t()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={stylest.footerWelcome}>
                            <TouchableOpacity onPress={() => { navigation.navigate('ResetPassword') }}>
                                <Text style={styles.textMain}>{"FORGOT_PASSWORD".t()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let params = navigation.state.params;
                                if (params !== undefined && params.changePass) {
                                    navigation.navigate('Account');
                                } else {
                                    navigation.goBack();
                                }
                                // console.log(changePass,"change pass");

                            }}>
                                <Text style={styles.textMain}>{"SKIP".t()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <ModalAlert
                    content={content}
                    visible={visible}
                    onClose={() => this.setState({ visible: false })}
                    ButtonOKText={ButtonOKText}
                    onOK={this.resendEmailConfirm}
                    timer={timer}
                    hasTime={hasTimer}
                    isViewContent={isViewContent}
                    viewContent={viewContent}
                />
            </Container>
        );
    }
}

const stylest = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 20,
        minHeight: Platform.OS === 'ios' ? '100%' : dimensions.height - 25,
    },
    t_LOGIN: {
        color: '#4061ac',
        fontSize: 25,
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
        marginTop: -10
    },
    footerWelcome: {
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
export default connect(null, { checkLogin, getUserInfo })(Login);
