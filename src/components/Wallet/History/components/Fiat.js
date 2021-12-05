import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    Picker,
    Left,
    Body,
} from 'native-base'
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from "../../../../config/style";
import InputFieldFnx from '../../../Shared/InputFieldFnx';
import SearchList from '../../../Shared/SearchList';
const Fiat = ({
    fiatList,
    symbol,
    onSelectWallet,
    label ='FIAT_WALLET_VALUE'.t(),
    placeholder='SELECT_WALLET'.t(),
    showFiat=true,
    isSearchList=false,
    handleBack,
    onPress,
    name,
    itemObj,
    labelSelected,
    hasFirst=false,
    ...rest
}) => {
    return (
        <View 
        style={styles.container}>
            <Left style={styles.textFiat}>
                <Text style={[style.textMain, { marginLeft: 10 }]}>{label}</Text>
            </Left>
            <Body 
            style={styles.bodyDropdown}
            >
            <InputFieldFnx styled={{
                 flexDirection: "row",
                 justifyContent: "space-between",
                 alignItems: "center",
                 width:"93%",
                 paddingVertical: 10,
            }} 
            placeholder={'ALL'.t()}
            hasDropdown 
            styleTextField={style.textMain.color}
            onPress={onPress}
            selected={labelSelected}
            />
                <SearchList 
                 visibleModal={isSearchList}
                 handleBack={
                    handleBack
                 }
                 data={fiatList}
                 itemObj={itemObj}
                 selected={onSelectWallet}
                 name={name}
                 hasFirst
                />
            </Body> 
        </View>
    );
}

export default Fiat
const styles = StyleSheet.create({
    container: {
        borderRadius: 2.5,
        marginTop: 10,
        backgroundColor: '#152542',
        // width: width-20,
        height: 40,
        marginBottom: 25,
        borderBottomWidth: 0,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    textFiat: {
        borderRightWidth: 1,
        borderColor: style.colorHighLight,
        flex: 1,
        alignItems: 'flex-start'
    },
    iconPick: {
        fontSize: 20,
        color: 'white',
        marginRight: 10
    },
    dropdown: {
        width: '100%',
        color: '#fff'
    },
    bodyDropdown: {
        flex: 2.75,
        alignItems: 'flex-start',
        marginLeft: 10
    }
})