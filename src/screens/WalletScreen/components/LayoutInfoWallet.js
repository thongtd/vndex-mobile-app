import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  RefreshControl,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import TopBarWallet from '../../../components/TopBarWallet';
import TextFnx from '../../../components/Text/TextFnx';
import {
  pop,
  showModal,
  dismissAllModal,
  pushSingleScreenApp,
} from '../../../navigation/Navigation';
import {
  constant,
  fontSize,
  IdNavigation,
  spacingApp,
} from '../../../configs/constant';
import Container from '../../../components/Container';
import HeaderWalletScreen from './HeaderWalletScreen';
import Layout from '../../../components/Layout/Layout';
import Image from '../../../components/Image/Image';
import {
  get,
  isIos,
  isArray,
  size,
  formatCurrency,
  to_UTCDate,
  jwtDecode,
  listenerEventEmitter,
  createAction,
  toast,
  set,
  formatTrunc,
  CheckStepStatus,
  checkLang,
  CheckDisableStatus,
  getOneMonthAgoDate,
  getCurrentDate,
  removeEventEmitter,
} from '../../../configs/utils';
import colors from '../../../configs/styles/colors';
import icons from '../../../configs/icons';
import ButtonTypeWallet from '../../../components/Button/ButtonTypeWallet';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon';
import {SwipeListView} from 'react-native-swipe-list-view';
import Empty from '../../../components/Item/Empty';
import ItemHistorySwap from '../../SwapScreen/components/ItemHistorySwap';
import {useDispatch, useSelector} from 'react-redux';
import _, {isNaN, orderBy, uniqBy} from 'lodash';
import {
  GET_WITHDRAW_FIAT_LOG,
  GET_WITHDRAW_COIN_LOG,
  GET_DEPOSIT_COIN_LOG,
  GET_DEPOSIT_FIAT_LOG,
  GET_BALANCE_BY_CURRENCY_SUCCESS,
} from '../../../redux/modules/wallet/actions';
import {
  ALERT_ACCOUNT_ACTIVE,
  MODAL_ALERT,
  PICKER_SEARCH,
  DEPOSIT_COIN_SCREEN,
  DEPOSIT_FIAT_SCREEN,
  HISTORY_DEPOSIT_COIN_SCREEN,
  HISTORY_DEPOSIT_FIAT_SCREEN,
  WITHDRAW_COIN_SCREEN,
  WITHDRAW_FIAT_SCREEN,
  TRANSACTION_HISTORY,
} from '../../../navigation';
import {authService} from '../../../services/authentication.service';
import {WalletService} from '../../../services/wallet.service';
import ItemList from '../../../components/Item/ItemList';
import FilterHistorySwapScreen from '../../SwapScreen/childrensScreens/FilterHistorySwapScreen';
import DepsitSvg from 'assets/svg/deposit.svg';
import WithdrawSvg from 'assets/svg/withdraw.svg';
import {Navigation} from 'react-native-navigation';

