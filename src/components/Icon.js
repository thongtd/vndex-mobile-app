import FontAwesome from "react-native-vector-icons/FontAwesome5"
import AntDesign from "react-native-vector-icons/AntDesign"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Foundation from "react-native-vector-icons/Foundation"
import Octicons from "react-native-vector-icons/Octicons"
import Zocial from "react-native-vector-icons/Zocial"
import Entypo from "react-native-vector-icons/Entypo"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Feather from "react-native-vector-icons/Feather"
import Fontisto from "react-native-vector-icons/Fontisto"

import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { constant } from "../configs/constant"
const Icon = ({
    type = constant.TYPE_ICON.FontAwesome,
    style,
    name="search",
    size,
    color
}) => {
    let Icon;
    switch (type) {
        case constant.TYPE_ICON.FontAwesome:
            Icon = <FontAwesome style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.AntDesign:
            Icon = <AntDesign style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Ionicons:
            Icon = <Ionicons style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.MaterialIcons:
            Icon = <MaterialIcons style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.MaterialCommunityIcons:
            Icon = <MaterialCommunityIcons style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Foundation:
            Icon = <Foundation style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Octicons:
            Icon = <Octicons style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Zocial:
            Icon = <Zocial style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Entypo:
            Icon = <Entypo style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.AntDesign:
            Icon = <AntDesign style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Feather:
            Icon = <Feather style={style} name={name} size={size} color={color} />
            break;
        case constant.TYPE_ICON.Fontisto:
            Icon = <Fontisto style={style} name={name} size={size} color={color} />
            break;

        default:
            Icon = <FontAwesome style={style} name={name} size={size} color={color} />
            break;
    }
    return Icon
};
Icon.propTypes = {
    type: PropTypes.oneOf([
        constant.TYPE_ICON.FontAwesome,
        constant.TYPE_ICON.AntDesign,
        constant.TYPE_ICON.Ionicons,
        constant.TYPE_ICON.MaterialIcons,
        constant.TYPE_ICON.MaterialCommunityIcons,
        constant.TYPE_ICON.Foundation,
        constant.TYPE_ICON.Octicons,
        constant.TYPE_ICON.Zocial,
        constant.TYPE_ICON.Entypo,
        constant.TYPE_ICON.EvilIcons,
        constant.TYPE_ICON.Feather,
        constant.TYPE_ICON.Fontisto
    ]),
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
      ]),
}
export default Icon;


