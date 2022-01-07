import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
import Container from '../../../components/Container';

import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import { fontSize, spacingApp } from '../../../configs/constant';
import colors from '../../../configs/styles/colors';

const Step3BuySellScreen = ({
    isScroll,
    content,
    title="ok"
}) => {
    const actionSheetRef = useRef(null);
   useEffect(() => {
    
       return () => {
           
       }
   }, [actionSheetRef])
    return (
        <Container
        isScroll
        >
        <Button 
        onPress={()=>actionSheetRef?.current?.show()}
        title='ok'
        />
        
          <BottomSheet title='KAKA' actionRef={actionSheetRef}>
<View style={{
    paddingVertical:50
}}>
    <TextFnx>Hello</TextFnx>
    <TextFnx>Hello</TextFnx>
    <TextFnx>Hello</TextFnx>

    <TextFnx>Hello</TextFnx><TextFnx>Hello</TextFnx>
    <TextFnx>Hello</TextFnx>

</View>

            </BottomSheet>
          
      </Container>
    )
}

export default Step3BuySellScreen

  const styles = StyleSheet.create({
    footer: {
      height: 100,
    },
   
  });