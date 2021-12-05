import React from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    Linking,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    StatusBar
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
import { style } from '../../../../config/style'
import {
    dimensions,
    formatCurrency,
    formatSCurrency,
    jwtDecode
} from "../../../../config/utilities";
const { width, height } = Dimensions.get('window');
import { constant } from "../../../../config/constants";
import stylest from './styles';
import CountDown from 'react-native-countdown-component';
import {styles} from "react-native-theme";
const Processing = ({
    until,
    onFinishTimer,
    contact,
    onMail,
    onTelegram,
    onFacebook
}) => {
    return (
        <View>
            <Text
                style={[style.textMain, {
                    marginBottom: 10,
                    textAlign: 'center'
                }]}>{'TIME_COMPLETE'.t()}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <CountDown
                    until={until}
                    size={18}
                    onFinish={onFinishTimer}
                    digitBgColor={'transparent'}
                    digitTxtColor={styles.textWhite.color}
                    timeToShow={['H']}
                    labelH={''}
                    labelM={''}
                    labelS={''}
                />
                <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                <CountDown
                    until={until}
                    size={18}
                    onFinish={onFinishTimer}
                    digitBgColor={'transparent'}
                    digitTxtColor={styles.textWhite.color}
                    timeToShow={['M']}
                    labelH={''}
                    labelM={''}
                    labelS={''}
                />
                <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                <CountDown
                    until={until}
                    size={18}
                    onFinish={onFinishTimer}
                    digitBgColor={'transparent'}
                    digitTxtColor={styles.textWhite.color}
                    timeToShow={['S']}
                    labelH={''}
                    labelM={''}
                    labelS={''}
                />
            </View>
            {
                contact &&
                <View>
                    <Text style={styles.bgSellOldNew}>{'WITHDRAWAL_SUPPORT'.t()}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ marginHorizontal: 10, padding: 10 }}
                            onPress={onMail}
                        >
                            <Icon name={'envelope'} size={14} color={'#456edd'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginHorizontal: 10, padding: 10 }}
                            onPress={onTelegram}
                        >
                            <Icon name={'telegram'} size={14} color={'#456edd'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginHorizontal: 10, padding: 10 }}
                            onPress={onFacebook}
                        >
                            <Icon name={'facebook'} size={14} color={'#456edd'} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    )

}
export default Processing;