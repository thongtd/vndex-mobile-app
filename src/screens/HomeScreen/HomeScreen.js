import React,{useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import Button from '../../components/Button/Button';
import { LOGIN_SCREEN, SETTING_SCREEN } from '../../navigation';
import {pushSingleHiddenTopBarApp, pushSingleScreenApp, showModal} from '../../navigation/Navigation';
import {useSelector} from "react-redux"
import Container from '../../components/Container';
import { Navigation } from 'react-native-navigation';
import { IdNavigation } from '../../configs/constant';
const HomeScreen = ({
    componentId
}) => {
  
  useEffect(() => {
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.historyTransaction) {
            pushSingleScreenApp(componentId, TRANSACTION_HISTORY, null, {
              topBar: {
                rightButtons: [
                  {
                    id: IdNavigation.PressIn.filterTransaction,
                    icon: require('assets/icons/Filter.png'),
                  },
                ],
              },
            });
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
    };
  }, []);
    const logged = useSelector(state => state.authentication.logged);
  return (
    <Container
    componentId={componentId}
    isTopBar
    isScroll
    title='P2P'
    >
      <View>
        <Text>HomeScreen</Text>
        {logged?<Button 
          onSubmit={() => {
            pushSingleHiddenTopBarApp(componentId,SETTING_SCREEN);
          }}
          isSubmit
          textSubmit={'Thông tin tài khoản'}
        />:<Button 
          onSubmit={() => {
            pushSingleScreenApp(componentId,LOGIN_SCREEN);
          }}
          isSubmit
          textSubmit={'Login'}
        />}
        
      </View>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
