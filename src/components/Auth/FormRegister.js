import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Image, Platform } from 'react-native';
import TextField from '../Shared/TextField'
import { Container, Content, Item, Input, Button, Icon, CheckBox, ListItem, Body } from 'native-base';
import { style } from "../../config/style/index";
import { constant } from "../../config/constants";
import SubmitButton from "../Shared/SubmitButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authService } from "../../services/authenticate.service";
import { connect } from 'react-redux';
import { alertError } from '../../config/utilities';
import ConfirmModal from "../Shared/ConfirmModal";
import ModalInfoRegister from './components/ModalInfoRegister';
import HaveAccountField from './components/HaveAccountField';
import IconAlertInfoRule from '../Shared/IconAlertInfoRule';
import {styles} from "react-native-theme";
class FormRegister extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            rePassword: "",
            fromReferralId: "",
            agree_condition: false,
            is_submit: false,
            is_error: false,
            error_message: "",
            is_confirm: false,
            content: null,
            title: null,
            ButtonOKText: null,
            isModalInfoRegister: false
        }
    }

    _setError(message) {
        this.setState({
            is_error: true,
            error_message: message
        })
    }

    _validate() {
        const { password, rePassword } = this.state;
        const passRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
        if (password !== rePassword) {
            this.setState({ is_error: true, error_message: 'PASSWORD_NOT_MATCH'.t() })
            return false
        } else if (!passRegex.test(password)) {
            this.setState({ is_error: true, error_message: 'PASSWORD_NOT_MATCH'.t() })
            return false
        } else if (!password || !rePassword) {
            this.setState({ is_error: true, error_message: 'PASSWORD_NOT_MATCH'.t() })
        }
        return true
    }

    doRegister = () => {
        const { agree_condition, password, rePassword, fromReferralId } = this.state;
        if (!agree_condition) {
            // alertError ("You must be accepted this condition".t());
            this.setState({ is_confirm: true, title: "ERROR".t(), content: "You must be accepted this condition".t(), ButtonOKText: null,ButtonCloseText:"CLOSE".t() })
            return;
        }
        let { country, email } = this.props.navigation.state.params.data;
        let register_model = {
            "email": email,
            "password": password,
            "rePassword": rePassword,
            "fromReferralId": fromReferralId,
            "countryCode": country || '',
            "callbackUrl": "",
            "ipAddress": "",
            "city": "",
            "userLocationRaw": "",
            "via": 2
        }
        let isValid = this._validate();
        if (isValid) {
            this.setState({
                is_summit: true
            })
            authService.register(register_model).then(res => {
                this.setState({
                    is_summit: false
                })
                if (res.status === "OK") {
                    // Alert.alert(res.message.t(), "EMAIL_REGISTER_VERIFICATION_P_1".t() + email + "EMAIL_REGISTER_VERIFICATION_P_2".t(), [{ text: 'OK', onPress: () => this.props.navigation.navigate("Login") }]);

                    this.setState({is_success:true, is_confirm: true, title: res.message.t(), content: "EMAIL_REGISTER_VERIFICATION_P_1".t() + email + "EMAIL_REGISTER_VERIFICATION_P_2".t(), ButtonOKText: 'OK'.t(),ButtonCloseText:null })

                    // this.props.navigation.navigate('Login')
                }
                else {
                    this._setError(res.message.t())
                }
            })
                .catch(err => {
                    this.setState({
                        is_summit: false
                    })
                    this._setError(err.message.t())
                })
        }
    }
    render() {
        const { navigation, language } = this.props
        const {is_success, isModalInfoRegister, is_submit, is_error, error_message, password, rePassword, fromReferralId, is_confirm, content, title, ButtonOKText ,ButtonCloseText} = this.state;
        return (
            <Container style={styles.backgroundMain}>
                <KeyboardAwareScrollView style={styled.content} showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text style={[styles.textMain, { marginRight: 0 }]}>{"CANCEL".t()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={style.textTitle}>{"REGISTER_TEXT".t()}</Text>
                    </View>

                    <Text style={[styles.textWhite, { fontWeight: '600', paddingLeft: 1 }]}>{"PASSWORD".t()}</Text>
                    <View>
                        {is_error ? <View>
                            <Text style={styles.bgSellOldNew}>{error_message}</Text>
                        </View> : null
                        }
                        <Item style={[styled.inputStyle,{borderBottomColor:styles.line.color}]}>
                            <Icon style={[{
                                marginTop: 10,
                                color: "#486db4",
                                marginRight: 2,
                                fontSize:16
                            },]} active name='lock' />
                            <TextField
                                value={password}
                                onChangeText={(text) => this.setState({ password: text })}
                                placeholder={"PASSWORD".t()}
                                style={[styles.textWhite, { marginTop: 10 }]}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                returnKeyType={"next"}
                                onEnter={() => this.rePassword.focus()}
                                secureTextEntry={true}
                                ref={(input) => this.password = input}
                            />
                            <IconAlertInfoRule 
                            onInfoAlert={() => this.setState({
                                isModalInfoRegister: true
                            })}
                            />

                        </Item>
                        <Item style={[styled.inputStyle,{borderBottomColor:styles.line.color}]}>
                            <Icon style={[{
                                marginTop: 10,
                                color: "#486db4",
                                marginRight: 2,
                                fontSize: 16
                            }]} active name='lock' />
                            <TextField
                                value={rePassword}
                                onChangeText={(text) => this.setState({ rePassword: text })}
                                placeholder={'CONFIRM_PASSWORD'.t()}
                                style={[styles.textWhite, { marginTop: 10 }]}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                returnKeyType={"next"}
                                onEnter={() => this.fromReferralId.focus()}
                                secureTextEntry={true}
                                ref={(input) => this.rePassword = input}
                            />
                        </Item>
                        <Text style={[styles.textWhite, { paddingLeft: 1, fontWeight: '600', marginTop: 30 }]}>{'REFERRAL_ID'.t()}</Text>
                        <Item style={[styled.inputStyle,{borderBottomColor:styles.line.color}]}>
                            <Icon style={[{
                                marginTop: 10,
                                color: "#486db4",
                                marginRight: 2,
                                fontSize: 16
                            }]} active name='people' />
                            <TextField
                                value={fromReferralId}
                                onChangeText={(text) => this.setState({ fromReferralId: text })}
                                placeholder={'REFERRAL_ID'.t()}
                                style={[styles.textWhite, { marginTop: 10,marginLeft:-2 }]}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                returnKeyType={"done"}
                                onEnter={() => {
                                    this.setState({ agree_condition: true });
                                    this.doRegister()
                                }}
                                secureTextEntry={false}
                                ref={(input) => this.fromReferralId = input}
                            />
                        </Item>
                        <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                            <CheckBox checked={this.state.agree_condition}
                                onPress={() => this.setState({ agree_condition: !this.state.agree_condition })}
                                style={{ marginLeft: Platform.OS === 'ios' ? -5 : -7, borderRadius: 0 }}
                            />
                            <Text style={[styles.textMain, { marginLeft: 10 }]}>  {"I have already read this".t()}</Text>
                            <TouchableOpacity onPress={() => {
                                language == 'en' ?
                                    Linking.openURL(constant.LINK.POLICY_EN)
                                    :
                                    Linking.openURL(constant.LINK.POLICY_VN)
                            }}>
                                <Text style={{ color: styles.textHighLightOld.color, fontSize: 14 }}> {"CONDITION".t()}</Text>
                            </TouchableOpacity>
                        </View>
                        <SubmitButton
                            label={'COMPLETE'.t()}
                            style={[style.btnSubmit, style.buttonHeight, { elevation: 0 }]}
                            onSubmit={this.doRegister}
                            is_submit={is_submit}
                            labelStyle={style.textWhite}
                        />
                        <HaveAccountField 
                        navigation={navigation}
                        />
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ height: 10, width: 15, tintColor: '#486db5' }}
                                source={require('../../assets/img/ic_backlogin.png')}
                            />
                            <Text style={{ color: '#486db5', marginLeft: 10 }}>{"BACK".t()}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <ConfirmModal visible={is_confirm} title={title}
                    content={content}
                    onClose={() => is_success?this.setState({ is_confirm: false }, () => {
                        this.props.navigation.navigate("Login")
                    }): this.setState({ is_confirm: false })}
                    onOK={() => {
                        this.setState({ is_confirm: false }, () => {
                            this.props.navigation.navigate("Login")
                        })
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
            </Container>
        );
    }
}

const styled = StyleSheet.create({
    content: {
        flex: 1,
        paddingVertical: 20,
        marginLeft: 20,
        marginRight: 20
    },
    inputStyle: {
        marginTop: 5,
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c'
    }
})

const mapStateToProps = state => {
    return {
        language: state.commonReducer.language
    }
}

export default connect(mapStateToProps)(FormRegister);
