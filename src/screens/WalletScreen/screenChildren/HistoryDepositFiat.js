import React from 'react';
import { Text, View } from 'react-native';
import Container from '../../../components/Container';
import ItemConfirmDepositFiat from '../components/ItemConfirmDepositFiat';
import { to_UTCDate, get, CheckColorStatus, formatCurrency } from '../../../configs/utils';
import { useDispatch, useSelector } from "react-redux"
const HistoryDepositFiat = ({
    InfoBank,
    componentId
}) => {
    const currencyList = useSelector(state => state.market.currencyList);
    return(
   <Container
   title={`${"Deposits".t()} ${get(InfoBank, "walletCurrency")}`}
   hasBack
   componentId={componentId}
   >
       <ItemConfirmDepositFiat
            value={get(InfoBank,"statusLable").t()}
            title={"Status".t()}
            isCopy={false}
            colorValue={CheckColorStatus(get(InfoBank,"statusLable").t())}
        />
       <ItemConfirmDepositFiat
            value={to_UTCDate(get(InfoBank,"createdDate"), "DD-MM-YYYY hh:mm:ss")}
            title={"Time".t()}
            isCopy={false}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankName")}
            title={"BANK_NAME".t()}
        />
       {get(InfoBank, "walletCurrency") !== "IDR" && <ItemConfirmDepositFiat
            value={get(InfoBank, "bankBranchName")}
            title={"BRANCH_NAME".t()}
        />} 
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankAccountName")}
            title={"ACCOUNT_NAME".t()}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankAccountNo")}
            title={"ACCOUNT_NUMBER".t()}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "description")}
            title={"TRANSFER_DESCRIPTION".t()}
        />
        <ItemConfirmDepositFiat
            value={`${formatCurrency(get(InfoBank,"amount"),get(InfoBank, "walletCurrency"),currencyList)} ${get(InfoBank, "walletCurrency")}`}
            title={"DEPOSIT_AMOUNT".t()}
        />
   </Container>
);}

export default HistoryDepositFiat;
