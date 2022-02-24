import {StyleSheet, Text, FlatList} from 'react-native';
import Container from '../../components/Container';
import React from 'react';
import Layout from '../../components/Layout/Layout';
import {fontSize} from '../../configs/constant';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';

const data = [
  {
    text1: 'Hóa đơn điện thoại cố định',
    text2: 'Chờ xét duyệt',
    isReply: false,
    date: '2021-12-09',
    ic: 'eye',
  },
  {
    text1: 'Sao kê ngân hàng tháng 04/2021',
    text2: 'Đã duyệt',
    isReply: true,
    date: '2021-11-06',
    ic: 'eye',
  },
  {
    text1: 'Sao kê ngân hàng tháng 05/2021',
    text2: 'Đã duyệt',
    isReply: true,
    date: '2021-11-01',
    ic: 'eye',
  },
];

const ListUpdateScreen = ({componentId}) => {
  return (
    <Container title="Hồ sơ Đầu tư chuyên nghiệp" componentId={componentId}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={data}
        renderItem={({item}) => (
          <Layout
            isSpaceBetween
            isCenter
            style={{
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderColor: colors.line,
              height: 70,
            }}>
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
            <Layout type="column">
              <Button
                isTitle
                title={item.text2}
                spaceHorizontal={10}
                size={fontSize.f14}
                color={item.isReply ? colors.cl8EC393 : colors.textMomo}
                style={{
                  backgroundColor: item.isReply
                    ? colors.cl28382E
                    : colors.app.bg3B2B2B,
                  borderRadius: 5,
                }}
                onTitle={() => {}}
              />
              <TextFnx
                spaceTop={5}
                align={'right'}
                size={fontSize.f12}
                color={colors.description}>
                {item.date}
              </TextFnx>
            </Layout>
          </Layout>
        )}
      />
    </Container>
  );
};

export default ListUpdateScreen;

const styles = StyleSheet.create({
  a: {
    justifyContent: 'flex-start',
  },
});
