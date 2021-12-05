import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {style} from "../../../config/style"
import {styles} from "react-native-theme";
const LabelField = ({
  label
}) =>{
  return (
      <Text allowFontScaling={false} style={[styles.txtMainTitle,style.fontMain]}>{label}</Text>
  )
}
export default LabelField;