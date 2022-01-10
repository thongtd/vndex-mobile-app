import { get } from 'lodash';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import StepIndicator from 'react-native-step-indicator';
import Icon from '../../../components/Icon';
import TextFnx from '../../../components/Text/TextFnx'
import { BUY, fontSize, spacingApp } from '../../../configs/constant'
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors'

const TimelineBuySell = ({
    step=0,
    title,
    side="B"
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
          color={side == BUY?colors.app.sell: colors.app.buy}>
          {title}
        </TextFnx>
     

        <StepIndicator
        
        renderStepIndicator={(parms)=>{
            // console.log(parms,"paaa")
            if(get(parms,"stepStatus") == 'finished'){
                return (<Icon name='check' color={side == BUY?colors.app.sell: colors.app.buy} />)
            }else{
                return (<TextFnx>{get(parms,"position")+1}</TextFnx>)
            }
            
        }}
      customStyles={formatStyle(side == BUY?true:false)}
      currentPosition={step}
      stepCount={4}
    />
      </View>
    )
}

export default TimelineBuySell

const styles = StyleSheet.create({})
const formatStyle = (Buy)=>{
  return {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 0.5,
    currentStepStrokeWidth: 0.5,
    stepStrokeCurrentColor:Buy?colors.app.sell: Buy?colors.app.sell: colors.app.buy,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: colors.app.backgroundLevel2,
    stepStrokeUnFinishedColor: colors.app.backgroundLevel2,
    separatorFinishedColor: Buy?colors.app.sell: colors.app.buy,
    separatorUnFinishedColor: colors.app.backgroundLevel3,
    stepIndicatorFinishedColor:Buy?colors.app.bgSell: '#161F15',
    stepIndicatorUnFinishedColor: colors.app.backgroundLevel2,
    stepIndicatorCurrentColor: colors.app.backgroundLevel2,
    stepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: colors.app.yellowHightlight,
    currentStepIndicatorLabelFontSize: 14,
  };
}
