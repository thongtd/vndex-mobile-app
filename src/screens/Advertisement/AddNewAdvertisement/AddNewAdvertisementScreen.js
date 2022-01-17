import {isEmpty, isNumber} from 'lodash';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/Button/Button';
import Container from '../../../components/Container';
import ItemList from '../../../components/Item/ItemList';
import Layout from '../../../components/Layout/Layout';
import {BUY, SELL, spacingApp} from '../../../configs/constant';
import colors from '../../../configs/styles/colors';

import {
  formatCurrency,
  formatNumberOnChange,
  get,
  size,
  toast,
} from '../../../configs/utils';
import {
  PICKER_SEARCH,
  STEP_2FA_ADS_ADD_SCREEN,
  pushSingleScreenApp,
} from '../../../navigation';
import {dismissAllModal, showModal} from '../../../navigation/Navigation';
import {useActionsP2p} from '../../../redux';
import ProgressSteps from './components/ProgressSteps';
import Step1AddNewAds from './components/Step1AddNewAds';
import Step2AddNewAds from './components/Step2AddNewAds';
import Step3AddNewAds from './components/Step3AddNewAds';
const timeToLive = [
  {
    second: 600,
    name: '10 phút',
  },
  {
    second: 900,
    name: '15 phút',
  },
  {
    second: 1200,
    name: '20 phút',
  },
];
const AddNewAdvertisementScreen = ({componentId}) => {
  const title = [
    'Đặt Mã chứng khoán và Giá',
    'Đặt khối lượng & Phương thức thanh toán',
    'Đặt khối lượng & Phương thức thanh toán',
  ];
  // detail item for edit

  const advertismentDetails = useSelector(state => state.p2p.advertisment);
  const [step, SetStep] = useState(0);
  const [data, setData] = useState({});
  const [activeType, SetActiveType] = useState(BUY);
  const [checked, setChecked] = useState('FIXED_PRICE');
  const marketInfo = useSelector(state => state.p2p.marketInfo);
  console.log('marketInfoitem: ', marketInfo);
  const [price, setPrice] = useState(
    formatCurrency(
      get(marketInfo, 'lastestPrice'),
      get(marketInfo, 'paymentUnit'),
      currencyList,
    ),
  );
  const dispatch = useDispatch();
  const [minOrder, setMinOrder] = useState('');
  const [maxOrder, setMaxOrder] = useState('');
  const [quantity, setQuantity] = useState('');
  // const [, set] = useState(initialState)
  const [comment, setComment] = useState('');
  const [checkedStatus, setCheckedStatus] = useState('first');
  const [autoReplyMessage, setAutoReplyMessage] = useState('');
  const [isSelectedKYC, setSelectionKYC] = useState(true);
  const [isSelectedRegister, setSelectedRegister] = useState(true);

  const paymentMethods = useSelector(state => state.p2p.paymentMethods);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [paymentMethodIdData, setPaymentMethodIdData] = useState([]);
  const [activeTimeToLive, setActiveTimeToLive] = useState({
    second: 900,
    name: '15 phút',
  });
  const tradingMarket = useSelector(state => state.p2p.tradingMarket);
  const currencyList = useSelector(state => state.market.currencyList);
  const [ActiveAsset, setActiveAsset] = useState(
    get(tradingMarket, 'assets[0]'),
  );
  const [ActiveFiat, setActiveFiat] = useState(
    get(tradingMarket, 'paymentUnit[0]'),
  );
  const [percentPrice, setPercentPrice] = useState(100);
  useEffect(() => {
    useActionsP2p(dispatch).handleGetPaymentMethodByAcc();
    return () => {};
  }, [dispatch]);
  useEffect(() => {
    let methodsData = [...paymentMethods];
    if (size(methodsData) > 3) {
      methodsData.length = 3;
      setPaymentMethodData([...methodsData]);
    } else {
      setPaymentMethodData([...paymentMethods]);
    }
    return () => {};
  }, [paymentMethods]);
  useEffect(() => {
    if (size(paymentMethodData) > 0) {
      let result = paymentMethodData.map(({id}) => id);
      setPaymentMethodIdData(result);
    }

    return () => {};
  }, [paymentMethodData]);
  const onGetTimer = () => {
    let propsData = {
      data: timeToLive,
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActive(item)}
            value={item.name}
            checked={item.name === activeTimeToLive.name}
          />
        );
      },
      keywords: ['name'],
    };
    showModal(PICKER_SEARCH, propsData, false);
  };
  const handleActive = item => {
    setActiveTimeToLive(item);
    dismissAllModal();
  };

  useEffect(() => {
    useActionsP2p(dispatch).handleGetMarketInfo({
      symbol: ActiveAsset,
      paymentUnit: ActiveFiat,
    });
    return () => {};
  }, [dispatch, ActiveAsset, ActiveFiat]);
  useEffect(() => {
    setPrice(
      formatCurrency(
        get(marketInfo, 'lastestPrice'),
        get(marketInfo, 'paymentUnit'),
        currencyList,
      ),
    );
    return () => {};
  }, [marketInfo]);

  const onGetAsset = () => {
    let propsData = {
      data: get(tradingMarket, 'assets'),
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveAsset(item)}
            value={item}
            checked={item === ActiveAsset}
          />
        );
      },
    };
    showModal(PICKER_SEARCH, propsData, false);
  };
  const handleActiveAsset = item => {
    setActiveAsset(item);
    dismissAllModal();
  };
  const onGetFiat = () => {
    let propsData = {
      data: get(tradingMarket, 'paymentUnit'),
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveFiat(item)}
            value={item}
            checked={item === ActiveFiat}
          />
        );
      },
    };
    showModal(PICKER_SEARCH, propsData, false);
  };
  const handleActiveFiat = item => {
    setActiveFiat(item);
    dismissAllModal();
  };

  useEffect(() => {
    if (advertismentDetails?.orderId) {
      const _i = {...advertismentDetails};
      SetActiveType((_i?.side == 'B' && BUY) || SELL);
      setActiveAsset(_i?.symbol || get(tradingMarket, 'assets[0]'));
      setActiveFiat(
        get(_i, 'paymentUnit') || get(tradingMarket, 'paymentUnit[0]'),
      );
      setChecked(get(_i, 'priceType') || 'FIXED_PRICE');
      //step 2
      setMaxOrder(String(get(_i, 'maxOrderAmount') || ''));
      setMinOrder(String(get(_i, 'minOrderAmount') || ''));
      setQuantity(String(get(_i, 'quantity') || ''));
      setPaymentMethodData(get(_i, 'paymentMethods') || []);
      setActiveTimeToLive({
        second: get(_i, 'lockedInSecond') || 900,
        name: `${(get(_i, 'lockedInSecond') || 900) / 60} phút`,
      });
      //step3
      setComment(String(get(_i, 'note') || ''));
      setSelectionKYC(get(_i, 'requiredKyc'));
    }
  }, [advertismentDetails]);
  const renderLayout = ({
    activeType,
    checked,
    price,
    ActiveAsset,
    ActiveFiat,
    percentPrice,
    minOrder,
    maxOrder,
    quantity,
    paymentMethodData,
    activeTimeToLive,
    comment,
    autoReplyMessage,
    isSelectedKYC,
    isSelectedRegister,
    checkedStatus,
    paymentMethodIdData,
  }) => {
    switch (step) {
      case 0:
        return (
          <Step1AddNewAds
            onSelectType={__i => SetActiveType(__i?.type || 1)}
            dataState={{
              activeType,
              checked,
              price,
              ActiveAsset,
              ActiveFiat,
              percentPrice,
            }}
            // bntClose={bntClose}
            decrementPrice={() => {
              if (checked == 'FIXED_PRICE') {
                setPrice(
                  formatCurrency(
                    price.str2Number() + 1000,
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
                setPercentPrice(
                  parseFloat(
                    price.str2Number() +
                      (1000 / get(marketInfo, 'lastestPrice')) * 100,
                  ).toFixed(2),
                );
              } else {
                setPercentPrice(
                  !isEmpty(percentPrice) && isNumber(parseFloat(percentPrice))
                    ? (parseFloat(percentPrice) + 0.01).toFixed(2)
                    : 0,
                );
                setPrice(
                  formatCurrency(
                    parseFloat(
                      (get(marketInfo, 'lastestPrice') *
                        (parseFloat(percentPrice) + 0.01).toFixed(2)) /
                        100,
                    ),
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
              }
            }}
            onChangePrice={value => {
              if (checked == 'FIXED_PRICE') {
                setPrice(
                  formatCurrency(
                    value.str2Number(),
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
                setPercentPrice(
                  parseFloat(
                    (value.str2Number() / get(marketInfo, 'lastestPrice')) *
                      100,
                  ).toFixed(2),
                );
              } else {
                setPercentPrice(
                  isNumber(parseFloat(value))
                    ? parseFloat(value).toFixed(2)
                    : value,
                );
                setPrice(
                  formatCurrency(
                    parseFloat(
                      (get(marketInfo, 'lastestPrice') * parseFloat(value)) /
                        100,
                    ),
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
              }
            }}
            onIncreamentPrice={() => {
              if (checked == 'FIXED_PRICE') {
                setPrice(
                  formatCurrency(
                    price.str2Number() - 1000,
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
                setPercentPrice(
                  parseFloat(
                    price.str2Number() -
                      (1000 / get(marketInfo, 'lastestPrice')) * 100,
                  ).toFixed(2),
                );
              } else {
                setPercentPrice(
                  !isEmpty(percentPrice) && isNumber(parseFloat(percentPrice))
                    ? (parseFloat(percentPrice) - 0.01).toFixed(2)
                    : 0,
                );
                setPrice(
                  formatCurrency(
                    parseFloat(
                      (get(marketInfo, 'lastestPrice') *
                        (parseFloat(percentPrice) - 0.01).toFixed(2)) /
                        100,
                    ),
                    get(marketInfo, 'paymentUnit'),
                    currencyList,
                  ),
                );
              }
            }}
            onFixed={() => {
              setPrice(
                formatCurrency(
                  parseFloat(
                    (get(marketInfo, 'lastestPrice') *
                      parseFloat(percentPrice).toFixed(2)) /
                      100,
                  ),
                  get(marketInfo, 'paymentUnit'),
                  currencyList,
                ),
              );
              setChecked('FIXED_PRICE');
            }}
            onFloat={() => {
              setChecked('FLOAT_PRICE');
              setPercentPrice(
                parseFloat(
                  (price.str2Number() / get(marketInfo, 'lastestPrice')) * 100,
                ).toFixed(2),
              );
            }}
            onSubmitNextStep={submitNextStep}
            onGetFiat={onGetFiat}
            onGetAsset={onGetAsset}
          />
        );
      case 1:
        return (
          <Step2AddNewAds
            onBtnAll={value => setQuantity(value)}
            onGetTimer={onGetTimer}
            dataState={{
              paymentUnit: ActiveFiat,
              symbol: ActiveAsset,
              minOrder,
              maxOrder,
              quantity,
              paymentMethodData,
              activeTimeToLive,
            }}
            onRemovePaymentMethod={item => {
              let arr = paymentMethodData.filter(
                __item => item.id !== __item.id,
              );
              setPaymentMethodData([...arr]);
            }}
            onSelectPaymentMethod={(item, cb) => {
              let flagCheck = true;
              let arData2 = [...paymentMethodData];
              arData2.map((_item, index) => {
                if (_item.id == item.id) {
                  flagCheck = false;
                  return toast(
                    'Phương thức thanh toán này đã được thêm vào rồi, vui lòng chọn phương thức thanh toán khác',
                  );
                }
              });
              if (flagCheck) {
                arData2.push(item);
                setPaymentMethodData(arData2);
                cb();
              }
            }}
            onMaxOrderChange={txt => {
              setMaxOrder(formatNumberOnChange(currencyList, txt, ActiveFiat));
            }}
            onMinOrderChange={txt =>
              setMinOrder(formatNumberOnChange(currencyList, txt, ActiveFiat))
            }
            onQuantityChange={txt => {
              setQuantity(formatNumberOnChange(currencyList, txt, ActiveAsset));
            }}
            bntClose={bntClose}
            submitNextStep={submitNextStep}
          />
        );
      case 2:
        return (
          <Step3AddNewAds
            dataState={{
              comment,
              autoReplyMessage,
              isSelectedKYC,
              isSelectedRegister,
              checkedStatus,
            }}
            onCommentChange={text => setComment(text)}
            onAutoRepChange={text => setAutoReplyMessage(text)}
            bntClose={bntClose}
            onCheckKyc={() => {
              setSelectionKYC(!isSelectedKYC);
            }}
            onCheckReg={() => setSelectedRegister(!isSelectedRegister)}
            submitNextStep={submitNextStep}
            onCheckStatus={value => {
              setCheckedStatus(value);
            }}
          />
        );
    }
  };
  const submitStep1 = item => {
    // setData({...data, ...item});
    SetStep(1);
  };
  const bntClose = (
    <Button
      title={'Quay lại'}
      isNormal
      onPress={() => {
        if (step > 0) {
          SetStep(step - 1);
        }
      }}
      bgButtonColor={colors.background}
      colorTitle={colors.greyLight}
    />
  );

  const submitNextStep = () => {
    if (step == 0) {
      if (price.str2Number() <= 0 || isEmpty(price)) {
        return toast('Vui lòng nhập giá của bạn phải lớn hơn 0');
      } else if (
        price.str2Number() > 0 &&
        (price.str2Number() < (get(marketInfo, 'lastestPrice') * 80) / 100 ||
          price.str2Number() > (get(marketInfo, 'lastestPrice') * 200) / 100)
      ) {
        return toast('Giá của bạn không được vượt quá giới hạn 80% đến 200%');
      }
      SetStep(step + 1);
    } else if (step == 1) {
      if (quantity.str2Number() <= 0 || isEmpty(quantity)) {
        return toast('Vui lòng nhập tổng khối lượng của bạn phải lớn hơn 0');
      } else if (minOrder.str2Number() <= 0 || isEmpty(minOrder)) {
        return toast('Vui lòng nhập giới hạn lệnh tối thiểu phải lớn hơn 0');
      } else if (maxOrder.str2Number() <= 0 || isEmpty(maxOrder)) {
        return toast('Vui lòng nhập giới hạn lệnh tối đa phải lớn hơn 0');
      } else if (
        minOrder.str2Number() > 0 &&
        minOrder.str2Number() >
          get(marketInfo, 'lastestPrice') * quantity.str2Number()
      ) {
        return toast(
          'Giới hạn lệnh tối thiểu không được lớn hơn tổng khối lượng',
        );
      } else if (
        maxOrder.str2Number() > 0 &&
        maxOrder.str2Number() <= minOrder.str2Number()
      ) {
        return toast(
          'Giới hạn lệnh tối đa không được nhỏ hơn hoặc bằng giới hạn tối thiểu',
        );
      }else if(isEmpty(paymentMethodIdData)){
        return toast(
          'Vui lòng chọn ít nhất 1 phương thức thanh toán',
        );
      }
      SetStep(step + 1);
    } else if (step == 2) {
      pushSingleScreenApp(componentId, STEP_2FA_ADS_ADD_SCREEN, {
        data: {
          activeType,
          checked,
          price,
          ActiveAsset,
          ActiveFiat,
          percentPrice,
          minOrder,
          maxOrder,
          quantity,
          paymentMethodData,
          activeTimeToLive,
          comment,
          autoReplyMessage,
          isSelectedKYC,
          isSelectedRegister,
          checkedStatus,
          isUpdate: get(advertismentDetails, 'orderId') ? true : false,
          paymentMethodIdData,
          tradingOrderId: get(advertismentDetails, 'orderId') || null,
        },
      });
    }
  };
  return (
    <Container
      spaceHorizontal={0}
      componentId={componentId}
      isTopBar
      isScroll
      title={
        advertismentDetails?.orderId
          ? 'Chỉnh sửa quảng cáo'
          : 'Đăng quảng cáo mới'
      }>
      <Layout spaceHorizontal={spacingApp}>
        <ProgressSteps step={step} title={title[step]} />
      </Layout>
      {renderLayout({
        activeType,
        checked,
        price,
        ActiveAsset,
        ActiveFiat,
        percentPrice,
        minOrder,
        maxOrder,
        quantity,
        paymentMethodData,
        activeTimeToLive,
        comment,
        autoReplyMessage,
        isSelectedKYC,
        isSelectedRegister,
        checkedStatus,
        paymentMethodIdData,
      })}
    </Container>
  );
};

const styles = StyleSheet.create({});
export default AddNewAdvertisementScreen;
