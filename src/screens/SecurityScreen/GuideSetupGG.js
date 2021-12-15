import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import {
  pushTabBasedApp,
  pushSingleScreenApp,
  BACK_UP_KEY,
} from '../../navigation';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import icons from '../../configs/icons';
import LayoutCenter from '../../components/Layout/LayoutCenter';
import Button from '../../components/Button/Button';
import {fullHeight, checkFullHeight} from '../../configs/utils';

import GGAuth from 'assets/svg/Google_Authenticator.svg';
import GGPlay from 'assets/svg/ggplay.svg';
import AppStore from 'assets/svg/appstore.svg';
import { SvgXml } from 'react-native-svg';
const GuideSetupGG = ({componentId}) => (
  <Container
    hasBack
    componentId={componentId}
    title={'DOWNLOAD_AND_INSTALL'.t()}
    onClickRight={() => pushTabBasedApp(3)}
    textRight={'SKIP'.t()}
    style={{
      flex: 1,
      zIndex: 0,
    }}>
    <View style={stylest.container}>
      <LayoutCenter>
        <TextFnx
          space={20}
          value={'GUIDE_INSTALL'.t()}
          align="center"
          color={colors.text}
        />
        <View style={{
            flexDirection:"row",
            alignItems:"center",
            paddingVertical:30,
        }}>
          <GGAuth />
        <TextFnx
          space={10}
          spaceLeft={15}
          color={colors.text}
          value={'Google Authenticator'}
          weight="bold"
        />
        </View>
        <View style={{
            flexDirection:"row",
            justifyContent:"space-between"
        }}>
          <GGPlay style={{
                marginRight:20
            }}/>
            <AppStore />
        </View>
      </LayoutCenter>
    
      <Button
        textSubmit={'NEXT'.t()}
        onSubmit={() => pushSingleScreenApp(componentId, BACK_UP_KEY)}
        isSubmit
        isButtonCircle={false}
      />
    </View>
  </Container>
);
const stylest = StyleSheet.create({
  container: {
    height: '93%',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
export default GuideSetupGG;
