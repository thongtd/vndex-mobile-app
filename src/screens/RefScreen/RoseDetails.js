import {
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Container from '../../components/Container';
import FastImage from 'react-native-fast-image';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import {get} from 'lodash';
import Empty from '../../components/Item/Empty';
import {authService} from '../../services/authentication.service';
import {useSelector} from 'react-redux';

const RoseDetails = ({componentId}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  useEffect(() => {
    handleGetData(page);
    return () => {};
  }, []);

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!refresh) return null;
    return <ActivityIndicator style={{color: colors.text}} />;
  };
  const handleLoadMore = () => {
    if (!refresh) {
      setPage(page + 1);
      //   this.page = this.page + 1; // increase page by 1
    }
  };
  useEffect(() => {
    if (page != 1) {
      handleGetData(page); // method for API call
    }
    return () => {};
  }, [page]);
  const onRefresh = () => {
    setPage(1);
    setRefresh(true);
    // this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    authService
      .getUserCommission(get(UserInfo, 'email'), get(UserInfo, 'id'), 1, 15)
      .then(res => {
        setData(get(res, 'data.source'));
        setRefresh(false);
      });

    // this.setState({ isRefreshing: false, userCommission: userCommission.data.source, isDataEmpty: false })
  };
  const handleGetData = page => {
    authService
      .getUserCommission(get(UserInfo, 'email'), get(UserInfo, 'id'), page, 15)
      .then(res => {
        setData(get(res, 'data.source'));
        setLoading(false);
      })
      .catch(err => {
        console.log(err, 'ER');
        setLoading(false);
      });
  };
  return (
    <Container
      title={'Rose details'.t()}
      hasBack
      componentId={componentId}
      isLoadding={loading}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Empty />}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.line,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TextFnx color={colors.greyLight}>{get(item, 'email')}</TextFnx>
                <TextFnx size={16} color={colors.greyLight}>
                  {`${get(item, 'commissionAmount')} ${get(
                    item,
                    'paymentUnit',
                  )}`}
                </TextFnx>
              </View>
              <View>
                <TextFnx spaceTop={5} size={12} color={colors.description}>
                  {/* 2021-11-07 09:25:49 */}
                  {to_UTCDate(get(item, 'createdDate'), 'YYYY-MM-DD hh:mm:ss')}
                </TextFnx>
              </View>
            </View>
          );
        }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.05}
      />
    </Container>
  );
};

export default RoseDetails;

const styles = StyleSheet.create({});
