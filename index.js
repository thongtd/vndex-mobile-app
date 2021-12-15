
import { Navigation } from 'react-native-navigation';
import { pushTutorialScreen } from './src/navigation';
import {registerScreens} from './src/navigation/registerScreens'
import setup from "./src/redux/store/setup";

Navigation.events().registerAppLaunchedListener(async () => {
  const store = setup();
  registerScreens(store);
  pushTutorialScreen()
  // Navigation.setRoot({
  //   root: {
  //     component: {
  //             name: 'DAPP_SCREEN'
  //           }
  //         }
  // });
});

