import React, {useState, useEffect} from 'react';
import {
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
import {constant, IdNavigation} from '../../../configs/constant';
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
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
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
  ALERT_NOTICE_PASSWORD,
} from '../../../navigation';
import {authService} from '../../../services/authentication.service';
import {WalletService} from '../../../services/wallet.service';
import ItemList from '../../../components/Item/ItemList';
import FilterHistorySwapScreen from '../../SwapScreen/childrensScreens/FilterHistorySwapScreen';
import DepsitSvg from 'assets/svg/deposit.svg';
import WithdrawSvg from 'assets/svg/withdraw.svg';
import { Navigation } from 'react-native-navigation';

const LayoutInfoWallet = ({
  componentId,
  item,
  isCoinData,
  isHistoryTransaction,
  title
}) => {
  const lang = useSelector(state => state.authentication.lang);
  const logged = useSelector(state => state.authentication.logged);
  const [IsActive, setIsActive] = useState('C');
  const cryptoWallet = useSelector(state => state.wallet.cryptoWallet);
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
  const [Page, setPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [InfoDataSearch, setInfoDataSearch] = useState('');
  // var Page = 1;
  // const [Item, setItem] = useState(item)
  // useEffect(() => {
  //   // console.log(get(InfoCoin,"pending"), 'fiatWithdrawLog');

  //   if (isCoin && IsActive === 'C') {
  //     setSource(coinDepositLog);
  //   } else if (isCoin && IsActive === 'F') {
  //     setSource(coinWithdrawLog);
  //   } else if (!isCoin && IsActive === 'C') {
  //     setSource(fiatDepositLog);
  //   } else if (!isCoin && IsActive === 'F') {
  //     setSource(fiatWithdrawLog);
  //   }
  // }, [
  //   isHistoryTransaction,
  //   coinDepositLogLoadMore,
  //   coinWithdrawLog,
  //   coinDepositLog,
  //   fiatDepositLog,
  //   fiatWithdrawLog,
  //   IsActive,
  //   isCoin,
  // ]);
  
  useEffect(() => {
    const navigationButtonEventListener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if(buttonId == IdNavigation.PressIn.filterTransaction){
        console.log(buttonId,"buttonId2");
        showModal(ALERT_NOTICE_PASSWORD);
      }
    });
    return () => {
      navigationButtonEventListener.remove();
    }
  }, [])
  useEffect(() => {
    // dispatcher(createAction(GET_BALANCE_BY_CURRENCY_SUCCESS, {}));
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
  }, [IsActive]);
  // useEffect(() => {
  //   if (isArray(cryptoWallet) && size(cryptoWallet) > 0) {
  //     let cryptoFilter = cryptoWallet.filter(
  //       (crypto, index) => get(crypto, 'currency') == get(InfoCoin, 'currency'),
  //     );
  //     if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
  //       setInfoCoin(cryptoFilter[0]);
  //       setCurrencyActive(get(cryptoFilter[0], 'currency'));
  //     }
  //   }
  //   if (isArray(fiatsWallet) && size(fiatsWallet) > 0) {
  //     let cryptoFilter = fiatsWallet.filter(
  //       (crypto, index) => get(crypto, 'currency') == get(InfoCoin, 'currency'),
  //     );
  //     if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
  //       setInfoCoin(cryptoFilter[0]);
  //       setCurrencyActive(get(cryptoFilter[0], 'currency'));
  //     }
  //   }
  // }, [cryptoWallet, fiatsWallet]);

  const onRefresh = (loadMore = false) => {
    // setDisabled(true);
    dispatcher(
      createAction(GET_WITHDRAW_COIN_LOG, {
        UserId:get(UserInfo, 'id'),
        pageIndex: 1,
        loadMore: loadMore,
      }),
    );
    dispatcher(
      createAction(GET_DEPOSIT_COIN_LOG, {
        UserId:get(UserInfo, 'id'),
        pageIndex: 1,
        loadMore: loadMore,
      }),
    );
  };

  useEffect(() => {
    jwtDecode().then(user => {
      if (get(user, 'UserId')) {
        setUserId(get(user, 'UserId'));
        setUserSub(get(user, 'Username'));
      }
    });
  }, []);
  // useEffect(() => {
  //   // listenerEventEmitter('pushData', (data) => {

  //   //     let SourceData = [...Source,...data]
  //   //     console.log(SourceData,"dataPush");
  //   //     setLoading(false);
  //   //     setSource(SourceData)
  //   // })
  //   return () => {
  //     removeEventEmitter('pushData');
  //   };
  // }, [Source]);
  const onCancel = (data, rowMap) => {
    var passProps;
    var sessionId;
    var verifyCode;
    
      var dataSubmit = {
        sessionId,
        verifyCode,
        accId: get(UserInfo, 'id'),
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
              if (res) {
                if (get(res, 'status')) {
                  return toast(get(res, 'message'));
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
  // const onSelectCoin = () => {
  //   if (isCoin) {
  //     let data = orderBy(
  //       uniqBy(cryptoWallet, 'currency'),
  //       ['currency'],
  //       ['asc'],
  //     );
  //     let propsData = getPropData(
  //       data,
  //       'image',
  //       'currency',
  //       CurrencyActive,
  //       item => handleActive(item),
  //     );
  //     showModal(PICKER_SEARCH, propsData);
  //   } else {
  //     let data = orderBy(
  //       uniqBy(fiatsWallet, 'currency'),
  //       ['currency'],
  //       ['asc'],
  //     );
  //     let propsData = getPropData(
  //       data,
  //       'image',
  //       'currency',
  //       CurrencyActive,
  //       item => handleActive(item),
  //     );
  //     showModal(PICKER_SEARCH, propsData);
  //   }
  // };
  // const handleActive = item => {
  //   setCurrencyActive(get(item, 'currency'));
  //   setInfoCoin(item);
  //   dismissAllModal();
  // };
  const onDeposit = InfoCoin => {
    pushSingleScreenApp(componentId, DEPOSIT_COIN_SCREEN, {
      data: InfoCoin,
    });
  };
  const onWithdraw = (InfoCoin) => {
    pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
      data: InfoCoin,
    });
  };
  // const onHistory = item => {
  //   if (isCoin && IsActive === 'C') {
  //     pushSingleScreenApp(componentId, HISTORY_DEPOSIT_COIN_SCREEN, {
  //       data: item,
  //     });
  //   } else if (!isCoin && IsActive === 'C') {
  //     pushSingleScreenApp(componentId, HISTORY_DEPOSIT_FIAT_SCREEN, {
  //       InfoBank: item,
  //     });
  //   } else if (isCoin && IsActive === 'F') {
  //     var extraData = {};

  //     if (
  //       isArray(get(item, 'toExtraFields')) &&
  //       size(get(item, 'toExtraFields'))
  //     ) {
  //       get(item, 'toExtraFields').map((extra, index) => {
  //         if (get(extra, 'value')) {
  //           let fieldName = get(
  //             extra,
  //             `localizations.${checkLang(lang)}.FieldName`,
  //           );
  //           set(extraData, fieldName, {
  //             title: fieldName,
  //             value: get(extra, 'value'),
  //           });
  //         }
  //       });
  //     }
  //     pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
  //       step: CheckStepStatus(get(item, 'statusLable')),
  //       data: item,
  //       dataInfo: {
  //         amount: {
  //           title: 'AMOUNT'.t(),
  //           value: formatTrunc(
  //             currencyList,
  //             get(item, 'amount'),
  //             get(item, 'currency'),
  //           ),
  //         },
  //         address: {
  //           title: 'RECEIVED_ADDRESS'.t(),
  //           value: get(item, 'toAddress'),
  //         },
  //         ...extraData,
  //       },
  //       isHistory: true,
  //       requestId: get(item, 'id'),
  //     });
  //   } else {
  //     pushSingleScreenApp(componentId, WITHDRAW_FIAT_SCREEN, {
  //       step: CheckStepStatus(get(item, 'statusLable')),
  //       data: {...item, currency: get(item, 'walletCurrency')},
  //       dataInfo: {
  //         amount: {
  //           title: 'AMOUNT'.t(),
  //           value: formatTrunc(
  //             currencyList,
  //             get(item, 'amount'),
  //             get(item, 'currency'),
  //           ),
  //         },
  //         bank: {
  //           title: 'BANK_NAME'.t(),
  //           value: get(item, 'bankName'),
  //         },
  //         branch: {
  //           title: 'BRACH_NAME'.t(),
  //           value: get(item, 'bankBranchName'),
  //         },
  //         nameBankAccount: {
  //           title: 'RECEIVING_BANK_ACCOUNT_NAME'.t(),
  //           value: get(item, 'bankAccountName'),
  //         },
  //         numberBankAccount: {
  //           title: 'RECEIVING_BANK_ACCOUNT_NO'.t(),
  //           value: get(item, 'bankAccountNo'),
  //         },
  //         amount: {
  //           title: 'AMOUNT'.t(),
  //           value: formatTrunc(
  //             currencyList,
  //             get(item, 'amount'),
  //             get(item, 'currency'),
  //           ),
  //         },
  //       },
  //       isHistory: true,
  //       requestId: get(item, 'id'),
  //     });
  //   }
  // };
  // const renderFooter = () => {
  //   if (!Loading) return null;
  //   return <ActivityIndicator style={{color: '#000'}} />;
  // };
  // const handleLoadMore = () => {
  //   console.log(Page, 'cuoi');

  //   if (!Loading) {
  //     setPage(Page + 1);
  //     // method for API call
  //   }
  // };
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
          UserId:get(UserInfo,"id"),
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
          UserId:get(UserInfo,"id"),
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
  // const onSubmitSearch = data => {
  //   fetchData(1, data);
  //   setInfoDataSearch(data);
  //   setHiddenShow(false);
  // };
  // const onActiveWalletType = active => {
  //   if (get(active, 'value') == 1) {
  //     setIsCoin(false);
  //   } else {
  //     setIsCoin(true);
  //   }
  // };
  // console.log(get(InfoCoin,"available"),"InfoCoin");
  return (
    <Container
      onClickRight={() => setHiddenShow(!HiddenShow)}
      componentId={componentId}
      isTopBar
      title={title}
      // nameRight="filter"
    >
     
      {/* {isHistoryTransaction && <FilterHistorySwapScreen
                onSubmitSearch={onSubmitSearch}
                isHistoryTransaction
                HiddenShow={HiddenShow}
                startDate={{ show: getOneMonthAgoDate(true), api: getOneMonthAgoDate() }}
                endDate={{ show: getCurrentDate(true), api: getCurrentDate() }}
                onHiddenShow={() => setHiddenShow(!HiddenShow)}
                
                onActiveWalletType={onActiveWalletType}
            />} */}
      {!isHistoryTransaction && <View>
     <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextFnx spaceTop={10} color={colors.subText}>
          Tổng Cộng
        </TextFnx>
        <TextFnx space={10} color={colors.buy} size={20}>
          {`${get(item,"available") + get(item,"pending")}`}
        </TextFnx>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <TextFnx space={3} color={colors.subText} size={12}>
            Khả dụng
          </TextFnx>
          <TextFnx>{`${get(item,"available")}`}</TextFnx>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <TextFnx space={3} color={colors.subText} size={12}>
            Đang đặt lệnh
          </TextFnx>
          <TextFnx>{`${get(item,"pending")}`}</TextFnx>
        </View>
      </View>
      <Button
        spaceVertical={20}
        isReverse
        onSubmit={()=>onDeposit(item)}
        onClose={()=>onWithdraw(item)}
        isSubmit
        isClose
        textSubmit={'DEPOSIT'.t()}
        textClose={'WITHDRAW'.t()}
        iconLeftSubmit={<DepsitSvg />}
        iconLeftClose={<WithdrawSvg />}
      />
     </View>}
     
      <Layout isSpaceBetween>
        <ButtonTypeWallet
          title1={'Deposits'.t()}
          title2={'Withdrawal'.t()}
          style={[
            !isHistoryTransaction && {
              marginTop: 10,
            },
            {marginBottom: 10},
          ]}
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
      <SwipeListView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={Disabled} onRefresh={onRefresh} />
        }
        // contentContainerStyle={(!logged || size(Source) == 0) && {
        //     flex: 1
        // }}
        ListEmptyComponent={<Empty />}
        data={
          // [{}, {}, {}, {}, {}]
          eval(checkDataShowLoadMore(isCoin,IsActive))
        }
        renderItem={(data, rowMap) => {
          return (
            <View
              style={{
                paddingVertical: 5,
              }}>
              <TouchablePreview
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
                  valueEnd={get(data, 'item.amount')}
                  style={{
                    backgroundColor: colors.navigation,
                    paddingHorizontal: 15,
                  }}
                  isWallet
                />
              </TouchablePreview>
            </View>
          );
        }}
        renderHiddenItem={(data, rowMap) => {
          if (!CheckDisableStatus(get(data, 'item.status'))) {
            return (
              <TouchablePreview onPress={() => onCancel(data, rowMap)}>
                <View style={[stylest.rowBack]}>
                  <Icon color={colors.text} size={19} name={'trash-alt'} />
                </View>
              </TouchablePreview>
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
        ListFooterComponent={ null}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          console.log('cuoi roi');
          // if (isHistoryTransaction) {
          //   handleLoadMore();
          // }
        }}
      />
    </Container>
  );
};

const ButtonWithdraw = ({
  image = icons.withdraw,
  value = 'Withdrawal'.t(),
  onPress,
}) => (
  <TouchablePreview onPress={onPress}>
    <View style={stylest.btn}>
      <Image source={image} style={{width: 30, height: 30}} />
      <TextFnx spaceTop={5} value={value} color={colors.statusBar} />
    </View>
  </TouchablePreview>
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
  } else{
    return 'coinWithdrawLogLoadMore';
  }
};
export default LayoutInfoWallet;