var flagBtnId = true;
const LayoutInfoWallet = ({
  componentId,
  item,
  isCoinData,
  isHistoryTransaction,
}) => {
  const lang = useSelector(state => state.authentication.lang);
  const logged = useSelector(state => state.authentication.logged);
  const [IsActive, setIsActive] = useState('C');
  const cryptoWallet = useSelector(state => state.market.cryptoWallet);
  const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
  const [InfoCoin, setInfoCoin] = useState(item);
  const currencyList = useSelector(state => state.market.currencyList);
  const coinWithdrawLog = useSelector(state => state.wallet.coinWithdrawLog);
  const coinDepositLog = useSelector(state => state.wallet.coinDepositLog);
  const coinDepositLogLoadMore = useSelector(
    state => state.wallet.coinDepositLogLoadMore,
  );
  const fiatDepositLogLoadMore = useSelector(
    state => state.wallet.fiatDepositLogLoadMore,
  );
  const coinWithdrawLogLoadMore = useSelector(
    state => state.wallet.coinWithdrawLogLoadMore,
  );
  const fiatWithdrawLogLoadMore = useSelector(
    state => state.wallet.fiatWithdrawLogLoadMore,
  );
  useEffect(() => {
    console.log(HiddenShow, 'hiddeen tren show');
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.filterTransaction) {
            console.log(flagBtnId, 'hiddeen show');
            if (flagBtnId) {
              setHiddenShow(true);
              flagBtnId = false;
            } else {
              setHiddenShow(false);
              flagBtnId = true;
            }
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
    };
  }, [HiddenShow]);
  const [isCoin, setIsCoin] = useState(isCoinData);
  const fiatDepositLog = useSelector(state => state.wallet.fiatDepositLog);
  const fiatWithdrawLog = useSelector(state => state.wallet.fiatWithdrawLog);
  const [Source, setSource] = useState([]);
  const [Disabled, setDisabled] = useState(false);
  const [CurrencyActive, setCurrencyActive] = useState('BTC');
  const [UserId, setUserId] = useState('');
  const dispatcher = useDispatch();
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const twoFactorySerice = get(UserInfo, 'twoFactorService');
  const twoFactorEnable = get(UserInfo, 'twoFactorEnabled');
  const [UserSub, setUserSub] = useState('');
  const [InfoCurrency, setInfoCurrency] = useState('');
  const [HiddenShow, setHiddenShow] = useState(false);
  const [Page, setPage] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [Stop, setStop] = useState(false);
  const [InfoDataSearch, setInfoDataSearch] = useState('');
  // var Page = 1;
  // const [Item, setItem] = useState(item)
  useEffect(() => {
    console.log(fiatWithdrawLog, 'fiatWithdrawLog');

    if (isCoin && IsActive === 'C') {
      setSource(coinDepositLog);
    } else if (isCoin && IsActive === 'F') {
      setSource(coinWithdrawLog);
    }
  }, [
    isHistoryTransaction,
    coinDepositLogLoadMore,
    coinWithdrawLog,
    coinDepositLog,
    fiatDepositLog,
    fiatWithdrawLog,
    IsActive,
    isCoin,
  ]);
  useEffect(() => {
    dispatcher(createAction(GET_BALANCE_BY_CURRENCY_SUCCESS, {}));
    WalletService.getWalletBalanceByCurrency(
      get(UserInfo, 'id'),
      CurrencyActive,
    ).then(res => {
      setInfoCurrency(res);
    });
  }, [CurrencyActive]);
  useEffect(() => {
    onRefresh();
    setPage(1);
    setInfoDataSearch('');
    setStop(false);
    setLoading(true);
    setSource([]);
  }, [IsActive]);
  useEffect(() => {
    if (isArray(cryptoWallet) && size(cryptoWallet) > 0) {
      let cryptoFilter = cryptoWallet.filter(
        (crypto, index) => get(crypto, 'symbol') == get(InfoCoin, 'symbol'),
      );
      if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
        setInfoCoin(cryptoFilter[0]);
        setCurrencyActive(get(cryptoFilter[0], 'symbol'));
      }
    }
  }, [cryptoWallet]);

  const onRefresh = (loadMore = false) => {
    // setDisabled(true);
    dispatcher(
      createAction(GET_WITHDRAW_COIN_LOG, {
        UserId,
        pageIndex: 1,
        loadMore: loadMore,
      }),
    );

    dispatcher(
      createAction(GET_DEPOSIT_COIN_LOG, {
        UserId,
        pageIndex: 1,
        loadMore: loadMore,
      }),
    );
  };

  useEffect(() => {
    setUserId(get(UserInfo, 'id'));
    setUserSub(get(UserInfo, 'email'));

    listenerEventEmitter('doneWCoinLog', () => {
      setDisabled(false);
      setLoading(false);
    });
    listenerEventEmitter('doneDFiatLog', () => {
      setLoading(false);
      setDisabled(false);
    });
    listenerEventEmitter('doneDCoinLog', () => {
      console.log('done Dcoin Log');
      setLoading(false);
      setDisabled(false);
    });
    listenerEventEmitter('stopDCoinLog', () => {
      console.log('stopDCoinLog Dcoin Log');
      setLoading(false);
      setDisabled(false);
      setStop(true);
    });
    listenerEventEmitter('doneWFiatLog', () => {
      setLoading(false);
      setDisabled(false);
    });
  }, []);

  useEffect(() => {
    // listenerEventEmitter('pushData', (data) => {

    //     let SourceData = [...Source,...data]
    //     console.log(SourceData,"dataPush");
    //     setLoading(false);
    //     setSource(SourceData)
    // })
    return () => {
      // removeEventEmitter('pushData');
    };
  }, [Source]);
  const onCancel = (data, rowMap) => {
    var passProps;
    var sessionId;
    var verifyCode;

    var dataSubmit = {
      sessionId,
      verifyCode,
      accId: UserId,
      requestId: '',
    };
    if (
      twoFactorEnable &&
      twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA
    ) {
      passProps = {
        placeholder: '2FA_CODE'.t(),
        isResend: false,
        isIconLeft: false,
        title: 'Cancel',
        textFirst: 'Please enter 2FA code'.t(),
      };
    } else if (
      twoFactorEnable &&
      twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA
    ) {
      passProps = {
        onChangeText: text => {
          verifyCode = text;
        },
        onSubmit: () => {
          set(dataSubmit, 'verifyCode', verifyCode);
          set(dataSubmit, 'sessionId', sessionId);
          set(dataSubmit, 'requestId', get(data, 'item.id'));
          WalletService.cancelWithdrawCoin(dataSubmit).then(res => {
            console.log(dataSubmit, res, 'reas');
            if (res) {
              if (get(res, 'status')) {
                toast(get(res, 'message'));
                return dismissAllModal()
              } else {
                return toast(get(res, 'message'));
              }
            } else {
              
              return toast(get(res, 'message'));
            }
          });
          // console.log(dataSubmit,"dataSubmit");
        },
        placeholder: '2FA_CODE'.t(),
        isResend: true,
        isIconLeft: true,
        onResend: () => {
          authService.getTwoFactorEmailCode(UserSub).then(res => {
            sessionId = get(res, 'data.sessionId');
            // console.log(res,"val ka")
          });
        },
        title: 'Cancel',
        textFirst: `${'The 2fa code has been sent to email'.t()} ${UserSub}`,
      };
    } else {
      rowMap[data.index].closeRow();
      return toast('Please enable 2FA code'.t());
    }
    showModal(MODAL_ALERT, passProps, true);

    rowMap[data.index].closeRow();
  };
  const onSelectCoin = () => {
    if (isCoin) {
      let data = orderBy(
        uniqBy(cryptoWallet, 'currency'),
        ['currency'],
        ['asc'],
      );
      let propsData = getPropData(
        data,
        'image',
        'symbol',
        CurrencyActive,
        item => handleActive(item),
      );
      showModal(PICKER_SEARCH, propsData);
    } else {
      let data = orderBy(
        uniqBy(fiatsWallet, 'currency'),
        ['currency'],
        ['asc'],
      );
      let propsData = getPropData(
        data,
        'image',
        'symbol',
        CurrencyActive,
        item => handleActive(item),
      );
      showModal(PICKER_SEARCH, propsData);
    }
  };
  const handleActive = item => {
    setCurrencyActive(get(item, 'symbol'));
    setInfoCoin(item);
    dismissAllModal();
  };
  const onDeposit = InfoCoin => {
    if (isCoin) {
      pushSingleScreenApp(componentId, DEPOSIT_COIN_SCREEN, {
        data: InfoCoin,
      });
    } else {
      pushSingleScreenApp(componentId, DEPOSIT_FIAT_SCREEN, {
        data: InfoCoin,
      });
    }
  };
  const onWithdraw = () => {
    if (isCoin) {
      pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
        data: InfoCoin,
      });
    } else {
      pushSingleScreenApp(componentId, WITHDRAW_FIAT_SCREEN, {
        data: InfoCoin,
      });
    }
  };
  const onHistory = item => {
    if (IsActive === 'C') {
      pushSingleScreenApp(componentId, HISTORY_DEPOSIT_COIN_SCREEN, {
        data: item,
      });
    } else if (IsActive === 'F') {
      var extraData = {};

      if (
        isArray(get(item, 'toExtraFields')) &&
        size(get(item, 'toExtraFields'))
      ) {
        get(item, 'toExtraFields').map((extra, index) => {
          if (get(extra, 'value')) {
            let fieldName = get(
              extra,
              `localizations.${checkLang(lang)}.FieldName`,
            );
            set(extraData, fieldName, {
              title: fieldName,
              value: get(extra, 'value'),
            });
          }
        });
      }
      pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
        step: CheckStepStatus(get(item, 'statusLable')),
        data: item,
        dataInfo: {
          amount: {
            title: 'AMOUNT'.t(),
            value: formatTrunc(
              currencyList,
              get(item, 'amount'),
              get(item, 'symbol'),
            ),
          },
          address: {
            title: 'RECEIVED_ADDRESS'.t(),
            value: get(item, 'toAddress'),
          },
          ...extraData,
        },
        isHistory: true,
        requestId: get(item, 'id'),
      });
    }
  };
  const renderFooter = () => {
    if (!Loading) return null;
    return <ActivityIndicator style={{color: colors.text}} />;
  };
  const handleLoadMore = () => {
    console.log(Page, 'cuoi');

    if (!Loading && !Stop) {
      setPage(Page + 1);
      // method for API call
    }
  };
  useEffect(() => {
    fetchData(Page, InfoDataSearch);
    return () => {};
  }, [Page, InfoDataSearch]);
  const fetchData = (
    page = 1,
    data = {
      fromDate: '',
      toDate: '',
      walletCurrency: '',
      status: '',
    },
  ) => {
    setLoading(true);
    if (IsActive === 'C') {
      dispatcher(
        createAction(GET_DEPOSIT_COIN_LOG, {
          UserId,
          pageIndex: page,
          loadMore: true,
          fromDate: data.startDate,
          toDate: data.endDate,
          walletCurrency: data.symbol,
          status: data.status,
        }),
      );
    } else if (IsActive === 'F') {
      dispatcher(
        createAction(GET_WITHDRAW_COIN_LOG, {
          UserId,
          pageIndex: page,
          loadMore: true,
          fromDate: data.startDate,
          toDate: data.endDate,
          walletCurrency: data.symbol,
          status: data.status,
        }),
      );
    }
  };
  const onSubmitSearch = data => {
    fetchData(1, data);
    setInfoDataSearch(data);
    setHiddenShow(false);
    flagBtnId = true;
  };
  const onActiveWalletType = active => {
    if (get(active, 'value') == 1) {
      setIsCoin(false);
    } else {
      setIsCoin(true);
    }
  };
  return (
    <Container
      hasBack
      componentId={componentId}
      isFilter={HiddenShow}
      isTopBar
      title={'Transaction History'.t()}
      nameRight="filter"
      // isTopBar={isHistoryTransaction ? true : false}
    >
      {isHistoryTransaction && (
        <FilterHistorySwapScreen
          onSubmitSearch={onSubmitSearch}
          isHistoryTransaction
          HiddenShow={HiddenShow}
          startDate={{
            show: getOneMonthAgoDate(true),
            api: getOneMonthAgoDate(),
          }}
          endDate={{show: getCurrentDate(true), api: getCurrentDate()}}
          onHiddenShow={() => {
            setHiddenShow(false);
            flagBtnId = true;
          }}
          onActiveWalletType={onActiveWalletType}
        />
      )}

      {!isHistoryTransaction && (
        <>
          <View
            style={{
              backgroundColor: colors.app.backgroundLevel2,
              paddingHorizontal: 16,
              paddingBottom: 16,
              borderRadius: 8,
            }}>
            <Layout
              isLineCenter
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: colors.app.lineSetting,
                marginVertical: 15,
              }}>
              <Image
                source={{uri: get(item, 'images')}}
                style={{width: 32, height: 32, marginRight: 18}}
              />
              <View>
                <TextFnx
                  size={fontSize.f16}
                  weight="700"
                  //   spaceTop={10}
                  color={colors.subText}>
                  {get(item, 'symbol')}
                </TextFnx>
                <TextFnx space={10} weight="700" color={colors.buy} size={21}>
                  {`${formatCurrency(get(item, 'available') + get(item, 'pending'),get(item, 'symbol'),currencyList)}`}
                </TextFnx>
              </View>
            </Layout>
            <View>
              <Layout isSpaceBetween>
                <TextFnx space={3} color={colors.app.textContentLevel3}>
                  Khả dụng
                </TextFnx>
                <TextFnx>{`${formatCurrency(get(item, 'available'),get(item, 'symbol'),currencyList)}`}</TextFnx>
              </Layout>
              <Layout isSpaceBetween>
                <TextFnx color={colors.app.textContentLevel3} space={3}>
                  Đang đặt lệnh
                </TextFnx>
                <TextFnx>{`${formatCurrency(get(item, 'pending'),get(item, 'symbol'),currencyList)}`}</TextFnx>
              </Layout>
            </View>
          </View>
          <Button
            spaceVertical={20}
            isReverse
            onSubmit={() => onWithdraw(item)}
            onClose={() => onDeposit(item)}
            isSubmit
            isClose
            textSubmit={'WITHDRAW'.t()}
            textClose={'DEPOSIT'.t()}
            colorTitleClose={colors.black}
            bgButtonColor={colors.app.yellowHightlight}
            iconLeftSubmit={<WithdrawSvg />}
            iconLeftClose={<DepsitSvg />}
          />
        </>
      )}

      <View
        style={{
          backgroundColor: colors.app.backgroundLevel2,
          marginHorizontal: -spacingApp,
          paddingHorizontal: spacingApp,
          paddingTop: 20,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flex:1
        }}>
        <Layout isSpaceBetween>
          <ButtonTypeWallet
            title1={'Deposits'.t()}
            title2={'Withdrawal'.t()}
            style={[{marginBottom: 10}]}
            IsActive={IsActive}
            onIsActive={active => {
              setIsActive(active);
            }}
          />
          {/* {!isHistoryTransaction && <Button
                    onTitle={()=>pushSingleScreenApp(componentId,TRANSACTION_HISTORY)}
                    isTitle
                    title={
                        <>
                            <TextFnx isDart value={`${"More".t()} `} />
                            <Icon name="chevron-right" />
                        </>
                    }
                    color={colors.text}
                    style={[{
                        marginTop: 55,
                        marginBottom: 10
                    }]}
                />} */}
        </Layout>
        {/* <SwipeListView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={Disabled} onRefresh={onRefresh} />
          }
          scrollEnabled
          // contentContainerStyle={(!logged || size(Source) == 0) && {
          //     flex: 1
          // }}
          ListEmptyComponent={<Empty />}
          // data={eval(checkDataShowLoadMore(isCoin, IsActive)) }
          data={eval(checkDataShowLoadMore(isCoin, IsActive)) }
          renderItem={(data, rowMap) => {
            return (
              <View
                style={{
                  paddingVertical: 5,
                }}>
                <TouchableOpacity
                  onPress={() => onHistory(get(data, 'item'), rowMap)}>
                  <ItemHistorySwap
                    titleStart={to_UTCDate(
                      get(data, 'item.createdDate'),
                      'DD/MM/YYYY',
                    )}
                    titleCenter={'Status'.t()}
                    valueStart={to_UTCDate(
                      get(data, 'item.createdDate'),
                      'hh:mm:ss',
                    )}
                    valueCenter={get(data, 'item.statusLable')}
                    titleEnd={get(data, 'item.currency')}
                    valueEnd={formatCurrency(get(data, 'item.amount'),get(data, 'item.currency'),currencyList)}
                    style={{
                      backgroundColor: colors.navigation,
                      paddingHorizontal: 15,
                      borderBottomWidth: 0.5,
                      borderBottomColor: colors.app.lineSetting,
                    }}
                    isWallet
                    key={get(data, 'item.createdDate')}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          renderHiddenItem={(data, rowMap) => {
            if (!CheckDisableStatus(get(data, 'item.status'))) {
              return (
                <TouchableOpacity onPress={() => onCancel(data, rowMap)}>
                  <View style={[stylest.rowBack]}>
                    <Icon
                      color={colors.background}
                      size={19}
                      name={'trash-alt'}
                    />
                  </View>
                </TouchableOpacity>
              );
            } else {
              return null;
            }
          }}
          stopRightSwipe={-100}
          disableRightSwipe
          disableLeftSwipe={IsActive === 'C' ? true : false}
          rightOpenValue={-60}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={isHistoryTransaction ? renderFooter : null}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            // console.log('cuoi roi');
            if (isHistoryTransaction) {
              handleLoadMore();
            }
          }}
        /> */}
      </View>
    </Container>
  );
};

