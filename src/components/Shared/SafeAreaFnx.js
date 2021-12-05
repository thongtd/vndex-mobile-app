import React, { Component } from 'react';
import { View, Text,SafeAreaView,Platform,StatusBar } from 'react-native';
import {style} from "../../config/style";
import connect from 'react-redux/es/connect/connect';
import { checkLogin } from '../../redux/action/common.action';
import { getUserNotify } from '../../redux/action/trade.action';
import SignalrService from '../../services/signalr.service';
import { constant } from '../../config/constants';
import { authService } from '../../services/authenticate.service';
import AsyncStorage from '@react-native-community/async-storage';
 class SafeAreaFnx extends Component {
  constructor(props) {
    super(props);
    this.state = {
        statusBar:'#141d30'
    };
  }
 async componentDidMount() {
   let res = await authService.checkLogged();
   if(!res){
    AsyncStorage.removeItem('auth_token')
    this.props.checkLogin(false);
    this.props.getUserNotify(false)
   }
  }
componentWillReceiveProps = (nextProps) => {
  if(nextProps.statusBar !== this.state.statusBar){
      this.setState({
        statusBar:nextProps.statusBar
      })
  }
  if(nextProps.hasLogout !== this.props.hasLogout && nextProps.hasLogout === true){
    // AsyncStorage.removeItem('auth_token')
    // this.props.checkLogin(false);
    // this.props.getUserNotify(false);
  }
};

  render() {
      console.log(this.props.offEvent,"offEvent");
    const {statusBar} = this.state;
    const {listen_event} = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:this.state.statusBar}} >
          <StatusBar backgroundColor={statusBar} barStyle="light-content" />
          {this.props.children}
          <SignalrService 
          listen_event={listen_event}
          offEvent={this.props.offEvent}
          />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
    return {
        statusBar:state.commonReducer.statusBar,
        hasLogout:state.tradeReducer.hasLogout,
        offEvent:state.commonReducer.offEvent,
        listen_event:state.commonReducer.listenEvent
    }
}

export default connect(mapStateToProps,{checkLogin,getUserNotify})(SafeAreaFnx)