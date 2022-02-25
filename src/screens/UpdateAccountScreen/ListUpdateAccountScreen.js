import {StyleSheet, View, FlatList} from 'react-native';
import Container from '../../components/Container';
import React from 'react';
import Layout from '../../components/Layout/Layout';
import {fontSize} from '../../configs/constant';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import {
  LIST_UPDATE_ACCOUNT_SCREEN,
  LIST_UPDATE_SCREEN,
  pushSingleScreenApp,
  UPDATE_ACCOUNT_SCREEN,
} from '../../navigation';

const data = [
  {
    text1: 'Nhà đầu tư chuyên nghiệp',
    text2: 'Đã duyệt',
    isReply: true,
    date: '2021-11-07',
    ic: 'envelope-open',
    isShowList: true,
  },
  {
    text1: 'Nhà đầu tư chuyên nghiệp',
    text2: 'Nâng cấp',
    isReply: false,
    date: '',
    ic: 'envelope-open',
    isShowList: false,
    isUpdate: true,
  },
  {
    text1: 'Tổ chức phát hành',
    text2: 'Chờ xét duyệt',
    isReply: false,
    date: '2021-11-07',
    ic: 'envelope-open',
    isShowList: true,
  },
];

const ListUpdateAccountScreen = ({componentId}) => {
  return (
    <Container title="Nâng cấp tài khoản" componentId={componentId}>
      <View>
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
              <Layout style={{justifyContent: 'flex-start'}}>
                <Icon name={item.ic} color={colors.text} size={20} />
                <Layout type="column">
                  <Layout isLineCenter spaceBottom={5}>
                    <TextFnx spaceHorizontal={10} size={fontSize.f16}>
                      {item.text1}
                    </TextFnx>
                    <Icon iconComponent={icons.Ic1} size={16} />
                  </Layout>
                  {(item.isShowList && (
                    <Button
                      isTitle
                      title="Danh sách hồ sơ"
                      spaceHorizontal={10}
                      size={fontSize.f14}
                      color={colors.iconButton}
                      onTitle={() =>
                        pushSingleScreenApp(componentId, LIST_UPDATE_SCREEN)
                      }
                    />
                  )) ||
                    null}
                </Layout>
              </Layout>
              <Layout type="column">
                <Button
                  isTitle
                  title={item.text2}
                  spaceHorizontal={10}
                  size={fontSize.f14}
                  color={
                    item.isReply
                      ? colors.cl8EC393
                      : item.isShowList
                      ? colors.textMomo
                      : colors.black
                  }
                  style={{
                    backgroundColor: item.isReply
                      ? colors.cl28382E
                      : item.isShowList
                      ? colors.app.bg3B2B2B
                      : colors.iconButton,
                    borderRadius: 5,
                  }}
                  onTitle={() => {
                    (item?.isUpdate &&
                      pushSingleScreenApp(
                        componentId,
                        UPDATE_ACCOUNT_SCREEN,
                      )) ||
                      null;
                  }}
                />
                {(item.isReply && (
                  <TextFnx
                    spaceTop={5}
                    align={'right'}
                    size={fontSize.f12}
                    color={colors.description}>
                    {item.date}
                  </TextFnx>
                )) ||
                  null}
              </Layout>
            </Layout>
          )}
        />
      </View>
    </Container>
  );
};

export default ListUpdateAccountScreen;

const styles = StyleSheet.create({
  a: {
    justifyContent: 'flex-start',
  },
});
