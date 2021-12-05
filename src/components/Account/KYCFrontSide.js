import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Alert,Dimensions } from 'react-native';
import { Button, Card, CardItem, Container, Content, Header, Input, Item, Label, Left, Right } from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { base64ToArrayBuffer, dimensions } from "../../config/utilities";
import ImagePicker from 'react-native-image-picker';
import DropdownAlert from "react-native-dropdownalert";
import ConfirmModal from "../Shared/ConfirmModal";
import ContainerFnx from '../Shared/ContainerFnx';
import {styles} from "react-native-theme";
import {connect} from "react-redux";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import Image from 'react-native-scalable-image';
var b64toBlob = require('b64-to-blob');

const options = {
    title: 'UPLOAD IMAGE',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class KYCFrontSide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            frontIdentityCardBytes: null,
            frontIdentityCardFileName: null,
            isDisabled: false,
            is_confirm: false,
            content: null,
            title: null,
            ButtonOKText: null
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.setState({
            frontIdentityCardFileName: this.props.navigation.state.params.info.frontIdentityCard,
            imageUrl: this.props.navigation.state.params.info.frontIdentityCard,
            isDisabled: this.props.navigation.state.params.info.isDisabled
        })
    }

    selectImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            // console.log("response image: ", response);
            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else if (response.fileSize > 5000000) {
                // this.dropdown.alertWithType('warn', 'WARNING'.t(), 'FILE_SIZE'.t())
                // Alert.alert('WARNING'.t(), 'FILE_SIZE'.t(), [{text: 'CLOSE'.t()}])
                this.setState({
                    is_confirm: true,
                    title: "WARNING".t(),
                    content: 'FILE_SIZE'.t(),
                    ButtonOKText: null
                })
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    imageUrl: source,
                    frontIdentityCardBytes: response.data,
                    frontIdentityCardFileName: response.fileName,
                });
            }
        });
    }

    handleNext = () => {
        const { navigation } = this.props;
        const { frontIdentityCardBytes, imageUrl } = this.state;
        if (frontIdentityCardBytes || imageUrl) {
            navigation.navigate('KYCBackSide', { info: navigation.state.params.info, frontIdentityCardBytes: this.state.frontIdentityCardBytes, frontIdentityCardFileName: this.state.frontIdentityCardFileName })
        } else {
            // this.setState({is_confirm: true})
            // Alert.alert("WARNING".t(), "SELECT_IMAGE".t(), [{text: 'CLOSE'.t()}])
            this.setState({
                is_confirm: true,
                title: "WARNING".t(),
                content: "SELECT_IMAGE".t(),
                ButtonOKText: null
            })
        }
    }

    render() {
        const { navigation } = this.props;
        const { imageUrl, isDisabled, is_confirm, ButtonOKText, title, content } = this.state;
        return (
            <ContainerFnx
                title={'UPDATE_KYC'.t()}
                navigation={navigation}
                hasRight={
                    <Button transparent onPress={() => navigation.navigate('Account')}>
                        <Text style={[styles.textWhite, { fontSize: 14, marginLeft: 10, paddingLeft: 10 }]}>{'SKIP'.t()}</Text>
                    </Button>}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <DropdownAlert ref={ref => this.dropdown = ref} elevation={10} zIndex={Platform.OS === 'ios' ? 10 : 0} closeInterval={2000} errorImageSrc={null} successImageSrc={null} />
                    <View style={{ flex: 1 }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={[styles.txtWhiteTitle, { marginTop: 0 }]}>{"UPLOAD_FRONT_SIDE_ID_CARD".t()}</Text>
                            <Text style={[styles.textMain, { marginTop: 10, }]}>{"UPLOAD_ID_CARD_NOTE".t()}</Text>
                            < View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"CLEAR_IMAGE".t()}</Text></View>
                            <View style={{ marginTop: 5, alignItems: 'center', flexDirection: 'row' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"JPG_OR_IMAGE_IMAGE_FORMAT".t()}</Text></View>
                            <View style={{ marginTop: 5, marginBottom: 5, alignItems: 'center', flexDirection: 'row' }}><Icon name={'check'} color={'#44a250'} /><Text style={[styles.textMain, { marginLeft: 10 }]}>{"FILE_SIZE".t()}</Text></View>
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
                                        <View style={{ alignItems: 'center', }}>
                                            <Icon name={"image"} size={40} color={style.colorIcon} />
                                            <Text style={styles.textMain}>{"UPLOAD_IMAGE".t()}</Text>
                                        </View>
                                }
                            </TouchableOpacityFnx>
                        </View>
                        <View style={[stylest.exampleImage]}>
                            <Text style={[styles.textWhite, {  textAlign: 'center', padding: 10,fontWeight:"bold" }]}>{'FRONT_SIDE'.t().toUpperCase()}</Text>
                            <Image
                                width={Dimensions.get('window').width -40} // height will be calculated automatically
                                source={this.props.theme === "light" ? require('../../assets/img/light_ic_card_front.png') : require('../../assets/img/ic_card_front.png')}
                            />
                            {/* <Image source={this.props.theme === "light" ? require('../../assets/img/light_ic_card_front.png') : require('../../assets/img/ic_card_front.png')} style={{ width: "100%" }} resizeMode={'contain'} /> */}
                        </View>
                        <View style={stylest.btn}>
                            <Button style={[stylest.btnBack, style.buttonHeight, {
                                backgroundColor: styles.bgBtnClose.color
                            }]} onPress={() => navigation.goBack()}>
                                <Text style={styles.textWhiteMain}>{'BACK'.t()}</Text>
                            </Button>
                            <Button style={[stylest.btnNext, style.buttonHeight, { backgroundColor: styles.bgButton.color }]} onPress={this.handleNext}>
                                <Text style={style.textWhite}>{'NEXT'.t()}</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
                <ConfirmModal visible={is_confirm} title={title} content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => {
                        this.setState({ is_confirm: false })
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                />
            </ContainerFnx>
            // <Container style={style.container}>

            // </Container>
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
        marginTop: 5
    },
    exampleImage: {
        // marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
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
export default connect(mapStateToProps)(KYCFrontSide);
