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
import {
  BUY,
  constant,
  fontSize,
  IdNavigation,
  SELL,
} from '../../configs/constant';
import Banner from './components/Banner';
import colors from '../../configs/styles/colors';
import Layout from '../../components/Layout/Layout';
import Image from '../../components/Image/Image';
import TextFnx from '../../components/Text/TextFnx';
import ButtonIcon from '../../components/Button/ButtonIcon';
import icons from '../../configs/icons';
import Icon from '../../components/Icon';
import {useRef} from 'react';
import {get, size} from 'lodash';
import {Dimensions, StatusBar} from 'react-native';
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
import {
  formatCurrency,
  listenerEventEmitter,
  removeEventEmitter,
} from '../../configs/utils';
import {useActionsP2p} from '../../redux';
import { useDispatch } from 'react-redux';
var flagMenu = true;
const HomeScreen = ({componentId}) => {
  const dispatch = useDispatch();
  const [ActiveSymbol, setActiveSymbol] = useState('');
  const [ActiveType, setActiveType] = useState('B');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (size(get(tradingMarket, 'assets')) > 0) {
      setActiveSymbol(get(tradingMarket, 'assets')[0]);
      
    }

    return () => {};
  }, [tradingMarket]);
  const tradingMarket = useSelector(state => state.p2p.tradingMarket);
  const advertisments = useSelector(state => state.p2p.advertisments);
  console.log(advertisments, 'advertisments');
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
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
      listenerEmit.remove();
    };
  }, []);
  
 useEffect(() => {
   let evDone = listenerEventEmitter('doneApi',()=>{
    setIsLoading(false);
   });
   if(ActiveSymbol){
    useActionsP2p(dispatch).handleGetAdvertisments({
      pageIndex: 1,
      pageSize: 15,
      side: ActiveType== BUY?SELL:BUY,
      coinSymbol: ActiveSymbol ,
    });
    setIsLoading(true);
   }
   
 
   return () => {
    evDone.remove();
   }
 }, [dispatch,ActiveType,ActiveSymbol])
  const logged = useSelector(state => state.authentication.logged);
  const currencyList = useSelector(state => state.market.currencyList);
  return (
    <Container
    isLoadding={isLoading}
    isScroll componentId={componentId} isTopBar isFooter title="P2P">
      <Banner />
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
            onPress={() => setActiveType(BUY)}
            width={75}
            title={'Mua'}
            height={40}
            colorTitle={ActiveType == BUY ? colors.app.buy : colors.text}
            bgButtonColor={
              ActiveType == BUY ? colors.app.bgBuy : colors.app.backgroundLevel1
            }
          />
          <Button
            onPress={() => setActiveType(SELL)}
            isNormal
            width={75}
            title={'Bán'}
            height={40}
            colorTitle={ActiveType == SELL ? colors.app.sell : colors.text}
            bgButtonColor={
              ActiveType == SELL
                ? colors.app.bgSell
                : colors.app.backgroundLevel1
            }
          />
        </View>

        <Button
          isPlaceholder={false}
          spaceHorizontal={20}
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
          data={get(tradingMarket, 'assets') || []}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setActiveSymbol(item)}
              style={[
                {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                },
                ActiveSymbol == item && {
                  borderBottomColor:
                    ActiveType == BUY ? colors.app.buy : colors.app.sell,
                  borderBottomWidth: 2,
                },
              ]}>
              <TextFnx
                weight={ActiveSymbol == item ? '700' : '400'}
                size={fontSize.f16}
                color={
                  ActiveSymbol == item
                    ? ActiveType == BUY
                      ? colors.app.buy
                      : colors.app.sell
                    : colors.app.textContentLevel3
                }>
                {item}
              </TextFnx>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {(advertisments || []).map((item, index) => (
        <View
          key={`data-${index}`}
          style={{
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.app.lineSetting,
          }}>
          <Layout isSpaceBetween>
            <Layout>
              <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
                {`${get(item, 'traderInfo.emailAddress')}`}
              </TextFnx>
              {get(item, 'requiredKyc') && (
                <Icon iconComponent={icons.icTick} />
              )}
            </Layout>
            <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
              {get(item, 'traderInfo.totalCompleteOrder')} lệnh |{' '}
              {get(item, 'traderInfo.completePercent')}% hoàn tất
            </TextFnx>
          </Layout>
          <Layout isSpaceBetween isLineCenter>
            <View>
              <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                Giá
              </TextFnx>
              <TextFnx
                weight="500"
                color={
                  get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                }
                size={fontSize.f20}>
                {formatCurrency(
                  get(item, 'price'),
                  get(item, 'paymentUnit'),
                  currencyList,
                )}{' '}
                <TextFnx
                  color={colors.app.textContentLevel3}
                  weight="400"
                  size={fontSize.f14}>
                  {get(item, 'paymentUnit')}
                </TextFnx>
              </TextFnx>
            </View>
            <View>
              <Button
                spaceHorizontal={20}
                isNormal
                // width={175}
                onPress={() =>
                  pushSingleScreenApp(componentId, STEP_1_BUY_SELL_SCREEN,{
                    item
                  })
                }
                title={
                  get(item, 'side') == SELL
                    ? `Mua ${get(item, 'symbol')}`
                    : `Bán ${get(item, 'symbol')}`
                }
                height={40}
                colorTitle={
                  get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                }
                bgButtonColor={
                  get(item, 'side') == SELL
                    ? colors.app.bgBuy
                    : colors.app.bgSell
                }
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
                {formatCurrency(
                  get(item, 'quantity'),
                  get(item, 'symbol'),
                  currencyList,
                )}{' '}
                {get(item, 'symbol')}
              </TextFnx>
              <Layout isSpaceBetween>
                <TextFnx space={3} size={fontSize.f12}>
                  {formatCurrency(
                    get(item, 'minOrderAmount'),
                    get(item, 'paymentUnit'),
                    currencyList,
                  )}{' '}
                  -{' '}
                  {formatCurrency(
                    get(item, 'maxOrderAmount'),
                    get(item, 'paymentUnit'),
                    currencyList,
                  )}{' '}
                  {get(item, 'paymentUnit')}
                </TextFnx>

                <Layout>
                  {(get(item, 'paymentMethods') || []).map((it, ind) => {
                    if (get(it, 'code') == constant.CODE_PAYMENT_METHOD.MOMO) {
                      return (<Image
                        source={icons.icMomo}
                        style={{
                          marginLeft: 5,
                        }}
                      />);
                    } else if(get(it, 'code') == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER) {
                      return (<Image
                        source={icons.icBank}
                        style={{
                          marginLeft: 5,
                        }}
                      />);
                    }
                  })}
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
