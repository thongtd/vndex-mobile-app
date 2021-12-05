import React, { Component } from 'react'
import { Text, View, WebView,Dimensions } from 'react-native'
import { style } from '../../../config/style';
import Orientation from 'react-native-orientation';
import { CHART_TEST } from '../../../config/API';
import { Spiner } from '../../Shared';
import {connect} from "react-redux";
import {styles} from "react-native-theme"
class ChartFnx extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      loading:true
    };
  }

  render() {
    const {pair,theme} = this.props;
    const {loading} = this.state;
    return (
      <View style={{
        height:320,
        width:"100%",
        backgroundColor:styles.bgMain.backgroundColor,
        
      }}>
        <Spiner isVisible={loading} style={{position:"absolute",zIndex:100,top:"20%",left:"45%"}} />
     <WebView
     onLoad={()=>{
      setTimeout(()=>{
        this.setState({
          loading:false
         })
      },1000)
     }}
     scrollEnabled={false}
      scalesPageToFit={true}
        style={{
          // height:"70%",
          backgroundColor:style.container.backgroundColor,
          opacity:loading?0:1
          // width:500,
        }}
        source={{
          uri: `${CHART_TEST}?symbol=${pair || "BTC_VND"}&theme=${theme}`
        }}
      />
      <View style={{
        width:35,
        height:35,
        position:"absolute",
        backgroundColor:"transparent",
        bottom:53,
        left:10
      }}>

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

export default connect(mapStateToProps)(ChartFnx)