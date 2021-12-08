import React,{useState,useEffect} from 'react';
import { Text, View } from 'react-native';
// import PINCode from '@haskkor/react-native-pincode'
import SafeAreaViewFnx from '../../components/SafeAreaView';
import colors from '../../configs/styles/colors';
import PinView from './passcodeView/PinView';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import { Navigation } from 'react-native-navigation';
import { storageService } from '../../services/storage.service';
import { constant } from '../../configs/constant';
import {useDispatch,useSelector} from "react-redux"
import { createAction, size, toast, emitEventEmitter } from '../../configs/utils';
import { CHECK_PASSCODE } from '../../redux/modules/authentication/actions';
import BackgroundTimer from 'react-native-background-timer';
const PasscodeScreen = ({
    componentId,
}) => {
    const [Step,setStep] = useState(1);
    const [Passcode,setPasscode] = useState("");
    const dispatcher = useDispatch();
    const isPasscode = useSelector(state => state.authentication.isPasscode);
    const [Count, setCount] = useState(0);
    const [Lock, setLock] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimer, setIsTimer] = useState(true);
    useEffect(() => {
        if (Lock) {
            var intervalId;
            if (isTimer && timer) {
                intervalId = BackgroundTimer.setInterval(() => {
                    setTimer(timer - 1);
                    emitEventEmitter('timer',timer)
                }, 1000);

            } else if (!timer) {
                setIsTimer(false);
                setLock(false);
                BackgroundTimer.clearInterval(intervalId);
            }
        }
        return () => BackgroundTimer.clearInterval(intervalId);
    }, [isTimer, timer, Lock]);
   
    const onComplete =async (inputtedPin, clear) => {
        
        
        if(isPasscode){
            let passcode = await storageService.getItem(constant.STORAGEKEY.PASSCODE);
            if(size(passcode)>0 && passcode == inputtedPin){
                dispatcher(createAction(CHECK_PASSCODE,{
                    is:false
                }))
               await storageService.removeItem(constant.STORAGEKEY.PASSCODE)
                Navigation.pop(componentId);
            } else if (size(passcode)>0 && inputtedPin !== passcode) {
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
        }else{
            
            if(Step ===1){
                setPasscode(inputtedPin)
                setStep(2)
            }else{
                
                if(Passcode == inputtedPin){
                    dispatcher(createAction(CHECK_PASSCODE,{
                        is:true,
                    }))
                    setStep(1)
                    Navigation.pop(componentId);
                    storageService.setItem(constant.STORAGEKEY.PASSCODE,Passcode)
                }else {
                    setStep(1)
                }
            }
        }
        
        clear();
    }
    return (
        <Container
        title={"passcode".t()}
        hasBack
        componentId={componentId}
        >{(Lock && isTimer) ? (<>
            <View style={{
                alignItems: "center",
                paddingTop: 200
            }}>
                <TextFnx align="center" color={colors.text} value={"Lock_passcode".t()} />
                <TextFnx color={colors.text} space={15} size={20} weight={"bold"} value={`${timer} second`} />
            </View>
        </>):(
            <>
            <View style={{
                alignItems:"center",
                paddingVertical:60
            }}>
                <TextFnx color={colors.text} value={`${isPasscode?"Enter your passcode":(Step===1?"Enter a new passcode":"Please re-enter new a passcode")}`} />
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
            
        </Container>
    )
}

export default PasscodeScreen;
