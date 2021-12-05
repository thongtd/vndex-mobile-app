import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { SendEmailField } from "../../../../Shared"
import { authService } from "../../../../../services/authenticate.service"
import { jwtDecode } from "../../../../../config/utilities"
import { constant } from '../../../../../config/constants';
import Toast from 'react-native-simple-toast';
export default class Step2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            code: null,
            checked: false,
            timer: 60
        }
    }
    componentDidMount = () => {
        Toast.showWithGravity("OTP code has been sent to your email".t(), Toast.LONG, Toast.CENTER);
        let { requestId } = this.props;
        if (requestId) {

            this.setState({ disable: true, checked: true, });
            let timerActive = new Date().getTime();
            this.interval = setInterval(() => {
                if (this.state.timer <= 0) {
                    clearInterval(this.interval);
                    this.setState({
                        checked: false,
                        disable: false,
                        timer: 60
                    })
                } else {
                    this.setState({
                        timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                    })
                }
            }, 1000);
        }
    };

    async onSentOtp() {
        Toast.showWithGravity("OTP code has been sent to your email".t(), Toast.LONG, Toast.CENTER);
        this.setState({ disable: true, checked: true, });
            let timerActive = new Date().getTime();
            this.interval = setInterval(() => {
                if (this.state.timer <= 0) {
                    clearInterval(this.interval);
                    this.setState({
                        checked: false,
                        disable: false,
                        timer: 60
                    })
                } else {
                    this.setState({
                        timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                    })
                }
            }, 1000);


        let { requestId } = this.props;
        if (requestId) {
            console.log(requestId, " this aside step2");
            let user = await jwtDecode();
            let response = await authService.getOtp(user.sub, 'COIN_WITHDRAWAL', requestId);
            // console.log(response,"response send otp");
            // this.setState({ sessionId:  })
            this.props.sessionId(response.sessionId)
        }

    }

    render() {
        const { onChangeText, checked, timer, onSend } = this.state;
        const { value } = this.props;
        return (
            <View style={{
                paddingTop: 20,
                marginBottom:10
            }}>
                <SendEmailField
                    maxLength={constant.MAX_OTP}
                    placeholder={'OTP_VERIFICATION'.t()}
                    onChangeText={(code) => this.props.codeOtp(code)}
                    titleBtn={"SEND_OTP".t()}
                    checked={checked}
                    timer={timer}
                    value={value}
                    onSend={() => this.onSentOtp()}
                />
            </View>

        )
    }
}
