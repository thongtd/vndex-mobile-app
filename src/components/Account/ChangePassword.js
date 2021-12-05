import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Platform, TextInput, Alert } from 'react-native';
import { Body, Button, Card, CardItem, Container, Content, Header, Input, Item, Label, Left, Right } from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { dimensions, jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import DropdownAlert from 'react-native-dropdownalert';
import { constant } from "../../config/constants";
import ConfirmModal from "../Shared/ConfirmModal";
import LabelField from './components/LabelField';
import IconAlertInfoRule from '../Shared/IconAlertInfoRule';
import ModalInfoRegister from '../Auth/components/ModalInfoRegister';
import { checkLogin, setStatusBar } from "../../redux/action/common.action";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";
import NoteNoticeBlockAcc from '../Shared/NoteNoticeBlockAcc';
import { HeaderFnx } from '../Shared';
import ContainerFnx from '../Shared/ContainerFnx';
import TextInputFnx from '../Shared/TextInputFnx';
import { SendEmailField } from '../Shared';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from "react-native-theme";
class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true,
            password: '',
            newPassword: '',
            confirmPassword: '',
            success: false,
            verifyCode: '',
            twoFactorEnabled: null,
            twoFAType: null,
            sessionId: null,
            timer: 60,
            seconds: 9,
            checked: false,
            email: '',
            is_confirm: false,
            title: null,
            content: null,
            ButtonOKText: null,
            isModalInfoRegister: false,
            secureTextEntry: true
        }
    }

    componentWillMount() {

    }

    async componentDidMount() {
        let user = await jwtDecode();
        let res = await authService.keepLogin(user.id);
        if (res) {
            this.setState({ email: user.sub, twoFactorEnabled: res.twoFactorEnabled, twoFAType: res.twoFAType })
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
        this.setState({ sessionId: response.data.sessionId, });
    }

    onChangePassword = async () => {
        let user = await jwtDecode();
        const { password, newPassword, confirmPassword, sessionId, verifyCode } = this.state;
        if (!newPassword || !confirmPassword) {
            // Alert.alert("ERROR".t(), `PASSWORD_CONFIRM`.t(), [{text: 'CLOSE'.t()}])
            this.setState({ is_confirm: true, title: "ERROR".t(), content: `PASSWORD_CONFIRM`.t(), ButtonOKText: null, ButtonCloseText: 'CLOSE'.t() })

        } else if (newPassword !== confirmPassword) {
            this.setState({ is_confirm: true, title: 'ERROR'.t(), content: 'PASSWORD_CONFIRM'.t(), ButtonOKText: null, ButtonCloseText: 'CLOSE'.t() })
            // Alert.alert("ERROR".t(), `PASSWORD_CONFIRM`.t(), [{text: 'CLOSE'.t()}])
        } else {
            let data;
            if (verifyCode) {
                data = { userEmail: user.sub, password, newPassword, verifyCode, sessionId }
            } else {
                data = { userEmail: user.sub, password, newPassword, sessionId }
            }
            let response = await authService.changePassword(data);

            if (response.status === 'OK') {
                // Alert.alert("SUCCESS".t(), `Your password has been changed successfully`.t(), [{ text: 'OK'.t(), onPress: () => this.props.navigation.navigate('Account') }])

                this.setState({ is_confirm: true, title: "SUCCESS".t(), content: `Your password has been changed successfully`.t(), ButtonOKText: 'OK'.t(), ButtonCloseText: null })
            } else {
                // Alert.alert("ERROR".t(), `Change password failed`.t(), [{ text: 'CLOSE'.t() }])
                this.setState({ is_confirm: true, title: "ERROR".t(), content: `Change password failed`.t(), ButtonOKText: null, ButtonCloseText: 'CLOSE'.t() })
            }
        }
    }

    onCloseAlert = () => {
        if (this.state.success) {
            this.props.navigation.goBack()
        }
    }

    render() {
        const { navigation } = this.props;
        const { secureTextEntry, isModalInfoRegister, newPassword, password, confirmPassword, success, twoFactorEnabled, twoFAType, verifyCode, is_confirm, title, content, ButtonOKText, ButtonCloseText } = this.state;
        return (
            <ContainerFnx
                colorStatus={style.bgHeader.backgroundColor}
                hasBack
                title={'CHANGE_PASSWORD'.t()}
                navigation={navigation}
                backgroundHeader={styles.backgroundSub.color}
            >
                <View >
                    <TextInputFnx
                        label
                        hasSecure
                        placeholder={'OLD_PASSWORD'.t()}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(password) => this.setState({ password })}
                        value={password}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", height: 20 }}>
                        <LabelField label={'NEW_PASSWORD'.t()} />
                        <IconAlertInfoRule
                            styled={{
                                paddingLeft: 10,
                                color: "#486db4",
                                marginRight: 2,
                                fontSize: 16
                            }}
                            onInfoAlert={() => this.setState({
                                isModalInfoRegister: true
                            })} />
                    </View>
                    <TextInputFnx
                        hasSecure
                        value={newPassword}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(newPassword) => this.setState({ newPassword })}
                    />
                    <TextInputFnx
                        hasSecure
                        label
                        placeholder={'CONFIRM_NEW_PASSWORD'.t()}
                        value={confirmPassword}
                        secureTextEntry={secureTextEntry}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                    />
                    {
                        twoFactorEnabled ?
                            (twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                                <SendEmailField
                                    label
                                    titleBtn={"SEND_EMAIL".t()}
                                    placeholder={'VERIFY_CODE'.t()}
                                    placeholderTextColor={styles.textMain.color}
                                    onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                    value={verifyCode}
                                    onSend={() => { this.onSentMail() }}
                                    timer={this.state.timer}
                                    checked={this.state.checked}
                                />
                                :
                                <TextInputFnx
                                    label
                                    placeholder={'VERIFY_CODE'.t()}
                                    onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                    value={verifyCode}
                                />

                            ) : null
                    }
                    <View style={{ marginVertical: 20 }}>
                        <Button block primary onPress={this.onChangePassword}
                            style={[style.buttonHeight, { backgroundColor:styles.bgButton.color, borderRadius: 2.5 }]}
                        >
                            <Text style={style.textWhite}>{'CHANGE_PASSWORD'.t()}</Text>
                        </Button>
                    </View>
                    <NoteNoticeBlockAcc
                        styled={{ fontSize: 12 }}
                    />
                </View>

                {/* </Content> */}
                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => {
                        if (ButtonCloseText === "CLOSE".t()) {
                            this.setState({ is_confirm: false, resultType: "", resultText: "" })
                        }
                    }
                    }
                    onOK={() => {
                        if (title === "ERROR".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                this.props.navigation.navigate('Login', { changePass: true })
                                AsyncStorage.removeItem('auth_token')
                                this.props.checkLogin(false)
                            })
                        }
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={ButtonCloseText}
                />
                <ModalInfoRegister
                    isModalInfoRegister={isModalInfoRegister}
                    onModalInfoRegister={() => this.setState({
                        isModalInfoRegister: false
                    })}
                />
            </ContainerFnx>
        );
    }
}
// const styles = StyleSheet.create({
//     modalBackground: {
//         flex: 1,
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         backgroundColor: '#00000080'
//     },
//     activityIndicatorWrapper: {
//         backgroundColor: '#343f85',
//         width: dimensions.width,
//         height: dimensions.height / 3,
//         padding: 10,
//         justifyContent: 'space-around',
//         alignItems: 'center'
//     }
// })

export default connect(null, { checkLogin, setStatusBar })(ChangePassword);
