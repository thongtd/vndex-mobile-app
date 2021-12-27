import React, {useEffect, useState} from 'react';
import {Text, View, Clipboard, StyleSheet} from 'react-native';
import Container from '../../../components/Container';
import {constant} from '../../../configs/constant';
import QRCode from 'react-native-qrcode-svg';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import {
  toast,
  formatMessageByArray,
  get,
  isArray,
  size,
  getPropsData,
  checkLang,
} from '../../../configs/utils';
import NoteImportant from '../../../components/Text/NoteImportant';
import Share from 'react-native-share';
import {WalletService} from '../../../services/wallet.service';
import {useSelector} from 'react-redux';
import _, {orderBy, uniqBy} from 'lodash';
import {showModal, dismissAllModal} from '../../../navigation/Navigation';
import {PICKER_SEARCH, MODAL_ALERT} from '../../../navigation';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button/Button';
const DepositCoinScreen = ({componentId, data}) => {
  const cryptoWallet = useSelector(state => state.wallet.cryptoWallet);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const lang = useSelector(state => state.authentication.lang);
  const [InfoCurrency, setInfoCurrency] = useState('');
  const [CurrencyActive, setCurrencyActive] = useState(get(data, 'symbol'));
  const [Disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(true);
    WalletService.getWalletBalanceByCurrency(
      get(UserInfo, 'id'),
      CurrencyActive,
    )
      .then(res => {
        setDisabled(false);
        console.log(res,"Ress");
        if (res) {
          setInfoCurrency(res);
          if (
            isArray(get(res, 'extraFields')) &&
            size(get(res, 'extraFields')) > 0
          ) {
            showModal(
              MODAL_ALERT,
              {
                top: '20%',
                customView: (
                  <Layout
                    type={'column'}
                    style={{
                      alignItems: 'center',
                    }}>
                    <TextFnx
                      color={colors.tabbarActive}
                      size={16}
                      value={'Notice'.t().toUpperCase()}
                      weight="bold"
                    />
                    <Icon
                      style={{paddingVertical: 10}}
                      color={colors.yellow}
                      size={45}
                      name={'exclamation-triangle'}
                    />
                    <TextFnx
                      align="center"
                      space={5}
                      color={colors.text}
                      value={get(
                        res,
                        `extraFields[0].localizations.${checkLang(
                          lang,
                        )}.DepositWarningMsg`,
                      )}
                    />
                    <TextFnx
                      align="center"
                      space={5}
                      color={colors.tabbarActive}
                      value={get(
                        res,
                        `extraFields[0].localizations.${checkLang(
                          lang,
                        )}.AgreeMsg`,
                      )}
                    />
                    <Button
                      onSubmit={() => dismissAllModal()}
                      spaceVertical={10}
                      isSubmit
                      textSubmit={'I understand, Continue'.t()}
                      isButtonCircle={false}
                    />
                  </Layout>
                ),
                isTitle: false,
              },
              true,
            );
          }
        }
      })
      .catch(() => setDisabled(false));
  }, [CurrencyActive]);
  const onSelectCoin = () => {
    let data = orderBy(uniqBy(cryptoWallet, 'currency'), ['currency'], ['asc']);
    let propsData = getPropsData(
      data,
      'image',
      'currency',
      CurrencyActive,
      item => handleActive(item),
    );
    showModal(PICKER_SEARCH, propsData);
  };
  const handleActive = item => {
    setCurrencyActive(get(item, 'symbol'));
    dismissAllModal();
  };
  return (
    <Container
      title={`${'Deposits'.t()} ${CurrencyActive}`}
      hasBack
      componentId={componentId}
      nameRight={'bars'}
      typeRight={constant.TYPE_ICON.AntDesign}
      onClickRight={onSelectCoin}
      sizeIconRight={19}
      isLoadding={Disabled}>
      <Layout type="column">
        <View style={stylest.containerQrcode}>
          <QRCode
            value={get(InfoCurrency, 'cryptoAddress') || '0'}
            size={170}
          />
        </View>
        {/* <ItemDepositCoin
          addressWallet={'Ethereum (ERC 20)'}
          label={'Mạng lưới'}
        /> */}
        <ItemDepositCoin
          addressWallet={get(InfoCurrency, 'cryptoAddress')}
          label={formatMessageByArray('DEPOSIT_ADDRESS'.t(), [CurrencyActive])}
        />
        {/* <ItemDepositCoin addressWallet={'C2f1EfEf36Bf'} label={'Tag'} /> */}
        {
                    get(InfoCurrency, "extraFields") && size(get(InfoCurrency, "extraFields")) > 0 && get(InfoCurrency, "extraFields").map((item, index) => {
                        return (<ItemDepositCoin
                            key={`key-${index}`}
                            addressWallet={get(item, "value")}
                            label={get(item, "name")}
                             />)
                    })
                }
                <View style={{
                    borderBottomWidth:1,
                    borderBottomColor:colors.line
                }}>

                </View>
        <NoteImportant
          arrNote={[
            'NOTE_HAS_TAG'.t(),
            formatMessageByArray('COIN_DEPOSIT_WARNING'.t(), ['AIFT']),
          ]}
        />
      </Layout>
    </Container>
  );
};
const ItemDepositCoin = ({onShare, addressWallet = '  ', label}) => {
  return (
    <Layout space={5} type="column">
      <TextFnx color={colors.subText} value={label} />
      <Layout
        style={{
          maxWidth: '85%',
        }}>
        <TextFnx
          space={10}
          color={colors.iconButton}
          value={
            addressWallet
              ? `${addressWallet} `
              : '0xcfe625b9df4070DbcC2f1EfEf36Bf2c302b490955618118'
          }
        />
        <ButtonIcon
          style={stylest.icon}
          size={18}
          color={colors.iconButton}
          name={'copy'}
          onPress={() => {
            Clipboard.setString(addressWallet);
            toast('COPY_TO_CLIPBOARD'.t());
          }}
        />
      </Layout>
    </Layout>
  );
};
const stylest = StyleSheet.create({
  icon: {
    height: 25,
    justifyContent: 'flex-end',
    paddingHorizontal: 7,
    alignItems: 'center',
  },
  containerQrcode: {
    marginVertical: 25,
    alignItems: 'center',
  },
});
export default DepositCoinScreen;
