import React, { useState } from 'react';
import { Text, View, StyleSheet, Linking } from 'react-native';
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
import { ALERT_NOTICE_PASSWORD, ALERT_ACCOUNT_ACTIVE, WALLET_SCREEN, LOGIN_SCREEN, pushSingleScreenApp } from '../../navigation';
import { hiddenModal, toast, get, _validateAuth } from '../../configs/utils';
import { IdNavigation } from '../../configs/constant';
import { authService } from '../../services/authentication.service';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';

const ConfirmScreen = ({
    countryCode,
    email,
    componentId
}) => {
    const [isCheck, setCheck] = useState(false);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [referralId, setReferralId] = useState("");
    const [disabled, setDisabled] = useState(false);

    const handleButtonRight = () => {
        Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
    }

    const doRegister = () => {
        if (!isCheck) {
            toast("You must be accepted this condition".t());
            return;
        }
        let register_model = {
            "email": email,
            "password": password,
            "rePassword": rePassword,
            "fromReferralId": referralId,
            "countryCode": countryCode,
            "via": 2
        }

        let isValid = _validateAuth(password, rePassword);
        if (isValid) {
            setDisabled(true)
            authService.register(register_model).then(res => {
                if (get(res, "status") === "OK") {
                    setDisabled(false)
                    toast(get(res, "message").t());
                    pushSingleScreenApp(componentId, LOGIN_SCREEN)
                }
                else {
                    setDisabled(false)
                    toast(get(res, 'message'))
                }
            })
                .catch(err => {
                    console.log(err,"Err");
                    setDisabled(false)
                })
        }
    }
    return (
        <LayoutSplashScreen
            isLoadding={disabled}
        >
            <View style={stylest.title}>
                <TextFnx size={25} color={colors.tabbarActive} weight={"bold"} value={"REGISTER".t()} />
            </View>

            <Input
                styleRight={{
                    borderRightWidth: 1,
                    borderRightColor:colors.iconButton ,
                    height:25
                }}
                isSecurity
                onChangeText={(text) => setPassword(text)}
                // secureTextEntry
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
                onChangeText={(text) => setRePassword(text)}
                // secureTextEntry
                spaceVertical={10}
                isIconLeft
                nameIconLeft={"lock"}
                placeholder={"CONFIRM_PASSWORD".t()}
                isCircle />
            <Input
                onChangeText={(text) => setReferralId(text)}
                spaceVertical={10}
                isIconLeft
                nameIconLeft={"user-friends"}
                placeholder={"REFERRAL_ID".t()}
                isCircle />
            {/* <Input
                handleResend={() => console.log("k")}
                onSubmitEditing={doRegister}
                keyboardType={"number-pad"}
                // onChangeText={(text) => setReferralId(text)}
                spaceVertical={10}
                isIconLeft
                nameIconLeft={"key"}
                placeholder={"OTP_CODE".t()}
                isResend
                isPaste
                isCircle /> */}

            <View style={stylest.blockCheckbox}>
                <CheckBox
                    onClick={() => {
                        setCheck(!isCheck)
                    }}
                    checkBoxColor={colors.green}
                    isChecked={isCheck}
                    rightTextStyle={{ color: colors.background }}
                    rightTextView={
                        <TextFnx value={`${"I_ALREADED_READ".t()} `} />
                    }
                />
                <ButtonWithTitle
                    onPress={() => Linking.openURL("LINK_POLICY".t())}
                    color={colors.highlight}
                    title={"CONDITION".t()} />
            </View>
            <Button
                disabled={disabled}
                textSubmit={"Complete".t()}
                onSubmit={doRegister}
                spaceVertical={10}
                isSubmit
                isButtonCircle />

            <View style={stylest.textRegister}>
                <TextFnx space={10} value={`${"I_HAVE_ACCOUNT".t()} `} />
                <ButtonWithTitle space={10} onPress={() => pushSingleScreenApp(componentId, LOGIN_SCREEN)} color={colors.highlight} title={"LOGIN".t()} />
            </View>
            <ButtonWithTitle space={10} onPress={() => Navigation.pop(componentId)} style={[stylest.textRegister, { alignItems: 'center', }]}>
                <Icon name="arrow-left" color={colors.background} />
                <TextFnx value={` ${"BACK".t()}`} />
            </ButtonWithTitle>
            <ButtonFooterAuth
                textLeft={""}
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
export default ConfirmScreen;
