import React, { Component } from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import { offEvent } from '../../redux/action/common.action';
import {connect} from "react-redux";
class TouchableOpacityFnx extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableOpacity
      onPressIn={()=>this.props.offEvent(true)}
      onPressOut={()=>{
        setTimeout(()=>this.props.offEvent(false),500)
      }}
      {...this.props}
      >
          {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default connect(null,{offEvent})(TouchableOpacityFnx);