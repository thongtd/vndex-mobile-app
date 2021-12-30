import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import ItemSecurity from './components/ItemSecurity';
import Container from '../../components/Container';
import icons from '../../configs/icons';
import { getUserInfo, get, createAction, toast } from '../../configs/utils';
import { constant } from '../../configs/constant';
import { pushSingleScreenApp, FA_CODE_EMAIL, ENABLE_2FA_GG, GUIDE_SET_UP_GG, CHANGE_PASSWORD, HISTORY_LOGIN_SCREEN } from '../../navigation';
import { useDispatch, useSelector } from "react-redux"
import HistoryLogin from 'assets/svg/historyLogin.svg';
import ChangePass from 'assets/svg/changePass.svg';
import { SET_USER_INFO } from '../../redux/modules/authentication/actions';
import NoteImportant from '../../components/Text/NoteImportant';
const SecurityScreen = ({
    componentId,
}) => {
    const UserInfo = useSelector(state => state.authentication.userInfo)
    const twoFactorySerice = get(UserInfo, "twoFactorService");
    const twoFactorEnable = get(UserInfo, "twoFactorEnabled");
    const handleFaEmail = () => {
        if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            return pushSingleScreenApp(componentId, FA_CODE_EMAIL, {
                disable: true,
                UserInfo
            })
        } else if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA) {
            toast("Your account has been enabled 2FA by Gooogle Authenticator".t());
            return;
        } else {
            return pushSingleScreenApp(componentId, FA_CODE_EMAIL, {
                enable: true,
                UserInfo
            })
        }
    }
    const onChangePassword = () => {
        pushSingleScreenApp(componentId, CHANGE_PASSWORD);
      };
      const onHistoryLogin = () => {
        pushSingleScreenApp(componentId, HISTORY_LOGIN_SCREEN);
      };
    const handleFaGG = () => {
        if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            toast("Your account has been enabled 2FA by Email".t());
            return;
        } else if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA) {

            return pushSingleScreenApp(componentId, ENABLE_2FA_GG, {
                enable: false
            })
        } else {
            return pushSingleScreenApp(componentId, GUIDE_SET_UP_GG)
        }
    }

    return (
        <Container
            hasBack
            title={"Security".t()}
            componentId={componentId}
        >
            <ItemSecurity
            hasSwitch
                iconLeftSvg={icons.email2fa}
                IsSwitch={(twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) ? true : false}
                onValueChange={handleFaEmail}
            />
           
            <ItemSecurity
                hasSwitch
                IsSwitch={(twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA) ? true : false}
                iconLeftSvg={icons.gg2fa} textLeft={"Google Authentication".t()}
                isBorder={false}
                onValueChange={handleFaGG}
            />
             <ItemSecurity
                
                iconLeftSvg={<ChangePass />} textLeft={'Change Password'.t()}
                iconRight={true}
                onPress={onChangePassword}
            />
            <ItemSecurity
                iconLeftSvg={<HistoryLogin />} textLeft={'History Login'.t()}
                isBorder={false}
                iconRight={true}
                onPress={onHistoryLogin}
            />
            {/* <NoteImportant
                arrNote={["Note Security".t()]}
            /> */}
        </Container>
    );
}

export default SecurityScreen;
