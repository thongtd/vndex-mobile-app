import React, { useState, useCallback } from 'react';
import { useSelector } from "react-redux"
import { Text, View, StyleSheet, DeviceEventEmitter } from 'react-native';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { LayoutSplashScreen } from '../../components';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import { Navigation } from 'react-native-navigation';
import { PICKER_SEARCH, WALLET_SCREEN, LOGIN_SCREEN, CONFIRM_REGISTER_SCREEN, pushSingleScreenApp } from '../../navigation';
import { hiddenModal, createAction, get, toast, validateEmail, size } from '../../configs/utils';
import ItemList from '../../components/Item/ItemList';
import { constant, IdNavigation } from '../../configs/constant';
import { authService } from '../../services/authentication.service';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import ButtonBack from '../../components/Button/ButtonBack';
import { dismissAllModal } from '../../navigation/Navigation';
const RegisterScreen = ({
    componentId
}) => {
    const countries = useSelector(state => state.authentication.countries);
    const [country, setCountry] = useState({
        code: "VN",
        name: "Viet Nam"
    });
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);
    const handleActiveCountry = (countryActived) => {
        setCountry(countryActived);
        dismissAllModal();
    }
    const handleSelectCountry = () => {
        let propsData = {
            data: countries,
            renderItem: ({ item, key }) => {
                return (
                    <ItemList
                        onPress={() => handleActiveCountry(item)}
                        value={item.name}
                        checked={item.code === country.code}
                    />
                )
            },
            keywords: ["name"]
        }
        Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
    }
    const handleChangeEmail = (text) => {
        setEmail(text);
    }
    const handleSubmitCheckEmail = async () => {
        setDisabled(true)
        if(size(email) === 0){
            setDisabled(false)
            return toast("PLEASE_ENTER_EMAIL".t());
        } else if(!validateEmail(email)){
            setDisabled(false)
            return toast("PLEASE_INPUT_A_VALID_EMAIL".t())
        } else{
            try {
                let res = await authService.checkRegister(email);
                console.log(res,"res reg")
                if (get(res, "result") === 'ok') {
                    if (get(res, "data.code") === 7) {
                        setDisabled(false)   
                        return toast("Email Address already exists".t());
                    } else {
                        setDisabled(false);
                        pushSingleScreenApp(componentId,CONFIRM_REGISTER_SCREEN,{
                            email:email,
                            countryCode:get(country,"code")
                        })
                    }
                }
            } catch (error) {
                console.log(error,"err reg")
                setDisabled(false)
            }
        }
    }
    return (
        <LayoutSplashScreen
        isLoadding={disabled}
        componentId={componentId}
        >
             <View style={stylest.textRegister}>
                {/* <TextFnx space={10} value={`${"I_HAVE_ACCOUNT".t()} `} /> */}
                <ButtonWithTitle space={10} onPress={() => pushSingleScreenApp(componentId,LOGIN_SCREEN)} color={colors.highlight} title={"LOGIN".t()} />
            </View>
            <View style={stylest.title}>
                <TextFnx size={25} color={colors.tabbarActive} weight={"bold"} value={"REGISTER".t()} />
            </View>
            <Button
                isLabel
                label={"CHOOSE_YOUR_COUNTRY".t()}
                isPlaceholder={false}
                spaceVertical={10}
                onInput={handleSelectCountry}
                isInput
                iconRight="caret-down"
                iconLeft="globe-americas"
                placeholder={get(country, "name")}
            />
            <Input
                isLabel
                label="Email"
                onSubmitEditing={handleSubmitCheckEmail}
                value={email}
                onChangeText={handleChangeEmail}
                keyboardType={"email-address"}
                spaceVertical={10}
                placeholder={"Enter your email or phone".t()}
                // isCircle
                 />
            <Button
                isButtonCircle={false}
                disabled={disabled}
                onSubmit={handleSubmitCheckEmail}
                spaceVertical={25}
                isSubmit
                textSubmit={"NEXT".t()}
            />

           
            <ButtonFooterAuth 
            textLeft=""
            componentId={componentId}
            />
        </LayoutSplashScreen>
    )
};
const stylest = StyleSheet.create({
    blockCheckbox: { flexDirection: "row", alignItems: "center" },
    title: {
        alignItems: "center",
        paddingTop: 31,
        paddingBottom: 32
    },
    textRegister: {
        flexDirection: "row",
        justifyContent: "flex-end",
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
export default RegisterScreen;
