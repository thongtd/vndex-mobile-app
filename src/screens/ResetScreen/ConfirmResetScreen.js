import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { LayoutSplashScreen } from '../../components';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import Icon from '../../components/Icon';
import CheckBox from 'react-native-check-box';
import ModalAlert from '../../components/Alert/AlertNoticePassword';
import { Navigation } from 'react-native-navigation';
import { ALERT_NOTICE_PASSWORD, ALERT_ACCOUNT_ACTIVE, LOGIN_SCREEN, pushSingleScreenApp } from '../../navigation';
import { hiddenModal, get, toast, _validateAuth, size } from '../../configs/utils';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import { authService } from '../../services/authentication.service';

const ConfirmResetScreen = ({
    email,
    ...rest
}) => {
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [otp, setOtp] = useState("");
    const [sessionId, setSessionId] = useState(rest.sessionId)
    const [disabled, setDisabled] = useState(false)

    const handleButtonRight = () => {
        Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
    }
    const handleConfirm = async () => {
        let data = { email, otpCode: otp, sessionId, newPassword: password };

        let isValid = _validateAuth(password, rePassword,otp,true);
        if (isValid) {
            setDisabled(true);
            let res = await authService.confirmResetPassword(data);
            if (get(res, "status")) {
                toast(get(res, "message").t())
                setDisabled(false);
                pushSingleScreenApp(rest.componentId, LOGIN_SCREEN)
            } else {
                setDisabled(false);
                toast(get(res, "message").t())
            }
        }
    }
    const handleResend = async () => {
        let res = await authService.resetPassword(email);
        if (get(res, "status")) {
            toast("OTP code has been sent to your email".t())
            setSessionId(get(res, "otpToken.sessionId"));
        }
    }
    return (
        <LayoutSplashScreen
        isLoadding={disabled}
        >
            <View style={stylest.title}>
                <TextFnx size={25} color={colors.tabbarActive} weight={"bold"} value={"RESET_PASSWORD".t()} />
            </View>
            <Input
                isSecurity
                value={password}
                onChangeText={(pass) => setPassword(pass)}
                onPressButtonRight={handleButtonRight}
                nameIconLeft="lock"
                spaceVertical={10}
                isIconLeft
                placeholder={"PASSWORD".t()}
                isCircle
                isButtonRight
                nameIconRight="exclamation-circle"
            />
            <Input
                isSecurity
                value={rePassword}
                onChangeText={(pass) => setRePassword(pass)}
                spaceVertical={10}
                isIconLeft
                nameIconLeft={"lock"}
                placeholder={"CONFIRM_PASSWORD".t()}
                isCircle />
            <Input
                onSubmitEditing={handleConfirm}
                handleResend={handleResend}
                value={otp}
                onChangeText={(otp) => {
                    setOtp(otp)
                }}
                isPaste
                isResend
                spaceVertical={10}
                placeholder={"OTP_CODE".t()}
                isCircle />
            <Button disabled={disabled} onSubmit={handleConfirm} spaceVertical={10} isSubmit textSubmit={"CONFIRM".t()} isButtonCircle />
            <ButtonWithTitle space={10} onPress={() => Navigation.pop(rest.componentId)} style={[stylest.textRegister, { alignItems: 'center', }]}>
                <Icon name="arrow-left" color={colors.background} />
                <TextFnx value={` ${"BACK".t()}`} />
            </ButtonWithTitle>
            <ButtonFooterAuth
                textLeft=""
            />
        </LayoutSplashScreen>
    )
}

const stylest = StyleSheet.create({
    blockCheckbox: { flexDirection: "row", alignItems: "center" },
    title: {
        alignItems: "center",
        paddingTop: 65,
        paddingBottom: 10
    },
    textRegister: {
        flexDirection: "row",
        justifyContent: "center",
        // marginVertical: 10
    },
    textBottom: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "120%",
        left: "-10%"
    }
})
export default ConfirmResetScreen;
