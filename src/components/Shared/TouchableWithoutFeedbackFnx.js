import React, { Component } from 'react';
import { View, Text,TouchableWithoutFeedback } from 'react-native';
import { offEvent } from '../../redux/action/common.action';
import {connect} from "react-redux";
class TouchableWithoutFeedbackFnx extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableWithoutFeedback
      onPressIn={()=>this.props.offEvent(true)}
      onPressOut={()=>this.props.offEvent(false)}
      {...this.props}
      >
          {this.props.children}
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(null,{offEvent})(TouchableWithoutFeedbackFnx);