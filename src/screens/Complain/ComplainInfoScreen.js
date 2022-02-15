import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Image from '../../components/Image/Image';
import {COMPLAINING_SCREEN, pushSingleScreenApp} from '../../navigation';
import { IdNavigation } from '../../configs/constant';
const ComplainScreen = ({componentId}) => {
  const [note, setNote] = useState('');

  return (
    <Container
      spaceHorizontal={20}
      componentId={componentId}
      isTopBar
      isScroll
      title="Cung cấp thông tin khiếu nại">
      <View>
        <TextFnx>Lý do khiếu nại *</TextFnx>
        <Button
          placeholder={'Chọn lý do'}
          isPlaceholder={false}
          spaceVertical={10}
          onInput={() => {
            alert('add dropdow');
          }}
          isInput
          iconRight="caret-down"
        />
      </View>
      <View style={{position: 'relative'}}>
        <TextFnx style={styles.noteForText} color={colors.description}>
          0/500
        </TextFnx>
        <Input
          label="Mô tả *"
          styleBorder={{height: 'auto'}}
          placeholder="Hãy cung cấp càng nhiều chi tiết càng tốt"
          style={styles.textArea}
          hasValue
          isLabel
          value={note}
          onChangeText={text => setNote(text)}
          isInputTop
          restInput={{
            numberOfLines: 10,
            multiline: true,
          }}
        />
      </View>

      {/* for upload image */}
      <Layout type="column">
        <TextFnx spaceBottom={15}>Tải lên bằng chứng *</TextFnx>
        <TextFnx color={colors.description} size={12} spaceBottom={15}>
          {`Ảnh chụp màn hình, ghi âm, chứng từ thanh toán và nhật ký liên tục. Kích thước <10MB`}
        </TextFnx>
        {/* image after choose */}
        {/* <Layout></Layout>
        <ButtonIcon iconComponent={<Image />} /> */}
      </Layout>

      <Input hasValue placeholder="Nhập tên của bạn" isLabel label="Tên" />
      <Input
        hasValue
        placeholder="Nhập số điện thoại của bạn"
        isLabel
        label="Số điện thoại"
      />
      <Layout type="column" space={10}>
        <TextFnx color={colors.highlight} space={10}>
          Lý do khiếu nại và bằng chứng phải được hiển thị cho hai bên và bộ
          phận hỗ trợ khách hàng. Tránh để lộ thông tin nhạy cảm hoặc riêng tư.
        </TextFnx>
        <TextFnx color={colors.highlight}>
          Khiếu nại mà không có bằng chứng có thể khiến tài khoản bị cấm
        </TextFnx>
      </Layout>

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
        
        onSubmit={() => {
          pushSingleScreenApp(componentId, COMPLAINING_SCREEN, null, {
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
        colorTitle={colors.text}
        weightTitle={'700'}
        onClose={() => {
          alert('Hủy bỏ button');
        }}
        textClose="Huỷ lệnh"
        textSubmit="Khiếu nại"
        colorTitleClose={colors.description}
        //   te={'MUA USDT'}
      />
    </Container>
  );
};

export default ComplainScreen;

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
