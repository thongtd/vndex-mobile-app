import React,{Fragment} from 'react';
import { Text, View } from 'react-native';
import {connect} from "react-redux";
import { setStatusBar } from '../../redux/action/common.action';
import {NavigationEvents} from "react-navigation";
const StatusBarFnx = ({
    setStatusBar,
    color
}) => (
    <Fragment>
        <NavigationEvents
        onWillFocus={(payload) => {
            setStatusBar(color);
        }}
        />
    </Fragment>
);

export default connect(null,{setStatusBar})(StatusBarFnx);
