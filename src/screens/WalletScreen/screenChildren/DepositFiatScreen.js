import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Container from '../../../components/Container';
import { constant } from '../../../configs/constant';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon';
import NoteImportant from '../../../components/Text/NoteImportant';
import Recommended from '../components/Recommend';
import { pushSingleScreenApp, CONFIRM_DEPOSIT_FIAT_SCREEN, PICKER_SEARCH, INFO_FIAT_SCREEN } from '../../../navigation';
import { get, formatCurrency, getPropsData, createAction, formatNumberOnChange, formatSCurrency, toast, size, isArray, formatMessageByArray } from '../../../configs/utils';
import { useDispatch, useSelector } from "react-redux"
import { showModal, dismissAllModal, pop, popTo } from '../../../navigation/Navigation';
import _, { orderBy, uniqBy } from "lodash"
import { GET_DEPOSIT_BANK_ACCOUNT, GET_WITHDRAW_COIN_LOG, GET_WITHDRAW_FIAT_LOG, GET_DEPOSIT_COIN_LOG, GET_DEPOSIT_FIAT_LOG } from '../../../redux/modules/wallet/actions';
import { WalletService } from '../../../services/wallet.service';
import ConfirmDepositFiatScreen from './ConfirmDepositFiatScreen';
const DepositFiatScreen = ({
    componentId,
    data
}) => {
    const [Disabled, setDisabled] = useState(false);
    const [InfoCoin, setInfoCoin] = useState(data);
    const [CurrencyActive, setCurrencyActive] = useState("");
    const [BankNameActive, setBankNameActive] = useState("");
    const [Amount, setAmount] = useState("0");
    const [InfoBank, setInfoBank] = useState("");
    const dispatcher = useDispatch();
    const currencyList = useSelector(state => state.market.currencyList);
    const userInfo = useSelector(state => state.authentication.userInfo);
    const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
    const listBank = useSelector(state => state.wallet.listBank);
    const [Step, setStep] = useState(1);
    const [CreatedDate, setCreatedDate] = useState("");
    const [RequestId, setRequestId] = useState("");
    const [Loadding, setLoadding] = useState(false);
    const onSubmit = () => {
        if (Amount === "0" || size(Amount) === 0) {
            return toast("Please enter your amount");
        } else if (size(BankNameActive) === 0) {
            return toast("Please select your bank");
        } else {
            setDisabled(true);
            setLoadding(true);
            WalletService.getFiatDepositRequest(get(userInfo, "id"), get(InfoCoin, "currency"), Amount.str2Number(), InfoBank).then(res => {
                setDisabled(false);
                setLoadding(false);
                if (get(res, "status") == "OK") {
                    getData();
                    setCreatedDate(get(res, "data.createdDate"));
                    setRequestId(get(res,"data.itemId"))
                    setStep(2)

                } else {
                    if(isArray(get(res,"data.messageArray")) && size(get(res,"data.messageArray")) > 0){
                        let msg = formatMessageByArray(get(res, "data.message").t(),get(res,"data.messageArray"));
                        toast(msg);
                    }else{
                        toast(get(res, "data.message").t())
                    }
                    
                }
            }).catch(() => {
                setLoadding(false);
                setDisabled(false);
            })
        }
        // 
    }
    const getData = ()=>{
        dispatcher(createAction(GET_WITHDRAW_COIN_LOG, {
            UserId:get(userInfo, "id"),
            pageIndex: 1
          }))
          dispatcher(createAction(GET_WITHDRAW_FIAT_LOG, {
            UserId:get(userInfo, "id"),
            pageIndex: 1
          }))
          dispatcher(createAction(GET_DEPOSIT_COIN_LOG, {
            UserId:get(userInfo, "id"),
            pageIndex: 1
          }))
          dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
            UserId:get(userInfo, "id"),
            pageIndex: 1
          }))
    }
    const onSelectBar = () => {
        let data = orderBy(uniqBy(fiatsWallet, 'currency'), ['currency'], ['asc']);
        let propsData = getPropsData(data, "image", "currency", CurrencyActive, (item) => handleActive(item))
        showModal(PICKER_SEARCH, propsData)
    }
    const handleActive = (item) => {
        setCurrencyActive(get(item, "currency"));
        setInfoCoin(item);
        dismissAllModal()
    }
    const onSelectBank = () => {
        let data = orderBy(listBank, ['currency'], ['asc']);
        let propsData = getPropsData(data, "image", "bankName", BankNameActive, (item) => handleActiveBankName(item), false)
        showModal(PICKER_SEARCH, propsData)
    }
    const handleActiveBankName = (item) => {
        setInfoBank(item);
        setBankNameActive(get(item, "bankName"));
        dismissAllModal();
    }
    useEffect(() => {
        dispatcher(createAction(GET_DEPOSIT_BANK_ACCOUNT, {
            UserId: get(userInfo, "id"),
            currency: get(InfoCoin, "currency")
        }))
    }, [userInfo, InfoCoin])
    const onChangeAmount = (amount, currencyList, InfoCoin) => {
        let AmountText = formatNumberOnChange(currencyList, amount, get(InfoCoin, "currency"));
        setAmount(AmountText);
    }
    return (
        <Container
            hasBack
            componentId={componentId}
            title={`${"Deposits".t()} ${get(InfoCoin, "currency")}`}
            onClickRight={Step ===1? onSelectBar:""}
            nameRight={"bars"}
            typeRight={constant.TYPE_ICON.AntDesign}
            sizeIconRight={19}
            isScroll
            isLoadding={Loadding}
        >
            {Step === 1 ? (<>
                <Layout space={10} isCenter type="column">
                    <TextFnx value={"AVAILABLE".t().toUpperCase()} color={colors.subText} isDart />
                    <TextFnx value={`${formatCurrency(get(InfoCoin, "available"), get(InfoCoin, "currency"), currencyList)} ${get(InfoCoin, "currency")}`} color={colors.green} spaceTop={5} size={16} weight={"600"} />
                </Layout>
                <Input
                    hasValue
                    value={Amount}
                    onChangeText={(text) => onChangeAmount(text, currencyList, InfoCoin)}
                    spaceVertical={10}
                    placeholder={"AMOUNT".t()}
                    keyboardType={"number-pad"}
                />
                <Button
                    isPlaceholder={BankNameActive ? false : true}
                    onInput={onSelectBank}
                    spaceVertical={10}
                    placeholder={BankNameActive ? BankNameActive : "SELECT_BANK".t()}
                    isInput
                    iconRight="caret-down"
                />
                <Recommended />
                <NoteImportant
                    arrNote={["MONEY_DEPOSITS_NOTE".t(), "CLICK_CONFIRM_NOTE".t(), "ANY_MISTAKE_NOTE".t()]}
                />
                <Button
                    onClose={() => {
                        pop(componentId)
                    }}
                    disabled={Disabled}
                    onSubmit={onSubmit}
                    spaceVertical={10}
                    textSubmit={"CONFIRM".t()}
                    textClose={"Cancel".t()}
                    isSubmit
                    isClose
                    isButtonCircle={false}
                />
            </>) : (
                    <ConfirmDepositFiatScreen
                    componentId={componentId}
                        createdDate={CreatedDate}
                        InfoBank={InfoBank}
                        Amount={Amount}
                        InfoCoin={InfoCoin}
                        requestId={RequestId}
                        setLoadding={(bl)=>setLoadding(bl)}
                    />
                )}
        </Container>
    );

}
export default DepositFiatScreen;
