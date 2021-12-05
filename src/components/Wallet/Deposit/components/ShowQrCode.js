import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity } from 'react-native'
import { style } from "../../../../config/style"
import Icon from "react-native-vector-icons/FontAwesome5"
import QRCode from 'react-native-qrcode-svg';
import BtnDepositCoin from './BtnDepositCoin';
import { CameraRoll, ToastAndroid, PermissionsAndroid } from "react-native"
import RNFS from "react-native-fs"
import {formatMessageByArray} from "../../../../config/utilities"
import {styles} from "react-native-theme";
export default class ShowQrCode extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

 requestCameraPermission = async() => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Cool Photo App Camera Permission',
                message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}
handlePress =async () => {
    await this.requestCameraPermission();
    await this.qrcode.toDataURL(this.callback)
}
callback = (dataURL) => {
    // console.log(dataURL,"dataUrl");
    RNFS.writeFile(RNFS.CachesDirectoryPath + "/test.png", dataURL, 'base64')
        .then((success) => {
            console.log(success, "success");
            return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath + "/test.png", 'photo')
        })
        .then(() => {
            // this.setState({ busy: false, imageSaved: true })
            ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT)
        })
}
render() {
    // console.log(this.svg,"svg");
    const { onDismiss, visibleQrcode, onRequestClose, symbol, address, onCopy } = this.props;
    return (
        <Modal
            transparent
            visible={visibleQrcode}
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <View style={{
                backgroundColor: "#000",
                opacity: 0.5,
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
            }}>
            </View>

            <View style={{
                backgroundColor: "#fff",
                marginHorizontal: "10%",
                marginTop: "10%"
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingHorizontal: 15,
                    paddingTop: 10
                }}>
                    <TouchableOpacity style={{
                        width: 20,
                        height: 20,
                        backgroundColor: style.container.backgroundColor,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={onRequestClose}>
                        <Icon name={"times"} color={style.textWhite.color} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    paddingHorizontal: 25,
                    paddingBottom: 35,

                }}>
                    <View style={{
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <Text style={[{ color: style.btnBackgroundColor, paddingVertical: 10 }, style.fontSize20]}>{`${formatMessageByArray('DEPOSIT_ADDRESS'.t(),[symbol])}`}</Text>
                        <QRCode
                            value={address}
                            size={180}
                            getRef={(data) => (this.qrcode = data)}
                            logoBackgroundColor='transparent'
                        />
                        <Text style={[style.fontSize16, { textAlign:"center",paddingVertical: 10, color: "#000" }]}>{address}</Text>
                        <BtnDepositCoin
                            style={{ width: "100%", backgroundColor: styles.bgButton.color,borderWidth:0 }}
                            nameIcon={'copy'}
                            titleBtn={`${'COPY'.t()} ${'ADDRESS'.t()}`}
                            onPress={onCopy}
                            styleText={style.textWhite}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
}
