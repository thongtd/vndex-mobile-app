import {StyleSheet, View, FlatList} from 'react-native';
import Container from '../../components/Container';
import React, {useEffect, useMemo, useState} from 'react';
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
import {useActionsAuthen, useActionsP2p} from '../../redux';
import {useDispatch, useSelector} from 'react-redux';
import {get, size} from 'lodash';

const data = [
  {
    text1: 'Nhà đầu tư chuyên nghiệp',
    text2: 'Đã duyệt',
    isReply: true,
    // date: '2021-11-07',
    ic: 'envelope-open',
    // isShowList: true,
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
    isReply: true,
    // date: '2021-11-07',
    ic: 'envelope-open',
    // isShowList: true,
  },
];

const ListUpdateAccountScreen = ({componentId}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authentication.userInfo);
  const userKyc = useSelector(state => state.authentication.userKyc);
  const allCustomerType = useSelector(state => state.p2p.allCustomerType);
  console.log('allCustomerType: ', allCustomerType);
  useEffect(() => {
    useActionsP2p(dispatch).handleGetAllCustomerType();
    useActionsAuthen(dispatch).handleGetUserKyc(get(userInfo, 'id'));
    return () => {};
  }, []);
  const handleCheck = it => {
    if (size(get(userKyc, 'identityUserCustomerTypes')) > 0) {
      get(userKyc, 'identityUserCustomerTypes').map((item, index) => {
        if (get(item, 'customerTypeId') == get(it, 'id')) {
          it.approved = get(item, 'approved');
          it.idDetail = get(item, 'id');
        }
      });
    }
    if (get(it, 'approved')) {
      return (
        <Button
          isTitle
          title={'Đã duyệt'}
          spaceHorizontal={10}
          size={fontSize.f14}
          color={colors.cl8EC393}
          style={{
            backgroundColor: colors.cl28382E,
            borderRadius: 5,
          }}
          onTitle={() => {}}
        />
      );
    } else if (get(it, 'approved') == false) {
      return (
        <Button
          isTitle
          title={'Chờ xét duyệt'}
          spaceHorizontal={10}
          size={fontSize.f14}
          color={colors.textMomo}
          style={{
            backgroundColor: colors.app.bg3B2B2B,
            borderRadius: 5,
          }}
          onTitle={() => {}}
        />
      );
    } else if (get(it, 'rejected') === true) {
      <Button
        isTitle
        title={'Đã từ chối'}
        spaceHorizontal={10}
        size={fontSize.f14}
        color={colors.app.sell}
        style={{
          backgroundColor: colors.app.bg3B2B2B,
          borderRadius: 5,
        }}
        onTitle={() => {
          pushSingleScreenApp(componentId, UPDATE_ACCOUNT_SCREEN, {
            item: it,
          });
        }}
      />;
    } else {
      return (
        <Button
          isTitle
          title={'Nâng cấp'}
          spaceHorizontal={10}
          size={fontSize.f14}
          color={colors.black}
          style={{
            backgroundColor: colors.iconButton,
            borderRadius: 5,
          }}
          onTitle={() => {
            pushSingleScreenApp(componentId, UPDATE_ACCOUNT_SCREEN, {
              item: it,
            });
          }}
        />
      );
    }
  };
  return (
    <Container title="Nâng cấp tài khoản" componentId={componentId}>
      <View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={allCustomerType}
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
                <Icon name={'envelope-open'} color={colors.text} size={20} />
                <Layout type="column">
                  <Layout isLineCenter spaceBottom={5}>
                    <TextFnx spaceHorizontal={10} size={fontSize.f16}>
                      {get(item, 'name')}
                    </TextFnx>
                  </Layout>
                </Layout>
              </Layout>
              <Layout type="column">{handleCheck(item)}</Layout>
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
