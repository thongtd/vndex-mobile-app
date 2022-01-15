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
    'Đặt loại và giá',
    'Đặt Tổng số lượng & Phương thức thanh toán',
    'Đặt Tổng số lượng & Phương thức thanh toán',
  ];
  const [step, SetStep] = useState(0);
  const [data, setData] = useState({});
  const [activeType, SetActiveType] = useState(BUY);
  const [checked, setChecked] = useState('FIXED_PRICE');
  const marketInfo = useSelector(state => state.p2p.marketInfo);
  const [price, setPrice] = useState(
    formatCurrency(
      get(marketInfo, 'lastestPrice'),
      get(marketInfo, 'paymentUnit'),
      currencyList,
    ),
  );

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
  const dispatch = useDispatch();
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
    paymentMethodIdData
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
          onBtnAll={(value)=>setQuantity(value)}
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
      SetStep(step + 1);
    } else if (step == 1) {
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
          paymentMethodIdData
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
      title="Đăng quảng cáo mới">
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
        paymentMethodIdData
      })}
    </Container>
  );
};

const styles = StyleSheet.create({});
export default AddNewAdvertisementScreen;
