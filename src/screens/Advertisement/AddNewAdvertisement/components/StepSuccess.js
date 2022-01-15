import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/Button/Button';
import Container from '../../../../components/Container';
import Image from '../../../../components/Image/Image';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import icons from '../../../../configs/icons';
import colors from '../../../../configs/styles/colors';
import { pushTabBasedApp } from '../../../../navigation';

export default function StepSuccess({componentId}) {
  return (
    <Container
      isTopBar
      title="Hoàn thành"
      componentId={componentId}
    //   spaceHorizontal={0}
      isScroll
      space={15}>
      <Layout isCenter type="column">
        <Image source={icons.imgChecked} />
        <TextFnx space={20} size={30} color={colors.app.buy}>
          Đăng thành công
        </TextFnx>

        <TextFnx spaceBottom={30} color={colors.app.textContentLevel2}>
          Quảng cáo của bạn đã được đăng tải và sẽ được hiển thị cho những người
          dùng khác. Hãy chú ý đến thông báo lệnh mới
        </TextFnx>
        <View
          style={{
            height: 100,
          }}>
          <Button
            onPress={() => pushTabBasedApp(0)}
            width={200}
            isNormal
            title={'Đã xong'}
          />
        </View>
      </Layout>
    </Container>
  );
}
