import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import Container from '../../../../components/Container';
import { constant } from '../../../../configs/constant';
import StepIndicator from "react-native-step-indicator";
import Available from '../../components/Available';
import Dash from 'react-native-dash';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import colors from '../../../../configs/styles/colors';
import Button from '../../../../components/Button/Button';
import ItemConfirmDepositFiat from '../../components/ItemConfirmDepositFiat';
import NoteImportant from '../../../../components/Text/NoteImportant';
import { get, isArray, size, getPropsData, createAction, CheckContentStatus, CheckColorStatus, listenerEventEmitter, removeEventEmitter } from '../../../../configs/utils';
import Input from '../../../../components/Input';
import ButtonIcon from '../../../../components/Button/ButtonIcon';
import icons from '../../../../configs/icons';
import { useDispatch, useSelector } from "react-redux"
import _, { orderBy } from "lodash"
import { showModal, dismissAllModal, pop } from '../../../../navigation/Navigation';
import { PICKER_SEARCH } from '../../../../navigation';
import { GET_BALANCE_BY_CURRENCY } from '../../../../redux/modules/wallet/actions';
const LayoutWithdraw = ({
    Disabled,
    componentId,
    dataInfo,
    step,
    children,
    onSubmit,
    data,
    isCoin,
    InfoDataGlobal,
    setStep,
    onResend,
    VerifyCode,
    onVerifyCode,
    OtpCode,
    onOtpCode,
    onResendOtp,
    onCancelWithdraw,
    isHistory
}) => {
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
    const [InfoCoin, setInfoCoin] = useState(data);
    const [CurrencyActive, setCurrencyActive] = useState("");
    const UserInfo = useSelector(state => state.authentication.userInfo);
    const dispatcher = useDispatch();
    const twoFactorySerice = get(UserInfo, "twoFactorService");
    const twoFactorEnable = get(UserInfo, "twoFactorEnabled");
    const coinWithdrawLog = useSelector(state => state.wallet.coinWithdrawLog);
    const fiatWithdrawLog = useSelector(state => state.wallet.fiatWithdrawLog);
    const [InfoCoinCreated, setInfoCoinCreated] = useState(data);
    useEffect(() => {
        dispatcher(createAction(GET_BALANCE_BY_CURRENCY, {
            UserId: get(UserInfo, "id"),
            currency: CurrencyActive
        }))
    }, [CurrencyActive, UserInfo])
    useEffect(() => {
        if(!isHistory && isArray(coinWithdrawLog) && size(coinWithdrawLog) > 0){
            setInfoCoinCreated(coinWithdrawLog[0]);
        }else if (isArray(coinWithdrawLog) && size(coinWithdrawLog) > 0) {
            let coinFilterCreated = coinWithdrawLog.filter((item, index) => get(item, "id") == get(InfoCoinCreated, "id"))
            if (isArray(coinFilterCreated) && size(coinFilterCreated) > 0) {
                setInfoCoinCreated(coinFilterCreated[0]);
            }
        }
        if(!isHistory && isArray(fiatWithdrawLog) && size(fiatWithdrawLog) > 0){
            setInfoCoinCreated(fiatWithdrawLog[0]);
        }else if (isArray(fiatWithdrawLog) && size(fiatWithdrawLog) > 0) {
            let coinFilterCreated = fiatWithdrawLog.filter((item, index) => get(item, "id") == get(InfoCoinCreated, "id"))
            if (isArray(coinFilterCreated) && size(coinFilterCreated) > 0) {
                setInfoCoinCreated(coinFilterCreated[0]);
            }
        }
        
    }, [coinWithdrawLog, fiatWithdrawLog])
    useEffect(() => {
        setInfoCoinCreated(data);
    }, [data])
    useEffect(() => {
        console.log(cryptoWallet, "cryptosWallet2 moi ne");
        if (isArray(cryptoWallet) && size(cryptoWallet) > 0) {
            let cryptoFilter = cryptoWallet.filter((crypto, index) => get(crypto, "symbol") == get(InfoCoin, "symbol"))
            if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
                setInfoCoin(cryptoFilter[0])
                InfoDataGlobal(cryptoFilter[0])
                setCurrencyActive(get(cryptoFilter[0], "symbol"))
            }
        }
        if (isArray(fiatsWallet) && size(fiatsWallet) > 0) {
            let cryptoFilter = fiatsWallet.filter((crypto, index) => get(crypto, "symbol") == get(InfoCoin, "symbol"))
            if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
                setInfoCoin(cryptoFilter[0]);
                InfoDataGlobal(cryptoFilter[0])
                setCurrencyActive(get(cryptoFilter[0], "symbol"))
            }
        }
    }, [cryptoWallet, fiatsWallet]);
   
    const onSelectCoin = () => {
        if (isCoin) {
            let data = orderBy(cryptoWallet, ['currency'], ['asc']);
            let propsData = getPropsData(data, "image", "symbol", CurrencyActive, (item) => handleActive(item))
            showModal(PICKER_SEARCH, propsData)
        } else {
            let data = orderBy(fiatsWallet, ['currency'], ['asc']);
            let propsData = getPropsData(data, "image", "symbol", CurrencyActive, (item) => handleActive(item))
            showModal(PICKER_SEARCH, propsData)
        }
    }
    const handleActive = (item) => {
        setCurrencyActive(get(item, "symbol"));
        setInfoCoin(item);
        dismissAllModal();
        InfoDataGlobal(item);
    }
    console.log(InfoCoinCreated, "InfoCoinCreated");
    return (
        <Container
            hasBack
            title={`${"Withdrawal".t()} ${get(InfoCoin, "symbol")}`}
            componentId={componentId}
            onClickRight={step === 0 ? onSelectCoin : null}
            sizeIconRight={19}
            typeRight={constant.TYPE_ICON.AntDesign}
            nameRight={"bars"}
            isScroll
            isLoadding={Disabled}
        >
            <StepIndicator
                customStyles={customStyles}
                currentPosition={step}
                stepCount={4}
            />
            <Available
                data={{ currency: get(InfoCoin, "symbol"), amount: get(InfoCoin, "available") }}
            />

            {children}
            {step === 1 &&
                <Input
                    keyboardType={"number-pad"}
                    maxLength={6}
                    onChangeText={onVerifyCode}
                    value={VerifyCode}
                    handleResend={onResend}
                    hasValue
                    placeholder={"2FA_CODE".t()}
                    isResend={twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA ? false : true}
                    isPaste
                />
            }
            {step === 2 &&
                <Input
                    onChangeText={onOtpCode}
                    value={OtpCode}
                    keyboardType={"number-pad"}
                    maxLength={6}
                    hasValue
                    placeholder={"OTP_CODE".t()}
                    isResend
                    isPaste
                    handleResend={onResendOtp}
                />
            }
            {step === 3 &&
                <Layout style={stylest.bgStep4} isCenter type={"column"}>
                    <TextFnx space={10} size={15} color={get(InfoCoinCreated, "status") === constant.STATUS_FUNDS.EmailSent ? colors.green : CheckColorStatus(get(InfoCoinCreated, "statusLable") && get(InfoCoinCreated, "statusLable").t(), "W")} value={CheckContentStatus(get(InfoCoinCreated, "status"))} />
                    {/* <TextFnx space={7} color={colors.tabbarActive} value={"Time Complete"} />
                    <TextFnx spaceTop={3} spaceBottom={7} value={"00:12:12"} isDart size={18} weight={"500"} /> */}
                    {!isHistory && <>
                        <TextFnx value={"NOTE_NOT_WITHDRAW".t()} color={colors.red} />
                        <TextFnx value={"please contact us".t()} color={colors.red} />
                        <Layout>
                            {arrIconSupport.map((item, index) => {
                                return <ButtonIcon
                                    key={`key ${index}`}
                                    style={stylest.btnIcon}
                                    hasImage
                                    source={item.icon}
                                    width={20}
                                    height={20}
                                    onPress={item.onPress}
                                />
                            })}
                        </Layout>
                    </>}

                </Layout>
            }
            {step === 0 ? <>
                <TextFnx value={"Tutorial"} isDart space={10} weight={"bold"} />
                <Dash dashThickness={0.5} style={{ width: "100%", height: 0.5 }} />
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {[{ name: "MAKE_WITHDRAWAL".t() }, { name: "VERIFY_2FA".t() }, { name: "CONFIRM_EMAIL".t() }, { name: "COMPLETE".t() }].map((item, index) => {
                        return <ItemTutorial key={`key-${index}`} number={index + 1} value={item.name} />
                    })}
                </ScrollView>
                <Dash dashThickness={0.5} style={{ width: "100%", height: 0.5 }} />
                <Button
                    onSubmit={onSubmit}
                    isSubmit
                    isButtonCircle={false}
                    spaceVertical={15}
                />
            </> : <>{step !== 3 && <Button
                disabled={Disabled}
                onSubmit={onSubmit}
                isClose
                isSubmit
                isButtonCircle={false}
                spaceVertical={15}
                onClose={() => {
                    if (step === 1) {
                        pop(componentId)
                    } else if (step === 2) {
                        onCancelWithdraw();
                    }
                }}
            />}
                    {dataInfo && dataInfo.map((item, index) => {
                        return <ItemConfirmDepositFiat
                            key={`key-${index}`}
                            title={get(item, "title")}
                            value={get(item, "value")}
                            isCopy={false}
                        />
                    })}
                    <NoteImportant
                        isRed
                        arrNote={["NOTE_WITHDRAWAL".t()]}
                    />
                </>}


        </Container>
    );
}


