import { Platform } from 'react-native';
import { dimensions } from "../config/utilities";

import { style } from "../config/style/";
import theme from 'react-native-theme';
// var bgButton = '#152032';
var colorDart = {
    bgMain: '#141d30',
    bgBtnListCoin: '#152032',
    textWhite: '#fff',
    box: '#1c2840',
    Highlight: '#77b0ff',
    subText: '#3a4d92',
    subBox: '#152032',
    textMain: '#486db5',
    textWhiteOp: '#cac8cb',
    bgButton: '#19386f',
    HighlightOld: "#06ffff",
    placeHolder: "#283b5b",
}
var colorLight = {
    bgMain: '#fff',
    bgBtnListCoin: '#E4F0F9',
    textWhite: '#333',
    box: '#E4F0F9',
    Highlight: '#448EF6',
    subText: '#63686E',
    subBox: '#F3F8FF',
    textMain: '#333',
    textWhiteOp: '#63686E',
    bgButton: '#486DB5',
    placeHolder: '#ABC7DD',
    title: '#91ACC4'
}
var uploadBox = "#0e1021";
theme.add({ // Add default theme

    //------------------start Screen Setup-------------
    
    SU_item: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#0e1021'
    }
    ,

    //-----------------end Screen Setup-------------
    //*************************************************/
    // --------------------start Screen Market -------------

    M_fontSize: {
        fontSize: 12, paddingTop: 4
    },
    M_fontSize15: {
        fontSize: 15
    },

    //---------------------start Screen Market-------------
    // --------------------start Register -------------

    RG_content: {
        flex: 1,
        paddingVertical: 20,
        marginLeft: 20,
        marginRight: 20
    },
    RG_inputStyle: {
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c'
    },

    //---------------------start Register-------------
    textWhite: { color: colorDart.textWhite },
    textHighLight: { color: colorDart.Highlight },
    textHighLightOld: { color: colorDart.HighlightOld },
    txtHl: { color: colorDart.HighlightOld },
    textMain: { color: colorDart.textMain },
    textWhiteOp: { color: colorDart.textWhiteOp },
    bgBtnListCoin:{
        color: colorDart.bgBtnListCoin
    },
    backgroundMain: {
        color: colorDart.bgMain,
        backgroundColor: colorDart.bgMain
    },
    backgroundSub: {
        color: colorDart.box,
        backgroundColor: colorDart.box
    },
    bgMain: {
        color: colorDart.bgMain,
        backgroundColor: colorDart.bgMain
    },
    bgSub: {
        color: colorDart.box,
        backgroundColor: colorDart.box
    },
    textWhiteMain: { color: "#fff" },
    bgButton: { color: colorDart.bgButton },
    textPlaceHolder: { color: colorDart.placeHolder },
    txtPh: { color: colorDart.placeHolder },
    bgAlert: { color: '#192240' },
    txtMainTitle: style.textMain,
    bgUploadBox: {
        color: uploadBox
    },
    txtWhiteTitle: {
        color: "#fff"
    },
    txtMainSub: {
        color: '#486db5'
    },
    bgBoxDWWhite: {
        color: "#354660"
    },
    bgTooltipOldNew: {
        color: "#25354f"
    },
    bgBuyOldNew: {
        color: '#01ff9d'
    },
    bgSellOldNew: {
        color: "#ff315d"
    },
    bgInfoWlWhite: {
        color: '#162a4f'
    },
    txtButtonTabMainTitle: {
        color: "#193870"
    },
    txtWhiteOpSub: {
        color: style.textWhiteOp.color
    },
    txtBlackTitle: {
        color: '#323232'
    },
    bgBtnClose:{
        color:'#1c2840'
    },
    rowItem:{
        color:'#e3e3e3'
    },
    bgSubBoxWhite:{
        color:colorDart.subBox
    },
    bgInputWhite:{
        color:"#1b2337"
    },
    txtWhiteSub:{
        color:"#fff"
    },
    bgBoxCancel:{
        color:"#162033"
    },
    txtCancelSell:{
        color:"#60192f"
    },
    txtCancelBuy:{
        color:"#063f1d"
    },
    txtCancel:{
        color:"#37404f"
    },
    txtSplitHeader:{
        color:'#171f32'
    },
    borderBottomItem:{
        color:"#212938"
    },
    line:{
        color:"#44588c"
    },
    bgDisable:{
        color:"#2E4159"
    },
    borderTutorial:{
        color:"#19243a"
    },
    txtMainHl:{
        color:style.textMain.color
    }
});

