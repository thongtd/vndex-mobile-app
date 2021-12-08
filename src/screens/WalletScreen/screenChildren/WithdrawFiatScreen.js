import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import LayoutInfoWallet from '../components/LayoutInfoWallet';
import LayoutWithdraw from './Withdraw/LayoutWithdraw';
import Step1Coin from './Withdraw/components/Step1Coin';
import Step1Fiat from './Withdraw/components/Step1Fiat';
import { formatTrunc, get, formatNumberOnChange, getInfoCoinFull, toast, set, isArray, size, checkLang, getPropsData, formatCurrency } from '../../../configs/utils';
import { useSelector } from "react-redux";
import _, { isNaN } from "lodash"
import { constant } from '../../../configs/constant';
import { WalletService } from '../../../services/wallet.service';
import { authService } from '../../../services/authentication.service';
import { showModal, dismissAllModal } from '../../../navigation/Navigation';
import { PICKER_SEARCH } from '../../../navigation';
import ItemList from '../../../components/Item/ItemList';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
const WithdrawFiatScreen = ({
    componentId,
    data,
    step = 0,
    dataInfo = {
        bank: {
            title: "BANK_NAME".t(),
            value: ""
        },
        branch: {
            title: "BRACH_NAME".t(),
            value: ""
        },
        nameBankAccount: {
            title: "RECEIVING_BANK_ACCOUNT_NAME".t(),
            value: ""
        },
        numberBankAccount: {
            title: "RECEIVING_BANK_ACCOUNT_NO".t(),
            value: ""
        },
        amount: {
            title: "AMOUNT".t(),
            value: ""
        },
    },
    isHistory,
    requestId = ""
}) => {
    const [Step, setStep] = useState(step);
    const [InfoCoin, setInfoCoin] = useState(data);
    const currencyList = useSelector(state => state.market.currencyList);
    const infoCoinCurrent = useSelector(state => state.wallet.infoCoinCurrent);
    const lang = useSelector(state => state.authentication.lang);
    const UserInfo = useSelector(state => state.authentication.userInfo);
    const twoFactorySerice = get(UserInfo, "twoFactorService");
    const [SessionId, setSessionId] = useState("");
    const [VerifyCode, setVerifyCode] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const [OtpCode, setOtpCode] = useState("");
    const [RequestId, setRequestId] = useState(requestId);
    const [DataInfo, setDataInfo] = useState(dataInfo);
    const [BankAccounts, setBankAccounts] = useState([]);
    const [ActiveBankAccount, setActiveBankAccount] = useState("");
    const [Bank, setBank] = useState("");
    const [BankList, setBankList] = useState([]);
    const [BranchList, setBranchList] = useState([]);
    const [Branch, setBranch] = useState("");
    const [NameAccount, setNameAccount] = useState("");
    const [NumberAccount, setNumberAccount] = useState("");
    const [Amount, setAmount] = useState("");
    const [IsAddAcc, setIsAddAcc] = useState(true);
    const [PaymentGateway, setPaymentGateway] = useState("");
    useEffect(() => {
        getBankAcc();
        getBankList();
    }, [infoCoinCurrent]);
    useEffect(() => {
        getPaymentGateway();
    }, []);
    const getBankAcc = () => {
        WalletService.getBankAccount(get(UserInfo, "id")).then(bank => {
            if (size(bank) > 0) {
                if (get(InfoCoin, "currency") === "VND") {
                    setBankAccounts([...bank.filter((item, index) => get(item, "bank.countryCode") === "VN")]);
                } else if (get(InfoCoin, "currency") === "IDR") {
                    setBankAccounts([...bank.filter((item, index) => get(item, "bank.countryCode") === "ID")]);
                } else {
                    setBankAccounts([...bank]);
                }
            }

        })
    }
    const getPaymentGateway = () => {
        WalletService.getPaymentGateway(get(InfoCoin, "currency")).then(res => {
            if (res) {
                console.log(res, "PaymentGateway");
                setPaymentGateway(res);
            }
        })
    }
    const getBankList = () => {
        WalletService.getBankByCurrencyCode(get(InfoCoin, "currency")).then(res => {
            if (res) {
                setBankList(res);
            } else {
                setBankList([]);
            }
        })
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
        let bankCurrencySettings = get(Bank, "bankCurrencySettings") && get(Bank, "bankCurrencySettings").filter((setting, index) => get(setting, "currencyCode") === get(InfoCoin, "currency"));

        if (!get(Bank, "name")) {
            return toast("Please select your bank".t());
        } else if (get(InfoCoin, "currency") !== "IDR" && !get(Branch, "name")) {
            return toast("Please select your branch".t());
        } else if (!NameAccount) {
            return toast("Please enter your bank account name".t())
        } else if (!NumberAccount) {
            return toast("Please enter your bank number".t());
        } else if (!Amount) {
            return toast("Please enter your amount".t());
        } else if (Amount && size(bankCurrencySettings) > 0 && Amount.str2Number() < get(bankCurrencySettings[0], "minWithdrawal")) {
            return toast("MIN_AMOUNT_WITHDRAWAL_VALIDATE".t().replace('{0}', formatCurrency(get(bankCurrencySettings[0], "minWithdrawal"), get(InfoCoin, "currency"), currencyList)))

        } else if (Amount && size(bankCurrencySettings) > 0 && Amount.str2Number() > get(bankCurrencySettings[0], "maxWithdrawal")) {
            return toast("MAX_AMOUNT_WITHDRAWAL_VALIDATE".t().replace('{0}', formatCurrency(get(bankCurrencySettings[0], "maxWithdrawal"), get(InfoCoin, "currency"), currencyList)))
        } else if (IsAddAcc) {
            addBankAccount();
            setDataInfo({
                ...DataInfo,
                amount:{...DataInfo.amount,value:Amount},
                nameBankAccount:{...DataInfo.nameBankAccount,value:NameAccount},
                numberBankAccount:{...DataInfo.numberBankAccount,value:NumberAccount},
                bank:{...DataInfo.bank,value:get(Bank,"name")},
                branch:{...DataInfo.branch,value:get(Branch,"name")}
            })
            return setStep(1);
        } else {
            setDataInfo({
                ...DataInfo,
                amount:{...DataInfo.amount,value:Amount},
                nameBankAccount:{...DataInfo.nameBankAccount,value:NameAccount},
                numberBankAccount:{...DataInfo.numberBankAccount,value:NumberAccount},
                bank:{...DataInfo.bank,value:get(Bank,"name")},
                branch:{...DataInfo.branch,value:get(Branch,"name")}
            })
            return setStep(1);
        }
    }
    const addBankAccount = () => {
        WalletService.addBankAccount(
            get(UserInfo, "id"),
            get(Bank, "id"),
            get(InfoCoin, "currency") === "IDR" ? "" : get(Branch, "id"),
            NumberAccount,
            NameAccount,
            get(PaymentGateway, "id")
        ).then(res => {
            getBankAcc();
        })
    }

    const submitStep2 = () => {
        if (size(VerifyCode) === 0) {
            return toast("Please enter 2FA code".t())
        }
        setDisabled(true);
        WalletService.createFiatWithdrawalRequest(
            get(UserInfo,"id"),
            get(InfoCoin,"currency"),
            get(Bank,"id"),
            get(InfoCoin,"currency") ==="IDR"?"":get(Branch,"id"),
            NameAccount,
            NumberAccount,
            Amount.str2Number(),
            VerifyCode,
            get(PaymentGateway,"id"),
            get(UserInfo,"email"),
            SessionId
            ).then(res => {
                setDisabled(false);
                if(res.status){
                    setSessionId(get(res,"otpToken.sessionId"));
                    setRequestId(get(res,"requestId"))
                    setStep(2);
                }else{
                    return toast(`${get(res, "message").t()}`)
                }
            }).catch(err => {
                setDisabled(false);
            })
    }
    const submitStep3 = () => {
        if (size(OtpCode) === 0) {
            return toast("Please enter OTP code".t())
        }
        setDisabled(true);
        WalletService.confirmFiatWithdrawByOTP(SessionId,RequestId,OtpCode).then(res => {
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
        if (Step === 2 && isHistory) {
            onResendOtp();
        }
    }, [Step])


    const onResendOtp = () => {
        WalletService.getOtp(get(UserInfo, "email"), 'FIAT_WITHDRAWAL', RequestId).then((res) => {
            if (get(res, "sessionId")) {
                setSessionId(get(res, "sessionId"));
                toast("OTP code has been sent to your email".t());
            }
        })
    }
    const onCancelWithdraw = () => {
        alert("on Cancel");
    }
    const onBankAccounts = () => {
        let propsData = getPropsDataLocal(BankAccounts, ["bankAccountName", "bank.name", "bankBranch.name", "bankAccountNo", "id"], get(ActiveBankAccount, "id"), (item) => handleActive(item))
        showModal(PICKER_SEARCH, propsData);
    }
    const handleActive = (active) => {
        setActiveBankAccount(active);
        dismissAllModal();
        setBank(get(active, "bank"));
        if (get(active, "bankBranch")) {
            setBranch(get(active, "bankBranch"));
            WalletService.getBankBranchByBankId(get(active, "bank.id")).then(res => {
                setBranchList(res);
            })
        }

        setNameAccount(get(active, "bankAccountName"));
        setNumberAccount(get(active, "bankAccountNo"));
    }
    const onNameAcc = (text) => {
        setNameAccount(text)
    }
    const onNumberAcc = (text) => {
        setNumberAccount(text);
    }
    const onAmount = (text) => {
        let amount = formatNumberOnChange(currencyList, text, get(InfoCoin, "currency"));
        setAmount(amount);
    }
    const onBranch = () => {
        let propsData = getPropsData(BranchList, "", ["name"], get(Branch, "name"), (item) => handleActiveBranch(item), false)
        showModal(PICKER_SEARCH, propsData);
    }
    const handleActiveBranch = (active) => {
        setBranch(active);
        dismissAllModal();
    }
    const onBank = () => {
        let propsData = getPropsData(BankList, "", ["name"], get(Bank, "name"), (item) => handleActiveBank(item), false)
        showModal(PICKER_SEARCH, propsData);
    }
    const handleActiveBank = (active) => {
        setBank(active);
        dismissAllModal();
        setBranchList([]);
        setBranch("");
        WalletService.getBankBranchByBankId(get(active, "id")).then(res => {
            setBranchList(res);
        })
    }
    return (
        <LayoutWithdraw
            onCancelWithdraw={onCancelWithdraw}
            onResendOtp={onResendOtp}
            OtpCode={OtpCode}
            onOtpCode={(text) => setOtpCode(text)}
            Disabled={Disabled}
            InfoDataGlobal={(Info) => setInfoCoin(Info)}
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

            {Step === 0 && <Step1Fiat
                InfoCoin={InfoCoin}
                onBankAccounts={onBankAccounts}
                Bank={Bank}
                Branch={Branch}
                NameAccount={NameAccount}
                NumberAccount={NumberAccount}
                onNumberAcc={onNumberAcc}
                onNameAcc={onNameAcc}
                onAddAcc={() => setIsAddAcc(!IsAddAcc)}
                onAmount={onAmount}
                isAddAcc={IsAddAcc}
                amount={Amount}
                onBranch={onBranch}
                onBank={onBank}
            />}
        </LayoutWithdraw>
    );
}
const getPropsDataLocal = (data, value, Active, cb, isCustom = true) => {
    return {
        data: [...data],
        renderItem: ({ item, key }) => {
            return (
                <ItemList
                    customView={
                        isCustom ? (

                            <Layout type="column">
                                <TextFnx spaceBottom={5} isDart value={`  ${get(item, value[0]) || ""}`} />
                                <TextFnx space={5} isDart value={`  ${get(item, value[1]) || ""}`} />
                                {get(item, "bankBranch.name") ? <TextFnx space={5} isDart value={`  ${get(item, value[2]) || ""}`} /> : null}
                                <TextFnx spaceTop={5} isDart value={`  ${get(item, value[3]) || ""}`} />
                            </Layout>) : false
                    }
                    onPress={() => cb(item)
                    }
                    value={get(item, value[4])}
                    checked={get(item, value[4]) === Active}
                />
            )
        },
        keywords: [...value]
    }
}
export default WithdrawFiatScreen;
