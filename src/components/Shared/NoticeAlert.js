import React from 'react';
import { Text, View, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { style } from '../../config/style'
import ButtonFnx from './ButtonFnx';
const NoticeAlert = ({
    onRequestClose,
    visible,
    content,
    hasContent,
    onHidden,
    titleBtn,
    styleBtn,
    styleTextBtn,
    styleViewBtn
}) => (
        <Modal
            onRequestClose={onRequestClose}
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={{
                backgroundColor: "#000",
                opacity: 0.5,
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
            }}>
            </View>
                <View style={{
                    justifyContent: "center"
                }}>
                    <View style={{
                        marginHorizontal: "11%",
                        backgroundColor: "#fff",
                        marginTop: "10%"
                    }}>
                        <View style={{
                            paddingHorizontal: 30,
                            // paddingBottom: 30,
                            paddingVertical: 30
                        }}>
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Text style={[style.textMain, style.fontSize18, { fontWeight: "bold" }]}>
                                    {"Notice".t()}
                                </Text>
                                <Image style={{
                                    width: 50,
                                    height: 50
                                }} source={require("../../../src/assets/img/warning.png")} />
                                {/* <Icon name={"exclamation-triangle"} size={35} color="#f6ff00" style={{
                                marginVertical: 10
                            }} /> */}
                            </View>
                            <View>
                                {hasContent ? hasContent : <Text>
                                    {content}
                                </Text>}
                            </View>
                            <View style={{
                                marginVertical: 10
                            }}>
                                <ButtonFnx
                                    hiddenSecond={true}
                                    onClickFirst={onRequestClose}
                                    titleFirst={titleBtn}
                                    styleHiddenSecond={styleBtn}
                                    styleTextFirst={styleTextBtn}
                                    styled={styleViewBtn}
                                />
                            </View>
                        </View>
                    </View>
                </View>

            

        </Modal>
    );

export default NoticeAlert;
