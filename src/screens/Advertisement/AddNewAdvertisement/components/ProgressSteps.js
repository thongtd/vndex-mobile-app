import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../../configs/styles/colors';
import TextFnx from '../../../../components/Text/TextFnx';
import {fontSize,spacingApp} from '../../../../configs/constant';
import Icon from '../../../../components/Icon';
import { get } from 'lodash';

const ProgressSteps = ({step, title}) => {
  return (
    <View
      style={{
        marginBottom: 20,
        width: '100%',
      }}>
      <TextFnx
        size={fontSize.f16}
        weight="bold"
        spaceBottom={20}
        spaceLeft={spacingApp}
        color={colors.app.yellowHightlight}>
        {title || ''}
      </TextFnx>
      <StepIndicator
        renderStepIndicator={parms => {
          // console.log(parms,"paaa")
          if (get(parms, 'stepStatus') == 'finished') {
            return <Icon name="check" color={colors.app.yellowHightlight} />;
          } else {
            return <TextFnx>{get(parms, 'position') + 1}</TextFnx>;
          }
        }}
        customStyles={customStyles}
        currentPosition={step}
        stepCount={3}
      />
    </View>
  );
};

export default ProgressSteps;

const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: colors.app.yellowHightlight,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.app.bgStepAds,
  stepStrokeUnFinishedColor: colors.app.backgroundLevel2,
  separatorFinishedColor: colors.app.yellowHightlight,
  separatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorFinishedColor: colors.app.bgStepAds,
  stepIndicatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorCurrentColor: colors.app.backgroundLevel2,
  stepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: colors.app.yellowHightlight,
  currentStepIndicatorLabelFontSize: 14,
};
const styles = StyleSheet.create({});
