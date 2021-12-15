import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, Platform } from 'react-native';
import Container from '../../../components/Container';
import Recommended from '../components/Recommend';
import NoteImportant from '../../../components/Text/NoteImportant';
import Button from '../../../components/Button/Button';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import ItemConfirmDepositFiat from '../components/ItemConfirmDepositFiat';
import CheckBox from 'react-native-check-box';
import Icon from '../../../components/Icon';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import { to_UTCDate, get, toast, formatMessageByArray } from '../../../configs/utils';
import { pop } from '../../../navigation/Navigation';
import Image from '../../../components/Image/Image';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { WalletService } from '../../../services/wallet.service';
const ConfirmDepositFiatScreen = ({
    componentId,
    createdDate,
    InfoBank,
    Amount,
    InfoCoin,
    requestId,
    setLoadding
}) => {
    const options = {
        title: "Upload Image".t(),
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    const [Check, setCheck] = useState(false);
    const [AvatarSource, setAvatarSource] = useState("");
    const [FileName, setFileName] = useState("");
    const [FileBytes, setFileBytes] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const [Des, setDes] = useState("");
    const onUploadImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else if (response.originalRotation == 90 && Platform.OS === "android") {
                if (response.fileSize > 5000000) {
                    toast("FILE_SIZE".t());
                } else {
                    setFileName(response.fileName);
                    setFileBytes(response.data);
                    setAvatarSource({ uri: response.uri });
                }
            } else {
                ImageResizer.createResizedImage(response.uri, 1800, 1600, 'JPEG', 10).then(({ uri, size, name }) => {
                    if (size > 5000000) {
                        toast("FILE_SIZE".t());
                    } else {
                        toDataURL(uri, function (dataUrl) {
                            let dataImg = dataUrl.replace("data:image/jpeg;base64,", "")
                            const source = { uri: uri };
                            setFileName(name);
                            setFileBytes(dataImg);
                            setAvatarSource(source);
                        })
                    }
                }).catch((err) => {
                    console.log('error:', err)
                })
            }
        });
    }
    const toDataURL = (url, callback) => {
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
    const onSubmit = () => {
        
        if (!AvatarSource) {
            toast("Please select a Proof of Payment to upload".t());
            return;
        }
        setLoadding(true);
        setDisabled(true);
        WalletService.confirmDepositFiat(FileName, Des, requestId, FileBytes).then((res) => {
            console.log(res,"res kaka");
            setDisabled(false)
            setLoadding(false);
            if (res.status) {
                pop(componentId);

            } else if (res.message == "FILE_EXTENSION_INVALID") {
                toast(formatMessageByArray(res.message.t(), get(res,"messageArray")))
            }
            else {
                toast(res.message.t())
            }
        })
            .catch(err => {
                setDisabled(false)
                setLoadding(false);
                toast("UNKNOWN_ERROR".t())
            })
    }

    return (<>
        <ItemConfirmDepositFiat
            value={to_UTCDate(createdDate, "DD-MM-YYYY hh:mm:ss")}
            title={"Time".t()}
            isCopy={false}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankName")}
            title={"BANK_NAME".t()}
        />
         {get(InfoCoin, "currency") !== "IDR" && <ItemConfirmDepositFiat
            value={get(InfoBank, "bankBranchName")}
            title={"BRANCH_NAME".t()}
        />}
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankAccountName")}
            title={"ACCOUNT_NAME".t()}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "bankAccountNo")}
            title={"ACCOUNT_NUMBER".t()}
        />
        <ItemConfirmDepositFiat
            value={get(InfoBank, "transferDescription")}
            title={"TRANSFER_DESCRIPTION".t()}
        />
        <ItemConfirmDepositFiat
            value={`${Amount} ${get(InfoCoin, "currency")}`}
            title={"DEPOSIT_AMOUNT".t()}
        />
        <CheckBox
            style={{
                marginLeft: -2,
            }}
            onClick={() => setCheck(!Check)}
            checkBoxColor={colors.green}
            isChecked={Check}
            rightText={"Not receive money".t()}
        />
        {Check &&
            <>
                <TouchablePreview
                    onPress={onUploadImage}
                >
                    <Layout
                        type={"column"}
                        isCenter
                        style={stylest.uploadImg}>
                        {AvatarSource ? (<Image source={AvatarSource} style={{
                            width: 150,
                            height: 115
                        }} />) : (
                                <>
                                    <Icon size={50} name={"image"} color={colors.title} />
                                    <TextFnx isDart color={colors.title} value={"Upload Image".t()} />
                                </>
                            )}

                    </Layout>
                </TouchablePreview>

                <TextInput
                    value={Des}
                    onChangeText={(text) => setDes(text)}
                    multiline={true}
                    numberOfLines={2}
                    placeholder={"Description".t()}
                    style={stylest.description}
                />
            </>}
        <Recommended />
        <NoteImportant
            arrNote={["NOTE_UPLOADS_PROOF".t(), "ACCEPT_MB".t()]}
        />
        <Button
            disabled={Disabled}
            onSubmit={onSubmit}
            onClose={() => pop(componentId)}
            spaceVertical={10}
            textSubmit={"CONFIRM".t()}
            textClose={"Cancel".t()}
            isSubmit={!Check ? false : true}
            isClose
            isButtonCircle={false}
        />
    </>
    );
}
const stylest = StyleSheet.create({
    description: {
        height: 50,
        marginVertical: 15,
        borderColor: colors.line,
        borderWidth: 0.5,
        paddingHorizontal: 10
    },
    uploadImg: {
        height: 120,
        borderWidth: 0.5,
        borderColor: colors.line,
        backgroundColor: colors.btnBlur
    }
});
export default ConfirmDepositFiatScreen;
