import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Animated,
    Easing,
    Alert,
    Clipboard, Keyboard,
    Platform
} from "react-native";
import { Button, Item, Left, Picker, Right, Body, Content, Textarea, CheckBox } from "native-base";
import { style } from "../../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { alertError, base64ToArrayBuffer, dimensions, jwtDecode, formatMessageByArray, to_UTCDate } from "../../../config/utilities";
import { authService } from "../../../services/authenticate.service";
import ImagePicker from "react-native-image-picker";
import TextField from "../../Shared/TextField";
import ModalCopy from "../../Shared/ModalCopy";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { constant } from '../../../config/constants';
import ModalAlert from "../../Shared/ModalAlert";
import NoteCast from './components/NoteCast';
import ImgToBase64 from 'react-native-image-base64';
import ButtonFnx from '../../Shared/ButtonFnx';
import ImageResizer from 'react-native-image-resizer';
import {styles} from "react-native-theme";
export default class ConfirmBankPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankInfo: {},
            submitting: false,
            errorText: '',
            is_error: false,
            poPDesc: '',
            fileBytes: '',
            isCopied: false,
            content: null,
            visible: false,
            isCheckPoof: false
        }
        this.animatedValue = new Animated.Value(0)
    }

    componentDidMount() {
        jwtDecode().then(acc => {
            let accId = acc.id;
            this.setState({ accId });
            let { currency } = this.props;
            authService.getDepositBankAccount(currency, accId).then(res => {
                this.setState({ bankInfo: res })
            })
        })
        this.animate();
        this.checkPicture()
    }
    checkPicture=()=>{
        const {bankInfo } = this.props.data;
        if(bankInfo && bankInfo.poPImage){
            this.setState({
                isCheckPoof:true
            })
        }
    }
    submit() {
        this.setState({ submitting: true })
        let { fileName, poPDesc, fileBytes, imageUrl } = this.state;
        let { data } = this.props;
        if (!imageUrl) {
            this.setState({
                submitting: false,
            })
            this.modalError("Please select a Proof of Payment to upload".t());
            return;
        }
        // ImgToBase64.getBase64String(imageUrl && imageUrl.uri)
        // .then(base64String => {
        authService.confirmDepositFiat(fileName, poPDesc, data.requestId, this.state.fileBytes).then((res) => {
            console.log(res, "data err");
            if (res.status) {
                this.setState({
                    submitting: false,
                    is_error: false,
                    errorText: res.message.t()
                })
                this.props.onClose();
            } else if (res.message == "FILE_EXTENSION_INVALID") {
                this.modalError(formatMessageByArray(res.message.t(), res.messageArray))
            }
            else {
                console.log(res.message.t(), "res.message upload image")
                this.modalError(res.message.t())
            }
        })
            .catch(err => {
                this.modalError("UNKNOWN_ERROR".t())
            })
        // })
        // .catch(err => console.log(err));
        // console.log(fileName, poPDesc, data.requestId, fileBytes,"file name");

    }

    cancel() {
        this.props.onClose();
    }

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    copyClipboard(url) {
        Clipboard.setString(url);
        this.setState({ isCopied: true });
        let self = this;
        setTimeout(function () {
            self.setState({ isCopied: false });
        }, 500);
    }

    modalError(content, visible = true) {
        this.setState({
            visible: visible,
            content: content,
            submitting: false,
            is_error: true
        })
    }
    toDataURL = (url, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    selectImage = () => {
        this.setState({ hiddenModal: true })
        const options = {
            title: 'UPLOAD_IMAGE'.t(),
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
        };
        var self = this;

        ImagePicker.showImagePicker(options, (response) => {

            console.log(response, "response take image");
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            }else if(response.originalRotation == 90 && Platform.OS === "android"){
                if(response.fileSize > 5000000){
                    this.modalError("FILE_SIZE".t());
                }else{
                    this.setState({
                        imageUrl: {uri:response.uri},
                        fileName: response.fileName,
                        fileBytes: response.data
                    });
                }
                
            }else {
                ImageResizer.createResizedImage(response.uri, 1800, 1600, 'JPEG', 10).then(({ uri, size, name }) => {
                    if (size > 5000000) {
                        this.modalError("FILE_SIZE".t());
                    } else {
                        this.toDataURL(uri, function (dataUrl) {
                            let dataImg = dataUrl.replace("data:image/jpeg;base64,", "")
                            const source = { uri: uri };
                            // You can also display the image using data:
                            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                            self.setState({
                                imageUrl: source,
                                fileName: name,
                                fileBytes: dataImg
                            });

                        })

                    }
                    console.log('newUri', uri)
                }).catch((err) => {
                    console.log('error:', err)
                })

            }
        });
    }
    checkPoof = () => {
        this.setState({
            isCheckPoof: !this.state.isCheckPoof
        })
    }

    render() {
        const { submitting, imageUrl, poPDesc, openConfirm, isCheckPoof } = this.state
        const { amount, bankInfo } = this.props.data;
        const {currency,createdDate} = this.props;
        console.log(bankInfo,"bankInfo2")
        return (
            <View style={{ flex: 1, marginTop: 5 }}>
                <Text
                    style={this.state.is_error ? styles.bgSellOldNew : styles.bgBuyOldNew}>{this.state.errorText}
                </Text>
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
                    onPress={Keyboard.dismiss}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{
                        marginLeft: -2
                    }}>
                        <Item style={stylest.item}>
                            <Left style={{ flex: 5, marginTop: 5 }}>
                                <Text style={[stylest.headerText,styles.textWhite]}>{'BANK_TRANSFER'.t()}</Text>
                            </Left>
                            <Right style={{ flex: 1 }}></Right>
                        </Item>
                        <Item style={stylest.item}>
                            <Left style={{
                                flex: 0
                            }}>
                                <Text style={styles.txtMainTitle}>{"TIME".t()}</Text>
                            </Left>
                            <Right style={{
                                flex: 1
                            }}>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{to_UTCDate(createdDate,"DD/MM/YYYY hh:mm:ss")}</Text>
                                </View>
                            </Right>
                        </Item>
                        <Item style={stylest.item}>
                            <Left style={{
                                flex: 0
                            }}>
                                <Text style={styles.txtMainTitle}>{"BANK_NAME".t()}</Text>
                            </Left>
                            <Right style={{
                                flex: 1
                            }}>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{bankInfo.bankName}</Text>
                                    <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankName)}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item>
                        {bankInfo.bankBranchName ? <Item style={stylest.item}>
                            <Left>
                                <Text style={styles.txtMainTitle}>{"BRANCH_NAME".t()}</Text>
                            </Left>
                            <Right>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{bankInfo.bankBranchName}</Text>
                                    <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankBranchName)}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item> : null}
                        <Item style={stylest.item}>
                            <Left style={{ flex: 1 }}>
                                <Text style={styles.txtMainTitle}>{"ACCOUNT_NAME".t()}</Text>
                            </Left>
                            <Right style={{ flex: 2 }}>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{bankInfo.bankAccountName}</Text>
                                    <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankName)}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item>
                        <Item style={stylest.item}>
                            <Left>
                                <Text style={styles.txtMainTitle}>{"ACCOUNT_NUMBER".t()}</Text>
                            </Left>
                            <Right>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{bankInfo.bankAccountNo}</Text>
                                    <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankAccountNo)}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item>
                        <Item style={stylest.item}>
                            <Left>
                                <Text style={styles.txtMainTitle}>{"TRANSFER_DESCRIPTION".t()}</Text>
                            </Left>
                            <Right>
                                <View style={style.row}>
                                    <Text
                                        style={styles.textWhite}>{bankInfo.transferDescription || bankInfo.description}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.copyClipboard(bankInfo.transferDescription || bankInfo.description)}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item>
                        <Item style={stylest.item}>
                            <Left>
                                <Text style={styles.txtMainTitle}>{"DEPOSIT_AMOUNT".t()}</Text>
                            </Left>
                            <Right>
                                <View style={style.row}>
                                    <Text style={styles.textWhite}>{amount}{" "}{currency}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.copyClipboard(amount.str2Number().toString())}>
                                        <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                    </TouchableOpacity>
                                </View>
                            </Right>
                        </Item>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={
                                this.checkPoof
                            }
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <CheckBox
                                checked={isCheckPoof}
                                color={'#44a250'}
                                onPress={this.checkPoof}
                                style={{
                                    borderWidth: 0.5,
                                    marginTop: -13,
                                    marginLeft: -10
                                }}
                            />
                            <Text style={[styles.textWhite, { marginLeft: 20, marginBottom: 10, fontWeight: '500' }]}>{`${"Not receive money".t()}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {isCheckPoof && (
                        <View>
                            <View style={[stylest.item]}>
                                <TouchableOpacity style={[stylest.uploadImage,{
                                    backgroundColor:styles.bgUploadBox.color
                                }]} onPress={this.selectImage}>
                                    {
                                        imageUrl ?
                                            <Image source={imageUrl} style={{ flex: 1, height: '100%', width: '100%' }}
                                                resizeMode={'contain'} />
                                            :
                                            (
                                                bankInfo.poPImage ?
                                                    <Image source={{ uri: bankInfo.poPImage }}
                                                        style={{ flex: 1, height: '100%', width: '100%' }}
                                                        resizeMode={'contain'} />
                                                    :
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Icon name={"image"} size={40} color={style.colorIcon} />
                                                        <Text style={styles.txtMainTitle}>{"UPLOAD_IMAGE".t()}</Text>
                                                    </View>)
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={style.row}>

                                <Textarea rowSpan={2}
                                    // bordered
                                    placeholder={'Description'.t()}
                                    value={poPDesc}
                                    onChangeText={(poPDesc) => this.setState({ poPDesc })}
                                    style={[styles.textWhite,
                                    {
                                        borderWidth: 0.5,
                                        borderColor: style.colorIcon,
                                        borderStyle: 'dotted',
                                        width: '100%'
                                    }]}
                                    placeholderTextColor={styles.txtMainTitle.color}
                                    returnKeyType={"done"}
                                />
                            </View>
                        </View>
                    )}
                    <NoteCast styled={{ paddingRight: 10, }} noteSecond={"ACCEPT_MB".t()} noteFirst={"UPLOAD_POP_NOTE".t()} />

                    <ButtonFnx
                        hiddenFirst={isCheckPoof?false:true}
                        onClickFirst={() => this.submit()}
                        onClickSecond={() => this.cancel()}
                        titleFirst={"SUBMIT".t()}
                        titleSecond={'CLOSE'.t()}
                        disabledFirst={submitting}
                    />
                </KeyboardAwareScrollView>
                <ModalCopy visible={this.state.isCopied} />
                <ModalAlert
                    content={this.state.content}
                    visible={this.state.visible}
                    onClose={() => this.setState({ visible: false })}
                />
            </View>
        );
    }
}
const stylest = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1c2840',
        width: dimensions.width - 20,
        height: dimensions.height - 40,
        padding: 20,
        justifyContent: 'space-between',
        borderRadius: 5
    },
    item: {
        borderBottomWidth: 0,
        marginBottom: 15
    },
    buttonArea: {
        flex: 1,
        flexDirection: 'row'
    },
    headerText: {
        color: 'white',
        fontSize: 16
    },
    imgPickerArea: {
        padding: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadImage: {
        height: dimensions.height / 5,
        backgroundColor: "#1c2840",
        paddingBottom: 10,
        paddingTop: 10,
        borderWidth: 0.5,
        borderColor: style.colorIcon,
        borderStyle: 'dotted',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
})
