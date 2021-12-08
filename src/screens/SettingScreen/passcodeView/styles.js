import { StyleSheet } from "react-native"
import { fullHeight, fullWidth } from "../../../configs/utils";
export default StyleSheet.create({
  passwordInputView: {
    alignSelf: "center",
  },
  passwordInputViewItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    margin: 5,
    width: 35,
    borderRadius: 35 / 2,
  },
  passwordInputViewItemActive: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    margin: 5,
    borderRadius: 35 / 2,
  },
  // KeyboardView
  keyboardView: {
    alignItems: "center",
    marginVertical: 15,

  },
  keyboardViewItem: {
    alignItems: "center",
    justifyContent: "center",
    height:fullWidth/5.7,
    width:fullWidth/5.7,
    marginHorizontal: 20,
    borderRadius: fullWidth/ 2,
  },
  keyboardViewItemText: {
    fontSize: 20,
    fontWeight: "500",
  },
})
