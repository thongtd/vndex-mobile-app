import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, SafeAreaView, DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from "react-redux"
import { showModal, pop } from '../../navigation/Navigation';
import { IdNavigation } from '../../configs/constant';
import { SETTING_SCREEN, ALERT_NOTICE_PASSWORD, PASSCODE_SCREEN, PASSCODE_AUTH_SCREEN, pushTabBasedApp, pushSingleScreenApp, LOGIN_SCREEN } from '../../navigation';
import { Navigation } from 'react-native-navigation';
import { createAction, listenerEventEmitter, removeTokenAndUserInfo } from '../../configs/utils';
import { CHECK_PASSCODE, CHECK_STATE_LOGIN } from '../modules/authentication/actions';
const TaskBackground = React.memo(({
    children,
    componentId
}) => {
    const isPasscode = useSelector(state => state.authentication.isPasscode);
    const passPasscode = useSelector(state => state.authentication.passPasscode);
    const [HasPasscode, setHasPasscode] = useState(isPasscode);
    const dispatcher = useDispatch();
    const logged = useSelector(state => state.authentication.logged);
    // useEffect(() => {
    //     if (isPasscode === true && passPasscode === true) {
    //         dispatcher(createAction(CHECK_PASSCODE, {
    //             is: true,
    //             pass: false
    //         }));
    //         // console.log("vao day2");
    //         Navigation.showModal({
    //             component: {
    //                 name: PASSCODE_AUTH_SCREEN
    //             }
    //         })
    //     }
    //     return () => {
    //         dispatcher(createAction(CHECK_PASSCODE, {
    //             is: true,
    //             pass: false
    //         }));
    //     }
    // }, [isPasscode, passPasscode]);


    return (
        <View>

        </View>
    );

})
export default TaskBackground;
