import React, {useState, useEffect} from 'react';
import RN, {Text, View, StyleSheet} from 'react-native';
import TopBarWallet from '../../../components/TopBarWallet';
import {TextWhite} from '../../../components';
import TextSeparators from '../../../components/Text/TextSeparators';
import colors from '../../../configs/styles/colors';
import {useSelector} from 'react-redux';
import {
  convertToCurr,
  isArray,
  size,
  get,
  formatCurrencyFnx,
  formatCurrency,
  convertToUSD,
} from '../../../configs/utils';
import TextFnx from '../../../components/Text/TextFnx';
import Button from '../../../components/Button/Button';
import {
  pushSingleScreenApp,
  LOGIN_SCREEN,
  TRANSACTION_HISTORY,
} from '../../../navigation';
const HeaderWalletScreen = ({componentId}) => {
  const logged = useSelector(state => state.authentication.logged);
  const cryptos = useSelector(state => state.market.cryptoWallet);
  const fiats = useSelector(state => state.wallet.fiatsWallet);
  const conversion = useSelector(state => state.market.conversion);
  const currencyList = useSelector(state => state.market.currencyList);
  const [TotalValue, setTotalValue] = useState(0);
  const marketWatch = useSelector(state => state.market.marketWatch);
  var curr = 'VND';
  useEffect(() => {
    if (
      isArray(cryptos) &&
      size(cryptos) > 0
    ) {
      calculateAsset(cryptos, fiats);
      // console.log(marketWatch,"marketWatchmarketWatch")
    }
  }, [cryptos, fiats, marketWatch]);
  const calculateAsset = async (cryptos, fiats) => {
    var totalCryptoValue = 0;
    var totalFiatValue = 0;

    for (let i = 0; i <= size(cryptos); i++) {
      if (get(cryptos[i], 'available')) {
        totalCryptoValue += get(cryptos[i], 'available');
      }
        // formatCurrencyFnx(
        //   (get(cryptos[i], 'available') + get(cryptos[i], 'pending')) *
        //     get(cryptos[i], 'lastestPrice'),
        //   0,
        // ).str2Number();
    //   }
    }

    // for (let j = 0; j <= size(fiats); j++) {
    //   if (get(fiats[j], 'currency') === curr) {
    //     totalFiatValue += get(fiats[j], 'totalAmount');
    //   } else {
    //     totalFiatValue += convertToCurr(
    //       get(fiats[j], 'currency'),
    //       conversion,
    //       get(fiats[j], 'totalAmount'),
    //       curr,
    //     );
    //   }
    // }
    setTotalValue(totalCryptoValue);
  };
  return (
    <TopBarWallet>
      <View
        style={{
          flex: 1,
          padding:30
        }}>
        <TextFnx weight="500" size={20} color={colors.iconButton}>
          Số dư token
        </TextFnx>
        <TextFnx weight='700' spaceTop={8} color={colors.text} size={30}>
          {TotalValue}
        </TextFnx>
      </View>
    </TopBarWallet>
  );
};
const stylest = StyleSheet.create({
  textRenderItem: {
    fontWeight: 'bold',
    fontSize: 17,
    color: colors.background,
    // paddingBottom: 15
  },
  blockTopbar: {
    width: '100%',
  },
  priceConvert: {
    flexDirection: 'row',
  },
  price: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  blockChildTopBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrice: {
    color: colors.green,
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    paddingRight: 10,
    height: 45,
    width: '25%',
    justifyContent: 'center',
  },
});
export default HeaderWalletScreen;
