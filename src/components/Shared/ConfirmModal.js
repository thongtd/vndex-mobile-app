import React from 'react'
import { Image, View, Text, Modal, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { Button, Item, Left, Right } from "native-base";
import { dimensions } from "../../config/utilities";
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {styles} from "react-native-theme";
export default class ConfirmModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
 
    render() {
        let { resultType, resultText, title, content,ButtonOKText,ButtonCloseText,onRequestClose } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.props.visible}
                onRequestClose={onRequestClose?onRequestClose:this.props.onClose}>
                <View style={styled.modalBackground}>
                    <View style={[styled.activityIndicatorWrapper,{backgroundColor: styles.bgAlert.color,}]}>
                        <Item style={[style.item, { paddingBottom: 15 }]}>
                            <Left style={{ flex: 7 }}>
                                <Text style={{
                                    color:styles.textHighLightOld.color,
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}>{title}</Text>
                            </Left>
                            <Right style={{ flex: 1 }}>
                                <TouchableOpacity style={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: style.container.backgroundColor,
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={this.props.onClose}>
                                    <Icon name={"times"} color={style.textWhite.color} />
                                </TouchableOpacity>
                            </Right>
                        </Item>
                    {content ? <Text style={[styles.textWhite, { marginBottom: 10, fontSize: 14,marginHorizontal:1 }]}>{this.props.content}</Text> : null}
                        {resultType ? <Text style={[resultType === 'success' ? styles.bgBuyOldNew : styles.bgSellOldNew, {
                            marginBottom: 10,
                            fontSize: 14,
                            marginHorizontal:1
                        }]}>{resultText}</Text> : null}

                        {this.props.isViewContent ? <View style={{marginHorizontal:1}}>{this.props.viewContent}</View> : null}
                        <Item style={[styled.item, { marginTop: 10,marginLeft:0 }]}>
                            {
                                this.props.ButtonOKText &&
                                <Left style={{}}>
                                    <Button block style={[style.buttonNext, style.buttonHeight, { marginRight: ButtonCloseText?5:0,elevation:0,backgroundColor: styles.bgButton.color, }]}
                                        onPress={this.props.onOK}
                                    >
                                        <Text style={{
                                            color: style.textWhite.color,
                                            fontSize: 16
                                        }}>{this.props.ButtonOKText || 'OK'.t()}</Text>
                                    </Button>
                                </Left>
                            }
                            {
                                this.props.ButtonCloseText &&
                                <Right style={{}}>
                                    <Button block style={[style.buttonNext, style.buttonHeight, { backgroundColor: 'transparent', marginLeft: ButtonOKText?5:0, borderColor: "#19386f", borderWidth: 1,elevation:0 }]}
                                        onPress={this.props.onClose}
                                    >
                                        <Text style={{
                                            color:  styles.textWhite.color,
                                            fontSize: 16
                                        }}>{this.props.ButtonCloseText || 'CLOSE'.t()}</Text>
                                    </Button>
                                </Right>
                            }
                        </Item>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styled = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090'
    },
    activityIndicatorWrapper: {
        
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
