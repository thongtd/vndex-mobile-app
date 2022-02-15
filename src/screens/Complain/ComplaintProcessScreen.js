import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Image from '../../components/Image/Image';
import {
  pushSingleScreenApp,
  FEEDBACK_SCREEN,
  COMPLAINING_PROCESS_SCREEN,
} from '../../navigation';
import {IdNavigation} from '../../configs/constant';
import {pop} from '../../navigation/Navigation';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';

const ComplaintProcessScreen = ({componentId}) => {
  return (
    <Container
      spaceHorizontal={20}
      componentId={componentId}
      isTopBar
      isScroll
      title="Tiến trình khiếu nại">
      <Layout type="column">
        <TextFnx color={colors.app.textContentLevel3} size={12} space={10}>
          16-11-2021 12:30:35
        </TextFnx>
        <View
          style={{
            backgroundColor: colors.app.backgroundLevel2,
            borderRadius: 3,
          }}>
          <TextFnx
            style={{borderBottomWidth: 1, borderColor: colors.line}}
            space={10}
            spaceLeft={10}
            spaceRight={10}
            color={colors.subText}
            size={14}>
            Bình luận của Hỗ trợ khách hàng
          </TextFnx>
          <TextFnx
            space={10}
            spaceLeft={10}
            spaceRight={10}
            color={colors.subText}
            size={14}>
            Chào người mua, chúng tôi thấy bạn đánh dấu lệnh giao dịch này “Đã
            thanh toán”. Tuy nhiên, người bán vẫn chưa nhận được khoản tiền. Vui
            lòng tải lên hóa đơn thanh toán hoặc bằng chứng chuyển khoản
            <TouchableOpacity
              onPress={() => {
                pushSingleScreenApp(componentId, FEEDBACK_SCREEN, null, {
                  topBar: {
                    rightButtons: [
                      {
                        id: IdNavigation.PressIn.filterFeedback,
                        icon: require('assets/icons/ic_feedback.png'),
                      },
                    ],
                  },
                });
              }}>
              <TextFnx color={colors.highlight} style={{marginBottom: -3}}>
                {` tại đây`}
              </TextFnx>
            </TouchableOpacity>
            . Lưu ý: Lệnh giao dịch sẽ bị hủy nếu bạn không phản hồi. Xin cảm
            ơn.
          </TextFnx>
        </View>
      </Layout>

      <Layout type="column">
        <TextFnx color={colors.app.textContentLevel3} size={12} space={10}>
          16-11-2021 11:30:35
        </TextFnx>
        <View
          style={{
            backgroundColor: colors.app.backgroundLevel2,
            borderRadius: 3,
          }}>
          <TextFnx
            space={10}
            spaceLeft={10}
            spaceRight={10}
            color={colors.subText}
            size={14}>
            Hỗ trợ khách hàng đã tham gia vào vụ việc và sẽ tiến hành phân xử,
            xin hãy kiên nhẫn.
          </TextFnx>
        </View>
      </Layout>

      <Layout type="column">
        <TextFnx color={colors.app.textContentLevel3} size={12} space={10}>
          16-11-2021 12:30:35
        </TextFnx>
        <View
          style={{
            backgroundColor: colors.app.backgroundLevel2,
            borderRadius: 3,
          }}>
          <TextFnx
            style={{borderBottomWidth: 1, borderColor: colors.line}}
            space={10}
            spaceLeft={10}
            spaceRight={10}
            color={colors.subText}
            size={14}>
            Khiếu nại do người dùng gửi lên
          </TextFnx>
          <TextFnx
            space={10}
            spaceHorizontal={10}
            color={colors.subText}
            size={16}>
            VIP 1 Seller
          </TextFnx>
          <Layout spaceBottom={10} spaceHorizontal={10} type="column">
            <TextFnx color={colors.greyLight} size={14}>
              Lý do khiếu nại
            </TextFnx>
            <TextFnx color={colors.btnClose} spaceTop={10} size={14}>
              Tôi chưa nhận được tiền thanh toán từ người mua
            </TextFnx>
          </Layout>
          <Layout spaceBottom={10} spaceHorizontal={10} type="column">
            <TextFnx color={colors.greyLight} size={14}>
              Mô tả
            </TextFnx>
            <TextFnx color={colors.btnClose} spaceTop={10} size={14}>
              Chưa có mô tả
            </TextFnx>
          </Layout>
          <Layout spaceBottom={10} spaceHorizontal={10} type="column">
            <TextFnx color={colors.greyLight} size={14}>
              Bằng chứng
            </TextFnx>
            <Layout spaceTop={10}>
              <Image
                source={require('assets/images/Rectangle.png')}
                style={{
                  width: 64,
                  height: 64,
                  marginRight: 10,
                }}
              />
              <Image
                source={require('assets/images/Rectangle.png')}
                style={{
                  width: 64,
                  height: 64,
                  marginRight: 10,
                }}
              />
            </Layout>
          </Layout>
        </View>
      </Layout>

      <Button
        title={'Chat ngay'}
        isNormal
        onPress={() => {
          alert('Chat ngay button');
        }}
      />
    </Container>
  );
};

export default ComplaintProcessScreen;

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize: 16,
    position: 'relative',
    marginTop: -10,
    marginBottom: 10,
    width: '100%',
  },
  noteForText: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    zIndex: 100,
    height: 'auto',
  },
});