const ItemTutorial = ({
    value,
    number
}) => {
    return (
        <Layout space={5} style={{
            alignItems: 'center',
            paddingLeft: number !== 1 ? 20 : 0,
        }}>
            <View style={stylest.itemTutorial}>
                <TextFnx size={12} isDart value={number} />
            </View>
            <TextFnx spaceLeft={5} isDart value={value} />
        </Layout>
    )
}

const stylest = StyleSheet.create({
    itemTutorial: {
        width: 15,
        height: 15,
        borderColor: colors.subText,
        borderWidth: 1,
        borderRadius: 15 / 2,
        justifyContent: 'center',
        alignItems: "center"
    },
    bgStep4: {
        backgroundColor: colors.btnBlur,
        paddingVertical: 15,
        borderColor: colors.line,
        borderWidth: 0.5,
        borderRadius: 5
    },
    btnIcon: {
        width: 50,
        paddingTop: 13,
        alignItems: 'center',
    }
});
const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 23,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#4aae4f',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#4aae4f',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#4aae4f',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#4aae4f',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 11,
    currentStepIndicatorLabelFontSize: 11,
}

const linkSupport = {
    fb: "https://www.facebook.com/FinanceX.io/",
    telegram: "https://t.me/FinanceX_Vietnam",
    email: "support@financex.io"
}
const arrIconSupport = [
    { onPress: () => Linking.openURL(`mailto:${linkSupport.email}`), icon: icons.emailSupport },
    { onPress: () => Linking.openURL(linkSupport.telegram), icon: icons.teleSupport },
    { onPress: () => Linking.openURL(linkSupport.fb), icon: icons.fbSupport },
]
export default LayoutWithdraw;
