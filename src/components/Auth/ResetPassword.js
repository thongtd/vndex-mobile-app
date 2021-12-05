import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Button } from 'native-base';
import { style } from "../../config/style";
import { authService } from "../../services/authenticate.service";
import { EXCHANGE_API } from "../../config/API";
import { ModalAlert } from '../Shared';
import NoteNoticeBlockAcc from '../Shared/NoteNoticeBlockAcc';
import {styles} from "react-native-theme";
class ResetPassword extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            msg: '',
            visible:false
        }
        this.handleNext = this.handleNext.bind(this);
    }
    async handleNext() {
        const { email } = this.state;
        if (email.length > 0) {
            // this.setState({ msg: '' });
            let res = await authService.resetPassword(email);
            console.warn(res);
            if (res.status) {
                this.props.navigation.navigate('VerifyReset', { sessionId: res.otpToken.sessionId, email })
            } else {
                this.setState({visible:true, content: `${res.message}`.t() })
            }
        } else {
            this.setState({visible:true, content: 'Please enter email'.t() })
        }
    }

    render() {
        const { navigation } = this.props;
        const { email, msg,content,visible } = this.state;
        return (
            <Container style={styles.backgroundMain}>
                <View style={stylest.content}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[style.textMain, { textAlign: 'right' }]}>{'CANCEL'.t()}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={[style.textTitle, { marginTop: 20, marginBottom: 50, }]}>{'RESET_PASSWORD'.t()}</Text>
                        <Text style={[styles.textWhite, { fontWeight: 'bold' }]}>{'Enter your email or phone'.t()}</Text>
                        <Text style={styles.bgSellOldNew}>{msg && msg}</Text>
                        <Item style={stylest.inputStyle}>
                            <Input
                                allowFontScaling={true}
                                onChangeText={(email) => this.setState({ email })}
                                placeholder={'Enter your email or phone'.t()}
                                placeholderTextColor={styles.textPlaceHolder.color}
                                style={[styles.textWhite, { height: 40, marginLeft: -5 },style.fontSize14]}
                                keyboardType={'email-address'}
                            />
                        </Item>
                        <Button
                            block warning style={[style.btnSubmit,{marginBottom:15,backgroundColor:styles.bgButton.color}, style.buttonHeight]}
                            onPress={this.handleNext}
                        >
                            <Text style={{ color: '#fff' }}>{'NEXT'.t()}</Text>
                        </Button>
                        <NoteNoticeBlockAcc />
                    </View>
                </View>
                <ModalAlert 
                content={content}
                visible={visible}
                onClose={()=>this.setState({
                    visible:false
                })}
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
        borderBottomColor: '#44588c',
    }
})

export default ResetPassword;
