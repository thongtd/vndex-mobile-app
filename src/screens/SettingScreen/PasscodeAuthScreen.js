import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView,BackHandler } from 'react-native';
// import PINCode from '@haskkor/react-native-pincode'
import colors from '../../configs/styles/colors';
import PinView from './passcodeView/PinView';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import { Navigation } from 'react-native-navigation';
import { storageService } from '../../services/storage.service';
import { constant } from '../../configs/constant';
import { useDispatch } from "react-redux"
import { createAction, emitEventEmitter, toast, backHandler, removeBackHandler } from '../../configs/utils';
import { CHECK_PASSCODE } from '../../redux/modules/authentication/actions';
import BackgroundTimer from 'react-native-background-timer';
import useAppState from 'react-native-appstate-hook';
import { dismissAllModal } from '../../navigation/Navigation';
const PasscodeAuthScreen = ({
    componentId,
    navigator
}) => {
    const [Count, setCount] = useState(0);
    const [Lock, setLock] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimer, setIsTimer] = useState(true);
    const onComplete = (inputtedPin, clear) => {
        storageService.getItem(constant.STORAGEKEY.PASSCODE).then(passcode => {
            if (inputtedPin == passcode) {
                dismissAllModal();
                
            } else if (inputtedPin !== passcode) {
                if (Count < 4) {
                    toast("Wrong passcode".t())
                    setCount(Count + 1)
                } else {
                    setCount(0);
                    setTimer(60)
                    setLock(true);
                    setIsTimer(true);
                }
            }
            clear();
        })

    }
    useEffect(() => {
        if (Lock) {
            var intervalId;
            if (isTimer && timer) {
                intervalId = BackgroundTimer.setInterval(() => {
                    setTimer(timer - 1);
                    emitEventEmitter('timer', timer)
                }, 1000);

            } else if (!timer) {
                setIsTimer(false);
                setLock(false);
                BackgroundTimer.clearInterval(intervalId);
            }
        }
        return () => BackgroundTimer.clearInterval(intervalId);
    }, [isTimer, timer, Lock]);
    useEffect(() => {
       var backer =  BackHandler.addEventListener('hardwareBackPress', (e) => {return true})
        return () => {
            backer.remove();
        };
    }, [])
    return (
        <Container
            componentId={componentId}
            isTopBar={false}
        >
            <SafeAreaView>
                {(Lock && isTimer) ? (<>
                    <View style={{
                        alignItems: "center",
                        paddingTop: 200
                    }}>
                        <TextFnx align="center" color={colors.text} value={"Lock_passcode".t()} />
                        <TextFnx color={colors.text} space={15} size={20} weight={"bold"} value={`${timer} second`} />
                    </View>
                </>) : (
                        <>
                            <View style={{
                                alignItems: "center",
                                paddingVertical: 60
                            }}>
                                <TextFnx color={colors.text} value={"Enter your passcode"} />
                            </View>
                            <PinView
                                buttonDeleteStyle={{ backgroundColor: "transparent" }}
                                buttonDeletePosition={"right"}
                                onComplete={onComplete}
                                pinLength={6}
                                activeBgColor={colors.statusBar}
                                inputViewStyle={{ width: 18, height: 18, borderColor: colors.title, borderWidth: 1 }}
                            />
                        </>
                    )}

            </SafeAreaView>

        </Container>
    )
}

export default PasscodeAuthScreen;
