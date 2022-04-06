import React, { useState } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { LayoutSplashScreen } from '../../components';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import Icon from '../../components/Icon';
import CheckBox from 'react-native-check-box';
import ModalAlert from '../../components/Alert/AlertNoticePassword';
// import { Navigation } from 'react-native-navigation';
import { ALERT_NOTICE_PASSWORD, ALERT_ACCOUNT_ACTIVE, LOGIN_SCREEN, pushSingleHiddenTopBarApp } from '../../navigation';
import { hiddenModal, get, toast, _validateAuth, size } from '../../configs/utils';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import { authService } from '../../services/authentication.service';
import { showModal } from '../../navigation/Navigation';

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
        showModal(ALERT_NOTICE_PASSWORD);
        // Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
    }
    const handleConfirm = async () => {
        let data = { email, otpCode: otp, sessionId, newPassword: password };

        let isValid = _validateAuth(password, rePassword,otp,true);
        if (isValid) {
            setDisabled(true);
            let res = await authService.confirmResetPassword(data);
            
            if (get(res, "status")) {
                setDisabled(false);
                toast(get(res, "message").t())
                await pushSingleHiddenTopBarApp(rest.componentId,LOGIN_SCREEN);
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
        componentId={rest.componentId}
        >
            {/* <View style={stylest.textRegister}>
                <ButtonWithTitle space={10} onPress={() => pushSingleHiddenTopBarApp(rest.componentId,LOGIN_SCREEN)} color={colors.highlight} title={"LOGIN".t()} />
            </View> */}
            <View style={stylest.title}>
                <TextFnx spaceTop={Platform.OS == 'android' && 40} size={30} color={colors.tabbarActive} weight={"bold"} value={"RESET_PASSWORD".t()} />
            </View>
            <Input
                // label={"PASSWORD".t()}
                // isLabel
                isSecurity
                value={password}
                onChangeText={(pass) => setPassword(pass)}
                onPressButtonRight={handleButtonRight}
                // nameIconLeft="lock"
                spaceVertical={10}
                // isIconLeft
                placeholder={"PASSWORD".t()}
                // isCircle
                isButtonRight
                nameIconRight="exclamation-circle"
            />
            <Input
                // label={"CONFIRM_PASSWORD".t()}
                // isLabel
                isSecurity
                value={rePassword}
                onChangeText={(pass) => setRePassword(pass)}
                spaceVertical={10}
                // isIconLeft
                // nameIconLeft={"lock"}
                placeholder={"CONFIRM_PASSWORD".t()}
                // isCircle 
                />
            <Input
                // label={"OTP_CODE".t()}
                // isLabel
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
                // isCircle 
                />
            <TextFnx color={colors.description} value={`${"Enter the 6 numbers sent to the email".t()} ${email}`} />
            <Button disabled={disabled} onSubmit={handleConfirm} spaceVertical={10} isSubmit textSubmit={"CONFIRM".t()} isButtonCircle={false} />
            <TextFnx style={{
                color: colors.red
            }} value={`${"NOTE_RESET_PASSWORD".t()} `} />
            {/* <ButtonWithTitle space={10} onPress={() => Navigation.pop(rest.componentId)} style={[stylest.textRegister, { alignItems: 'center', }]}>
                <Icon name="arrow-left" color={colors.background} />
                <TextFnx value={` ${"BACK".t()}`} />
            </ButtonWithTitle> */}
            {/* <ButtonFooterAuth
                textLeft=""
            /> */}
        </LayoutSplashScreen>
    )
}

const stylest = StyleSheet.create({
    blockCheckbox: { flexDirection: "row", alignItems: "center" },
    title: {
        paddingTop: 40,
        paddingBottom: 10
    },
    textRegister: {
        flexDirection: "row",
        justifyContent: "flex-end"
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
