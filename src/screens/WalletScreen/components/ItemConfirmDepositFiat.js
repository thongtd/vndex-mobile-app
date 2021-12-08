import React from 'react';
import { Text, View,Clipboard } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import colors from '../../../configs/styles/colors';
import { toast } from '../../../configs/utils';

const ItemConfirmDepositFiat = ({
    title,
    value,
    isCopy=true,
    colorValue,
    width
}) => (
    <Layout isSpaceBetween space={10}>
    <TextFnx color={colors.subText} value={title} />
    <Layout>
        <TextFnx color={colorValue} isDart value={value} />
        {isCopy &&<ButtonIcon
            onPress={()=>{
                Clipboard.setString(value);
                toast("COPY_TO_CLIPBOARD".t())
            }}
            style={{
                width: 25,
                alignItems: 'flex-end',
            }}
            name={"copy"}
            color={colors.tabbarActive}
        />} 
    </Layout>
</Layout>
);

export default ItemConfirmDepositFiat;
