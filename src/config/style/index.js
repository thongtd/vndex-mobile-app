// import {dimensions} from "../utilities";

import { PixelRatio,Dimensions } from "react-native";

const {width,height} = Dimensions.get("window");
export const style = {
    colorBorderTrade:"#486db5",
    colorButtonPercent:"#193870",
    colorWithdraw:'#1c2840',
    colorHistory:"#162a4f",
    fontMain: { fontSize: 15 },
    fontSize14: { fontSize: 14 },
    textWhite: { color: '#fff' },
    textWhiteOp: { color: '#cac8cb' },
    textGreen: { color: '#01ff9d' },
    textRed: { color: '#ff315d' },
    container: { backgroundColor: '#141d30' },
    textField: { color: "#283b5b" },
    textAddress: { color: '#78afff' },
    colorBgCancel:'#1c2840',
    colorBgStatus:'#1c2840',
    btnCancel: {
        borderRadius: 1,
        borderColor: '#205AA7',
        borderWidth: 1,
        flex: 1,
        marginRight: 5
    },
    textTitle: {
        color: '#486db3',
        fontSize: 30,
        fontWeight: 'bold'
    },
    fontSize: {
        fontSize: 10,
    },
    textLabel: { color: '#343f85', fontSize: 30, fontWeight: '700' },
    textMain: { color: '#486db5' },
    iconMain: { color: "#486db4", fontSize: 25 },
    row: {
        flexDirection: 'row'
    },
    inputView2: {
        borderWidth: 0.5,
        borderColor:"#486db5",
        backgroundColor: "transparent",
        marginTop: 5,
        marginLeft: 0,
        color: "#ffffff",
        paddingLeft: 10,
        height: 40,
        marginBottom: 10
    },
    colorBorderBox:"#486db5",
    inputView: {
        // borderWidth: 2,
        backgroundColor: "#141d30",
        marginTop: 5,
        marginLeft: 0,
        color: "#ffffff",
        paddingLeft: 10,
        // paddingVertical: 5,
        borderBottomWidth: 0,
        height: 40,
        // borderRadius: 5
        marginBottom: 10
    },
    item: {
        borderBottomWidth: 0,
        // paddingBottom: 15
    },
    tabHeading: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderColor: "#19386f",
        borderWidth: 1
    },
    tabOrderHeading: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        height:30
    },
    btnSubmit: {
        marginTop: 25,
        marginBottom: 10,
        borderRadius: 2.5,
        backgroundColor: '#19386f',
        borderColor: '#19386f'
    },
    btnCloseModal: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        backgroundColor: "#101226",
        borderRadius: 20,
    },
    btnTrash: {
        backgroundColor: '#ff315d',
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        marginTop: 2.5,
        marginBottom: 2.5,
        borderBottomWidth: 0,
        borderRadius: 2.5,
    },
    colorWhite:"#fff",
    buttonHeight: { height: 40 },
    buttonBuy: { backgroundColor: '#44a250' },
    buttonSell: { backgroundColor: '#c5321e' },
    buttonNext: { backgroundColor: '#21386b', borderRadius: 2.5, elevation: 0 },
    colorIcon: '#486db5',
    colorHighLight: "#06ffff",
    colorHolder: "#283255",
    normalTextColor: "#486fb4",
    colorDart: "#101226",
    colorMain: "#486db5",
    popUpColor: "#1c2840",
    depositBtnColor: "#3f78ec",
    btnBackgroundColor: "#19386f",
    tabActiveColor: "transparent",
    tabInactiveColor: "#171f32",
    fontSize16: { fontSize: 16 },
    fontSize18: { fontSize: 18 },
    fontSize20: { fontSize: 20 },
    activeTab: { borderColor: '#1c2840', borderWidth: 1, backgroundColor: '#1c2840' },
    disActiveTab: { borderColor: '#1c2840', borderWidth: 1 },
    textBold: { fontWeight: 'bold' },
    colorRed: "#ff315d",
    colorGreen: "#01ff9d",
    hidden: {
        width: 0,
        height: 0
    },
    btnCancelAll: {borderColor:'#ff315d',borderWidth:1, backgroundColor: 'transparent', paddingHorizontal: 10, paddingVertical: 2.5, borderRadius: 2.5, height: 35, alignItems: 'center', justifyContent: 'center' },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#1c2840',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1c2840',
        // width: dimensions.width - 20,
        flex: 1,
        paddingHorizontal: 10
        // justifyContent: 'center'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgHeader: {
        backgroundColor: '#1c2840'
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
    input: {
        borderRadius: 2.5,
        height: 40,
        color: 'white',
        paddingHorizontal: 10,
        // fontSize: 14/ PixelRatio.getFontScale()
    },
    btnArrowLeft: {
        dash: {
            width: 16,
            height: 1.75,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginRight: 10,
        },
        arrow: {
            borderColor: '#fff',
            borderTopWidth: 1.75,
            borderLeftWidth: 1.75,
            padding: 5.25,
            marginLeft: .75,
            transform: [
                { rotateZ: '-45deg' }
            ]
        }
    },
    splitHeader: {
        borderLeftWidth: 1,
        borderLeftColor: '#171f32',
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    fontSize12: { fontSize: 12 },
    buttonFnxSubmit: {
        height: 40,
        borderRadius: 2,
        // backgroundColor: '#21386b',
        width: width/2 -15,
        alignItems: 'center',
        justifyContent:"center",
    },
    buttonFnxClose: {
        height: 40,
        borderRadius: 2,
        borderWidth:0,
        backgroundColor: '#1c2840',
        width: width/2 -15,
        // borderColor: "#19386f",
        
        alignItems: 'center',
        justifyContent:"center"
    },
    fullWidth:{width:width},
    buttonTextFirst:{
        color:"#fff"
    },
    buttonTextSecond:{
        color:"#fff"
    }
}