theme.add({ // Add light theme
    bgDisable:{
        color:"#7B9FBA"
    },
    txtMainHl:{
        color:colorLight.Highlight
    },
    borderTutorial:{
        color:"#63686E"
    },
    line:{
        color:"#87A8D0"
    },
    borderBottomItem:{
        color:"#ABC7DD"
    },
    txtSplitHeader:{
        color:'#333'
    },
    txtCancel:{
        color:"#ABC7DD"
    },
    txtCancelSell:{
        color:"#F9B7C8"
    },
    txtCancelBuy:{
        color:"#88E2AC"
    },
    bgBoxCancel:{
        color:"#E9F7FF"
    },
    bgInputWhite:{
        color:"#fff"
    },
    bgSubBoxWhite:{
        color:"#fff"
    },
    bgBtnClose:{
        color:"#CDD9E8"
    },
    bgBtnListCoin:{
        color: colorLight.subBox
    },
    textWhite: { color: colorLight.textWhite },
    textHighLight: { color: colorLight.Highlight },
    textMain: { color: colorLight.textMain },
    textWhiteOp: { color: colorLight.textWhiteOp },
    backgroundMain: {
        backgroundColor: colorLight.bgMain,
        color: colorLight.bgMain,
    },
    backgroundSub: {
        backgroundColor: colorLight.bgMain,
        color: colorLight.bgMain
    },
    bgMain: {
        color: colorLight.bgMain,
        backgroundColor: colorLight.bgMain
    },
    bgSub: {
        color: colorLight.box,
        backgroundColor: colorLight.box
    },
    textWhiteMain: { color: colorDart.textMain },
    bgButton: { color: colorLight.bgButton },
    textHighLightOld: { color: colorLight.Highlight },
    txtHl: { color: colorLight.Highlight },
    textPlaceHolder: { color: colorLight.placeHolder },
    txtPh: { color: colorLight.placeHolder },
    bgAlert: { color: '#fff' },
    txtMainTitle: {
        color: colorLight.title
    },
    bgUploadBox: {
        color: colorLight.box
    },
    txtWhiteTitle: {
        color: colorLight.title
    },
    txtMainSub: {
        color: colorLight.subText
    },
    bgBoxDWWhite: {
        color: "#fff"
    },
    bgTooltipOldNew: {
        color: "#C8E6F5"
    },
    bgBuyOldNew: {
        color: "#00D154"
    },
    bgSellOldNew: {
        color: "#FF315D"
    },
    bgInfoWlWhite: {
        color: "#fff"
    },
    txtButtonTabMainTitle: {
        color: "#91ACC4"
    },
    txtWhiteOpSub: {
        color: colorLight.subText
    },
    txtBlackTitle: {
        color: colorLight.title
    },
    rowItem:{
        color:colorLight.textWhite
    },
    txtWhiteSub:{
        color:colorLight.subText
    },
    //------------------start Screen Setup-------------

    SU_item: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#0e1021'
    },

    //-----------------end Screen Setup-------------

    // ************************************************
    // --------------------start Screen Market -------------

    M_fontSize: {
        fontSize: 12, paddingTop: 4
    },
    M_fontSize15: {
        fontSize: 15
    },

    //---------------------start Screen Market-------------

    // --------------------start Register -------------

    RG_content: {
        flex: 1,
        paddingVertical: 20,
        marginLeft: 20,
        marginRight: 20
    },
    RG_inputStyle: {
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c'
    }

    //---------------------start Register-------------
}, 'light');
