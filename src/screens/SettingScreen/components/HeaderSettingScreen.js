import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import TopBarWallet from '../../../components/TopBarWallet';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
import { constant, IdNavigation } from '../../../configs/constant';
import TextFnx from '../../../components/Text/TextFnx';
import ButtonWithTitle from '../../../components/Button/ButtonWithTitle';
import { Navigation } from "react-native-navigation"
import { LOGIN_SCREEN, DAPP_SCREEN, pushSingleScreenApp, REGISTER_SCREEN, pushTabBasedApp } from '../../../navigation';
import { hiddenTabbar, jwtDecode, get, createAction, removeTokenAndUserInfo, logout, emitEventEmitter } from '../../../configs/utils';
import { useDispatch, useSelector } from "react-redux"
import { CHECK_STATE_LOGIN, SET_USER_INFO } from '../../../redux/modules/authentication/actions';
import { GET_FIAT_WALLET_SUCCESS, GET_CRYPTO_WALLET_SUCCESS } from '../../../redux/modules/market/actions';
import Layout from '../../../components/Layout/Layout';
import { GET_ASSET_CRYPTO_WALLETS_SUCCESS, GET_ASSET_FIAT_WALLET_SUCCESS } from '../../../redux/modules/wallet/actions';
const HeaderSettingScreen = ({
    componentId,
}) => {
    const logged = useSelector(state => state.authentication.logged);
    const navigateLogin = () => {
        pushSingleScreenApp(componentId, LOGIN_SCREEN)
    }
    const dispatcher = useDispatch();
    const [Email, setEmail] = useState("");
    useEffect(() => {
        jwtDecode().then(userInfo => {
            if (userInfo) {
                setEmail(get(userInfo, "sub"))
            } else {
                setEmail("")
            }
        }).catch(err => {
            setEmail("")
        })

        return () => {
            setEmail("")
        }
    }, [])
    const handleLogout = () => {
        dispatcher(createAction(GET_FIAT_WALLET_SUCCESS, []));
        dispatcher(createAction(GET_CRYPTO_WALLET_SUCCESS, []))
        removeTokenAndUserInfo();
        dispatcher(createAction(CHECK_STATE_LOGIN, false));
        dispatcher(createAction(SET_USER_INFO, null));
        // dispatcher(createAction(GET_ASSET_CRYPTO_WALLETS_SUCCESS),[])
        // dispatcher(createAction(GET_ASSET_FIAT_WALLET_SUCCESS),[])
    }
    
    return (
        <TopBarWallet
            styleCenter={{ width: "50%", height: "100%",justifyContent:"flex-start" }}
            styleLeft={stylest.icon}
            styleRight={[stylest.icon, {  }]}
            onClickRight={logged ? handleLogout : null}
            textRight={"Logout".t()}
            renderItem={
                <View style={{
                    alignItems:"center",
                }}>
                    <View style={{
                        height:40,
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                        <Text
                            style={stylest.textRenderItem}>
                            {"SETTING".t()}
                        </Text>
                    </View>
                    <View style={stylest.blockIcon}>
                        <Icon type={constant.TYPE_ICON.Octicons} name="person" color={colors.description} size={40} />
                    </View>
                    {logged ? <TextFnx space={8} value={Email} /> : (
                            <Layout>
                                <ButtonWithTitle space={8} color={colors.highlight} onPress={navigateLogin} title="Login" />
                                <TextFnx space={8} value=" or " />
                                <ButtonWithTitle color={colors.highlight} space={8} onPress={() => pushSingleScreenApp(componentId, REGISTER_SCREEN)} title="Register" />
                            </Layout>
                        )}
                </View>
            }
        >
        </TopBarWallet>)
}
const stylest = StyleSheet.create({
    textRenderItem: {
        fontWeight: "bold",
        fontSize: 17,
        color: colors.background,
        // paddingBottom: 15
    },
    blockView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        // marginBottom:15
    },
    blockIcon: {
        backgroundColor: colors.background,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100
    },
    blockText: {
        flexDirection: "row",
        paddingTop: 0
    },
    icon: {
        paddingRight: 10,
        height: 45,
        width: "25%",
        justifyContent: "center"
    },

})
export default HeaderSettingScreen;
