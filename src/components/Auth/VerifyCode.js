import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Container, Content, Item, Input, Button } from 'native-base';
import { style } from "../../config/style";
import { authService } from "../../services/authenticate.service";
import {styles} from "react-native-theme";
class VerifyCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            sessionId: '',
            otpCode: '',
            msg: ''
        }
        this.resendMail = this.resendMail.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }


    componentDidMount() {
        const { email, sessionId } = this.props.navigation.state.params;
        this.setState({ email, sessionId });
    }

    async resendMail() {
        const { email } = this.state;
        let res = await authService.resetPassword(email);
        if (res.status) {
            this.setState({ sessionId: res.otpToken.sessionId })
        }
    }

    handleNext() {
        const { otpCode, sessionId } = this.state;
        if (otpCode.length > 0) {
            this.setState({ msg: '' })
            this.props.navigation.navigate('VerifyReset', { otpCode, sessionId })
        } else {
            this.setState({ msg: 'ENTER_CODE'.t() })
        }
    }


    render() {
        const { navigation } = this.props;
        const { email, msg } = this.state;
        return (
            <Container style={styles.backgroundMain}>
                <View style={stylest.content}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[styles.textMain, { textAlign: 'right' }]}>{'CANCEL'.t()}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={[style.textLabel, { marginTop: 20, marginBottom: 50 }]}>{'RESET_PASSWORD'.t()}</Text>
                        <Text style={[styles.textWhite, { fontWeight: '600', fontSize: 18 }]}>{'SAFELY_VERIFY'.t()}</Text>
                        <Text style={styles.bgSellOldNew}>{msg && msg}</Text>
                        <Text style={styles.textMain}>{'OTP_SENT'.t()} {email}</Text>
                        <Text style={styles.textMain}>{'ENTER_CODE'.t()}</Text>
                        <Item style={{ borderWidth: 1, marginTop: 15, marginLeft: 0, borderColor: '#808080' }}>
                            <TextInput
                            allowFontScaling={false}
                                onChangeText={(otpCode) => this.setState({ otpCode })}
                                placeholder={'OTP'.t()}
                                placeholderTextColor={style.colorHolder}
                                style={[style.textWhite, { flex: 1 }]}
                                keyboardType={'numeric'}
                            />
                            <Button style={[{ width: 100, justifyContent: 'center', borderRadius: 25, backgroundColor: styles.bgButton.color }, style.buttonHeight]}
                                onPress={this.resendMail}
                            >
                                <Text style={style.textWhite}>{'RESEND_EMAIL'.t()}</Text>
                            </Button>
                        </Item>
                        <Button
                            block warning style={[style.btnSubmit, style.buttonHeight, { marginTop: 20,backgroundColor:styles.bgButton.color }]}
                            onPress={this.handleNext}
                        >
                            <Text style={{ color: '#fff' }}>{'NEXT'.t()}</Text>
                        </Button>
                    </View>
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
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20
    }
})

export default VerifyCode;
