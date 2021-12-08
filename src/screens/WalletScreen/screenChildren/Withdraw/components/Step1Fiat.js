import React from 'react';
import { Text, View } from 'react-native';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button/Button';
import { constant } from '../../../../../configs/constant';
import CheckBox from 'react-native-check-box';
import colors from '../../../../../configs/styles/colors';
import Layout from '../../../../../components/Layout/Layout';
import TextFnx from '../../../../../components/Text/TextFnx';
import { get,  checkPlaceHolder } from '../../../../../configs/utils';

const Step1Fiat = ({
    onBankAccounts,
    InfoCoin,
    Bank,
    Branch,
    NameAccount,
    NumberAccount,
    onNumberAcc,
    onNameAcc,
    onAddAcc,
    onAmount,
    isAddAcc,
    amount,
    onBranch,
    onBank
}) => {
    return(
        <>
            <Button
                spaceVertical={10}
                onInput={onBankAccounts}
                sizeIconRight={19}
                isInput
                placeholder={"SELECT_ACCOUNT".t()}
                iconRight={"bars"}
                typeIconRight={constant.TYPE_ICON.AntDesign}
            />
            <Button
                isPlaceholder={checkPlaceHolder(get(Bank,"name"))}
                spaceVertical={10}
                onInput={onBank}
                sizeIconRight={18}
                isInput
                placeholder={get(Bank,"name")?get(Bank,"name"):"SELECT_BANK".t()}
                iconRight={"caret-down"}

            />
            {get(InfoCoin,"currency") !== "IDR" ?<Button
                isPlaceholder={checkPlaceHolder(get(Branch,"name"))}
                spaceVertical={10}
                onInput={onBranch}
                sizeIconRight={18}
                isInput
                placeholder={get(Branch,"name")?get(Branch,"name"):"SELECT_BRANCH".t()}
                iconRight={"caret-down"}
            />:null}
            
            <Input
                spaceVertical={10}
                placeholder={"RECEIVING_BANK_ACCOUNT_NAME".t()}
                isPaste
                hasValue
                value={NameAccount}
                onChangeText={onNameAcc}
            />
            <Input
                keyboardType={"number-pad"}
                spaceVertical={10}
                placeholder={"RECEIVING_BANK_ACCOUNT_NO".t()}
                isPaste
                hasValue
                value={NumberAccount}
                onChangeText={onNumberAcc}
            />
            <CheckBox
                style={{
                    marginLeft: -2,
                }}
                onClick={onAddAcc}
                checkBoxColor={colors.green}
                isChecked={isAddAcc}
                rightText={"SAVE_BANK_ACCOUNT".t()}
            />
            <Input
                keyboardType={"number-pad"}
                spaceVertical={10}
                placeholder={"AMOUNT".t()}
                hasValue
                onChangeText={onAmount}
                value={amount}
            />
            <Layout space={5} isSpaceBetween>
                <Layout>
                    <TextFnx value={`${"Fee".t()}: `} isDart />
                    <TextFnx isDart color={colors.red} value={"RECEIVER_PAYS_FEE".t()} />
                </Layout>
                <Layout>
                    <TextFnx value={`${"TOTAL_TRANSER_AMOUNT".t()}: `} isDart />
                    <TextFnx isDart weight={"bold"} value={`${amount || "0"} ${get(InfoCoin,"currency")}`} />
                </Layout>
            </Layout>

        </>
    )
}

export default Step1Fiat;
