import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Alert,Dimensions } from 'react-native';
import { Button, Card, CardItem, Container, Content, Header, Input, Item, Label, Left, Right } from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { base64ToArrayBuffer, dimensions } from "../../config/utilities";
import ImagePicker from "react-native-image-picker";
import { authService } from "../../services/authenticate.service";
import DropdownAlert from "react-native-dropdownalert";
import ConfirmModal from "../Shared/ConfirmModal";
import { EXCHANGE_API } from "../../config/API";
import { storageService } from "../../services/storage.service";
import ContainerFnx from '../Shared/ContainerFnx';
import {styles} from "react-native-theme";
import {connect} from "react-redux";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import Image from 'react-native-scalable-image';
const options = {
    title: 'UPLOAD IMAGE',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class KYCSelfie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selfieBytes: null,
            selfieFileName: null,
            imageUrl: null,
            disabled: false,
            success: false,
            is_confirm: false,
            title: null,
            content: null,
            isDisabled: false,
            ButtonOKText: null
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.setState({
            imageUrl: this.props.navigation.state.params.information.info.selfie,
            selfieFileName: this.props.navigation.state.params.information.info.selfie,
            isDisabled: this.props.navigation.state.params.information.info.isDisabled
        })
    }

    selectImage = () => {
        ImagePicker.showImagePicker(options, (response) => {


            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else if (response.fileSize > 5000000) {
                this.setState({
                    is_confirm: true,
                    content: 'FILE_SIZE'.t(),
                    title: "WARNING".t(),
                    ButtonOKText: null
                })
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imageUrl: source,
                    selfieBytes: response.data,
                    selfieFileName: response.fileName,
                });
            }
        });
    }

    submitKYC = async () => {
        const { selfieBytes, imageUrl } = this.state;
        if (selfieBytes || imageUrl) {
            try {
                this.setState({ disabled: true })
                const { backIdentityCardBytes, backIdentityCardFileName, information } = this.props.navigation.state.params;
                const { info, frontIdentityCardBytes, frontIdentityCardFileName } = information;
                const { birthDate, city, countryCode, firstName, lastName, identityCard, identityUserId, postalCode, sex } = info;
                const { selfieBytes, selfieFileName, isDisabled } = this.state;
                let data = {
                    birthDate, city, countryCode, firstName, lastName, identityCard, identityUserId, postalCode, sex,
                    selfieBytes, selfieFileName,
                    frontIdentityCardBytes, frontIdentityCardFileName,
                    backIdentityCardBytes, backIdentityCardFileName
                }
                if (isDisabled) {
                    this.props.navigation.navigate('Account')
                } else {
                    let token = await storageService.getItem('auth_token');
                    let res = await fetch(EXCHANGE_API.UPDATE_USER_INFO, {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer ' + token.authToken,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    let response = await res.json();
                    if (response.status) {
                        this.setState({
                            disabled: false,
                            is_confirm: true,
                            content: "Update personal info successful".t(),
                            title: "SUCCESS".t(),
                            ButtonOKText: 'OK'.t()
                        })
                    } else {
                        this.setState({
                            disabled: false,
                            is_confirm: true,
                            content: "Update personal info failed".t(),
                            title: "WARNING".t(),
                            ButtonOKText: null
                        });
                    }
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            this.setState({
                is_confirm: true,
                content: "SELECT_IMAGE".t(),
                title: "WARNING".t(),
                ButtonOKText: null
            })
        }
    }

    render() {
        const { navigation } = this.props;
        const { imageUrl, disabled, success, is_confirm, title, content, isDisabled, is_confirm_1, ButtonOKText } = this.state;
        return (
            <ContainerFnx
                title={'UPDATE_KYC'.t()}
                navigation={navigation}
            >
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ margin: 10,marginBottom:0,marginTop:0 }}>
                            <Text style={[styles.txtWhiteTitle, { marginTop: 0 }]}>{"UPLOAD_SELFIE_PHOTO".t().toUpperCase()}</Text>
                            <Text style={[styles.textMain, { marginTop: 10 }]}>{"UPLOAD_ID_CARD_NOTE".t()}</Text>
                            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"CLEAR_IMAGE".t()}</Text></View>
                            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"JPG_OR_IMAGE_IMAGE_FORMAT".t()}</Text></View>
                            <View style={{ marginTop: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"FILE_SIZE".t()}</Text></View>
                            <TouchableOpacityFnx style={[stylest.uploadImage,{
                                backgroundColor:styles.bgUploadBox.color
                            }]} onPress={this.selectImage} disabled={isDisabled}>
                                {
                                    imageUrl ?
                                        isDisabled ?
                                            <Image source={{ uri: imageUrl }} style={{ flex: 1, height: '100%', width: '100%' }} resizeMode={'contain'} />
                                            :
                                            <Image source={{ uri: imageUrl }} style={{ flex: 1, height: '100%', width: '100%' }} resizeMode={'contain'} />
                                        :
                                        <View style={{ alignItems: 'center' }}>
                                            <Icon name={"image"} size={40} color={style.colorIcon} />
                                            <Text style={styles.textMain}>{"UPLOAD_IMAGE".t()}</Text>
                                        </View>
                                }
                            </TouchableOpacityFnx>
                        </View>
                        <View style={stylest.exampleImage}>
                            <Text style={[styles.textWhite, { textAlign: 'center', padding: 10,fontWeight:"bold" }]}>{'SELFIE_PHOTO'.t().toUpperCase()}</Text>
                            {/* <Image source={this.props.theme === "light"?require('../../assets/img/light_ic_selfie_photo.png'):require('../../assets/img/ic_Selfie.png')} style={{ width: "100%", height: dimensions.height / 3 }} resizeMode={'contain'} /> */}
                            <Image
                                width={Dimensions.get('window').width -40} // height will be calculated automatically
                                source={this.props.theme === "light"?require('../../assets/img/light_ic_selfie_photo.png'):require('../../assets/img/ic_Selfie.png')}
                            />
                        </View>
                        <View style={stylest.btn}>
                            <Button style={[stylest.btnBack, style.buttonHeight,{
                                backgroundColor:styles.bgBtnClose.color
                            }]} onPress={() => navigation.goBack()}>
                                <Text style={styles.textWhiteMain}>{'BACK'.t()}</Text>
                            </Button>
                            <Button style={[stylest.btnNext, style.buttonHeight,{backgroundColor:styles.bgButton.color}]} onPress={this.submitKYC} disabled={disabled}>
                                <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => {
                        if (title === "WARNING".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                this.props.navigation.navigate('Account')
                            })
                        }
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}
                />
            </ContainerFnx>

        );
    }
}
const stylest = StyleSheet.create({
    uploadImage: {
        height: dimensions.height / 4,
        backgroundColor: "#0e1021",
        borderWidth: 0.5,
        borderColor: '#eee',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    exampleImage: {
        paddingLeft: 10,
        paddingRight: 10
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    btnBack: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#0e1021'
    },
    btnNext: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#192240'
    },
})
const mapStateToProps = (state) => {
    return {
        theme: state.commonReducer.theme
    }
}
export default connect(mapStateToProps)(KYCSelfie);
