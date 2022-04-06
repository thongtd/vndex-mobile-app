import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { _validateAuth, size, toast, jwtDecode, get, emitEventEmitter, removeTokenAndUserInfo, createAction } from '../../configs/utils';
import { authService } from '../../services/authentication.service';
import { constant } from '../../configs/constant';
import TextFnx from '../../components/Text/TextFnx';
import NoteImportant from '../../components/Text/NoteImportant';
import { useDispatch, useSelector } from "react-redux"
import { CHECK_STATE_LOGIN, SET_USER_INFO } from '../../redux/modules/authentication/actions';
import { pushSingleScreenApp, LOGIN_SCREEN } from '../../navigation';
import colors from '../../configs/styles/colors';
const ChangePasswordScreen = ({
    componentId,
}) => {
    const [OldPassword, setOldPassword] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [ReNewPassword, setReNewPassword] = useState("");
    const [VerifyCode, setVerifyCode] = useState("");
    const [SessionId, setSessionId] = useState("");
    const [Email, setEmail] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const dispatcher = useDispatch();
    const UserInfo = useSelector(state => state.authentication.userInfo)
    const TwoFAType = get(UserInfo, "twoFactorService");
    const TwoFactorEnable = get(UserInfo, "twoFactorEnabled");

    const handleSubmit = async () => {
        if (size(OldPassword) === 0) {
            toast("Please enter your old password".t());
            return;
        }
        let isValid = _validateAuth(NewPassword, ReNewPassword,VerifyCode,true);
        if (isValid) {
            let data;
            if (VerifyCode) {
                data = { userEmail: Email, password: OldPassword, newPassword: NewPassword, verifyCode: VerifyCode, sessionId: SessionId }
            } else {
                data = { userEmail: Email, password: OldPassword, newPassword: NewPassword, sessionId: SessionId }
            }
            setDisabled(true);
            try {
                let response = await authService.changePassword(data);
                console.log(response,"response")
                setDisabled(false);
                if (get(response, "status") === 'ok') {
                    removeTokenAndUserInfo();
                    dispatcher(createAction(CHECK_STATE_LOGIN, false));
                    dispatcher(createAction(SET_USER_INFO, null));
                    pushSingleScreenApp(componentId, LOGIN_SCREEN);
                    toast(`Your password has been changed successfully`.t())
                    
                } else {
                    toast("Change password failed".t())
                }
            } catch (error) {
                setDisabled(false)
            }
        }
    }
    useEffect(() => {
        getKeepLogin();
        if (TwoFactorEnable && TwoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            getSessionId();
        }
        return () => {

        }
    }, [])
    const getSessionId = () => {
        jwtDecode().then(user => {
            
            if (get(user, "Username")) {
                authService.getTwoFactorEmailCode(get(user, "Username")).then(res => {
                    console.log(res,"Ress");
                    if (get(res, "data.sessionId")) {
                        setSessionId(get(res, "data.sessionId"))
                    }
                }).catch(err => console.log(err,"Err"))
            }
        })

    }
    const getKeepLogin = () => {
        jwtDecode().then(user => {
            console.log(user,"ss")
            if (get(user, "Username")) {
                console.log(get(user, "Username"),"llll");
                setEmail(get(user, "Username"));
            }
        })

    }
    console.log(Email,"kakak");
    return (
        <Container
            title={"Change Password".t()}
            hasBack
            componentId={componentId}
            isLoadding={Disabled}
            isScroll={true}
            space={20}
        >
            <Input
                value={OldPassword}
                isSecurity
                placeholder={"Old password".t()}
                spaceVertical={10}
                onChangeText={(text) => setOldPassword(text)}
            />
            <Input
                value={NewPassword}
                isSecurity
                placeholder={"New Password".t()}
                spaceVertical={10}
                onChangeText={(text) => setNewPassword(text)}
            />
            <Input
                value={ReNewPassword}
                isSecurity
                placeholder={"Confirm New Password".t()}
                spaceVertical={10}
                onChangeText={(text) => setReNewPassword(text)}
            />
            {TwoFactorEnable && <Input
                isLabel
                label={"2FA_CODE".t()}
                handleResend={getSessionId}
                value={VerifyCode}
                isResend={TwoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA ? true : false}
                isPaste
                placeholder={"2FA_CODE".t()}
                spaceVertical={10}
                onChangeText={(text) => setVerifyCode(text)}
            />}
            {TwoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA?(<TextFnx space={10} color={colors.description}>{"Enter the 6 numbers sent to the email".t()} {Email}</TextFnx>):(<TextFnx color={colors.description} space={10}>{"Enter 6 numbers google authenticator from".t()} {Email}</TextFnx>)}
            <Button
                disabled={Disabled}
                isSubmit
                isButtonCircle={false}
                onSubmit={handleSubmit}
            />
            <NoteImportant
                isTitle={false}
                arrNote={["NoteChangePass".t()]}
            />
        </Container>
    );
}

export default ChangePasswordScreen;
