import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { style } from "../../config/style"
import {styles} from "react-native-theme";
const InputFieldFnx = ({
    hasDropdown,
    hasIcon,
    selected,
    placeholder = 'CHOOSE_YOUR_COUNTRY'.t(),
    icon = "globe-americas",
    onPress,
    styled,
    styleTextField=style.textField.color
}) => {
    return (
        <React.Fragment>
            {hasDropdown ? (
                <TouchableOpacity onPress={onPress}>
                    <View
                        style={styled ?styled:{
                            alignItems: "center",
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#44588c',
                            paddingVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            {hasIcon && <Icon name={icon}
                                size={15}
                                color={styleTextField}
                                style={{
                                    paddingRight: 10
                                }}
                            />}
                            <Text style={{
                                color: selected ? styles.textWhite.color : styleTextField,
                                fontSize: 14
                            }}>
                                {selected ? selected : placeholder}
                            </Text>
                        </View>
                        <View>
                            {hasDropdown && (
                                <Icon name="sort-down"
                                    size={15}
                                    color={styleTextField}
                                />
                            )}

                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                    <View
                        style={{
                            alignItems: "center",
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#44588c',
                            paddingVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            {hasIcon && <Icon name={icon}
                                size={15}
                                color={style.textTitle.color}
                                style={{
                                    paddingRight: 10
                                }}
                            />}
                            <Text style={{
                                color: selected ? styles.textWhite.color : style.textField.color,
                                fontSize: 14
                            }}>
                                {selected ? selected : placeholder}
                            </Text>
                        </View>
                        <View>
                            {hasDropdown && (
                                <Icon name="sort-down"
                                    size={15}
                                    color={style.textTitle.color}
                                />
                            )}

                        </View>
                    </View>
                )}
        </React.Fragment>

    )
}
export default InputFieldFnx