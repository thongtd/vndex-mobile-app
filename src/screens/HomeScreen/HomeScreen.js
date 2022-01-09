import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import Button from '../../components/Button/Button';
import {
  ADS_HISTORY_EXCHANGE_SCREEN,
  ADS_MY_ADVERTISENMENT_SCREEN,
  LOGIN_SCREEN,
  SETTING_SCREEN,
  STEP_1_BUY_SELL_SCREEN,
} from '../../navigation';
import {
  pushSingleHiddenTopBarApp,
  pushSingleScreenApp,
  showModal,
} from '../../navigation/Navigation';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import {Navigation} from 'react-native-navigation';
import {fontSize, IdNavigation} from '../../configs/constant';
import Banner from './components/Banner';
import colors from '../../configs/styles/colors';
import Layout from '../../components/Layout/Layout';
import Image from '../../components/Image/Image';
import TextFnx from '../../components/Text/TextFnx';
import ButtonIcon from '../../components/Button/ButtonIcon';
import icons from '../../configs/icons';
import Icon from '../../components/Icon';
import {useRef} from 'react';
import {get} from 'lodash';
import {Dimensions, StatusBar} from 'react-native';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
import {listenerEventEmitter, removeEventEmitter} from '../../configs/utils';
var flagMenu = true;
const HomeScreen = ({componentId}) => {
  const [ActiveSymbol, setActiveSymbol] = useState('AIFT');
  useEffect(() => {
    const listenerEmit = listenerEventEmitter('pushMyads', () => {
      pushSingleScreenApp(componentId, ADS_MY_ADVERTISENMENT_SCREEN, null, {
        topBar: {
          rightButtons: [
            {
              id: IdNavigation.PressIn.filterMyAdvertisement,
              icon: require('assets/icons/Filter.png'),
            },
          ],
        },
      });
    });

    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.menuLeft) {
            Navigation.mergeOptions(componentId, {
              sideMenu: {
                left: {
                  visible: true,
                },
              },
            });
          }

          if (buttonId == IdNavigation.PressIn.profile) {
            if (logged) {
              pushSingleScreenApp(componentId, SETTING_SCREEN);
            } else {
              pushSingleScreenApp(componentId, LOGIN_SCREEN);
            }

            // pushSingleScreenApp(componentId, TRANSACTION_HISTORY, null, {
            //   topBar: {
            //     rightButtons: [
            //       {
            //         id: IdNavigation.PressIn.filterTransaction,
            //         icon: require('assets/icons/Filter.png'),
            //       },
            //     ],
            //   },
            // });
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
      listenerEmit.remove();
    };
  }, []);
  const logged = useSelector(state => state.authentication.logged);
  return (
    <Container isScroll componentId={componentId} isTopBar isFooter title="P2P">
      <Banner />
      {/* {logged ? (
          <Button
            onSubmit={() => {
              pushSingleHiddenTopBarApp(componentId, SETTING_SCREEN);
            }}
            isSubmit
            textSubmit={'Thông tin tài khoản'}
          />
        ) : (
          <Button
            onSubmit={() => {
              pushSingleScreenApp(componentId, LOGIN_SCREEN);
            }}
            isSubmit
            textSubmit={'Login'}
          />
        )} */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: -20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '50%',
          }}>
          <Button
            isNormal
            width={75}
            title={'Mua'}
            height={40}
            colorTitle={colors.app.buy}
            bgButtonColor={colors.app.bgBuy}
          />
          <Button
            spaceHorizontal={10}
            isNormal
            spaceHorizontal={20}
            title={'Bán'}
            height={40}
            colorTitle={colors.app.sell}
            bgButtonColor={colors.app.bgSell}
          />
        </View>

        <Button
          isPlaceholder={false}
          // spaceVertical={10}
          spaceHorizontal={20}
          // width={100}
          // onInput={handleSelectSex}
          height={40}
          isInput
          iconRight="caret-down"
          iconLeft="globe-americas"
          placeholder={'VND'}
        />
        <ButtonIcon iconComponent={icons.icFilter} />
      </View>
      <View>
        <FlatList
          style={{
            borderBottomColor: colors.app.lineSetting,
            borderBottomWidth: 1,
          }}
          horizontal
          data={['AIFT', 'DIC', 'USDT', 'LTA']}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                },
                ActiveSymbol == item && {
                  borderBottomColor: colors.app.buy,
                  borderBottomWidth: 2,
                },
              ]}>
              <TextFnx
                weight={ActiveSymbol == item ? '700' : '400'}
                size={fontSize.f16}
                color={
                  ActiveSymbol == item
                    ? colors.app.buy
                    : colors.app.textContentLevel3
                }>
                {item}
              </TextFnx>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {[{}, {}, {}, {}, {}, {}, {}, {}, {}].map((item, index) => (
        <View
          style={{
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.app.lineSetting,
          }}>
          <Layout isSpaceBetween>
            <Layout>
              <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
                lutuananh94
              </TextFnx>
              <Icon iconComponent={icons.icTick} />
            </Layout>
            <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
              2125 lệnh | 99.07% hoàn tất
            </TextFnx>
          </Layout>
          <Layout isSpaceBetween isLineCenter>
            <View>
              <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                Giá
              </TextFnx>
              <TextFnx weight="500" color={colors.app.buy} size={fontSize.f20}>
                53,083.14{' '}
                <TextFnx
                  color={colors.app.textContentLevel3}
                  weight="400"
                  size={fontSize.f14}>
                  VND
                </TextFnx>
              </TextFnx>
            </View>
            <View>
              <Button
                spaceHorizontal={20}
                isNormal
                // width={175}
                onPress={() =>
                  pushSingleScreenApp(componentId, STEP_1_BUY_SELL_SCREEN)
                }
                title={'Mua USDT'}
                height={40}
                colorTitle={colors.app.buy}
                bgButtonColor={colors.app.bgBuy}
              />
            </View>
          </Layout>

          <Layout>
            <Layout type="column" spaceRight={10}>
              <TextFnx
                space={3}
                size={fontSize.f12}
                color={colors.app.textDisabled}>
                Khả dụng
              </TextFnx>
              <TextFnx
                space={3}
                size={fontSize.f12}
                color={colors.app.textDisabled}>
                Giới hạn
              </TextFnx>
            </Layout>
            <View
              style={{
                flex: 1,
              }}>
              <TextFnx space={3} size={fontSize.f12}>
                89.23 AIFT
              </TextFnx>
              <Layout isSpaceBetween>
                <TextFnx space={3} size={fontSize.f12}>
                  50,000,000 - 1,000,000,000 VND
                </TextFnx>
                <Layout>
                  <Image
                    source={icons.icMomo}
                    style={{
                      marginLeft: 5,
                    }}
                  />
                  <Image
                    source={icons.icMomo}
                    style={{
                      marginLeft: 5,
                    }}
                  />
                </Layout>
              </Layout>
            </View>
          </Layout>
        </View>
      ))}
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
