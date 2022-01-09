import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Rating } from 'react-native-ratings';
import Button from '../../../components/Button/Button';
import Container from '../../../components/Container';
import Image from '../../../components/Image/Image';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {fontSize, spacingApp} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import TimelineBuySell from './TimelineBuySell';

const Step5BuySellScreen = ({componentId}) => {
  return (
    <Container
      isTopBar
      title="Hoàn thành"
      componentId={componentId}
      spaceHorizontal={0}
      isScroll
      space={15}>
     <Layout isCenter type='column'>
     <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell
          step={3}
          title={'Chuyển tiền và Xác nhận chuyển tiền'}
        />
      </Layout>
      <Image 
      source={icons.imgChecked}
      />
      <TextFnx space={20} size={30} color={colors.app.buy} >
      50,000 AIF
      </TextFnx>
      <TextFnx spaceBottom={30} color={colors.app.textContentLevel2} >
      Đã được nạp vào ví của bạn
      </TextFnx>
      <View style={{
          height:100
      }}>
      <Button 
      width={200}
      isNormal
      title={"Kiểm tra ví"}
      />
      </View>
      <TextFnx spaceBottom={20} color={colors.app.textContentLevel2} >
      Trải nghiệm giao dịch của bạn như thế nào?
      </TextFnx>
      <Rating
              ratingCount={5}
              startingValue={5}
              tintColor={colors.app.backgroundLevel1}
              showRating
              style={{paddingVertical: 2}}
            />
     </Layout>
    </Container>
  );
};

export default Step5BuySellScreen;

const styles = StyleSheet.create({});
