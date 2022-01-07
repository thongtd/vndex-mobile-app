import { get } from 'lodash';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import Icon from '../../../components/Icon';
import TextFnx from '../../../components/Text/TextFnx'
import { fontSize, spacingApp } from '../../../configs/constant'
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors'

const TimelineBuySell = ({
    step=0,
    title
}) => {
    return (
        <View
        style={{
          marginBottom: 20,
        }}>
            
        <TextFnx
          size={fontSize.f16}
          weight="bold"
          spaceBottom={20}
          spaceLeft={spacingApp}
          color={colors.app.buy}>
          {title}
        </TextFnx>
     

        <StepIndicator
        
        renderStepIndicator={(parms)=>{
            // console.log(parms,"paaa")
            if(get(parms,"stepStatus") == 'finished'){
                return (<Icon name='check' color={colors.app.buy} />)
            }else{
                return (<TextFnx>{get(parms,"position")+1}</TextFnx>)
            }
            
        }}
      customStyles={customStyles}
      currentPosition={step}
      stepCount={4}
    />
      </View>
    )
}

export default TimelineBuySell

const styles = StyleSheet.create({})
const customStyles = {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 0.5,
    currentStepStrokeWidth: 0.5,
    stepStrokeCurrentColor: colors.app.buy,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: colors.app.backgroundLevel2,
    stepStrokeUnFinishedColor: colors.app.backgroundLevel2,
    separatorFinishedColor: colors.app.buy,
    separatorUnFinishedColor: colors.app.backgroundLevel3,
    stepIndicatorFinishedColor: '#161F15',
    stepIndicatorUnFinishedColor: colors.app.backgroundLevel2,
    stepIndicatorCurrentColor: colors.app.backgroundLevel2,
    stepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: colors.app.yellowHightlight,
    currentStepIndicatorLabelFontSize: 14,
  };