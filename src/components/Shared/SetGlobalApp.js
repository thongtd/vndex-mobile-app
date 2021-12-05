import React, { Component } from 'react';
import { View, Text,PixelRatio } from 'react-native';
// import {
//     setCustomView,
//     setCustomTextInput,
//     setCustomText,
//     setCustomImage,
//     setCustomTouchableOpacity
//   } from 'react-native-global-props';
// const customTextProps = {
//     style: {
//         fontSize:14,
//       fontFamily:'Roboto',
//     },
//     allowFontScaling: false
//   };
//   const customTextInputProps = {
//     style: {
//       fontSize:14/PixelRatio.getFontScale(),
//       fontFamily:'Roboto',
//     },
//     allowFontScaling: false
//   };
  
//   setCustomTextInput(customTextInputProps);
//   setCustomText(customTextProps);
export default class SetGlobalApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      console.log(PixelRatio.getFontScale(),"get font scale2");
    return (
      <View>
        <Text> SetGlobalApp </Text>
      </View>
    );
  }
}
