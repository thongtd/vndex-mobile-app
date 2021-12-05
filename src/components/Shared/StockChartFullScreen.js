
import React, { Component } from 'react'
import { Text, View, WebView, Dimensions, TouchableOpacity, TouchableWithoutFeedback, StatusBar } from 'react-native'
import { style } from '../../config/style';
import Orientation from 'react-native-orientation';
import Icon from "react-native-vector-icons/FontAwesome"
import { CHART_TEST } from '../../config/API';
import Spiner from './Spiner';
import {connect} from "react-redux";
import {styles} from "react-native-theme";
const { width, height } = Dimensions.get("window")
class ChartFnxFullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
  }
  componentWillUnmount() {
    StatusBar.setHidden(false);
  }
  render() {
    const { navigation,theme } = this.props;
    const { loading } = this.state;
    const {pair} = navigation.state.params;
    console.log(navigation.state.params, "params state navigation");
    return (
      <View style={{
        height: "100%",
        width: "100%",
        backgroundColor:styles.bgMain.color,
      }}>
        <Spiner isVisible={loading} style={{position: "absolute", top:"25%", right: 50, zIndex: 10}} />
        <View style={{
          height: width,
          width: height,
          backgroundColor:styles.bgMain.color,

        }}>
          <View style={{
            alignSelf: "flex-end",
            zIndex: 1000,
            position: "absolute",
            right: 0,
          }}>
            <TouchableWithoutFeedback onPress={() => {
              Orientation.getOrientation((err, orientation) => {
                if (orientation !== 'PORTRAIT') {
                  navigation.goBack()
                }
              });
            }}>
              <View style={{
                backgroundColor: styles.bgMain.color,
                paddingVertical: 10,
                paddingLeft: 50,
                paddingRight: 10
              }}>
                <Icon name="arrows-alt" color={styles.textWhite.color} size={16} />
              </View>

            </TouchableWithoutFeedback>
          </View>
          <WebView
            onLoad={() => {
              setTimeout(() => {
                this.setState({
                  loading: false
                })
              }, 1000)
            }}
            scrollEnabled={false}
            scalesPageToFit={true}
            style={{
              // height:"70%",
              backgroundColor: style.container.backgroundColor,
              opacity: loading ? 0 : 1,
              marginBottom: -20
            }}
            source={{
              uri: `${CHART_TEST}fullScreen.html?symbol=${pair || "BTC_VND"}&theme=${theme}`
            }}
          />
          <View style={{
        width:200,
        height:35,
        position:"absolute",
        backgroundColor:"transparent",
        bottom:53,
        left:10
      }}>

      </View>
        </View>
      </View>

    );
  }
}
const mapStateToProps = (state) => {
  return {
      theme:state.commonReducer.theme
  }
}
export default connect(mapStateToProps)(ChartFnxFullScreen)