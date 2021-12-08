import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Container from '../../components/Container';
import HeaderWalletScreen from '../WalletScreen/components/HeaderWalletScreen';
import HeaderSettingScreen from './components/HeaderSettingScreen';
import ItemSetting from '../../components/Item/ItemSetting';
import icons from '../../configs/icons';
import { get, hiddenTabbar, hiddenModal, checkLang, createAction, size } from '../../configs/utils';
import { constant } from '../../configs/constant';
import { useDispatch, useSelector } from "react-redux"
import { pushSingleScreenApp, SUPPORT_SCREEN, PICKER_SEARCH, PASSCODE_SCREEN, CHANGE_PASSWORD, SECURITY_SCREEN } from '../../navigation';
import { Navigation } from 'react-native-navigation';
import i18n from "react-native-i18n"
import ItemList from '../../components/Item/ItemList';
import { LANGUAGES } from '../../redux/modules/authentication/actions';
import { switchLangTabbar } from '../../navigation/helpers';
import { storageService } from '../../services/storage.service';
import { dismissAllModal } from '../../navigation/Navigation';
const checkLanguage = (lang) => {
    if (lang === "vi-VN") {
        return { name: "Tiếng Việt", value: "vi-VN" }
    } else if (lang === "en-US") {
        return { name: "English", value: "en-US" }
    }
}
const SettingScreen = ({
    componentId,
}) => {
    const dispatcher = useDispatch();
    const logged = useSelector(state => state.authentication.logged);
    const isPasscode = useSelector(state => state.authentication.isPasscode);
    const langGlobal = useSelector(state => state.authentication.lang)
    const [Lang, setLang] = useState(checkLanguage(checkLang(langGlobal)))
    const [IsSwitch, setIsSwitch] = useState(false)
    const checkDatalogged = (lang = "", currency = "") => {
        if (logged) {
            const dtLogged = [
                { textLeft: "Change Password", iconLeft: icons.changePass, iconRight: true, onPress: onChangePassword },
                { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData},
                { textLeft: "Security", iconLeft: icons.sercurity, iconRight: true, onPress: onSecurity, isBorder: true },
                { textLeft: "currency", iconLeft: icons.currency, textRight: "VND", onPress: onCurrency },
                { textLeft: "Languages", iconLeft: icons.language, textRight: lang, onPress: onLanguage, isBorder: true },
                { textLeft: "Support", iconLeft: icons.support, iconRight: true, onPress: onSupport },
                { textLeft: "About", iconLeft: icons.about, textRight: `V ${constant.GOOGLE_VERSION}` },
            ];
            return dtLogged;
        } else {
            const dataNoLogged = [
                { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },
                { textLeft: "Languages", iconLeft: icons.language, textRight: lang, onPress: onLanguage, isBorder: true },
                { textLeft: "Support", iconLeft: icons.support, iconRight: true, onPress: onSupport },
                { textLeft: "About", iconLeft: icons.about, textRight: `V ${constant.GOOGLE_VERSION}` },
            ];
            return dataNoLogged
        }
    }
    const [DataSetting, setDataSetting] = useState(checkDatalogged(get(Lang, "name")))
    useEffect(() => {
        setDataSetting(checkDatalogged(get(Lang, "name")))
        return () => {

        };
    }, [logged, Lang]);
    useEffect(() => {
        if (isPasscode) {
            setIsSwitch(true)
        } else {
            setIsSwitch(false)
        }
    }, [isPasscode])
    const changeSwitchData = () => {
        pushSingleScreenApp(componentId, PASSCODE_SCREEN)
    }
    const onSupport = () => {
        pushSingleScreenApp(componentId, SUPPORT_SCREEN, hiddenTabbar())
    }
    const onChangePassword = () => {
        pushSingleScreenApp(componentId, CHANGE_PASSWORD)
    }
    const onSecurity = () => {
        pushSingleScreenApp(componentId, SECURITY_SCREEN)
    }
    const onLanguage = () => {
        let propsData = {
            data: [{ name: "Tiếng Việt", value: "vi-VN" }, { name: "English", value: "en-US" }],
            renderItem: ({ item, key }) => {
                return (
                    <ItemList
                        onPress={() => handleActiveLang(item)}
                        value={item.name}
                        checked={item.value === Lang.value}
                    />
                )
            },
            keywords: ["name"]
        }

        Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
    }
    const handleActiveLang = (langActive) => {
        setLang(langActive);
        dispatcher(createAction(LANGUAGES, langActive.value));
        i18n.locale = langActive.value;
        switchLangTabbar();
        dismissAllModal();
    }
    const onCurrency = () => {
        let propsData = {
            data: [{ name: "VND", value: "VND" }, { name: "IDR", value: "IDR" }],
            renderItem: ({ item, key }) => {
                return (
                    <ItemList
                        onPress={() => handleActiveCurrency(item)}
                        value={item.name}
                        checked={item.value === Lang.value}
                    />
                )
            },
            keywords: ["name"]
        }

        Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
    }
    const handleActiveCurrency=(currency)=>{
        
        dismissAllModal();
    }
    return (
        <Container
            space={5}
            isTopBar={false}
            customTopBar={
                <HeaderSettingScreen componentId={componentId} />
            }
        >
            {DataSetting.map((item, index) => {
                return (<ItemSetting
                    IsSwitch={IsSwitch}
                    key={index}
                    textLeft={get(item, "textLeft").t()}
                    iconLeft={get(item, "iconLeft")}
                    iconRight={get(item, "iconRight")}
                    textRight={get(item, "textRight")}
                    hasSwitch={get(item, "hasSwitch")}
                    isBorder={get(item, "isBorder")}
                    onPress={get(item, "onPress")}
                    onValueChange={get(item, "onValueChange")}
                />)
            })}

        </Container>
    );
}

export default SettingScreen;
