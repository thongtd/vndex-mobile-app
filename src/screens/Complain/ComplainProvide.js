import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import {Navigation} from 'react-native-navigation';
import {IdNavigation} from '../../configs/constant';
import Input from '../../components/Input';
import {useState} from 'react';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import Icon from '../../components/Icon';
import {isArray, size} from '../../configs/utils';
import {launchImageLibrary} from 'react-native-image-picker';
import Image from '../../components/Image/Image';
import {get} from 'lodash';

const ComplainProvide = ({componentId}) => {
  const [ReasonComplain, setReasonComplain] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const handleSelfieSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 0,
    }).then(res => {
      setImages([...res.assets]);
    });
  };
  return (
    <Container
      title="Cung cấp thông tin khiếu nại"
      isTopBar
      isScroll
      componentId={componentId}
      customsNavigation={() => {
        Navigation.mergeOptions(componentId, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.historyTransaction,
                icon: require('assets/icons/ic_chat.png'),
              },
            ],
          },
        });
      }}>
      <Input
        hasValue
        value={ReasonComplain}
        onChangeText={text => setReasonComplain(text)}
        placeholder="Nhập lý do bạn muốn khiếu nại"
        isLabel
        isRequired
        label="Lý do khiếu nại"
      />

      <Input
        isLabel
        isRequired
        label="Mô tả"
        placeholder="Hãy cung cấp càng nhiều chi tiết càng tốt"
        hasValue
        styleBorder={styles.textArea}
        value={description}
        onChangeText={text => setDescription(text)}
        restInput={{
          numberOfLines: 10,
          multiline: true,
        }}
      />
      <TextFnx color={colors.subText} space={10}>
        Tải lên bằng chứng
        <TextFnx color={colors.app.sell} value={' *'} />
      </TextFnx>
      <TextFnx color={colors.app.textDisabled} size={12}>
        Ảnh chụp màn hình, ghi âm, chứng từ thanh toán và nhật ký liên tục. Kích
        thước nhỏ hơn 10 MB
      </TextFnx>

      <ScrollView
        horizontal
        style={{
          flex: 1,
        }}>
        {isArray(images) &&
          size(images) > 0 &&
          images.map((item, index) => (
            <View key={index.toString()}>
              <View
                style={{
                  position: 'relative',
                  width: 84,
                  height: 84,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: 64,
                    width: 64,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: get(item, 'uri'),
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() =>
                  setImages(images.filter((_, index) => _.uri != item.uri))
                }
                style={{
                  position: 'absolute',
                  backgroundColor: colors.black,
                  right: 0,
                  top: 2,
                  width: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <Icon size={14} name="times" color={colors.text} />
              </TouchableOpacity>
            </View>
          ))}
        <TouchableOpacity
          onPress={handleSelfieSide}
          style={{
            width: 84,
            height: 84,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#3E3E3E',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon color={colors.app.textContentLevel3} size={16} name="upload" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Input
        hasValue
        value={ReasonComplain}
        onChangeText={text => setReasonComplain(text)}
        placeholder="Nhập tên của bạn"
        isLabel
        label="Tên"
      />
      <Input
        hasValue
        value={ReasonComplain}
        onChangeText={text => setReasonComplain(text)}
        placeholder="Nhập số điện thoại của bạn"
        isLabel
        label="Số điện thoại"
      />
      <TextFnx spaceTop={16} size={12} color={colors.app.yellowHightlight}>
        <TextFnx color={colors.app.yellowHightlight} weight="bold">
          ·
        </TextFnx>{' '}
        Lý do khiếu nại và bằng chứng phải được hiển thị cho hai bên và bộ phận
        hỗ trợ khách hàng. Tránh để lộ thông tin nhạy cảm hoặc riêng tư.
      </TextFnx>
      <TextFnx spaceTop={8} size={12} color={colors.app.yellowHightlight}>
        <TextFnx color={colors.app.yellowHightlight} weight="bold">
          ·
        </TextFnx>{' '}
        Khiếu nại mà không có bằng chứng có thể khiến tài khoản bị cấm
      </TextFnx>
      <Button
        textClose={'Huỷ bỏ'}
        textSubmit={'Khiếu nại'}
        isClose
        isSubmit></Button>
    </Container>
  );
};

export default ComplainProvide;

const styles = StyleSheet.create({
  textArea: {
    height: 100,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    // fontSize: 16,
  },
});
