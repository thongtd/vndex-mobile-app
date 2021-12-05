import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity,PixelRatio } from 'react-native'
import { Item } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome5";
import { style } from "../../config/style"
import StatusBarFnx from './StatusBar';
// import styles from '../Wallet/Withdraw/status/styles';
import {styles} from "react-native-theme"
import {connect} from "react-redux";
import TouchableOpacityFnx from './TouchableOpacityFnx';
const SearchBar = ({
    text,
    onChangeText,
    handleBack,
    placeholderSearchBar='Please input Keywords'.t(),
    ...rest
}) => {
    console.log(PixelRatio.getFontScale(),"get font scale searchBar");
    return (
        <KeyboardAvoidingView enabled={true}
            onPress={Keyboard.dismiss}
            behavior={'padding'}
        >
            <StatusBarFnx color={'#1c2840'} />
            <Item style={[{ justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 0, marginLeft: 0, backgroundColor: styles.backgroundSub.color,borderBottomWidth:rest.theme === "light"?0.5:0}]}>
                <View style={{ flexDirection: 'row', backgroundColor: styles.backgroundSub.color, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={'search'} style={{ color: '#486db5', paddingHorizontal: 10 }} size={20} />
                    <TextInput
                        allowFontScaling={true}
                        placeholder={placeholderSearchBar}
                        placeholderTextColor={styles.txtPh.color}
                        style={[{ padding: 5, color: styles.textWhite.color, backgroundColor: styles.backgroundSub.color, flex: 1,fontSize:14/PixelRatio.getFontScale() }]}
                        autoFocus={true}
                        value={text}
                        onChangeText={onChangeText}
                    />
                    <TouchableOpacityFnx
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: style.container.backgroundColor,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 10
                        }}
                        onPress={handleBack}
                    >
                        <Icon name={'times'} color={'#fff'} />
                    </TouchableOpacityFnx>
                </View>
            </Item>
        </KeyboardAvoidingView>
    )
}
const mapStateToProps = (state) => {
    return {
        theme:state.commonReducer.theme
    }
}

export default connect(mapStateToProps)(SearchBar);
