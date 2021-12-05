import React from 'react';
import {Image, View, Text, Modal, TextInput, StyleSheet, Dimensions, TouchableOpacity, Clipboard, StatusBar, BackHandler } from 'react-native';
import { Container, Content, Item, Button, Left, Right, Header } from 'native-base';
import { style } from "../../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import QRCode from "react-native-qrcode-svg";
import { dimensions, formatMessageByArray, jwtDecode } from "../../../config/utilities";
import ModalCopy from "../../Shared/ModalCopy";
import { HeaderFnx } from "../../Shared"
import BtnDepositCoin from './components/BtnDepositCoin';
import ShowQrCode from './components/ShowQrCode';
import Note from '../../Shared/Note';
import I18n from "react-native-i18n"
import NoticeAlert from '../../Shared/NoticeAlert';
import { setStatusBar } from "../../../redux/action/common.action"
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation"
import ContainerFnx from '../../Shared/ContainerFnx';
import PickerSearch from '../../Shared/PickerSearch';
import { authService } from '../../../services/authenticate.service';
import { setCurrencyWithdrawFiat } from '../../../redux/action/wallet.action';
// var locale = I18n.currentLocale();
import {styles} from "react-native-theme";
const { width, height } = Dimensions.get('window');

class DepositCoin extends React.Component {
    constructor(props) {
        super(props);
        const { infoCurrency } = this.props.navigation.state.params;
        this.state = {
            cryptoAddress: infoCurrency.cryptoAddress,
            symbol: infoCurrency.symbol,
            addressQrCode: infoCurrency.addressQrCode,
            isCopy: false,
            fields: infoCurrency.fields ? infoCurrency.fields : null,
            isQrcode: false,
            extraFields: infoCurrency.extraFields,
            isNotice: true,
            language: "en-US"
        }
    }

