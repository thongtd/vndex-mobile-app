import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Container from '../../components/Container';
import { pushTabBasedApp } from '../../navigation';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { jwtDecode, get, toast, size, createAction } from '../../configs/utils';
import { authService } from '../../services/authentication.service';
import { useDispatch } from "react-redux"
import { SET_FA_CODE } from '../../redux/modules/authentication/actions';
import { constant } from '../../configs/constant';
const Enable2FaGG = ({
    componentId,
    SecretKey,
    enable
}) => {
    const [Password, setPassword] = useState("");
    const [VerifyCode, setVerifyCode] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const dispatcher = useDispatch();
    const validate = () => {
        if (size(Password) === 0) {
            toast("Please enter Password".t())
            return false;
        } else if (size(VerifyCode) === 0) {
            toast("Please enter 2FA code".t());
            return false;
        }
        return true;
    }
    const handleSubmit = async () => {
        if (validate()) {

            try {
                let user = await jwtDecode();
                if (get(user, "sub")) {
                    if (enable) {
                        let data = {
                            password: Password,
                            verifyCode: VerifyCode,
                            email: get(user, "sub"),
                            secretKey: SecretKey
                        }
                        setDisabled(true)

                        let res = await authService.setupGoogleAuth(data);
                        setDisabled(false);
                        if (get(res, "code") === 1) {
                            dispatcher(createAction(SET_FA_CODE, { twoFactorEnabled: true, twoFactorService: constant.TWO_FACTOR_TYPE.GG2FA }))
                            pushTabBasedApp(3);
                            toast(`${get(res, "message")}`.t())
                        } else {
                            toast(`${get(res, "message")}`.t())
                        }
                    } else {
                        setDisabled(true)
                        let res = await authService.disableGGAuth(get(user, "sub"), Password, VerifyCode);
                        setDisabled(false);
                        if (get(res, "data.status")) {
                            dispatcher(createAction(SET_FA_CODE, { twoFactorEnabled: false, twoFactorService: "" }))
                            pushTabBasedApp(3);
                            toast(`${get(res, "data.message")}`.t())
                        } else {
                            toast(`${get(res, "data.message")}`.t())
                        }
                    }

                }
            } catch (error) {
                setDisabled(false);
            }
        }
    }
    return (
        <Container
            isScroll={true}
            title={`${enable ? "Enable".t() : "Disable".t()} ${"Google Authentication".t()}`}
            hasBack
            componentId={componentId}
            onClickRight={() => pushTabBasedApp(3)}
            textRight={"SKIP".t()}
            style={{
                flex: 1,
            }}
            isLoadding={Disabled}
        >
            <Input
                
                value={Password}
                onChangeText={(text) => setPassword(text)}
                
                placeholder={"PASSWORD".t()}
                spaceVertical={10}
                isSecurity
            />
            <Input
                hasValue
                isPaste
                keyboardType={"number-pad"}
                value={VerifyCode}
                maxLength={6}
                onChangeText={(text) => setVerifyCode(text)}
                spaceVertical={10}
                placeholder={"Google authenticator code".t()}
            />
            <Button
                disabled={Disabled}
                spaceVertical={10}
                isSubmit
                isButtonCircle={false}
                onSubmit={handleSubmit}
            />
        </Container>
    );

}
export default Enable2FaGG;
