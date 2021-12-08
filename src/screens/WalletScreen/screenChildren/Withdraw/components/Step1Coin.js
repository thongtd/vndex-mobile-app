import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Input from '../../../../../components/Input';
import Layout from '../../../../../components/Layout/Layout';
import TextFnx from '../../../../../components/Text/TextFnx';
import { get, formatCurrencyFnx, isArray, size, checkLang } from '../../../../../configs/utils';
import { useDispatch, useSelector } from "react-redux"
import CheckBox from 'react-native-check-box';
import colors from '../../../../../configs/styles/colors';
const Step1Coin = ({
    InfoCoin,
    onMax,
    amount,
    onChangeAmount,
    InfoCoinFull,
    onChangeAdress,
    Address,
    onCheckNo,
    ExtraField,
    onChangeExtraField,
    
}) => {
    const infoCoinCurrent = useSelector(state => state.wallet.infoCoinCurrent);
    const lang = useSelector(state => state.authentication.lang);
    return (
        <>
            <Input
                keyboardType={"number-pad"}
                value={amount}
                hasValue
                onMax={onMax}
                placeholder={"AMOUNT".t()}
                isMax
                onChangeText={onChangeAmount}
            />
            <Layout space={10} isSpaceBetween>
                <Layout>
                    <TextFnx value={`${"Fee".t()}: `} isDart />
                    <TextFnx isDart weight={"bold"} value={formatCurrencyFnx(get(InfoCoinFull, "transactionFee"), 8)} />
                </Layout>
                <Layout>
                    <TextFnx value={`${"YOU_WILL_GET".t()}: `} isDart />
                    <TextFnx isDart weight={"bold"} value={formatCurrencyFnx(amount.str2Number() - get(InfoCoinFull, "transactionFee") > 0 ? amount.str2Number() - get(InfoCoinFull, "transactionFee") : 0, 8)} />
                </Layout>
            </Layout>
            <Input
                hasValue
                value={Address}
                onChangeText={onChangeAdress}
                placeholder={"RECEIVED_ADDRESS".t()}
                isPaste
                isQrcode
            />
            {isArray(get(infoCoinCurrent, "extraFields")) && size(get(infoCoinCurrent, "extraFields")) > 0 && get(infoCoinCurrent, "extraFields").map((item, index) => {
                return <Layout key={`key-${index}`} space={10} type={"column"}>
                    <CheckBox
                        style={{
                            marginLeft: -2,
                            paddingBottom: 10,
                        }}
                        onClick={()=>onCheckNo(get(item,`localizations.${checkLang(lang)}.FieldName`))}
                        checkBoxColor={colors.green}
                        isChecked={get(ExtraField,`${get(item,`localizations.${checkLang(lang)}.FieldName`)}.isCheck`)}
                        rightText={`${"_NO".t()} ${get(item,`localizations.${checkLang(lang)}.FieldName`)}`}
                    />
                    <Input
                        editable={!get(ExtraField,`${get(item,`localizations.${checkLang(lang)}.FieldName`)}.isCheck`)}
                        value={get(ExtraField,`${get(item,`localizations.${checkLang(lang)}.FieldName`)}.value`)}
                        onChangeText={(text)=>onChangeExtraField(get(item,`localizations.${checkLang(lang)}.FieldName`),text)}
                        placeholder={get(item,`localizations.${checkLang(lang)}.FieldName`)}
                        isPaste={!get(ExtraField,`${get(item,`localizations.${checkLang(lang)}.FieldName`)}.isCheck`)}
                    />
                </Layout>
            })}

        </>
    );
}

export default Step1Coin;
