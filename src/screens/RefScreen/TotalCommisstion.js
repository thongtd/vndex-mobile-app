import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import FastImage from 'react-native-fast-image';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
const TotalCommisstion = ({componentId}) => {
  return (
    <Container
      title={'Your total commission'.t()}
      hasBack
      componentId={componentId}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            style={{width: 25, height: 25, borderRadius: 25}}
            source={{
              uri: 'https://unsplash.it/400/400?image=1',
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <TextFnx spaceLeft={15}>AIFT</TextFnx>
        </View>
        <TextFnx>1,520.00</TextFnx>
      </View>
    </Container>
  );
};

export default TotalCommisstion;

const stylest = StyleSheet.create({});
