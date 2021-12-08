import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { authService } from '../../services/authentication.service';
import { get, toast, size, jwtDecode, validateEmail, createAction } from '../../configs/utils';
import { pop } from '../../navigation/Navigation';
import { useDispatch,useSelector } from "react-redux"
import { SET_FA_CODE } from '../../redux/modules/authentication/actions';
import { constant } from '../../configs/constant';
const FaCodeEmail = ({
    componentId,
    enable,
    disable,
    userInfo
}) => {
    const [Password, setPassword] = useState("");
    const [Email, setEmail] = useState("");
    const [FaCode, setFaCode] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const [SessionId, setSessionId] = useState("");
    const dispatcher = useDispatch();
    const UserInfo = useSelector(state => state.authentication.userInfo)
    const TwoFAType = get(UserInfo, "twoFactorService");
    const TwoFactorEnable = get(UserInfo, "twoFactorEnabled");

    useEffect(() => {
        if (TwoFactorEnable && TwoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            handleResend2Fa();
        }

        return () => {

        };
    }, [])
    const handleSubmit = () => {
        if (enable) {
            handleEnable()
        } else {
            handleDisable();
        }
    }
    const handleDisable = async () => {
        try {
            if (validate(false)) {
                setDisabled(true)
                let res = await authService.disableEmail(Password, Email, FaCode, SessionId);
                setDisabled(false)
                console.log(res);
                if (get(res, "data.status")) {
                    toast(get(res, "data.message").t());
                    dispatcher(createAction(SET_FA_CODE, { twoFactorEnabled: false, twoFactorService: "" }))
                    pop(componentId);

                } else {
                    
                    toast(get(res, "data.message").t())
                }
            }
        } catch (error) {
            setDisabled(false)
        }
    }
    const handleResend2Fa = async () => {
        try {

            let content = await jwtDecode();
            if (get(content, "Username")) {
                let res = await authService.getTwoFactorEmailCode(get(content, "Username"));
                if (get(res, "data.sessionId")) {
                    setSessionId(get(res, "data.sessionId"));
                }
            }
        } catch (error) {

        }
    }
    const validate = (enable = true) => {
        if (enable) {
            if (size(Password) === 0) {
                toast("Please enter Password".t());
                return false
            } else if (size(Email) === 0) {
                toast("PLEASE_ENTER_EMAIL".t());
                return false
            } else if (!validateEmail(Email)) {
                toast("PLEASE_INPUT_A_VALID_EMAIL".t())
                return false
            }
            return true
        } else {
            if (size(Password) === 0) {
                toast("Please enter Password".t());
                return false
            } else if (size(Email) === 0) {
                toast("PLEASE_ENTER_EMAIL".t());
                return false
            } else if (!validateEmail(Email)) {
                toast("PLEASE_INPUT_A_VALID_EMAIL".t())
                return false
            } else if (size(FaCode) === 0) {
                toast("Please enter 2FA code".t());
                return false
            }
            return true
        }
    }
    const handleEnable = async () => {
        try {
            if (validate()) {
                setDisabled(true)
                let res = await authService.enableEmail(Password, Email);
                console.log(res,"ress");
                setDisabled(false)
                if (get(res, "data.status")) {
                    toast(get(res, "data.message").t());
                    dispatcher(createAction(SET_FA_CODE, { twoFactorEnabled: true, twoFactorService: constant.TWO_FACTOR_TYPE.EMAIL_2FA }))
                    pop(componentId)
                } else {
                    toast(get(res, "data.message").t())
                }
            }
        } catch (error) {
            console.log(error,"errr");
            setDisabled(false)
        }
    }
    return (
        <Container
            isScroll={true}
            isLoadding={Disabled}
            componentId={componentId}
            hasBack
            title={`${disable ? "Disable".t() : "Enable".t()} ${"Email Verification".t().toLowerCase()}`}
        >
            <Input
                spaceVertical={10}
                isSecurity
                value={Password}
                placeholder={"PASSWORD".t()}
                onChangeText={(text) => setPassword(text)}
            />
            <Input
                spaceVertical={10}
                value={Email}
                placeholder={"Email"}
                onChangeText={(text) => setEmail(text)}
            />
            {disable && <Input
                isResend
                isPaste
                spaceVertical={10}
                value={FaCode}
                placeholder={"2FA_CODE".t()}
                onChangeText={(text) => setFaCode(text)}
                handleResend={handleResend2Fa}
            />}

            <Button
                spaceVertical={10}
                isSubmit
                isButtonCircle={false}
                onSubmit={handleSubmit}
                disabled={Disabled}
            />
        </Container>
    );
}

export default FaCodeEmail;
