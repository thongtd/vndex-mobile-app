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
import styles from './styles';
const EmailSent = ({
    onChangeCode,
    code,
    onResendOtp,
    checked,
    timer
}) => (
    <View>
    <View style={{
        flexDirection: 'row',
        backgroundColor: '#171d2f',
        marginBottom: 10
    }}>
        <TextInput
            allowFontScaling={false}
            style={{
                flex: 3,
                color: style.textWhite.color,
                height: 40,
                paddingHorizontal: 10
            }}
            placeholder={'EMAIL_VERIFICATION'.t()}
            placeholderTextColor={style.textMain.color}
            onChangeText={onChangeCode}
            value={code}
            keyboardType={'numeric'}
        />
        <Button
            primary
            style={[style.buttonNext, style.buttonHeight, {
                padding: 5,
                width: dimensions.width / 4,
                justifyContent: 'center'
            }]}
            onPress={onResendOtp}
        >
            <Text
                style={{ color: 'white' }}> {checked ? timer + "s" : "SEND_EMAIL".t()} </Text>
        </Button>
    </View>
    <TouchableOpacity block style={[style.buttonNext, { height: 35 }]}>
        <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
    </TouchableOpacity>
</View>
);

export default EmailSent;
