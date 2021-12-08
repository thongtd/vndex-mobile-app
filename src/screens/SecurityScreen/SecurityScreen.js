import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import ItemSecurity from './components/ItemSecurity';
import Container from '../../components/Container';
import icons from '../../configs/icons';
import { getUserInfo, get, createAction, toast } from '../../configs/utils';
import { constant } from '../../configs/constant';
import { pushSingleScreenApp, FA_CODE_EMAIL, ENABLE_2FA_GG, GUIDE_SET_UP_GG } from '../../navigation';
import { useDispatch, useSelector } from "react-redux"
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
                IsSwitch={(twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) ? true : false}
                onValueChange={handleFaEmail}
            />
            <ItemSecurity
                IsSwitch={(twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA) ? true : false}
                iconLeft={icons.gg2fa} textLeft={"Google Authentication".t()}
                isBorder={false}
                onValueChange={handleFaGG}
            />
            <NoteImportant
                arrNote={["EMAIL_VERIFY_NOTE".t(), "GG_VERIFY_NOTE".t()]}
            />
        </Container>
    );
}

export default SecurityScreen;
