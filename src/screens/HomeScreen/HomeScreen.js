import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import Button from '../../components/Button/Button';
import { LOGIN_SCREEN, SETTING_SCREEN } from '../../navigation';
import {pushSingleHiddenTopBarApp, pushSingleScreenApp, showModal} from '../../navigation/Navigation';
import {useSelector} from "react-redux"
const HomeScreen = ({
    componentId
}) => {
    
    const logged = useSelector(state => state.authentication.logged);
  return (
    <LayoutSplashScreen
    componentId={componentId}
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
    </LayoutSplashScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