const ButtonWithdraw = ({
  image = icons.withdraw,
  value = 'Withdrawal'.t(),
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={stylest.btn}>
      <Image source={image} style={{width: 30, height: 30}} />
      <TextFnx spaceTop={5} value={value} color={colors.statusBar} />
    </View>
  </TouchableOpacity>
);
const stylest = StyleSheet.create({
  layoutBtn: {
    position: 'absolute',
    top: -35,
    justifyContent: 'center',
    width: '100%',
  },
  btn: {
    width: 100,
    height: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  icons: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: colors.red,
    // flex: 1,
    width: 57,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    marginBottom: -15,
    marginTop: 5,
  },
});

const getPropData = (data, image, value, Active, cb) => {
  return {
    data: [...data],
    renderItem: ({item, key}) => {
      return (
        <ItemList
          customView={
            <Layout>
              <Image
                source={{
                  uri: get(item, image),
                }}
                style={{width: 17, height: 17}}
              />
              <TextFnx isDart weight={'500'} value={`  ${get(item, value)}`} />
            </Layout>
          }
          onPress={() => cb(item)}
          value={get(item, value)}
          checked={get(item, value) === Active}
        />
      );
    },
    keywords: [value],
  };
};
const checkDataShowLoadMore = (isCoin, IsActive) => {
  if (IsActive === 'C') {
    return 'coinDepositLogLoadMore';
  } else if (IsActive === 'F') {
    return 'coinWithdrawLogLoadMore';
  }
};
export default LayoutInfoWallet;
