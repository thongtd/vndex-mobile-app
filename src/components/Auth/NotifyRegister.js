import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container } from 'native-base';
import { style } from '../../config/style';
import SubmitButton from '../Shared/SubmitButton'
import { authService } from '../../services/authenticate.service';
import Welcome from './components/Welcome';
import theme,{styles} from "react-native-theme";
export default class NotifyRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: true,
            is_submit: false,
            timer: 60
        };
        // this.doResendEmail = this.doResendEmail.bind(this);
    }

    componentDidMount() {
        this.setState({ isReady: false })
    }


    resendEmailConfirm = async () => {
        const { email } = this.props.navigation.state.params;
        console.log("click resend");


        this.setState({ is_submit: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    is_submit: false,
                    timer: 60
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let res = await authService.resendConfirmEmail(email);

        console.log(res, "data send");

    }
    render() {
        // const {email} = this.props.navigation.state.params
        const { navigation } = this.props;
        const { email } = navigation.state.params;
        const { is_submit, timer } = this.state;
        return (
            <Container style={styles.backgroundMain} flex={1}>
                <View margin={15} style={{
                    marginHorizontal:25
                }} flex={1}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.textWhite}>{'WELCOME'.t()}</Text>
                        <View style={stylest.logoWelcome}>
                            <Image source={theme.name === "light"?require('../../assets/financex_logo_l.png'):require('../../assets/img/logo-financex.png')}
                                style={{ maxWidth: '100%', height: 58 }}
                                resizeMode={'contain'} />
                        </View>
                    </View>
                    {/* <Welcome /> */}
                    <View style={{ flex: 2, justifyContent: 'flex-start'}}>
                        <Text style={{
                            color: '#486db3',
                            fontSize: 16,
                            fontWeight: 'bold',
                            paddingBottom: 13,
                        }}>{"EMAIL_HAS_NOT_BEEN_CONFIRMED".t()}</Text>
                        <Text style={[styles.textWhite, { textAlign: 'justify' }]}>
                            {"EMAIL_REGISTER_VERIFICATION_P_1".t() }
                        </Text>
                        <Text style={[styles.textWhite, { textAlign: 'justify' }]}>
                            {email + "EMAIL_REGISTER_VERIFICATION_P_2".t()}
                        </Text>
                        {/* {hasTimer && <Text style={{
                            color:"#fff",
                            fontSize:18,
                            textAlign:"center"
                        }}>{timer}</Text>} */}
                        <SubmitButton
                            is_submit={is_submit}
                            label={is_submit ? timer : 'RESEND_EMAIL'.t()}
                            style={[style.btnSubmit, style.buttonHeight, { width: '100%' }]}
                            onSubmit={this.resendEmailConfirm}
                            labelStyle={style.textWhite}
                        />
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Image
                                style={{ height: 10, width: 15, tintColor: '#486db5' }}
                                source={require('../../assets/img/ic_backlogin.png')}
                            />
                            <Text style={{ color: '#486db5', marginLeft: 10 }}>{"BACK".t()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    logoWelcome: {
        width: '50%',
        flex: 1,
        flexDirection: 'row',
        marginTop: -10
    },
})