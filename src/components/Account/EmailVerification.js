import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Platform, Alert, BackHandler, AppState, StatusBar } from 'react-native';
import { Body, Button, Card, CardItem, Container, Content, Header, Input, Item, Label, Left, Right } from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { dimensions, jwtDecode } from "../../config/utilities";
import { storageService } from "../../services/storage.service";
import { constant } from "../../config/constants";
import { authService } from "../../services/authenticate.service";
import DropdownAlert from "react-native-dropdownalert";
import ConfirmModal from "../Shared/ConfirmModal";
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from "../../config/BackHandle"
import { HeaderFnx } from "../Shared"
import ViewSpecial from './components/ViewSpecial';
import LabelField from './components/LabelField';
import ContainerFnx from '../Shared/ContainerFnx';
import TextInputFnx from '../Shared/TextInputFnx';
import { SendEmailField } from '../Shared';
import {styles} from "react-native-theme";
class EmailVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            verifyCode: '',
            twoFactorEnabled: null,
            twoFAType: null,
            sessionId: null,
            success: false,
            timer: 60,
            seconds: 9,
            checked: false,
            checkTextChange: false,
            minute: 0,
            checkTime: false,
            // tạm thời để check count down time chờ comfirm mail
            checkCancel: false,
            is_confirm: false,
            title: null,
            content: null,
            ButtonOKText: null,
            isAccount: false
        }
    }

    async componentDidMount() {
        let { twoFactorEnabled, twoFAType } = this.props.navigation.state.params;
        this.setState({ twoFactorEnabled, twoFAType })
    }

    getCode = async () => {
        let content = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(content.sub);
        this.setState({ sessionId: response.data.sessionId })
    }
    handleEnable = async () => {
        const { password, email } = this.state;
        let response = await authService.enableEmail(password, email);
        if (response.data.status === true) {
            this.setState({ is_confirm: true, title: "SUCCESS".t(), content: response.data.message.t(), ButtonCloseText: null, ButtonOKText: 'OK'.t(), isAccount: false })
        } else {
            this.setState({ is_confirm: true, title: 'WARNING'.t(), content: "Invalid Email or Password".t(), ButtonOKText: null, ButtonCloseText: "CLOSE".t() })
        }
    }
    handleDisable = async () => {
        const { password, email, verifyCode, sessionId } = this.state;
        let response = await authService.disableEmail(password, email, verifyCode, sessionId);
        let resInfo = JSON.parse(response.config.data);
        console.log(response, "response disable");
        if (resInfo.password === "" || resInfo.password === undefined) {

            this.setState({ is_confirm: true, title: 'WARNING'.t(), content: "PLEASE_ENTER_PASSWORD".t(), ButtonCloseText: "CLOSE".t(), ButtonOKText: null })
        } else if (resInfo.email === "" || resInfo.email === undefined) {

            this.setState({ is_confirm: true, title: 'WARNING'.t(), ButtonCloseText: "CLOSE".t(), content: "PLEASE_ENTER_EMAIL".t(), ButtonOKText: null })
        } else if (response.data.code === 0 && resInfo.password && resInfo.email && resInfo.verifyCode) {

            this.setState({ is_confirm: true, ButtonCloseText: "CLOSE".t(), title: 'WARNING'.t(), content: `${response.data.message}`.t(), ButtonOKText: null })
        } else if (resInfo.verifyCode === "" || resInfo.verifyCode === undefined) {

            this.setState({ ButtonCloseText: "CLOSE".t(), is_confirm: true, title: 'WARNING'.t(), content: "PLEASE_ENTER_CODE".t(), ButtonOKText: null })
        } else {

            this.setState({ ButtonCloseText: null, is_confirm: true, title: "SUCCESS".t(), content: `${response.data.message}`.t(), ButtonOKText: 'OK'.t(), isAccount: true })
        }
    }

    onCloseAlert = () => {
        if (this.state.success) {
            this.props.navigation.goBack();
        }
    }

    async onSentMail() {
        this.setState({ isDisabled: true, checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60,
                    isDisabled: false
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let user = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(user.sub);
        this.setState({ sessionId: response.data.sessionId, })

    }


    render() {
        const { navigation } = this.props;
        const { password, email, twoFactorEnabled, verifyCode, twoFAType, success, is_confirm, content, title, ButtonOKText, isAccount, ButtonCloseText } = this.state;
        return (
            <ContainerFnx
                title={'EMAIL_VERIFICATION'.t()}
                hasBack
                navigation={navigation}
            >
                <DropdownAlert ref={ref => this.dropdown = ref} onClose={success && this.onCloseAlert} closeInterval={2000} errorImageSrc={null} successImageSrc={null} zIndex={Platform.OS === 'ios' ? 10 : 0} />
                <Content>
                    {
                        twoFactorEnabled && twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                            <View>
                                <Item stackedLabel style={style.item}>
                                    <ViewSpecial>
                                        <TextInputFnx
                                            label
                                            placeholder={'PASSWORD'.t()}
                                            value={password} secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })}
                                        />
                                    </ViewSpecial>
                                </Item>
                                <Item stackedLabel style={style.item}>
                                    <ViewSpecial>
                                        <TextInputFnx
                                            placeholder={'EMAIL_ADDRESS'.t()}
                                            label
                                            keyboarType={"email-address"}
                                            value={email}
                                            onChangeText={(text) => this.setState({ email: text })}
                                        />
                                    </ViewSpecial>
                                </Item>
                                <Item stackedLabel style={[style.item]}>
                                    <ViewSpecial>
                                        <SendEmailField
                                            label
                                            placeholder={'VERIFY_CODE'.t()}
                                            onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                            value={verifyCode}
                                            keyboardType={'numeric'}
                                            timer={this.state.timer}
                                            titleBtn={"SEND_EMAIL".t()}
                                            checked={this.state.checked}
                                            onSend={() => { this.onSentMail() }}
                                        />
                                    </ViewSpecial>
                                </Item>
                                <View style={{ width: "100%", marginVertical: 20 }}>
                                    <Button block primary style={[style.buttonNext, style.buttonHeight,{backgroundColor:styles.bgButton.color}]} onPress={this.handleDisable}>
                                        <Text style={[style.textWhite]}>{'DISABLE'.t()}</Text>
                                    </Button>
                                </View>
                            </View>
                            :
                            <View>
                                <View stackedLabel style={[style.item]}>
                                    <ViewSpecial>
                                        <TextInputFnx
                                            placeholder={'PASSWORD'.t()}
                                            label
                                            value={password} secureTextEntry={true} onChangeText={(text) => this.setState({ password: text })}
                                        />
                                    </ViewSpecial>
                                </View>
                                <View stackedLabel style={style.item}>
                                    <ViewSpecial>
                                        <TextInputFnx
                                            label
                                            placeholder={'EMAIL_ADDRESS'.t()}
                                            keyboarType={"email-address"}
                                            value={email} onChangeText={(text) => this.setState({ email: text })}
                                        />

                                    </ViewSpecial>

                                </View>
                                <View style={{ marginVertical: 20 }}>
                                    <Button block primary style={[style.buttonNext, style.buttonHeight,{
                                        backgroundColor:styles.bgButton.color
                                    }]} onPress={this.handleEnable}>
                                        <Text style={[style.textWhite]}>{'ENABLE'.t()}</Text>
                                    </Button>
                                </View>
                            </View>
                    }
                </Content>
                <ConfirmModal
                    onRequestClose={async () => {
                        await this.setState({
                            is_confirm: false
                        })
                        await setTimeout(() => {
                            navigation.goBack()
                        }, 450)

                    }}
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => {
                        if (title === "WARNING".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                if (isAccount === true) {
                                    this.props.navigation.navigate('Account')
                                } else {
                                    this.props.navigation.goBack()
                                }

                            })
                        }
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={ButtonCloseText}
                    navigation={this.props.navigation}
                />
            </ContainerFnx>

        );
    }
}

export default EmailVerification;
