import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { style } from "../../../config/style";
const { width, height } = Dimensions.get("window");
import {styles} from "react-native-theme";
export default class ModalInfoRegister extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalInfo: true
        }
        this.dataStatic = [
            { title: "Your password must have:".t(), fontSize: 16, fontWeight: "bold", hasIcon: false },
            { title: "8 or more characters".t(), fontSize: 14, fontWeight: "normal", hasIcon: true },
            { title: "Uppercase & Lower letters".t(), fontSize: 14, fontWeight: "normal", hasIcon: true },
            { title: "At least one number & special character".t(), fontSize: 14, fontWeight: "normal", hasIcon: true }

        ]
    }

    render() {
        const { modalInfo } = this.state;
        const { isModalInfoRegister } = this.props;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalInfoRegister}
                onRequestClose={() => {
                    console.log("close");
                }}
            >
                <TouchableOpacity
                    onPress={this.props.onModalInfoRegister}>
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
                            height: 150,
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
                                    backgroundColor: "#333",
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={this.props.onModalInfoRegister}>
                                    <Icon name={"times"} color={style.textWhite.color} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                {this.dataStatic.map((item, index) => {
                                    return (
                                        <View style={{flexDirection:"row"}}>
                                            {item.hasIcon && <Text style={{
                                                color: style.textMain.color,
                                                fontSize: 10,
                                                alignSelf:"center"
                                            }}>&#9679;{'  '}</Text>}
                                            <Text style={[{
                                                color: styles.textWhite.color,
                                                fontWeight: item.fontWeight,
                                                fontSize: item.fontSize,
                                            },
                                            !item.hasIcon && { paddingBottom: 5 }
                                            ]}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
