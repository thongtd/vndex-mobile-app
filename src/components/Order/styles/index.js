import {StyleSheet} from "react-native"
import {style} from "../../../config/style"
export const styles = StyleSheet.create({
    ModalFilter:{
        backgroundColor:"black",
        opacity:0.5,
        position:"absolute",
        width:"100%",
        height:"100%"
   },
    date: {
        flexDirection: 'row',
        borderBottomWidth: 0,
        backgroundColor: '#1b2337',
        // padding: 10,
        borderRadius: 2,
        flex: 1,
        justifyContent: 'space-between',
        height: 35,
        alignItems: 'center'
    },
    item: {
        borderBottomWidth: 0,
        paddingTop: 10,
        paddingBottom: 10,
    },
    listItem: {
        backgroundColor: '#1c2840',
        padding: 10,
        marginBottom: 10,
        borderBottomWidth: 0,
        marginLeft: 10,
        marginRight: 10,
    },
    btnSearch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        borderRadius: 2.5,
        marginLeft: 5,
        backgroundColor: style.buttonNext.backgroundColor
    },
    paddingCommon:{
        paddingTop:4
    },
    colorGrey:{
        color:"#37404f"
    },
    boxFilter:{height:35,backgroundColor:'#1b2337',width:"49%",justifyContent:"center",paddingHorizontal: 10,}
})

export default  StyleSheet.create({
    ModalFilter:{
        backgroundColor:"black",
        opacity:0.5,
        position:"absolute",
        width:"100%",
        height:"100%"
   },
    date: {
        flexDirection: 'row',
        // borderBottomWidth: 0,
        backgroundColor: '#1b2337',
        // padding: 10,
        borderRadius: 2,
        flex: 1,
        justifyContent: 'space-between',
        height: 35,
        alignItems: 'center'
    },
    item: {
        borderBottomWidth: 0,
        paddingTop: 10,
        paddingBottom: 10,
    },
    listItem: {
        backgroundColor: '#1c2840',
        padding: 10,
        marginBottom: 10,
        borderBottomWidth: 0,
        marginLeft: 10,
        marginRight: 10,
    },
    btnSearch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        borderRadius: 2.5,
        marginLeft: 5,
        backgroundColor: style.buttonNext.backgroundColor
    },
    paddingCommon:{
        paddingTop:4
    },
    colorGrey:{
        color:"#37404f"
    },
    boxFilter:{height:35,backgroundColor:'#1b2337',width:"49%",justifyContent:"center",paddingHorizontal: 10,}
})