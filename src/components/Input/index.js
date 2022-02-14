import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from '../Icon';
import ButtonWithTitle from '../Button/ButtonWithTitle';
import colors from '../../configs/styles/colors';
import ButtonIcon from '../Button/ButtonIcon';
import TextFnx from '../Text/TextFnx';
import styles from '../../configs/styles/styles';
import {constant, spacingApp} from '../../configs/constant';
import PropTypes from 'prop-types';
import BackgroundTimer from 'react-native-background-timer';
import {thousandsSeparators, subString, size} from '../../configs/utils';
import {isFunction, isNull} from 'lodash';
import {TextInputMask} from 'react-native-masked-text';
import Button from '../Button/Button';
import Layout from '../Layout/Layout';

const Input = ({
  placeholder = '',
  label = '',
  available,
  nameIconLeft,
  nameIconRight,
  onPressButtonRight,
  onPressButtonLeft,
  spaceVertical = 0,
  keyboardType = 'default',
  colorRight = colors.description,
  onChangeText = () => {},
  value = '',
  onSubmitEditing = () => {},
  maxLength = null,
  style = stylest.inputCore,
  styleView = stylest.inputView,
  styleBorder,
  styleButtonMax = stylest.btnMax,
  colorTextMax,
  widthMax,
  heightMax,
  onMax,
  styleBtnRight,
  hasValue,
  stylePrefix,
  styleRight,
  editable,
  defaultValue,
  onBtnRight,
  iconComponentLeft,
  titleBtnRight,
  isInputTop,
  isInputTopUnit,
  bgBtnRight,
  titleRight,
  restInput,
  prefix,
  isRequired,
  ...rest
}) => {
  const [valueInput, setValue] = useState(value);
  const [isSecurity, setSecurity] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimer, setIsTimer] = useState(true);
  useEffect(() => {
    if (rest.isSecurity) {
      setSecurity(true);
    }
  }, [rest.isSecurity]);

  const handleChange = text => {
    if (hasValue) {
      onChangeText(text);
    } else {
      onChangeText(text);
      setValue(text);
    }
  };
  const handleSecurity = () => {
    setSecurity(!isSecurity);
  };
  const handleMax = () => {
    if (isFunction(onMax)) {
      onMax();
    } else {
      setValue(thousandsSeparators(available));
    }
  };
  const handleResend = () => {
    setTimer(60);
    setIsTimer(true);
    rest.handleResend();
  };
  useEffect(() => {
    var intervalId;
    if (isTimer && timer) {
      intervalId = BackgroundTimer.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (!timer) {
      setIsTimer(false);
      BackgroundTimer.clearInterval(intervalId);
    }
    return () => BackgroundTimer.clearInterval(intervalId);
  }, [isTimer, timer]);
  const handlePaste = async () => {
    let dataCopied = await Clipboard.getString();
    setValue(subString(dataCopied));
    onChangeText(subString(dataCopied));
  };
  return (
    <>
      {rest.isLabel && <TextFnx style={stylest.label}>
        {label} {isRequired && <TextFnx color={colors.app.sell} value={'*'} />}
        </TextFnx>}
      
      <View
        style={[
          rest.isCircle ? stylest.inputCircle : [styleView, styleBorder],
          {marginVertical: spaceVertical},
        ]}>
        {rest.isIconLeft && (
          <ButtonIcon
            name={nameIconLeft}
            iconComponent={iconComponentLeft}
            onPress={onPressButtonLeft}
            style={[stylest.iconLeft]}
            color={colors.description}
            size={13}
          />
        )}

        {(isInputTop && (
          <View style={{flex: 1, marginRight: 20}}>
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={5}
              style={{marginBottom: -8}}>
              {isInputTop}
            </TextFnx>

            <Layout isCenter style={{justifyContent: 'flex-start'}}>
              <TextInput
                defaultValue={defaultValue}
                editable={editable}
                maxLength={rest.isResend ? 6 : maxLength}
                keyboardType={rest.isResend ? 'number-pad' : keyboardType}
                secureTextEntry={isSecurity}
                onChangeText={handleChange}
                value={hasValue ? value : valueInput}
                style={[{color: colors.text, height: 40, width: '93%'}, style]}
                placeholderTextColor={colors.description}
                placeholder={placeholder}
                onSubmitEditing={onSubmitEditing}
                {...restInput}
              />
              {isInputTopUnit}
            </Layout>
          </View>
        )) || (
          <TextInput
            defaultValue={defaultValue}
            editable={editable}
            maxLength={rest.isResend ? 6 : maxLength}
            keyboardType={rest.isResend ? 'number-pad' : keyboardType}
            secureTextEntry={isSecurity}
            onChangeText={handleChange}
            value={hasValue ? value : valueInput}
            style={[{color: colors.text}, style]}
            placeholderTextColor={colors.description}
            placeholder={placeholder}
            onSubmitEditing={onSubmitEditing}
            {...restInput}
          />
        )}
        {prefix && (
          <View
            style={[
              {
                position: 'absolute',
                right: 8,
                top: '35%',
              },
              stylePrefix,
            ]}>
            <TextFnx color={colors.app.textContentLevel3}>{prefix}</TextFnx>
          </View>
        )}
        {rest.isPaste && (
          <ButtonWithTitle
            onPress={handlePaste}
            style={[styles.icon, {width: 60}]}
            title={'PASTE'.t()}
            color={colors.iconButton}
          />
        )}
        {titleRight && (
          <TextFnx color={colors.app.textContentLevel3} spaceRight={spacingApp}>
            {titleRight}
          </TextFnx>
        )}
        {titleBtnRight && (
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              onBtnRight();
            }}
            style={{
              backgroundColor: '#FFEFC5',
              paddingVertical: 5,
              paddingHorizontal: 7,
              borderRadius: 6,
              marginRight: spacingApp,
            }}>
            <TextFnx color={colors.black}>{titleBtnRight}</TextFnx>
          </TouchableOpacity>
        )}
        {rest.isButtonRight && (
          <ButtonIcon
            name={nameIconRight}
            onPress={onPressButtonRight}
            style={[styles.icon, styleRight]}
            color={colorRight}
            styleView={styleBtnRight}
          />
        )}
        {rest.isSecurity && (
          <ButtonIcon
            onPress={handleSecurity}
            style={styles.icon}
            color={colors.description}
            size={18}
            name={!isSecurity ? 'eye' : 'eye-slash'}
          />
        )}
        {rest.isResend && (
          <ButtonIcon
            disabled={timer && isTimer ? true : false}
            titleIcon={timer ? `${timer}` : ''}
            onPress={handleResend}
            style={[
              rest.isCircle ? stylest.iconReloadCircle : stylest.iconReload,
              styles.icon,
            ]}
            size={18}
            name="sync-alt"
          />
        )}
        {rest.isQrcode && (
          <ButtonIcon
            color={colors.iconButton}
            style={[stylest.iconQrcode, styles.icon, {height: 25}]}
            size={18}
            type={constant.TYPE_ICON.MaterialCommunityIcons}
            name="qrcode-scan"
          />
        )}
        {rest.isMax && (
          <ButtonWithTitle
            color={colorTextMax}
            onPress={handleMax}
            width={widthMax}
            height={heightMax}
            title={'MAX'.t()}
            style={styleButtonMax}
          />
        )}
      </View>
    </>
  );
};
const stylest = StyleSheet.create({
  iconQrcode: {
    borderLeftColor: colors.iconButton,
    borderLeftWidth: 0.5,
  },
  btnMax: {
    backgroundColor: colors.iconButton,
    height: 52,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconReload: {
    backgroundColor: colors.iconButton,
  },
  iconReloadCircle: {
    backgroundColor: colors.iconButton,
    borderRadius: 25,
    marginRight: -1,
  },
  inputView: {
    width: '100%',
    // borderColor: colors.line,
    borderWidth: 0,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
  },
  inputCircle: {
    width: '100%',
    borderColor: colors.line,
    borderWidth: 0,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 25,
    backgroundColor: colors.background,
  },
  inputCore: {
    height: 52,
    flex: 1,
  },
  label: {
    paddingVertical: 10,
    color: colors.subText,
  },
  iconLeft: {paddingRight: 10},
});
export default Input;
Input.propTypes = {
  isSecurity: PropTypes.bool,
  isMax: PropTypes.bool,
  isQrcode: PropTypes.bool,
  isButtonRight: PropTypes.bool,
  isIconLeft: PropTypes.bool,
  isResend: PropTypes.bool,
  isPaste: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  isCircle: PropTypes.bool,
  available: PropTypes.number,
  nameIconLeft: PropTypes.string,
  nameIconRight: PropTypes.string,
  onPressButtonRight: PropTypes.func,
  onPressButtonLeft: PropTypes.func,
};
