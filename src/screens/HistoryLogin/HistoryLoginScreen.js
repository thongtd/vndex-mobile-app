import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import {authService} from '../../services/authentication.service';
import {get, toast, to_UTCDate} from '../../configs/utils';
import {useSelector} from 'react-redux';
import moment from 'moment';

const HistoryLoginScreen = ({componentId}) => {
  const userInfo = useSelector(state => state.authentication.userInfo);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    handleGetLastLogin(get(userInfo, 'email'));
    return () => {};
  }, [userInfo]);
  const handleGetLastLogin = email => {
    authService
      .getLastLogin(email)
      .then(res => {
        setData(get(res, 'data'));
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        toast('Can not get data for history login')
      });
  };

  return (
    <Container 
    isLoadding={loading}
    hasBack componentId={componentId} title={'History Login'.t()}>
      {data.map((item, index) => {
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
              <TextFnx color={colors.greyLight}>
                {get(item, 'ipAddress')}
              </TextFnx>
              <TextFnx size={16} color={colors.greyLight}>
                {get(item, 'location') || get(item, 'action')}
              </TextFnx>
            </View>
            <View>
              <TextFnx spaceTop={5} size={12} color={colors.description}>
                {/* 2021-11-07 09:25:49 */}
                {to_UTCDate(get(item, 'createdDate'),'YYYY-MM-DD hh:mm:ss')}
              </TextFnx>
            </View>
          </View>
        );
      })}
    </Container>
  );
};

export default HistoryLoginScreen;

const styles = StyleSheet.create({});
