import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
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
import {isArray, listenerEventEmitter, size, toast} from '../../configs/utils';
import {launchImageLibrary} from 'react-native-image-picker';
import Image from '../../components/Image/Image';
import {get, isEmpty} from 'lodash';
import {useActionsP2p} from '../../redux';
import {pop, pushSingleScreenApp} from '../../navigation/Navigation';
import {useDispatch,useSelector} from 'react-redux';
import { CHAT_SCREEN, COMPLAINING_SCREEN } from '../../navigation';

const ComplainProvide = ({componentId, orderId}) => {
  const [ReasonComplain, setReasonComplain] = useState('1');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [images, setImages] = useState([]);
  const dispatcher = useDispatch();
  const advertisment = useSelector(state => state.p2p.advertisment);
  const handleSelfieSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 0,
    }).then(res => {
      console.log(res.assets, 'ressss assets');
      setImages([...res.assets]);
    });
  };
  useEffect(() => {
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.chat) {
            pushSingleScreenApp(componentId, CHAT_SCREEN, {
              orderId: orderId,
              email: get(advertisment, 'traderInfo.emailAddress'),
            });
          }
        },
      );
      const ev = listenerEventEmitter('createSuccess', () => {
        pushSingleScreenApp(componentId,COMPLAINING_SCREEN,{orderId:orderId})
      });
      const evLoading = listenerEventEmitter('doneApi', () => {
        setIsLoading(false);
      });
    return () => {
      navigationButtonEventListener.remove();
      ev.remove();
      evLoading.remove();
    }
  }, [])
  
  const onComplain = useCallback(() => {
    let fileBytes = [];
    let fileNames = [];
    if (size(images) > 0) {
      for (let i = 0; i < images.length; i++) {
        const eleImage = images[i];
        if (get(eleImage, 'fileSize') > 5000000) {
          return toast('FILE_SIZE'.t());
        } else {
          fileBytes.push(get(eleImage, 'base64'));
          fileNames.push(get(eleImage, 'fileName'));
        }
      }
    }
    if (size(images) == 0) {
       return toast('Bằng chứng tải lên không được để trống');
    }else if(isEmpty(description)){
      return toast('Mô tả không được để trống');
    }else if(isEmpty(ReasonComplain)){
      return toast('Vui lòng chọn lý do khiếu nại');
    }
    setIsLoading(true);
    useActionsP2p(dispatcher).handleCreateComplain({
      orderId: orderId,
      reason: ReasonComplain,
      description: description,
      fullName: fullName,
      phoneNumber: phoneNumber,
      imageBytes: fileBytes,
      fileNames: fileNames,
      lockedInSecond: 900,
    });
  }, [images, orderId,description, ReasonComplain, fullName, phoneNumber]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Container
      isTopBar
      isLoadding={isLoading}
      isScroll
      componen tId={componentId}
      customsNavigation={() => {
        Navigation.mergeOptions(componentId, {
          topBar: {
            title:{
              text:"Cung cấp thông tin khiếu nại"
            },
            rightButtons: [
              {
                id: IdNavigation.PressIn.chat,
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
        thước nhỏ hơn 5 MB
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
            <Icon
              color={colors.app.textContentLevel3}
              size={16}
              name="upload"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Input
        hasValue
        value={fullName}
        onChangeText={text => setFullName(text)}
        placeholder="Nhập tên của bạn"
        isLabel
        label="Tên"
      />
      <Input
        hasValue
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
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
        onSubmit={onComplain}
        onClose={() => {
          pop(componentId);
        }}
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
