import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import LayoutInfoWallet from '../components/LayoutInfoWallet';
import LayoutWithdraw from './Withdraw/LayoutWithdraw';
import Step1Coin from './Withdraw/components/Step1Coin';
import Step1Fiat from './Withdraw/components/Step1Fiat';
import { formatTrunc, get, formatNumberOnChange, getInfoCoinFull, toast, set, isArray, size, checkLang } from '../../../configs/utils';
import { useSelector } from "react-redux";
import _, { isNaN } from "lodash"
import { constant } from '../../../configs/constant';
import { WalletService } from '../../../services/wallet.service';
import { authService } from '../../../services/authentication.service';
const WithdrawCoinScreen = ({
    componentId,
    data,
    step=0,
    dataInfo={
        amount: {
            title: "AMOUNT".t(),
            value: ""
        },
        address: {
            title: "RECEIVED_ADDRESS".t(),
            value: ""
        }
    },
    isHistory,
    requestId=""
}) => {
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const [Step, setStep] = useState(step);
    const [InfoCoin, setInfoCoin] = useState(data);
    const [InfoCoinFull, setInfoCoinFull] = useState(getInfoCoinFull(cryptoWallet, get(InfoCoin, "symbol")));
    const [Amount, setAmount] = useState("");
    const [Address, setAddress] = useState("");
    const currencyList = useSelector(state => state.market.currencyList);
    const [ExtraField, setExtraField] = useState({});
    const infoCoinCurrent = useSelector(state => state.wallet.infoCoinCurrent);
    const lang = useSelector(state => state.authentication.lang);
    const UserInfo = useSelector(state => state.authentication.userInfo);
    const twoFactorySerice = get(UserInfo, "twoFactorService");
    const twoFactorEnable = get(UserInfo, "twoFactorEnabled");
    const [SessionId, setSessionId] = useState("");
    const [VerifyCode, setVerifyCode] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const [OtpCode, setOtpCode] = useState("");
    const [RequestId, setRequestId] = useState(requestId);
    const [DataInfo, setDataInfo] = useState(dataInfo);
    const onMax = (InfoCoin) => {
        setAmount(formatTrunc(currencyList, get(InfoCoin, "available"), get(InfoCoin, "symbol")))
        setDataInfo({ ...DataInfo, amount: { ...DataInfo.amount, value: formatTrunc(currencyList, get(InfoCoin, "available"), get(InfoCoin, "symbol")) } })
    }
    const onChangeAmount = (txt) => {
        setAmount(formatNumberOnChange(currencyList, txt, get(InfoCoin, "symbol")))
        setDataInfo({ ...DataInfo, amount: { ...DataInfo.amount, value: formatNumberOnChange(currencyList, txt, get(InfoCoin, "symbol")) } })
    }
    useEffect(() => {
        setInfoCoinFull(getInfoCoinFull(cryptoWallet, get(InfoCoin, "symbol")));
    }, [cryptoWallet, InfoCoin]);
    const onChangeAddress = (txt) => {
        setAddress(txt);
        setDataInfo({ ...DataInfo, address: { ...DataInfo.address, value: txt } })
    }
    const onSubmit = () => {
        switch (Step) {
            case 0:
                submitStep1();
                break;
            case 1:
                submitStep2();
                break;
            case 2:
                submitStep3();
                break;
        }
    }
    const submitStep1 = () => {
        if (!Amount || Amount === "NaN") {
            return toast("Please enter your amount".t())
        } else if (!Address) {
            return toast("Please enter received address".t())
        } else if (Amount.str2Number() < get(InfoCoinFull, "minWithdrawal")) {
            return toast(`${"Enter your amount greater than".t()} ${get(InfoCoinFull, "minWithdrawal")}`)
        } else if (Amount.str2Number() > get(InfoCoinFull, "available")) {
            return toast("Balance not enough".t())
        } else if (isArray(get(infoCoinCurrent, "extraFields")) && size(get(infoCoinCurrent, "extraFields")) > 0) {
            let err = [];
            get(infoCoinCurrent, "extraFields").map((item, index) => {
                let fieldName = get(item, `localizations.${checkLang(lang)}.FieldName`);
                if (size(get(ExtraField, `${fieldName}.value`)) === 0 && !get(ExtraField, `${fieldName}.isCheck`)) {
                    err.push("err");
                    return toast(`Please enter ${fieldName}`);
                } else if (size(err) === 0) {
                    return setStep(1)
                }
            })
        } else {
            return setStep(1)
        }
    }
    const submitStep2 = () => {
        if (size(VerifyCode) === 0) {
            return toast("Please enter 2FA code".t())
        }
        var fromExtraFields = [];
        var toExtraFields = [];
        if (isArray(get(infoCoinCurrent, "extraFields")) && size(get(infoCoinCurrent, "extraFields")) > 0) {
            get(infoCoinCurrent, "extraFields").map((item, index) => {
                var toReq = {
                    name: item.name,
                    value: get(ExtraField, `${get(item, `localizations.${checkLang(lang)}.FieldName`)}.value`)
                };
                var fromReq = {
                    name: item.name,
                    value: item.value
                };
                toExtraFields.push(toReq)
                fromExtraFields.push(fromReq)
            })
        }
        let data = {
            amount: Amount,
            toAddress: Address,
            verifyCode: VerifyCode,
            symbol: get(infoCoinCurrent, "symbol"),
            fromAddress: get(infoCoinCurrent, "cryptoAddress"),
            customerEmail: get(UserInfo, "email"),
            accId: get(UserInfo, "id"),
            via: 2,
            sessionId: SessionId,
            fromExtraFields,
            toExtraFields
        }
        console.log(data,"data req")
        setDisabled(true)
        WalletService.createWithdrawalCoin(data).then(res => {
            console.log(res,"ress");
            setDisabled(false)
            if (res.status === "OK") {
                setSessionId(get(res, "data.otpToken.sessionId"));
                setRequestId(get(res, "data.requestId"));
                return setStep(2)
            } else {
                return toast(res.message)
            }
        }).catch((err) => {
            console.log(err,"err ress");
            setDisabled(false);
        })
    }
    const submitStep3 = () => {
        if (size(OtpCode) === 0) {
            return toast("Please enter OTP code".t())
        }
        let data = { sessionId: SessionId, requestId: RequestId, code: OtpCode };
        setDisabled(true);
        WalletService.confirmOtpCoin(data).then(res => {
            setDisabled(false);
            if (get(res, "code") === 1) {

                return setStep(3);
            } else {
                return toast(`${get(res, "message").t()}`)
            }
        }).catch(err => {
            setDisabled(false);
        })
    }

    const onCheckNo = (fieldName) => {
        if (!get(ExtraField, `${fieldName}`)) {
            let setData = set(ExtraField, `${fieldName}.isCheck`, true);
            setExtraField({ ...setData })
        } else {
            let setDataCheck = set(ExtraField, `${fieldName}.isCheck`, !get(ExtraField, `${fieldName}.isCheck`));
            setExtraField({ ...setDataCheck })
        }
    }
    const onChangeExtraField = (fieldName, val) => {
        let setData = set(ExtraField, `${fieldName}.value`, val);
        setExtraField({ ...setData });
        let setDataInfoValue = set(DataInfo, `${fieldName}.value`, val);
        let setDataInfoTitle = set(DataInfo, `${fieldName}.title`, fieldName);
        setDataInfo({ ...setDataInfoValue });
        setDataInfo({ ...setDataInfoTitle });
    }
    const onResend = () => {
        if (twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            authService.getTwoFactorEmailCode(get(UserInfo, "email")).then(res => {
                setSessionId(get(res, "data.sessionId"));
                toast("The 2fa code has been sent to email".t());
            })
        }
    }
    useEffect(() => {
        if (Step === 1) {
            onResend();
        }
        if(Step === 2 && isHistory){
            onResendOtp();
        }
    }, [Step])

    useEffect(() => {
        setExtraField({});
    }, [infoCoinCurrent])
    const onResendOtp = () => {
        WalletService.getOtp(get(UserInfo, "email"), 'COIN_WITHDRAWAL', RequestId).then((res) => {
            if (get(res, "sessionId")) {
                setSessionId(get(res, "sessionId"));
                toast("OTP code has been sent to your email".t());
            }
        })
    }
    const onCancelWithdraw = ()=>{
        alert("on Cancel");
    }
    console.log(InfoCoinFull,"InfoCoinFull");
    return (
        <LayoutWithdraw
            onCancelWithdraw={onCancelWithdraw}
            onResendOtp={onResendOtp}
            OtpCode={OtpCode}
            onOtpCode={(text) => setOtpCode(text)}
            Disabled={Disabled}
            InfoDataGlobal={(Info) => setInfoCoin(Info)}
            isCoin
            data={data}
            componentId={componentId}
            dataInfo={Object.values(DataInfo)}
            step={Step}
            onSubmit={onSubmit}
            setStep={(step) => setStep(step)}
            onResend={onResend}
            VerifyCode={VerifyCode}
            onVerifyCode={(text) => setVerifyCode(text)}
            isHistory={isHistory}
        >
            {Step === 0 && <Step1Coin
                onCheckNo={onCheckNo}
                onChangeAdress={onChangeAddress}
                InfoCoin={InfoCoin}
                onMax={() => onMax(InfoCoin)}
                amount={Amount}
                onChangeAmount={onChangeAmount}
                InfoCoinFull={InfoCoinFull}
                Address={Address}
                ExtraField={ExtraField}
                onChangeExtraField={onChangeExtraField}
            />}
        </LayoutWithdraw>
    );
}

export default WithdrawCoinScreen;
