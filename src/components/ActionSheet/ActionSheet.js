import React,{ useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'

import ActionSheet from 'react-native-actions-sheet';

import { fontSize, spacingApp } from '../../configs/constant';
import colors from '../../configs/styles/colors';
import Layout from '../Layout/Layout';
import TextFnx from '../Text/TextFnx';

const BottomSheet = ({
    content,
    title="ok",
    actionRef,
    children
}) => {
    // const actionSheetRef = useRef(null);
    // useEffect(() => {
    //     actionRef(actionSheetRef)
    //     return () => {
            
    //     }
    // }, [actionSheetRef])
    return (
        <ActionSheet
        
            initialOffsetFromBottom={0.4}
            ref={actionRef}
            statusBarTranslucent
            bounceOnOpen={true}
            drawUnderStatusBar={true}
            bounciness={4}
            gestureEnabled={true}
            containerStyle={{
                backgroundColor:colors.app.backgroundLevel2
            }}
            indicatorColor={colors.app.backgroundLevel3}
            defaultOverlayOpacity={0.3}>
                <Layout isCenter spaceBottom={10}>
                    <TextFnx weight='500' size={fontSize.f16}>{title}</TextFnx>
                </Layout>
            <View
              style={{
                paddingHorizontal: spacingApp,
              }}>
                 
                {content || children}
                <View style={styles.footer} />
            </View>
          </ActionSheet>
    )
}

export default BottomSheet

const styles = StyleSheet.create({
    footer: {
      height: 100,
    },
    
  });