    async copyClipboard(url) {
        await Clipboard.setString(url);
        this.setState({ isCopy: true })
        setTimeout(() => { this.setState({ isCopy: false }) }, 1000)
    }
    componentWillReceiveProps = (nextProps) => {
        console.log(nextProps, "next props kaka");
        if (nextProps.language !== this.props.language) {
            this.setState({
                language: nextProps.language
            })
        }
    };
    onHandleSelected = (text) => {
        this.setState({
            symbol: text
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.symbol !== this.state.symbol) {
            this.getBanlanceCurrency(this.state.symbol);
        }
    }
    getBanlanceCurrency = async (symbol) => {
        let user = await jwtDecode();
        let infoCurrency = await authService.getWalletBalanceByCurrency(user.id, symbol);
        this.setState({
            cryptoAddress: infoCurrency.cryptoAddress,
            symbol: infoCurrency.symbol,
            addressQrCode: infoCurrency.addressQrCode,
            fields: infoCurrency.fields ? infoCurrency.fields : null,
            extraFields: infoCurrency.extraFields,
        }, () => {
            if (this.state.extraFields.length > 0) {
                this.setState({
                    isNotice: true
                })
            }
        });
    }
    close = () => {
        this.props.navigation.goBack();
        this.props.setCurrencyWithdrawFiat(this.state.symbol);
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        this.props.setCurrencyWithdrawFiat(this.state.symbol);
    }
    render() {
        const { cryptoAddress, symbol, addressQrCode, isCopy, isQrcode, onRequestClose, cryptoDestinationTag, extraFields } = this.state;
        const { navigation, language } = this.props;
        const { cryptoWallet,fromHome } = navigation.state.params;
        console.log(cryptoAddress, "extraFields hihi kaka");
        // console.log( this.props.navigation.state.params.infoCurrency,"infoCurrency hihi")
        return (
            <ContainerFnx
                spaceTop={0}
                isbtnSpecial
                onPress={this.close}
                backgroundHeader={styles.bgMain.color}
                title={`${'DEPOSITS'.t()} ${symbol}`}
                hasBack
                navigation={navigation}
                style={style.bgHeader}
                colorStatus={style.bgHeader.backgroundColor}
                hasRight={
                    <PickerSearch
                        autoEnable={fromHome?true:false}
                        renderItem={(data) => {
                            return (
                                <View style={{
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: styles.borderBottomItem.color,
                                    height: 45,
                                    flexDirection: "row"
                                }}>
                                    <View style={{
                                         alignItems:"center",
                                         alignSelf:"center"
                                    }}>
                                        <Image source={{ uri: data.images }} style={{
                                            width: 15,
                                            height: 15,
                                        }} />
                                    </View>

                                    <Text style={{
                                        color: styles.textWhite.color,
                                        fontSize: 14,
                                        paddingLeft: 15,
                                        lineHeight: 45,
                                        fontWeight:"bold"
                                    }}>{data.symbol}
                                    </Text>
                                    <Text style={[styles.txtMainSub, {
                                        fontSize: 12,
                                        paddingLeft: 15,
                                        lineHeight: 45
                                    }]}>
                                        ({data.name})
                            </Text>
                                </View>
                            )
                        }}
                        selectedValue={symbol}
                        onValueChange={this.onHandleSelected}
                        placeholder={''}
                        label={["symbol"]}
                        textCenter={""}
                        value={"symbol"}
                        source={cryptoWallet}
                        hasBtn={
                            <Icon name={"list"} size={15} style={{
                                padding: 20
                            }} color={styles.textWhite.color} />
                        }
                    />
                }
            >
                <View style={[{
                    flex: 1,
                    flexDirection: 'column',

                }, style.container]}>
                    <View style={[styles.bgMain, { flex: 1, paddingTop: 20 }]}>
                        <View>
                            <Text style={styles.txtMainTitle}>
                                {`${formatMessageByArray('DEPOSIT_ADDRESS'.t(), [symbol])}`}
                            </Text>
                            <Text style={[style.textAddress, { paddingVertical: 10 }]}>{cryptoAddress}</Text>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                                <BtnDepositCoin
                                    nameIcon={'copy'}
                                    onPress={() => this.copyClipboard(cryptoAddress)}
                                    titleBtn={`${'COPY'.t()} ${'ADDRESS'.t()}`}
                                />
                                <BtnDepositCoin
                                    nameIcon={'qrcode'}
                                    onPress={() => this.setState({
                                        isQrcode: true
                                    })}
                                    titleBtn={"SHOW_QR_CODE".t()}
                                />
                            </View>
                        </View>
                        {extraFields && extraFields.length > 0 ?
                            extraFields.map((item, index) => {
                                if (item.localizations[language] && item.localizations[language].DepositWarningMsg && item.localizations[language].AgreeMsg) {
                                    return (
                                        <NoticeAlert
                                            onRequestClose={() => {
                                                this.setState({
                                                    isNotice: false
                                                })
                                            }}
                                            visible={this.state.isNotice}
                                            hasContent={
                                                <React.Fragment>
                                                    <Text style={{
                                                        color: "black",
                                                        fontSize: 15,
                                                        textAlign: "center"
                                                    }}>
                                                        {item.localizations[language].DepositWarningMsg}
                                                    </Text>
                                                    <Text style={{
                                                        marginVertical: 10,
                                                        color: style.colorMain,
                                                        fontSize: 15,
                                                        textAlign: "center"
                                                    }}>
                                                        {item.localizations[language].AgreeMsg}
                                                    </Text>
                                                </React.Fragment>

                                            }
                                            titleBtn={
                                                "I_UNDERSTANT_CONTINUTE".t()
                                            }
                                            styleBtn={{
                                                backgroundColor: "#fff",
                                                borderWidth: 1,
                                                borderColor: style.colorMain,
                                                width: "100%",
                                                borderRadius: 2.5,
                                                height: 40,
                                                justifyContent: "center",
                                                alignItems: "center"
                                                // flex:1
                                            }}
                                            styleViewBtn={{
                                                width: "100%"
                                            }}
                                            styleTextBtn={{ color: style.colorMain }}
                                        />
                                    )
                                }
                            })
                            : null}
                        {extraFields && extraFields.length > 0 ? extraFields.map((item, index) => {
                            return (
                                <View key={index} style={{
                                    paddingTop: 20
                                }}>
                                    <Text style={styles.txtMainTitle}>
                                        {item.localizations[language].FieldName || ""}
                                    </Text>
                                    <Text style={[style.textAddress, { paddingVertical: 10 }]}>{item.value || ""}</Text>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}>
                                        <BtnDepositCoin
                                            nameIcon={'copy'}
                                            onPress={() => this.copyClipboard(item.value || "")}
                                            titleBtn={`${'COPY'.t()} ${item.localizations[language].FieldName}`}
                                        />
                                    </View>
                                </View>
                            )
                        }) : null}
                        <Note
                            contentFirst={`NOTE_HAS_TAG`.t()}
                            contentSecond={`${"DEPOSIT_WARNING_1".t()} ${symbol} ${"DEPOSIT_WARNING_2".t()}`}
                            hasContentSecond
                            hasContentFirst={symbol == "XRP" ? true : false}
                        />
                    </View>
                </View>
                <ModalCopy visible={isCopy} />


                <ShowQrCode
                    visibleQrcode={isQrcode}
                    onRequestClose={() => this.setState({
                        isQrcode: false
                    })}
                    symbol={symbol}
                    address={cryptoAddress}
                    onCopy={() => this.copyClipboard(cryptoAddress)}
                />
            </ContainerFnx>

        )
    }
}
// const styles = StyleSheet.create({
//     modalBackground: {
//         flex: 1,
//         alignItems: 'center',
//         //flexDirection: 'column',
//         justifyContent: 'center',
//         backgroundColor: '#00000090',
//     },
//     activityIndicatorWrapper: {
//         backgroundColor: '#1c2840',
//         width: width - 20,
//         padding: 20,
//         // justifyContent: 'center',
//         marginLeft: 10,
//         marginRight: 10
//     },
//     item: {
//         borderBottomWidth: 0
//     }
// })
const mapStateToProps = (state) => {
    return {
        statusBar: state.commonReducer.statusBar,
        language: state.commonReducer.language
    }
}
export default connect(mapStateToProps, { setStatusBar, setCurrencyWithdrawFiat })(DepositCoin);
