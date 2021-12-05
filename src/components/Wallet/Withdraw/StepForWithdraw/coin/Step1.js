import React from 'react';
import {
    View,
    Dimensions,
} from 'react-native';
import {
    Container,
    Content,
    Item,
    Button,
    Left,
    Right,
    Input,
    Body,
    Header
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { style } from '../../../../../config/style'
import {
    dimensions,
    formatCurrency,
    formatSCurrency,
    jwtDecode
} from "../../../../../config/utilities";
const { width, height } = Dimensions.get('window');
import { constant } from "../../../../../config/constants";
import styles from './styles';
import { SendEmailField } from '../../../../Shared';
import TextInputFnx from '../../../../Shared/TextInputFnx';

export default class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
componentDidMount() {
    const {
        twoFactorService,
      } = this.props;
      if(twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ){
        this.props.onSendEmail();
      }
    
}
  render() {
      const {
        twoFactorService,
        onChangeVerifyCode,
        verifyCode,
        disable,
        onSendEmail,
        checked,
        timer
      } = this.props;
    return (
        <View style={{
            paddingTop: 20,
            marginBottom:10
        }}>
            {
                twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                    <SendEmailField
                        placeholder={'EMAIL_VERIFICATION'.t()}
                        onChangeText={onChangeVerifyCode}
                        value={verifyCode}
                        keyboardType={'numeric'}
                        disabled={disable}
                        onSend={onSendEmail}
                        timer={timer}
                        checked={checked}
                        titleBtn={"SEND_EMAIL".t()}
                    />
                    :
                    <TextInputFnx
                        placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                        onChangeText={onChangeVerifyCode}
                        value={verifyCode}
                        keyboardType={'numeric'}
                    />
                    
            }
        </View>

    );
  }
}
