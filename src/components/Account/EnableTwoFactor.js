import React from 'react';
import { Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { style } from "../../config/style";
import DropdownAlert from "react-native-dropdownalert";
import { Button, Container, Content, Header, Input, Item, Label, Left, Right } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import ConfirmModal from "../Shared/ConfirmModal";
import LabelField from './components/LabelField';
import ContainerFnx from '../Shared/ContainerFnx';
import ViewSpecial from './components/ViewSpecial';
import TextInputFnx from '../Shared/TextInputFnx';
import {styles} from "react-native-theme";
class EnableTwoFactor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            verifyCode: "",
            secretKey: this.props.navigation.state.params.secretKey,
            success: false,
            is_confirm: false,
            title: null,
            content: null,
            ButtonOKText: null
        }
    }

    componentWillMount() {

    }

    async componentDidMount() {

    }

    handleSubmit = async () => {
        let user = await jwtDecode();
        const { password, verifyCode, secretKey } = this.state;
        let data = {
            password, verifyCode, email: user.sub, secretKey
        }
        let response = await authService.setupGoogleAuth(data);
        if (response.code === 1) {
            this.setState({ is_confirm: true, title: 'SUCCESS'.t(), content: `${response.message}`.t(), ButtonOKText: 'OK'.t(), ButtonCloseText: null })
            // this.dropdown.alertWithType('success', 'SUCCESS'.t(), response.message)
            // Alert.alert("SUCCESS".t(), `${response.message}`.t(), [{text: 'OK'.t(), onPress: () => this.props.navigation.navigate('Account')}])
        } else {
            // this.dropdown.alertWithType('error', 'ERROR'.t(), response.message)
            // this.setState({ success: true, is_confirm: true, title: 'ERROR'.t(), content: `${response.message}`.t() })
            // Alert.alert("ERROR".t(), `${response.message}`.t(), [{text: 'CLOSE'.t()}])
            this.setState({ ButtonCloseText: "CLOSE".t(), is_confirm: true, title: "ERROR".t(), content: `${response.message}`.t(), ButtonOKText: null })
        }
    }
    onCloseAlert = () => {
        if (this.state.success) {
            this.props.navigation.navigate('Account');
        }
    }

    render() {
        const { navigation } = this.props;
        const { password, verifyCode, success, content, is_confirm, title, ButtonOKText, ButtonCloseText } = this.state;
        return (
            <ContainerFnx
                title={'GOOGLE_AUTHENTICATION'.t()}
                navigation={navigation}
                hasRight={
                    <Button transparent onPress={() => navigation.navigate('Account')}>
                        <Text style={[styles.textWhite, { fontSize: 14, marginLeft: 10, paddingLeft: 10 }]}>{'SKIP'.t()}</Text>
                    </Button>}
            >
                <Content >
                    <View style={{ marginBottom: 10 }}>
                        <View stackedLabel
                            style={{ borderBottomWidth: 0 }}
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
                            <ViewSpecial>
                                <TextInputFnx 
                                label
                                placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                                value={verifyCode} onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                />
                            </ViewSpecial>
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Button block primary onPress={this.handleSubmit} style={[style.buttonNext, style.buttonHeight,{backgroundColor:styles.bgButton.color}]}>
                            <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
                        </Button>
                    </View>
                </Content>
                <ConfirmModal
                    onRequestClose={async () => {
                        await this.setState({
                            is_confirm: false
                        })
                        setTimeout(() => {
                            navigation.navigate('Account');
                        }, 450)
                    }}
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false })}
                    onOK={() => {
                        if (title === "ERROR".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                this.props.navigation.navigate('Account')
                            })
                        }
                    }}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={ButtonCloseText}
                />
            </ContainerFnx>
            // <Container style={{ backgroundColor: '#1c2840' }}>
            //     {/*<DropdownAlert ref={ref => this.dropdown = ref} onClose={success && this.onCloseAlert} closeInterval={2000} errorImageSrc={null} successImageSrc={null} zIndex={Platform.OS === 'ios' ? 10 : 1} />*/}
            //     <TouchableOpacity transparent onPress={() => navigation.goBack()} style={{ flexDirection: 'row', padding: 15, alignItems: "center" }}>
            //         <View style={[style.btnArrowLeft.dash]}>
            //             <View style={style.btnArrowLeft.arrow}>
            //             </View>
            //         </View>
            //         <Text style={[style.textWhite, style.splitHeader, { fontSize: 18, fontWeight: 'bold' }]}>{'GOOGLE_AUTHENTICATION'.t()}</Text>
            //     </TouchableOpacity>

            // </Container>
        );
    }
}

export default EnableTwoFactor;
