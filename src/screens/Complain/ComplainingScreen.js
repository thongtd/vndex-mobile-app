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

const ComplainingScreen = ({componentId}) => {
  return (
    <Container
      spaceHorizontal={20}
      componentId={componentId}
      isTopBar
      isScroll
      title="Đang khiếu nại">
      <Layout
        type="column"
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <TextFnx
          color={colors.description}
          spaceBottom={5}
          size={14}
          align="center">
          Hãy chờ bộ phận hỗ trợ khách hàng của VNDEX
        </TextFnx>
        <TextFnx
          color={colors.description}
          spaceBottom={5}
          size={14}
          align="center">
          Hãy chờ người bị khiếu nại xử lý
        </TextFnx>
        <TextFnx
          color={colors.btnClose}
          spaceBottom={20}
          size={14}
          align="center">
          {`Thời gian còn lại `}
          <TextFnx color={colors.highlight} size={20}>
            03:31
          </TextFnx>
        </TextFnx>

        <TextFnx color={colors.description} spaceBottom={5} size={14}>
          1. Nếu cả hai đã được thỏa thuận, bạn có thể HỦY KHIẾU NẠI và tiến
          hành hoàn tất giao dịch
        </TextFnx>
        <TextFnx color={colors.description} spaceBottom={5} size={14}>
          2. Nếu người khiếu nại không phản hồi kịp thời, hỗ trợ khách hàng sẽ
          can thiệp và tiến hành phân xử.
        </TextFnx>
        <TextFnx color={colors.description} spaceBottom={5} size={14}>
          3. Hãy{' '}
          <TouchableOpacity
            onPress={() => {
              pop(componentId);
            }}>
            <TextFnx color={colors.highlight} style={{marginBottom: -3}}>
              Cung cấp thêm thông tin
            </TextFnx>
          </TouchableOpacity>
          . Thông tin cung cấp bởi người dùng và hỗ trợ khách hàng có thể tìm
          thấy ở "Tiến trình khiếu nại
        </TextFnx>
        <TextFnx color={colors.highlight}></TextFnx>
      </Layout>
      <Layout
        type="column"
        space={5}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <ButtonIcon
          title={'Tiến trình khiếu nại'}
          onPress={() => {
            pushSingleScreenApp(componentId, COMPLAINING_PROCESS_SCREEN, null, {
              topBar: {
                rightButtons: [
                  {
                    id: IdNavigation.PressIn.filterFeedback,
                    icon: require('assets/icons/ic_feedback.png'),
                  },
                ],
              },
            });
          }}
          size={0}
          iconRight={
            <Icon name="chevron-right" size={14} color={colors.background} />
          }
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        />
      </Layout>

      {/* info create order */}
      <Layout
        space={10}
        type="column"
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số tiền
          </TextFnx>
          <TextFnx color={colors.greyLight} size={16}>
            150,000,500 VND
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Giá
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            24,525 VND
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số lượng
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            5,000 AIF
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Phí
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            0.0154500 AIF
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số lệnh
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            1234567890
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Thời gian tạo
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            16-11-2021 11:20:35
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Thời gian tạo
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            16-11-2021 11:20:35
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Bí danh của người bán
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            {`lutuananh94  `}
            <Icon
              name="chevron-right"
              size={14}
              color={colors.background}
              style={{marginLeft: 10}}
            />
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Phương thức thanh toán
          </TextFnx>

          <TextFnx style={{width: 'auto'}}>
            <TextFnx
              color={colors.greyLight}
              size={14}
              style={{backgroundColor: colors.app.bg363636, borderRadius: 3}}>
              Chuyển khoản
            </TextFnx>
            {`  `}
            <Icon
              name="chevron-right"
              size={14}
              color={colors.background}
              style={{marginLeft: 10}}
            />
          </TextFnx>
        </Layout>
      </Layout>

      <Layout space={10} isSpaceBetween>
        <View style={{paddingRight: 10, marginTop: 3}}>
          <Icon iconComponent={icons.IcNote} />
        </View>

        <TextFnx color={colors.app.textContentLevel3} style={{lineHeight: 20}}>
          Bạn có thể hủy yêu cầu khiếu nại nếu đã liên lạc thành công với đối
          tác hoặc giải quyết được tranh chấp. Lệnh của bạn sẽ KHÔNG bị hủy nếu
          bạn hủy khiếu nại. Lệnh của bạn sẽ được trở lại trạng thái “Chờ mở
          khóa”.
        </TextFnx>
      </Layout>

      <Button
        textClose={'Hủy khiếu nại'}
        isClose
        onPress={() => {
          alert('Hủy bỏ button');
        }}
      />
      <Button
        spaceVertical={20}
        isSubmit
        // bgButtonColorSubmit={
        //   disabledSubmit ? '#715611' : colors.app.yellowHightlight
        // }
        // bgButtonColorClose={disabledSubmit ? '#2C2B28' : colors.btnClose}
        // disabledClose={disabledSubmit}
        // disabledSubmit={disabledSubmit}
        isClose
        onSubmit={() => {}}
        onClose={() => {}}
        colorTitle={colors.text}
        weightTitle={'700'}
        textClose="Đàm phán thất bại"
        textSubmit="Đạt thỏa thuận"
        colorTitleClose={colors.description}
        //   te={'MUA USDT'}
      />
    </Container>
  );
};

export default ComplainingScreen;

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
