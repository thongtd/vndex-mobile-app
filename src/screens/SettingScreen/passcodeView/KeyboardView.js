import React from "react"
import { Animated, FlatList, Text, TouchableOpacity, I18nManager } from "react-native"
import colors from "../../../configs/styles/colors"
import Icon from "../../../components/Icon"

const KeyboardView = ({
  activeKey,
  onPressOut,
  onPressIn,
  iconDel = "backspace",
  keyboardOnPress, 
  keyboardViewStyle, 
  keyboardViewTextStyle, pinLength, onComplete, bgColor, returnType, textColor, animatedDeleteButton, deleteText, animatedDeleteButtonOnPress, styles, onPress, buttonDeletePosition, buttonDeleteStyle, buttonActiveOpacity }) => {
  let data = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const leftButtonDeletePositions = [deleteText, "0", "empty"]
  const rightButtonDeletePositions = ["empty", "0", deleteText]

  const setButtonDeletePosition = (arrToConcatLeft, arrToConcatRight) => {
    let newData = data

    if (buttonDeletePosition === "right") {
      newData = [...data, ...arrToConcatRight]

      return newData
    }

    newData = [...data, ...arrToConcatLeft]
    return newData
  }

  if (I18nManager.isRTL) {
    data = setButtonDeletePosition(leftButtonDeletePositions, rightButtonDeletePositions).reverse()
  } else {
    data = setButtonDeletePosition(leftButtonDeletePositions, rightButtonDeletePositions)
  }
  const renderItem = ({ item, index }) => {
    let style
    let onPressInactive
    let onPressKeyboard = () => keyboardOnPress(item, returnType, pinLength, onComplete, onPress)
    let ViewStyles = keyboardViewStyle

    if (item === deleteText) {
      onPressInactive = animatedDeleteButtonOnPress
      style = [styles[0], {
        // visibility: "hidden",
        // opacity: animatedDeleteButton,
      }]
      ViewStyles = { ...ViewStyles, ...buttonDeleteStyle }
    } else if (item === "empty") {
      onPressInactive = false
      style = [styles[0], {
        opacity: 0,
      }]
      onPressKeyboard = () => { }
    } else {
      onPressInactive = false
      style = [styles[0]]
    }
    // console.log(item, "item keyboard View")
    return (
      <TouchableOpacity
        key={"key-item-" + index}
        activeOpacity={buttonActiveOpacity}
        onPressIn={()=>onPressIn(item)}
        onPress={onPressKeyboard}
        onPressOut={onPressOut}
        disabled={onPressInactive}>
        <Animated.View style={[style,activeKey===item ?{
          backgroundColor:colors.transparent
        }:{
          backgroundColor: "transparent",
        }, ViewStyles]}>
          {(item === deleteText && iconDel) ? <Icon size={25} name={iconDel} color={colors.text} /> : <Text style={[styles[1], {
            color: textColor,
            opacity: 1,
          }, keyboardViewTextStyle]}>{item}</Text>}

        </Animated.View>
      </TouchableOpacity>
    )
  }
  return (
    <FlatList
      contentContainerStyle={{
        flexDirection: I18nManager.isRTL ? "column-reverse" : "column",
        alignItems: I18nManager.isRTL ? "flex-end" : "flex-start",
      }}
      scrollEnabled={false}
      horizontal={false}
      vertical={true}
      numColumns={3}
      renderItem={renderItem}
      data={data}
      keyExtractor={(val, index) => "pinViewItem-" + index}
    />
  )
}
export default KeyboardView
