
import { Navigation } from 'react-native-navigation';
import { pushTutorialScreen } from './src/navigation';
import { Platform } from 'react-native'
import {registerScreens} from './src/navigation/registerScreens'
import setup from "./src/redux/store/setup";
import codePush from "react-native-code-push";
import OneSignal from 'react-native-onesignal';

Navigation.events().registerAppLaunchedListener(() => { 
  initOneSignal();
  const store = setup();
  registerScreens(store);
  pushTutorialScreen();
  checkCodePushUpdate();
});

 async function checkCodePushUpdate () {
        codePush.sync({
        checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
          installMode: codePush.InstallMode.IMMEDIATE,
        //production
        // deploymentKey: Platform.OS === 'ios'  ? "xUWVjiVw_NcQnPJ67IbIDW_ySoG6TpK5IJeAp" : "rJlYb4And7mJkkRAcBebcTiUTgv96NbQjaH10",
          //dev
        deploymentKey: Platform.OS === 'ios'  ? "oDjyvkfClbBm4y0M7wo53O6F0iVwBVYOHkyqj" : "1A9wnbp2GeGOuasRj-nrc1PxCjF8kATXj8tsJ",
      })
 }

    
function initOneSignal() {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("52463e7e-73b1-4f49-ae47-a2dcdfa2c5e3");


  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log("Prompt response:", response);
});

//Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
  });
}