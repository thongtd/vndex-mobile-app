import React from 'react'
import { Image, View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Item, Left, Right } from "native-base";
import { dimensions } from "../../config/utilities";
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {styles} from "react-native-theme";
const ModalAlert = ({
    contentType = "WARNING".t(),
    content,
    visible = false,
    showClose = true,
    isViewContent = false,
    viewContent,
    hasTime=false,
    timer,
    ...rest
}) => {
    return (
        <Modal
            transparent={true}
            animationType={'fade'}
            visible={visible}
            onRequestClose={rest.onClose}>
            <View style={styled.modalBackground}>
                <View style={[styled.activityIndicatorWrapper,{backgroundColor: styles.bgAlert.color,}]}>
                    <Item style={[style.item, { paddingBottom: 15 }]}>
                        <Left style={{ flex: 7 }}>
                            <Text style={{
                                color: styles.textHighLightOld.color,
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}>{contentType}</Text>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <TouchableOpacity style={{
                                width: 20,
                                height: 20,
                                backgroundColor: style.container.backgroundColor,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} onPress={rest.onClose}>
                                <Icon name={"times"} color={style.textWhite.color} />
                            </TouchableOpacity>
                        </Right>
                    </Item>
                    {content && <Text style={[styles.textWhite, { marginBottom: 10, marginHorizontal: 1, fontSize: 14 }]}>{content}</Text>}
                    {rest.resultType && <Text style={[rest.resultType === 'success' ? styles.bgBuyOldNew : styles.bgSellOldNew, {
                        marginBottom: 10,
                        fontSize: 14,
                        marginHorizontal: 1
                    }]}>{rest.resultText}</Text>}

                    {isViewContent && viewContent}
                    <Item style={[styled.item, { marginTop: 10, marginLeft: 0 }]}>
                        {
                            rest.ButtonOKText &&
                            <Left style={{}}>
                                <Button disabled={hasTime} block style={[style.buttonNext, style.buttonHeight, { marginRight: showClose ? 5 : 0, elevation: 0,backgroundColor: styles.bgButton.color, }]}
                                    onPress={rest.onOK}
                                >
                                    <Text style={{
                                        color: style.textWhite.color,
                                        fontSize: 16
                                    }}>{hasTime?timer:(rest.ButtonOKText || 'OK'.t())}</Text>
                                </Button>
                            </Left>
                        }
                        {
                            showClose &&
                            <Right style={{}}>
                                <Button block style={[style.buttonNext, style.buttonHeight, { backgroundColor: 'transparent', marginLeft: rest.ButtonOKText ? 5 : 0, borderColor: "#19386f", borderWidth: 1 }]}
                                    onPress={rest.onClose}
                                >
                                    <Text style={{
                                        color: styles.textWhite.color,
                                        fontSize: 16
                                    }}>{rest.ButtonCloseText || 'CLOSE'.t()}
                                    </Text>
                                </Button>
                            </Right>
                        }
                    </Item>
                </View>
            </View>
        </Modal>
    )
}
export default ModalAlert;
const styled = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090'
    },
    activityIndicatorWrapper: {
        // backgroundColor: '#192240',
        width: dimensions.width - 20,
        //height: dimensions.height / 3,
        padding: 20,
        display: 'flex',
        justifyContent: 'space-between'
    },
    item: {
        borderBottomWidth: 0,
        marginLeft: -1
    },
    input: {
        backgroundColor: '#1d314a',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5
    }
})
