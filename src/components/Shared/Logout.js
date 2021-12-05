import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { checkLogin } from '../../redux/action/common.action';
import { getUserNotify } from '../../redux/action/trade.action';
import {connect} from "react-redux";
import SignalrService from '../../services/signalr.service';
import { constant } from '../../config/constants';
class Logout extends Component {
    constructor(props) {
        super(props);

    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.hasLogout !== this.props.hasLogout && nextProps.hasLogout === true) {
            console.log(this.props.hasLogout,"has Logout socket2");
            AsyncStorage.removeItem('auth_token')
            this.props.checkLogin(false);
            this.props.getUserNotify(false);
            this.props.navigation.navigate("Login",{
                changePass:true
            })
        }
    };

    render() {
        // return (
        //     <SignalrService 
        //     listen_event={[constant.SOCKET_EVENT.USER_NOTIFY]}
        //     />
            
        // )
        return null;
    }
}
const mapStateToProps = (state) => {
    return {
        hasLogout: state.tradeReducer.hasLogout
    }
}
export default connect(mapStateToProps,{checkLogin,getUserNotify})(Logout);