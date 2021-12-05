import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import IconFont from 'react-native-vector-icons/FontAwesome5';
import { style } from '../../../config/style';
import {styles} from "react-native-theme";
import TouchableOpacityFnx from '../../Shared/TouchableOpacityFnx';
const TitleTop = ({
    onActiveTop,
    ...props
}) => (<React.Fragment>
    {props.hasBtn ? <View style={[stylest.container,styles.bgSub]}>
        <View style={[stylest.viewTitle]}>
            
            <TouchableOpacityFnx onPress={()=>onActiveTop("G")} style={[stylest.viewTitle, {height:"100%",width:115,paddingLeft:10 },props.active === "G"&&{ borderBottomColor: styles.textHighLight.color, borderBottomWidth: 1}]}>
                <Icon name={props.iconName2} size={16} color={props.active === "G" ? styles.textHighLight.color : styles.textWhite.color} />
                <Text style={[props.active === "G" ? { color: styles.textHighLight.color } : styles.textWhite, stylest.fontTitle, { paddingLeft: 5 }]}>{props.title2}</Text>
            </TouchableOpacityFnx>
            <TouchableOpacityFnx onPress={()=>onActiveTop("L")} style={[stylest.viewTitle, {height:"100%",width:115,paddingLeft:10 },props.active === "L"&&{ borderBottomColor: styles.textHighLight.color, borderBottomWidth: 1}]}>
                <Icon name={props.iconName1} size={16} color={props.active === "L" ? styles.textHighLight.color : styles.textWhite.color} />
                <Text style={[props.active === "L" ? { color: styles.textHighLight.color } : styles.textWhite, stylest.fontTitle, { paddingLeft: 5 }]}>{props.title1}</Text>
            </TouchableOpacityFnx>
        </View>
        <View style={stylest.viewTitle}>
            <TouchableOpacityFnx style={{ flexDirection: "row", alignItems: "center",paddingLeft:30 }} onPress={() => {
                props.navigation.navigate("MarketWatchSelect", props.dataNavigation)
            }}>
                <Text style={style.textWhiteOp}>{""}</Text>
                <IconFont style={{
                    paddingLeft: 5,
                    marginTop: 3
                }} name={"chevron-right"} size={12} color={styles.textWhiteOp.color} />
            </TouchableOpacityFnx>
        </View>
    </View> : <View style={[stylest.container,styles.bgSub]}>
            <View style={[stylest.viewTitle,{paddingLeft:10}]}>
                {props.hasFontIcon ? <IconFont name={props.iconName} size={12} color={styles.textWhite.color} /> : <Icon name={props.iconName} size={16} color={styles.textWhite.color} />}
                <Text style={[styles.textWhite, stylest.fontTitle, { paddingLeft: 5 }]}>{props.title}</Text>
            </View>
            <View style={stylest.viewTitle}>
                <TouchableOpacityFnx style={{ flexDirection: "row", alignItems: "center",paddingLeft:30 }} onPress={() => {
                    props.navigation.navigate("MarketWatchSelect", props.dataNavigation)
                }}>
                    <Text style={style.textWhiteOp}>{""}</Text>
                    <IconFont style={{
                        paddingLeft: 5,
                        marginTop: 3
                    }} name={"chevron-right"} size={12} color={styles.textWhiteOp.color} />
                </TouchableOpacityFnx>
            </View>
        </View>}
</React.Fragment>

    );
const stylest = StyleSheet.create({
    viewTitle: {
        alignItems: 'center',
        flexDirection: "row"
    },
    more: {
        alignItems: 'center',
    },
    fontTitle: {
        fontSize: 14
    },
    container: {
        flexDirection: "row",
        height: 35,
        justifyContent: "space-between",
        backgroundColor: style.bgHeader.backgroundColor,
        paddingRight:10
    }
})
export default TitleTop;
