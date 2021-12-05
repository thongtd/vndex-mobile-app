import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {style} from '../../config/style';
import {styles} from "react-native-theme";
const ButtonFnx = ({
    styleFirst=[style.buttonFnxSubmit,{backgroundColor:styles.bgButton.color}],
    styleSecond=[style.buttonFnxClose,{backgroundColor:styles.bgBtnClose.color}],
    titleFirst="OK".t(),
    titleSecond="CLOSE".t(),
    onClickFirst,
    onClickSecond,
    hiddenFirst,
    hiddenSecond,
    hasReverse,
    hiddenAll,
    styleTextSecond=style.textWhite,
    styleTextFirst=style.buttonTextFirst,
    styleHiddenSecond=[style.buttonFnxSubmit,style.fullWidth,{backgroundColor:styles.bgButton.color}],
    styleHiddenFirst=[style.buttonFnxClose,style.fullWidth,{backgroundColor:styles.bgButton.color}],
    disabledFirst=false,
    disabledSecond=false,
    styled={
        width: "100%",
        justifyContent: "space-between",
        flexDirection: hasReverse ? "row-reverse" : 'row',
        marginVertical: 25,
    }
}) => (
        <React.Fragment>
            {!hiddenAll ? (
                <View style={styled}>
                        <React.Fragment>
                            {!hiddenFirst && (
                                <TouchableOpacity disabled={disabledFirst} onPress={onClickFirst}>
                                    <View style={hiddenSecond?styleHiddenSecond:styleFirst}>
                                        <Text style={styleTextFirst}>{titleFirst || ""}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {!hiddenSecond && (
                                <TouchableOpacity disabled={disabledSecond} onPress={onClickSecond}>
                                    <View style={hiddenFirst?styleHiddenFirst:styleSecond}>
                                        <Text style={styleTextSecond}>{titleSecond || ""}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </React.Fragment>
                    
                </View>
            ) : null}
            {/* <Text>ahihihi</Text> */}
        </React.Fragment>
    );

export default ButtonFnx;
