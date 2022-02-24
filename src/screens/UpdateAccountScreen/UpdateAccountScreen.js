import {StyleSheet, TouchableOpacity, FlatList, View} from 'react-native';
import Container from '../../components/Container';
import React from 'react';
import Layout from '../../components/Layout/Layout';
import {fontSize} from '../../configs/constant';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/Button/ButtonIcon';

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
const UpdateAccountScreen = ({componentId}) => {
  const HeaderComponent = (
    <Layout type="column" style={[styles.borderLayout]} spaceBottom={10}>
      <TouchableOpacity style={styles.bntHeader} onPress={() => {}}>
        <TextFnx color={colors.description}>Thêm file</TextFnx>
        <View style={styles.bntPlus} onPress={() => {}}>
          <Icon name="plus" color={colors.black} />
        </View>
      </TouchableOpacity>
      <Layout spaceTop={15} type="column">
        {dataPolicy.map((_i, ind) => (
          <Layout isLineCenter key={String(`${_i}_${ind}`)} space={2}>
            <Icon name={'bullseye'} size={3} color={colors.description} />
            <TextFnx spaceHorizontal={5} size={fontSize.f12} color={colors.description}>
              {_i || ''}
              {(ind == 6 && (
                <TextFnx size={fontSize.f12} color={colors.iconButton}>
                  {`  tại đây`}
                </TextFnx>
              )) ||
                null}
            </TextFnx>
          </Layout>
        ))}
      </Layout>
    </Layout>
  );
  return (
    <Container title="Hồ sơ Tư vấn chuyên nghiệp" componentId={componentId}>
      <FlatList
        ListHeaderComponent={HeaderComponent}
        keyExtractor={(item, index) => index.toString()}
        data={data}
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
                  {item.text1}
                </TextFnx>
                <Icon name={'eye'} size={16} color={colors.iconButton} />
              </Layout>
              <TextFnx
                spaceHorizontal={5}
                size={fontSize.f12}
                color={colors.description}>
                {item.date}
              </TextFnx>
            </Layout>
            <ButtonIcon
              name="trash"
              color={colors.iconButton}
              size={fontSize.f16}
              onPress={() => {
                alert('remove');
              }}
            />
          </Layout>
        )}
        ListFooterComponent={
          <Button
            spaceVertical={20}
            isSubmit
            onSubmit={() => {
              alert('submit');
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
