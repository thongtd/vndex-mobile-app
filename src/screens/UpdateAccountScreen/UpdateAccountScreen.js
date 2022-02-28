import {StyleSheet, TouchableOpacity, FlatList, View} from 'react-native';
import Container from '../../components/Container';
import React, {useState, useEffect} from 'react';
import Layout from '../../components/Layout/Layout';
import {fontSize} from '../../configs/constant';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/Button/ButtonIcon';
import DocumentPicker from 'react-native-document-picker';
import {get} from 'lodash';
import {listenerEventEmitter, toast} from '../../configs/utils';
import {useDispatch, useSelector} from 'react-redux';
import {useActionsP2p} from '../../redux';
import { pop } from '../../navigation/Navigation';

const data = [
  {
    text1: 'Hóa đơn điện thoại cố định',
    date: '2021-12-09',
  },
  {
    text1: 'Sao kê ngân hàng tháng 04/2021',
    date: '2021-12-09',
  },
];

const dataPolicy = [
  'Định dạng .pdf, .jpg, .jpeg, .png',
  'Dung lượng: tối đa 10MB',
  'Tên trên giấy tờ phải giống trên ID đã gửi',
  'Địa chỉ trên giấy tờ phải giống địa chỉ cư trú đã nhập',
  'Giấy tờ phải trong 3 tháng gần nhất',
  'Phải nhìn thấy rõ tên, địa chỉ, ngày cấp và nơi cấp giấy tờ',
  'Vui lòng xem danh sách file được hỗ trợ',
];
const UpdateAccountScreen = ({componentId, item}) => {
  // const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const dispatcher = useDispatch();
  const UserInfo = useSelector(state => state.authentication.userInfo);
  
  const onChooseFile = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.csv,
          DocumentPicker.types.pdf,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
        allowMultiSelection: true,
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res[0].uri);
      console.log('Type : ' + res[0].type);
      console.log('File Name : ' + res[0].name);
      console.log('File Size : ' + res[0].size);
      if (res[0].size > 5000000) {
        return toast('Bạn không được tải file quá 5mb');
      }
      //Setting the state to show single file attributes
      // setSingleFile({...res});
      setFiles([...files, ...res]);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        // alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  useEffect(() => {
    const ev = listenerEventEmitter('doneApi', () => {
      pop(componentId);
    });

    return () => {
        ev.remove();
    };
  }, []);
  
  const HeaderComponent = (
    <Layout type="column" style={[styles.borderLayout]} spaceBottom={10}>
      <TouchableOpacity style={styles.bntHeader} onPress={onChooseFile}>
        <TextFnx color={colors.description}>Thêm file</TextFnx>
        <View style={styles.bntPlus} onPress={() => {}}>
          <Icon name="plus" color={colors.black} />
        </View>
      </TouchableOpacity>
      <Layout spaceTop={15} type="column">
        {dataPolicy.map((_i, ind) => (
          <Layout isLineCenter key={String(`${_i}_${ind}`)} space={2}>
            <Icon name={'bullseye'} size={3} color={colors.description} />
            <TextFnx
              spaceHorizontal={5}
              size={fontSize.f12}
              color={colors.description}>
              {_i || ''}
              {/* {(ind == 6 && (
                // <TextFnx size={fontSize.f12} color={colors.iconButton}>
                //   {`  tại đây`}
                // </TextFnx>
              )) ||
                null} */}
            </TextFnx>
          </Layout>
        ))}
      </Layout>
    </Layout>
  );
  return (
    <Container title={`Hồ sơ ${get(item, 'name')}`} componentId={componentId}>
      <FlatList
        ListHeaderComponent={HeaderComponent}
        keyExtractor={(item, index) => index.toString()}
        data={files}
        renderItem={({item}) => (
          <Layout
            isSpaceBetween
            isCenter
            style={[
              {
                paddingVertical: 10,
                height: 70,
              },
              styles.borderLayout,
            ]}>
            <Layout type="column">
              <Layout isLineCenter spaceBottom={5}>
                <TextFnx spaceHorizontal={5} size={fontSize.f16}>
                  {get(item, 'name')}
                </TextFnx>
                {/* <Icon name={'eye'} size={16} color={colors.iconButton} /> */}
              </Layout>
              {/* <TextFnx
                spaceHorizontal={5}
                size={fontSize.f12}
                color={colors.description}>
                {item.date}
              </TextFnx> */}
            </Layout>
            <ButtonIcon
              name="trash"
              color={colors.iconButton}
              size={fontSize.f16}
              onPress={() => {
                setFiles(files.filter(s => s.name != get(item, 'name')));
              }}
            />
          </Layout>
        )}
        ListFooterComponent={
          <Button
            spaceVertical={20}
            isSubmit
            onSubmit={() => {
              var formdataReal = new FormData();
              formdataReal.append('CustomerTypeId', get(item, 'id'));
              formdataReal.append('CustomerId', get(UserInfo, 'id'));
              formdataReal.append('Approved', true);
              for (let i = 0; i < files.length; i++) {
                const eleImage = files[i];
                // messages[0].image = [{link: get(eleImage, 'uri')}];
                formdataReal.append('Files', {
                  uri: get(eleImage, 'uri'),
                  type: get(eleImage, 'type'),
                  name: get(eleImage, 'name'),
                });
              }
              useActionsP2p(dispatcher).handleCreateCustomerType(formdataReal);
            }}
            colorTitle={colors.text}
            weightTitle={'700'}
            textSubmit="Gửi duyệt"
          />
        }
      />
    </Container>
  );
};

export default UpdateAccountScreen;

const styles = StyleSheet.create({
  bntHeader: {
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
  bntPlus: {
    padding: 7,
    backgroundColor: colors.iconButton,
    borderRadius: 100,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderLayout: {
    borderBottomWidth: 0.5,
    borderColor: colors.line,
  },
});
