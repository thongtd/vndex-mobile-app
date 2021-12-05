import React from 'react';
import { Text, View, TextInput, Dimensions } from 'react-native';
import { style } from "../../../../../config/style";
import { constant } from "../../../../../config/constants";
import { Button } from 'native-base';
import { styles } from "react-native-theme";
const { width, height } = Dimensions.get("window");
const CancelModal = ({
    twoFactorService,
    verifyCode,
    onChangeVerifyCode,
    onSendEmail,
    checked,
    timer
}) => (
        <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {
                twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                    <View style={{
                        flexDirection: 'row', backgroundColor: styles.bgMain.color, marginBottom: 20
                    }}>
                        <TextInput
                            allowFontScaling={false}
                            style={{
                                flex: 3,
                                paddingHorizontal: 10,
                                borderWidth: 0.5,
                                borderRightWidth: 0,
                                borderColor: style.colorBorderBox,
                                height: 40,
                                color: styles.textWhite.color,
                                borderTopLeftRadius: 2.5,
                                borderBottomLeftRadius: 2.5
                            }}
                            placeholder={'EMAIL_VERIFICATION'.t()}
                            placeholderTextColor={styles.txtPh.color}
                            onChangeText={onChangeVerifyCode}
                            value={verifyCode}
                            keyboardType={'numeric'}
                        />
                        <Button
                            disabled={checked}
                            primary
                            style={[style.buttonNext, {
                                height: 40,
                                padding: 5,
                                width: width / 4,
                                justifyContent: 'center',
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }, {
                                backgroundColor: styles.bgButton.color
                            }]}
                            onPress={onSendEmail}
                        >
                            <Text
                                style={{ color: 'white' }}> {checked ? (timer <= 0 ? 0 : timer) + "s" : "SEND_EMAIL".t()} </Text>
                        </Button>
                    </View>
                    :
                    <View style={{
                        flexDirection: 'row', backgroundColor: styles.bgMain.color, marginBottom: 20,
                    }}>
                        <TextInput
                            allowFontScaling={false}
                            style={[style.inputView2,{ flex: 3, color: styles.textWhite.color, padding: 10,backgroundColor:"transparent" }]}
                            placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                            placeholderTextColor={styles.txtPh.color}
                            onChangeText={onChangeVerifyCode}
                            value={verifyCode}
                            keyboardType={'numeric'}
                        />
                    </View>
            }
        </View>
    );

export default CancelModal;
