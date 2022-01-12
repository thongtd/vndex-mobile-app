import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../../components/Button/Button';
import Container from '../../../components/Container';
import Layout from '../../../components/Layout/Layout';
import {spacingApp} from '../../../configs/constant';
import colors from '../../../configs/styles/colors';
import ProgressSteps from './components/ProgressSteps';
import Step1AddNewAds from './components/Step1AddNewAds';
import Step2AddNewAds from './components/Step2AddNewAds';
import Step3AddNewAds from './components/Step3AddNewAds';

const AddNewAdvertisementScreen = ({componentId}) => {
  const title = [
    'Đặt loại và giá',
    'Đặt Tổng số lượng & Phương thức thanh toán',
    'Đặt Tổng số lượng & Phương thức thanh toán',
  ];
  const [step, SetStep] = useState(0);

  const renderLayout = () => {
    switch (step) {
      case 0:
        return (
          <Step1AddNewAds bntClose={bntClose} submitNextStep={submitNextStep} />
        );
      case 1:
        return (
          <Step2AddNewAds bntClose={bntClose} submitNextStep={submitNextStep} />
        );
      case 2:
        return (
          <Step3AddNewAds bntClose={bntClose} submitNextStep={submitNextStep} />
        );
    }
  };

  const bntClose = (
    <Button
      title={'Hủy bỏ'}
      isNormal
      bgButtonColor={colors.background}
      colorTitle={colors.greyLight}
    />
  );

  const submitNextStep = () => {
    if (step == 2)
      return alert(
        'CALL API Đăng Quảng Cáo Đi Chứ Ngồi Đấy Mà Nghịch!!',
      );
    SetStep(step + 1);
  };
  return (
    <Container
      spaceHorizontal={0}
      componentId={componentId}
      isTopBar
      isScroll
      title="Đăng quảng cáo mới">
      <Layout spaceHorizontal={spacingApp}>
        <ProgressSteps step={step} title={title[step]} />
      </Layout>
      {renderLayout()}
    </Container>
  );
};

const styles = StyleSheet.create({});
export default AddNewAdvertisementScreen;
