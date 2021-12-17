import {StyleSheet, Text, View} from 'react-native';
import React,{useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import { authService } from '../../services/authentication.service';
import { get, toast } from '../../configs/utils';
import { useSelector } from 'react-redux';
import moment from 'moment';

const HistoryLoginScreen = ({componentId}) => {
    const userInfo = useSelector(state => state.authentication.userInfo);
    const [data, setData] = useState([])
    useEffect(() => {
        handleGetLastLogin(get(userInfo,"email"))
        return () => {
            
        }
    }, [userInfo])
    const handleGetLastLogin = (email)=>{
        
        authService.getLastLogin(email).then(res => setData(get(res,"data"))).catch(err => toast("Can not get data for history login"));
    }
    

  return (
    <Container hasBack componentId={componentId} title={'History Login'.t()}>
      {data.map((item, index)=>{
          return (<View
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
              <TextFnx color={colors.greyLight}>{get(item,"ipAddress") || "117.5.152.151"}</TextFnx>
              <TextFnx size={16} color={colors.greyLight}>
                {get(item,"location") || "Hanoi, Vietnam"}
              </TextFnx>
            </View>
            <View>
              <TextFnx spaceTop={5} size={12} color={colors.description}>
                {/* 2021-11-07 09:25:49 */}
                {moment(get(item,"createdDate")).format("YYYY-MM-DD hh:mm:ss")}
              </TextFnx>
            </View>
          </View>);
      })}
      
    </Container>
  );
};

export default HistoryLoginScreen;

const styles = StyleSheet.create({});
