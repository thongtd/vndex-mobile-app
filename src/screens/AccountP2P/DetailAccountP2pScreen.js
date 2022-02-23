import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import icons from '../../configs/icons';
import {Rating} from 'react-native-ratings';
import Icon from '../../components/Icon';
import ButtonIcon from '../../components/Button/ButtonIcon';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import {useDispatch, useSelector} from 'react-redux';
import {useActionsP2p} from '../../redux';
import {ceil, get, isArray, size} from 'lodash';
import Empty from '../../components/Item/Empty';
import {listenerEventEmitter, to_UTCDate} from '../../configs/utils';

export default function DetailAccountP2pScreen({componentId}) {
  const [star, setStar] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const advInfo = useSelector(state => state.p2p.advInfo);
  const commentsByUser = useSelector(state => state.p2p.commentsByUser);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true);
    useActionsP2p(dispatch).handleGetAdvInfo();
    useActionsP2p(dispatch).handleGetCommentsByUser({
      starFilter: star,
      accountId: get(UserInfo, 'id'),
    });

    return () => {};
  }, [dispatch, star]);
  useEffect(() => {
    const ev = listenerEventEmitter('doneApi', () => {
      setIsLoading(false);
    });

    return () => {
        ev.remove();
    };
  }, []);

  return (
    <Container
      componentId={componentId}
      isScroll
      isTopBar
      isLoadding={isLoading}
      title="Chi tiết giao dịch P2P">
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Giao dịch trong 30 ngày
        </TextFnx>
        <TextFnx weight="600">
          {' '}
          {String(get(advInfo, 'totalRecentTransactions') || 0)} lần
        </TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Tỷ lệ hoàn tất trong 30 ngày
        </TextFnx>
        <TextFnx weight="600">
          {String(get(advInfo, 'percentageOfCompletedRecentTransactions') || 0)}
          %
        </TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Thời gian mở khóa trung bình
        </TextFnx>
        <TextFnx weight="600">
          {String(ceil(get(advInfo, 'averageUnlockTime')))} phút
        </TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Thời gian thanh toán trung bình
        </TextFnx>
        <TextFnx weight="600">
          {String(ceil(get(advInfo, 'averagePaymentTime')))} phút
        </TextFnx>
      </Layout>
      <View
        style={{
          borderBottomColor: colors.app.lineSetting,
          borderBottomWidth: 1,
          paddingVertical: 8,
          marginBottom: 16,
        }}></View>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>Đã đăng ký</TextFnx>
        <TextFnx weight="600">
          {String(get(advInfo, 'registeredDaysAgo'))} ngày trước
        </TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Giao dịch lần đầu tiên
        </TextFnx>
        <TextFnx weight="600">
          {String(get(advInfo, 'firstTransactionDaysAgo'))} ngày trước
        </TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>
          Tổng số giao dịch
        </TextFnx>
        <TextFnx weight="600">{`${get(
          advInfo,
          'totalRecentTransactions',
        )}`}</TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>Mua</TextFnx>
        <TextFnx weight="600">{`${get(
          advInfo,
          'totalBuyTransaction',
        )}`}</TextFnx>
      </Layout>
      <Layout space={8} isSpaceBetween>
        <TextFnx color={colors.app.textContentLevel2}>Bán</TextFnx>
        <TextFnx weight="600">
          {String(get(advInfo, 'totalSellTransaction'))}
        </TextFnx>
      </Layout>
      <View
        style={{
          borderBottomColor: colors.app.lineSetting,
          borderBottomWidth: 1,
          paddingVertical: 8,
          marginBottom: 16,
        }}></View>
      <Layout isSpaceBetween>
        <TouchableOpacity
          onPress={() => setStar(5)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingVertical: 4,
            backgroundColor:
              star == 5
                ? colors.app.yellowHightlight
                : colors.app.bgTransparent,
            justifyContent: 'center',
            width: 50,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <TextFnx spaceRight={8}>5</TextFnx>
          <Icon color={colors.text} solid name="star" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStar(4)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingVertical: 4,
            backgroundColor:
              star == 4
                ? colors.app.yellowHightlight
                : colors.app.bgTransparent,
            justifyContent: 'center',
            width: 50,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <TextFnx spaceRight={8}>4</TextFnx>
          <Icon color={colors.text} solid name="star" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStar(3)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingVertical: 4,
            backgroundColor:
              star == 3
                ? colors.app.yellowHightlight
                : colors.app.bgTransparent,
            justifyContent: 'center',
            width: 50,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <TextFnx spaceRight={8}>3</TextFnx>
          <Icon color={colors.text} solid name="star" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStar(2)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingVertical: 4,
            backgroundColor:
              star == 2
                ? colors.app.yellowHightlight
                : colors.app.bgTransparent,
            justifyContent: 'center',
            width: 50,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <TextFnx spaceRight={8}>2</TextFnx>
          <Icon color={colors.text} solid name="star" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStar(1)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingVertical: 4,
            backgroundColor:
              star == 1
                ? colors.app.yellowHightlight
                : colors.app.bgTransparent,
            justifyContent: 'center',
            width: 50,
            borderColor: '#fff',
            borderWidth: 1,
          }}>
          <TextFnx spaceRight={8}>1</TextFnx>
          <Icon color={colors.text} solid name="star" />
        </TouchableOpacity>
      </Layout>
      <View
        style={{
          borderBottomColor: colors.app.lineSetting,
          borderBottomWidth: 1,
          paddingVertical: 8,
        }}></View>
      {size(commentsByUser) > 0 && isArray(commentsByUser) ? (
        commentsByUser.map((item, index) => (
          <Layout key={`keyka-${index}`} type="column" space={16}>
            <Layout>
              <TextFnx spaceRight={8}>{get(item,"commentator.email")}</TextFnx>
              {icons.icTick}
            </Layout>
            <Layout isLineCenter space={8}>
              <Rating
                imageSize={16}
                ratingCount={5}
                startingValue={get(item,"ratingStar")}
                readonly
                tintColor={colors.app.backgroundLevel1}
                //   onFinishRating={setRatingStar}
                style={{flexDirection: 'row'}}
              />
              {/* <TextFnx spaceLeft={10} color={colors.app.textDisabled}>
                {to_UTCDate(
              get(item, 'createdDate'),
              'DD/MM/YYYY hh:mm:ss',
            )}
              </TextFnx> */}
            </Layout>
            <TextFnx color={colors.app.textDisabled}>
            {get(item,"content")}
            </TextFnx>
          </Layout>
        ))
      ) : (
        <Empty />
      )}
    </Container>
  );
}
