
import { Navigation } from 'react-native-navigation';
import { pushTutorialScreen } from './src/navigation';
import { Platform } from 'react-native'
import {registerScreens} from './src/navigation/registerScreens'
import setup from "./src/redux/store/setup";
import codePush from "react-native-code-push";
import OneSignal from 'react-native-onesignal';
Navigation.events().registerAppLaunchedListener(async () => start());

 async function checkCodePushUpdate () {
      return  codePush.sync({
        checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
        installMode: codePush.InstallMode.IMMEDIATE,
        deploymentKey: Platform.OS === 'ios'  ? "6bcb9bf4-0404-4a7d-96d3-1d152e6af8ab" : "88adc323-786c-41ac-9423-504fcd9a2e76",
      })
 }
    function start () {
      checkCodePushUpdate ()
        .then(async syncStatus => {
          console.log('Start: codePush.sync completed with status: ', syncStatus)
          // wait for the initial code sync to complete else we get flicker
          // in the app when it updates after it has started up and is
          // on the Home screen
          startApp()
        })
        .catch(() => {
          // this could happen if the app doesn't have connectivity
          // just go ahead and start up as normal
          startApp()
        })
    }

async function startApp() {
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
      const store = setup();
    registerScreens(store);
    pushTutorialScreen()
    }