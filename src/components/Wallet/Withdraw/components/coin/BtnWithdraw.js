import React from 'react';
import { Text, View,TextInput,Dimensions,TouchableOpacity } from 'react-native';
import { style } from "../../../../../config/style";
import { constant } from "../../../../../config/constants";
import { Button } from 'native-base';
const {width,height} = Dimensions.get("window");
import {styles} from "react-native-theme";
const BtnWithdraw = ({
    currentPosition,
    onHandleSubmit,
    onGoBack,
    onCancelVisible,
    checkCancel
}) => (
        <React.Fragment>
            {
                currentPosition !== 0 && !(currentPosition === 3) &&
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                    <TouchableOpacity
                        style={[{
                            backgroundColor:styles.bgButton.color,
                            flex: 1,
                            borderRadius: 2,
                            marginRight: 5,
                            borderColor: styles.bgButton.color,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }, style.buttonHeight]}
                        onPress={onHandleSubmit}
                    >
                        <Text style={{ color: 'white' }}>{'SUBMIT'.t()}</Text>
                    </TouchableOpacity>
                    {
                        currentPosition === 1 ?
                            <TouchableOpacity
                                style={[{
                                    backgroundColor: checkCancel ? '#205AA7' : styles.bgBtnClose.color,
                                    flex: 1,
                                    height: width / 10,
                                    borderRadius: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  
                                }, style.buttonHeight]}
                                onPress={onGoBack}
                            >
                                <Text style={{   color:styles.textWhiteMain.color }}>{'CANCEL'.t()}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={[{
                                    backgroundColor: checkCancel ? '#205AA7' : styles.bgBtnClose.color,
                                    flex: 1,
                                    height: width / 10,
                                    borderRadius: 2,
                                  
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }, style.buttonHeight]}
                                onPress={onCancelVisible}
                            >
                                <Text style={{color:styles.textWhiteMain.color }}>{'CANCEL'.t()}</Text>
                            </TouchableOpacity>
                    }
                </View>
            }
        </React.Fragment>
    );

export default BtnWithdraw;
