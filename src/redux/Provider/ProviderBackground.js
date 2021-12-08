import React, { Component, useEffect, useState } from 'react';
import { View, Text, AppState,DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from "react-redux"
import { createAction, size, listenerEventEmitter, removeTokenAndUserInfo } from '../../configs/utils';
import { CHECK_PASSCODE, CHECK_STATE_LOGIN } from '../modules/authentication/actions';
import { storageService } from '../../services/storage.service';
import { constant } from '../../configs/constant';

import { pushTabBasedApp } from '../../navigation';
const ProviderBackground = React.memo(({
    params,
}) => {
    const dispatcher = useDispatch();
    const isPasscode = useSelector(state => state.authentication.isPasscode);
    const passPasscode = useSelector(state => state.authentication.passPasscode);
    // const [AppStateData, setAppStateData] = useState("")

    //   useEffect(() => {
    //       listenerEventEmitter('logout',()=>{
    //           removeTokenAndUserInfo();
    //           dispatcher(createAction(CHECK_STATE_LOGIN, false));
    //           pushTabBasedApp(3);

    //       })
    //       return () => {
    //         DeviceEventEmitter.removeListener('logout');
    //       };
    //   }, [])
    // useEffect(() => {
    //     if (appState === "background") {
    //         // setAppStateData("");

    //         if (passPasscode === false && isPasscode === true) {
    //             dispatcher(createAction(CHECK_PASSCODE, {
    //                 is: true,
    //                 pass: true
    //             }))
    //         }
    //     }
    //     return () => {
    //         // setAppStateData("")
    //     }
    // }, [passPasscode, isPasscode, appState])
    return null
})
export default ProviderBackground;
