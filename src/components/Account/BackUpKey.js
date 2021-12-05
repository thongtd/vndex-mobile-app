import React from 'react';
import { Text, View, Alert, Clipboard, TouchableOpacity } from 'react-native';
import { style } from "../../config/style";
import { Button, Container } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { jwtDecode } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import ModalCopy from "../Shared/ModalCopy";
import ContainerFnx from '../Shared/ContainerFnx';
import BtnDepositCoin from '../Wallet/Deposit/components/BtnDepositCoin';
import {styles} from "react-native-theme";
class BackUpKey extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            secretKey: null,
            manualEntryKey: null,
            isCopy: false
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getQrCode();
    }

    copyClipboard(url) {
        Clipboard.setString(url);
        this.setState({ isCopy: true })
        // Alert.alert('COPY_TO_CLIPBOARD'.t())
        setTimeout(() => { this.setState({ isCopy: false }) }, 1000)
    }

    getQrCode = async () => {
        let user = await jwtDecode();
        let response = await authService.getQrCode(user.sub);
        this.setState({ secretKey: response.secretKey, manualEntryKey: response.manualEntryKey })
    }

    render() {
        const { navigation } = this.props;
        const { manualEntryKey, secretKey, isCopy } = this.state;
        return (
            <ContainerFnx
                navigation={navigation}
                title={'BACK_UP_KEY'.t()}
                hasRight={
                    <Button transparent onPress={() => navigation.navigate('Account')}>
                        <Text style={[styles.textWhite, { fontSize: 14, marginLeft: 10, paddingLeft: 10 }]}>{'SKIP'.t()}</Text>
                    </Button>}
            >
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={[styles.textWhite, { marginBottom: 30, textAlign: 'center' }]}>{"SAVE_CODE_STEP_3".t()}</Text>
                        <View style={[{ borderWidth: 0.5, borderColor: "#486db5", padding: 15, width: '100%', marginBottom: 20,backgroundColor:styles.bgSub.color}]}>
                            <Text style={[styles.txtMainHl, { textAlign: 'center',fontSize:18 }]}>{manualEntryKey}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                           
                            <Button block style={[{
                                backgroundColor: "transparent", borderColor: style.textMain.color, borderWidth: 1, elevation: 0
                            }, style.buttonHeight, { paddingHorizontal: 10, flexDirection: "row" }]}
                                onPress={() => this.copyClipboard(manualEntryKey)}>
                                <Icon style={{
                                    paddingRight:10
                                }} name={'copy'} size={20} color={styles.textWhiteMain.color} />
                                <Text style={styles.textWhiteMain}>{'COPY'.t()}</Text>
                            </Button>
                        </View>
                    </View>
                    <Button block style={[style.buttonNext, style.buttonHeight, { marginBottom: 20,backgroundColor:styles.bgButton.color }]}
                        onPress={() => navigation.navigate('SetupCode', { secretKey })}
                    >
                        <Text style={style.textWhite}>{'NEXT'.t()}</Text>
                    </Button>
                </View>
                <ModalCopy visible={isCopy} />
            </ContainerFnx>
         
        );
    }
}

export default BackUpKey;
