import React from 'react';
import { Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { style } from '../../config/style';
import {styles} from "react-native-theme";
const { width, height } = Dimensions.get("window");
const TooltipNotice = ({
    isTooltip,
    onClose,
    content
}) => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isTooltip}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                onPress={onClose}>
                <View
                    style={{
                        position: "absolute",
                        backgroundColor: "#000",
                        opacity: 0.5,
                        height: height,
                        width: width,
                        top: 0,
                        left: 0
                    }} />

            </TouchableOpacity>
            <View style={{
                height: "100%",
                paddingHorizontal: 20,
                flexDirection: "column",
                justifyContent: "center"
            }}>
                <View style={{
                    backgroundColor: "#00000090",

                }}>
                    <View style={{
                        backgroundColor: styles.bgAlert.color,
                        // height: 150,
                        paddingHorizontal: 15,
                        paddingTop: 15,
                        paddingBottom: 40
                    }}>
                        <View style={{
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity style={{
                                width: 20,
                                height: 20,
                                backgroundColor: style.container.backgroundColor,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} onPress={onClose}>
                                <Icon name={"times"} color={style.textWhite.color} />
                            </TouchableOpacity>
                        </View>
                        {content && content}
                    </View>
                </View>
            </View>
        </Modal>
    );

export default TooltipNotice;
