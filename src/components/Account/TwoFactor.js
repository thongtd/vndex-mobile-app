import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Platform, Alert } from 'react-native';
import { Body, Button, Card, CardItem, Container, Content, Header, Input, Item, Label, Left, Right } from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { dimensions, jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import { constant } from "../../config/constants";
import DropdownAlert from "react-native-dropdownalert";
import ConfirmModal from "../Shared/ConfirmModal";
import LabelField from './components/LabelField';
import ContainerFnx from '../Shared/ContainerFnx';
import ViewSpecial from './components/ViewSpecial';
import TextInputFnx from '../Shared/TextInputFnx';
import {styles} from "react-native-theme";
class TwoFactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: true,
            password: '',
            verifyCode: '',
            twoFactorEnabled: null,
            twoFAType: null,
            success: false,
            is_confirm: false,
            title: null,
            content: null,
            ButtonOKText: null
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        let { twoFactorEnabled, twoFAType } = this.props.navigation.state.params;
        this.setState({ twoFactorEnabled, twoFAType });
    }
    disableAuth = async () => {
        const { password, verifyCode } = this.state;
        let user = await jwtDecode();
        let response = await authService.disableGGAuth(user.sub, password, verifyCode);
        if (response.data.status) {
            // this.dropdown.alertWithType('success', 'SUCCESS'.t(), `${response.data.message}`.t())
            this.setState({ is_confirm: true, ButtonCloseText: null, title: 'SUCCESS'.t(), content: `${response.data.message}`.t(), ButtonOKText: 'OK'.t() })

            // Alert.alert("SUCCESS".t(), `${response.data.message}`.t(), [{ text: 'OK'.t(), onPress: () => this.props.navigation.navigate('Account') }])
        } else {
            // this.dropdown.alertWithType('error', 'ERROR'.t(), `${response.data.message}`.t())
            // this.setState({ success: true, is_confirm: true, title: 'ERROR'.t(), content: `${response.data.message}`.t() })
            // Alert.alert("ERROR".t(), `${response.data.message}`.t(), [{ text: 'CLOSE'.t() }])
            this.setState({
                is_confirm: true,
                title: "ERROR".t(),
                ButtonCloseText: "CLOSE".t(),
                content: `${response.data.message}`.t(), ButtonOKText: null
            })
        }
    }
    onCloseAlert = () => {
        if (this.state.success) {
            this.props.navigation.goBack();
        }
    }

    render() {
        const { navigation } = this.props;
        const { isShow, password, verifyCode, twoFactorEnabled, twoFAType, success, is_confirm, title, content, ButtonOKText, ButtonCloseText } = this.state;
        return (
            <ContainerFnx
                title={'GOOGLE_AUTHENTICATION'.t()}
                navigation={navigation}
                
            >
                <DropdownAlert ref={ref => this.dropdown = ref} onClose={success && this.onCloseAlert} closeInterval={2000} errorImageSrc={null} successImageSrc={null} zIndex={Platform.OS === 'ios' ? 10 : 1} />
                <Content >
                    <View>
                        <View stackedLabel
                            style={{ borderBottomWidth: 0, }}
                        >
                            <ViewSpecial>
                                <TextInputFnx
                                    label
                                    placeholder={'PASSWORD'.t()}
                                    value={password} secureTextEntry={true} onChangeText={(password) => this.setState({ password })}
                                />
                            </ViewSpecial>
                          
                        </View>
                        <View stackedLabel
                            style={{ borderBottomWidth: 0 }}
                        >
                            <ViewSpecial
                            >
                                <TextInputFnx
                                    label
                                    placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                                    value={verifyCode} onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                />
                            </ViewSpecial>
                        </View>
                        <View style={{ marginVertical: 20 }}>
                            <Button block primary onPress={this.disableAuth} style={[style.buttonNext, style.buttonHeight,{backgroundColor:styles.bgButton.color}]}>
                                <Text style={style.textWhite}>{'DISABLE'.t()}</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
                <ConfirmModal
                    onRequestClose={async () => {
                        await this.setState({
                            is_confirm: false
                        })
                        setTimeout(() => {
                            navigation.goBack();
                        }, 450)
                    }}
                    visible={is_confirm} title={title} content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => {
                        if (title === "ERROR".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                this.props.navigation.navigate('Account')
                            })
                        }
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={ButtonCloseText}
                />
            </ContainerFnx>

        );
    }
}
// const styles = StyleSheet.create({
//     modalBackground: {
//         flex: 1,
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         backgroundColor: '#00000080'
//     },
//     activityIndicatorWrapper: {
//         backgroundColor: style.container.backgroundColor,
//         width: dimensions.width,
//         height: dimensions.height / 3,
//         padding: 10,
//         justifyContent: 'space-around',
//         alignItems: 'center'
//     },
// })
export default TwoFactor;
