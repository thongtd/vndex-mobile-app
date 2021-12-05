import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
    Clipboard,
    ActivityIndicator,
    RefreshControl,
    Share,
    Linking,
    Modal,
    Animated,
    Platform,
    Alert,
    PixelRatio,
    AppState,
    DeviceEventEmitter
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Item, Left, Right, Body, Thumbnail, ListItem, Button, Input, Switch } from 'native-base';
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import { convertUTC, formatCurrency, formatTrunc, jwtDecode, formatMessageByArray } from "../../config/utilities";
import { storageService } from "../../services/storage.service";
import { authService } from "../../services/authenticate.service";
import { tradeService } from "../../services/trade.service";
import { connect } from 'react-redux';
import { checkLogin, offEvent, getListenEvent } from "../../redux/action/common.action";
import QRCode from 'react-native-qrcode-svg';
import { constant } from "../../config/constants";
import DropdownAlert from 'react-native-dropdownalert';
import { httpService } from "../../services/http.service";
import { NavigationEvents } from "react-navigation";
import ConfirmModal from "../Shared/ConfirmModal";
import ModalCopy from "../Shared/ModalCopy";
import Setup from './Setup';
import { Spiner } from '../Shared';
import { setStatusBar } from "../../redux/action/common.action"
import TooltipNotice from '../Shared/TooltipNotice';
import Logout from '../Shared/Logout';
import theme,{ styles } from "react-native-theme";
import LinearGradient from 'react-native-linear-gradient';
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class Account extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lastLogin: [],
            email: '',
            referral: [],
            userCommission: [],
            userCommissionSummary: {},
            info: {},
            loading: true,
            keepLogin: {},
            btcDailyWithdrawLimit: null,
            scrollY: new Animated.Value(0),
            is_confirm: false,
            content: null,
            isCopy: false,
            code: '',
            ButtonOKText: null,
            title: null,
            isTooltip: false,
            isSwitch: false,
            feeToken: 0
        }
    }

    componentWillMount() {
        this.checkLogIn();
    }
    componentDidMount() {
        this.getFee("VND");
        this.getFeeToken();
        AppState.addEventListener("change", this.handleChange);
    }
    getFee = (symbol) => {
        tradeService.getFeeBySymbol(symbol).then(res => {
            this.setState({ fee: res.referrerPercent })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.logged) {
            this.checkLogIn();

        }
    }

    checkLogIn = async () => {
        let res = await authService.getToken();
        AsyncStorage.getItem("ipAddress").then(ip => {
            this.setState({
                ipAddress: ip
            })
        })
        // let userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        if (res) {
            let content = await jwtDecode();
            this.props.checkLogin(true);

            let info = await authService.getUserInfo(content.id);

            let response = await authService.getLastLogin(content.sub);

            let referral = await authService.getUserReferrals(content.sub, content.id, 1, 15);

            let userCommission = await authService.getUserCommission(content.sub, content.id, 1, 15);

            let userCommissionSummary = await authService.getUserCommissionSummary(content.id);
            let btcDailyWithdrawLimit = await storageService.getItem(constant.BTC_WITHDRAWAL_LIMIT);
            // await this.checkIpAddress(response.data);
            response.data.map((item, i) => {
                if (item.ipAddress) {
                    this.setState({
                        lastLogin: item,
                    })
                }
            })
            this.setState({
                // lastLogin: response.data,
                email: content.sub,
                referral: referral.data.source,
                userCommission: userCommission.data.source,
                userCommissionSummary: userCommissionSummary.data,
                btcDailyWithdrawLimit,
                info: info.data,
                loading: false
            })
        } else {
            this.props.checkLogin(false)
            this.setState({ loading: false })
        }
    }
    copyClipboard(url) {
        Clipboard.setString(url);
        this.setState({ isCopy: true })
        // Alert.alert('COPY_TO_CLIPBOARD'.t())
        setTimeout(() => { this.setState({ isCopy: false }) }, 1000)
    }

    handleRefresh = () => {
        this.setState({ loading: true })
        this.checkLogIn();
        this.checkKeepLogin();
        this.getFee("VND");
        this.getFeeToken();
    }

    onClick = () => {
        Share.share({
            message: 'BAM: we\'re helping your business with awesome React Native apps',
            url: 'http://bam.tech',
            title: 'Wow, did you see that?'
        }, {
                // Android only:
                dialogTitle: 'Share BAM goodness',
                // iOS only:
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            })
    }

    checkKeepLogin = async () => {
        let user = await jwtDecode();
        let userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        try {
            let keepLogin = await authService.keepLogin(user.id);
            if (keepLogin) {
                console.log(keepLogin, "keepLogin kaka");
                this.setState({
                    keepLogin,
                    isSwitch: keepLogin.isUseFnxForFee
                })
            } else {
                this.setState({ keepLogin: userInfo })
            }
        } catch (e) {
            // httpService.onError()
        }
    }

    goToEmailVerification(navigation, keepLogin) {
        const { is_confirm } = this.state;
        if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.GG2FA) {
            this.setState({
                is_confirm: true,
                content: "TURN_OFF_2FA_GG_FIRST".t(),
                title: 'WARNING'.t(),
                ButtonOKText: null
            })
            // Alert.alert('WARNING'.t(), "TURN_OFF_2FA_GG_FIRST".t(), [{text: 'CLOSE'.t()}])

        } else {
            navigation.navigate('EmailVerification', {
                twoFAType: keepLogin.twoFAType,
                twoFactorEnabled: keepLogin.twoFactorEnabled
            })
        }
    }

    goToGoogleAuthVerification(navigation, keepLogin) {
        if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            this.setState({
                is_confirm: true,
                content: "TURN_OFF_2FA_EMAIL_FIRST".t(),
                title: 'WARNING'.t(),
                ButtonOKText: null
            })
            // Alert.alert('WARNING'.t(), "TURN_OFF_2FA_EMAIL_FIRST".t(), [{ text: 'CLOSE'.t() }])
        } else {
            navigation.navigate('TwoFactor', {
                twoFAType: keepLogin.twoFAType,
                twoFactorEnabled: keepLogin.twoFactorEnabled
            })
        }
    }

    goToGuideGoogleAuth(navigation, keepLogin) {
        if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
            this.setState({
                is_confirm: true,
                content: "TURN_OFF_2FA_EMAIL_FIRST".t(),
                title: 'WARNING'.t(),
                ButtonOKText: null
            })
            // Alert.alert('WARNING'.t(), "TURN_OFF_2FA_EMAIL_FIRST".t(), [{ text: 'CLOSE'.t() }])
        } else {
            navigation.navigate('GuideGoogleAuth1', {
                twoFAType: keepLogin.twoFAType,
                twoFactorEnabled: keepLogin.twoFactorEnabled
            })
        }
    }

    applyPromotion = async () => {
        const { code } = this.state;
        let user = await jwtDecode();
        let data = {
            accId: user.id,
            code,
            via: 2
        }
        if (code) {
            let response = await authService.applyPromotion(data);
            // Alert.alert('INFORMATION'.t(), response.t(), [{ text: 'CLOSE'.t() }])
            this.setState({
                is_confirm: true,
                content: response.t(),
                title: 'INFORMATION'.t(),
                ButtonOKText: null
            })
        } else {
            // Alert.alert('WARNING'.t(), 'Enter your gift code'.t(), [{ text: 'CLOSE'.t() }])
            this.setState({
                is_confirm: true,
                content: 'Enter your gift code'.t(),
                title: 'WARNING'.t(),
                ButtonOKText: null
            })
        }

    }
    setupUseFnxForFee = async (isUse) => {
        let content = await jwtDecode();
        let isFee = await authService.setupUseFnxForFee(content.id, isUse);
    }
    getFeeToken = async () => {
        let getFeeToken = await authService.getExchangeTokenForFee();
        this.setState({
            feeToken: getFeeToken
        })
    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleChange)
    }
    handleChange = (AppState) => {
        if (AppState === "active") {
            this.handleRefresh()
        }
    }
    render() {
        const { navigation, logged, currencyList,offEvent, getListenEvent } = this.props;
        const { is_confirm, content, lastLogin, email, userCommissionSummary, referral, info, loading, userCommission, keepLogin, btcDailyWithdrawLimit, isCopy, code, ButtonOKText, title, ipAddress, feeToken } = this.state;
        let _lastLogin = lastLogin;
        return (
            <React.Fragment>

                {logged ? (
                    <Container style={[styles.backgroundMain, { paddingBottom: 0, paddingHorizontal: 10 }]}>
                        <NavigationEvents
                            onWillFocus={(payload) => {
                                offEvent(true);
                                getListenEvent([])
                                DeviceEventEmitter.emit('eventScreen', { name: "ACCOUNT" });
                                this.checkKeepLogin();
                                this.checkLogIn();
                                this.props.setStatusBar(style.container.backgroundColor)
                            }}
                           
                        />
                        <Logout
                            navigation={navigation}
                        />
                        <Item style={[stylest.container, { paddingVertical: 12, borderBottomWidth: 0 }]}>
                            <Left>
                                <Text style={[styles.textWhite, style.fontSize18, { fontWeight: '500' }]}>{'USER_INFORMATION'.t()}</Text>
                            </Left>
                            <View style={{ position: 'absolute', top: 0, right: 0, marginTop: 5, }}>
                                <TouchableOpacityFnx
                                    style={{ padding: 10, paddingRight: 0 }}
                                    onPress={() => navigation.navigate('Setup')}>
                                    <Icon name={'cog'} size={20} color={'#696f7b'} />
                                </TouchableOpacityFnx>
                            </View>
                        </Item>
                        {
                            logged ?
                                <Content refreshControl={
                                    <RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />
                                }
                                    showsVerticalScrollIndicator={false}
                                >
                                    <ListItem thumbnail
                                        style={{
                                            paddingBottom: 10
                                        }}>
                                        <Left>
                                            <Thumbnail source={require('../../assets/img/ava.jpg')} large />
                                        </Left>
                                        <Body style={stylest.item}>
                                            <Text style={styles.textWhite}>{email}</Text>

                                            <View>
                                                {
                                                    !keepLogin.isKycUpdated || !keepLogin.verified ?
                                                        <Text style={[styles.bgSellOldNew, { fontSize: 12 }]} note numberOfLines={2}>{'VERIFY_ACC'.t()}</Text>
                                                        :
                                                        <Text style={styles.bgBuyOldNew}>
                                                            {'ACC_VEIRIED'.t()}
                                                        </Text>
                                                }
                                                <TouchableOpacityFnx
                                                    style={{ marginTop: 5 }}
                                                    onPress={() => navigation.navigate('AccountVerification', { keepLogin })}
                                                >
                                                    <Text style={styles.textHighLightOld}>{'Click here'.t()}</Text>
                                                </TouchableOpacityFnx>
                                            </View>
                                        </Body>
                                        <Right style={stylest.item} />
                                    </ListItem>
                                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#808080', marginBottom: 5 }} />
                                    <Item style={[stylest.item, { marginLeft: -1 }]}>
                                        <Left style={[stylest.item, { borderRightWidth: 1, borderRightColor: '#1c2840' }]}>
                                            <Text style={[style.textMain, { fontSize: 12, marginBottom: 10 }]}>{'LAST_LOGIN'.t()}</Text>
                                            <Text
                                                style={[styles.textWhite, { fontSize: 12 }]}>{_lastLogin && convertUTC(_lastLogin.createdDate)}</Text>
                                        </Left>
                                        <Body style={[stylest.item, { borderRightWidth: 1, borderRightColor: '#1c2840' }]}>
                                            <Text style={[style.textMain, { fontSize: 12, marginBottom: 10 }]}>{'IP_ADDRESS'.t()}</Text>
                                            <Text
                                                style={[styles.textWhite, { fontSize: 12 }]}>{(_lastLogin && (_lastLogin.ipAddress || ipAddress)) || "-- --"}</Text>
                                        </Body>
                                        <Right style={stylest.item}>
                                            <Text style={[style.textMain, { fontSize: 12, marginBottom: 10 }]}>{'WITHDRAWAL_LIMIT'.t()}</Text>
                                            <Text
                                                style={[styles.textWhite, { fontSize: 12 }]}>{btcDailyWithdrawLimit} BTC/24h</Text>
                                        </Right>
                                    </Item>
                                    <Item style={[{ height: 40, borderBottomWidth: 0, marginLeft: 0, marginRight: 0, backgroundColor: styles.bgSub.color, justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center" }]}>
                                        <Left style={[{ flex: 1, paddingLeft: 10 }]}>
                                            <Text style={[styles.textWhite]}>{formatMessageByArray("Using FNX for fees".t(), [feeToken])}</Text>
                                        </Left>
                                        <Right style={[{ flex: 0, paddingRight: 5 }]}>
                                            <Switch style={Platform.OS === "ios" ? {
                                                transform: [{ scaleX: .7 }, { scaleY: .7 }],

                                            } : {}}
                                                value={this.state.isSwitch} onValueChange={() => {
                                                    this.setState({
                                                        isSwitch: !this.state.isSwitch
                                                    }, () => {
                                                        this.setupUseFnxForFee(this.state.isSwitch)
                                                    })
                                                }}
                                            />
                                        </Right>
                                    </Item>
                                    <Text style={[styles.textWhite, style.fontSize16, { marginVertical: 10, fontWeight: '600' }]}>{"SECURITY".t()}</Text>
                                    <FlatList
                                        data={['1']}
                                        renderItem={() => (
                                            <View style={stylest.security}>
                                                <View style={[stylest.setting, styles.bgSub]}
                                                >
                                                    <Item style={[stylest.item]}>
                                                        <Left style={{ flex: 2 }}><Text
                                                            style={{ color: styles.textWhite.color, fontSize: 12 }}>{'EMAIL_VERIFICATION'.t()}</Text></Left>
                                                        {
                                                            keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA
                                                                ? <Right>
                                                                    <TouchableOpacityFnx
                                                                        onPress={() => this.goToEmailVerification(navigation, keepLogin)}
                                                                    // style={{ backgroundColor: '#1d5373', height: 30, width: 80, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                                                                    >
                                                                        <LinearGradient
                                                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                                            colors={theme.name === 'light'?['#a8f0fa', '#b0ddf8', '#b5cdf6']:["#226275","#204a72","#253e70"]}
                                                                            style={{ backgroundColor: '#1d5373', height: 30, width: 80, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                                                                        >
                                                                            <Text style={styles.textWhiteMain}>{'DISABLE'.t()}</Text>
                                                                        </LinearGradient>

                                                                    </TouchableOpacityFnx>
                                                                </Right>
                                                                : <Right>
                                                                    <TouchableOpacityFnx
                                                                        onPress={() => this.goToEmailVerification(navigation, keepLogin)}

                                                                    >
                                                                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                                                         colors={theme.name === 'light'?['#a8f0fa', '#b0ddf8', '#b5cdf6']:["#226275","#204a72","#253e70"]}
                                                                            style={{ backgroundColor: '#1d5373', height: 30, width: 80, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                                                                        >
                                                                            <Text style={styles.textWhiteMain}>{'ENABLE'.t()}</Text>
                                                                        </LinearGradient>

                                                                    </TouchableOpacityFnx>
                                                                </Right>
                                                        }
                                                    </Item>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={require('../../assets/img/mail-1.png')}
                                                            resizeMode={"contain"}
                                                            style={{ width: 120, height: 80 }} />
                                                        <Text
                                                            style={[style.textAddress, { textAlign: 'center', padding: 20, paddingBottom: 10, fontSize: 10 }, styles.textMain]}>{'EMAIL_VERIFY_NOTE'.t()}</Text>
                                                    </View>
                                                </View>
                                                <View style={[stylest.setting, { marginLeft: 7.5 }, styles.bgSub]}
                                                >
                                                    <Item style={stylest.item}>
                                                        <Left style={{ paddingRight: 10, flex: 2 }}><Text style={{ color: styles.textWhite.color, fontSize: 12 }}>{'GOOGLE_AUTHENTICATION'.t()}</Text></Left>
                                                        {
                                                            keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.GG2FA
                                                                ? <Right>
                                                                    <TouchableOpacityFnx
                                                                        onPress={() => this.goToGoogleAuthVerification(navigation, keepLogin)}
                                                                    >
                                                                        <LinearGradient
                                                                            style={{ backgroundColor: '#1d5373', height: 30, width: 80, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                                                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                                                                             colors={theme.name === 'light'?['#a8f0fa', '#b0ddf8', '#b5cdf6']:["#226275","#204a72","#253e70"]}>
                                                                            <Text style={styles.textWhiteMain}>{'DISABLE'.t()}</Text>
                                                                        </LinearGradient>

                                                                    </TouchableOpacityFnx>
                                                                </Right>
                                                                : <Right>
                                                                    <TouchableOpacityFnx
                                                                        onPress={() => this.goToGuideGoogleAuth(navigation, keepLogin)}
                                                                      
                                                                    >
                                                                        <LinearGradient
                                                                         start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  colors={theme.name === 'light'?['#a8f0fa', '#b0ddf8', '#b5cdf6']:["#226275","#204a72","#253e70"]}
                                                                            style={{ backgroundColor: '#1d5373', height: 30, width: 80, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={styles.textWhiteMain}>{'ENABLE'.t()}</Text>
                                                                        </LinearGradient>

                                                                    </TouchableOpacityFnx>
                                                                </Right>
                                                        }
                                                    </Item>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={require('../../assets/img/google-1.png')}
                                                            resizeMode={"contain"}
                                                            style={{ width: 120, height: 80 }} />
                                                        <Text
                                                            style={[styles.textMain, { textAlign: 'center', padding: 20, paddingBottom: 10, fontSize: 10 }]}>{'EMAIL_VERIFY_NOTE'.t()}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                        horizontal={true}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                    <View style={{
                                        flexDirection: "row",
                                        marginVertical: 10,
                                    }}>
                                        <Text style={[styles.textWhite, { fontWeight: '600' }, style.fontSize16]}>{"REFERRALS".t()}{"  "}
                                        </Text>
                                        <TouchableOpacityFnx
                                            style={{
                                                marginTop: 2
                                            }}
                                            onPress={() => this.setState({
                                                isTooltip: true
                                            })}
                                        >
                                            <Icon name="exclamation-circle" size={16} color={"#486db4"} />
                                        </TouchableOpacityFnx>
                                        <TooltipNotice
                                            content={<View
                                                style={{
                                                    width: "97%"
                                                }}>
                                                <View style={{
                                                    flexDirection: "row",
                                                    paddingVertical: 5
                                                }}>
                                                    <Text style={[styles.textMain, Platform.OS === "ios" ? { fontSize: 12 } : { marginTop: 2, fontSize: 9, }]}>&#9679; </Text>
                                                    <Text
                                                        style={[styles.textWhite]}>
                                                        {"REFERRAL_NOTICE.first_1".t()}
                                                        <Text style={{
                                                            color: styles.txtHl.color
                                                        }}>{" "}{this.state.fee}%{" "}</Text>
                                                        <Text>{"REFERRAL_NOTICE.first".t()}</Text>
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: "row",
                                                    paddingVertical: 5
                                                }}>
                                                    <Text style={[styles.textMain, Platform.OS === "ios" ? { fontSize: 12 } : { marginTop: 2, fontSize: 9, }]}>&#9679; </Text>
                                                    <Text style={[styles.textWhite]}>
                                                        {"REFERRAL_NOTICE.second".t()}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: "row",
                                                    paddingVertical: 5
                                                }}>
                                                    <Text style={[styles.textMain, Platform.OS === "ios" ? { fontSize: 12 } : { marginTop: 2, fontSize: 9, }]}>&#9679; </Text>
                                                    <Text style={[styles.textWhite]}>
                                                        {"REFERRAL_NOTICE.three".t()}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: "row",
                                                    paddingVertical: 5
                                                }}>
                                                    <Text style={[styles.textMain, Platform.OS === "ios" ? { fontSize: 12 } : { marginTop: 2, fontSize: 9, }]}>&#9679; </Text>
                                                    <Text style={[styles.textWhite]}>
                                                        {"REFERRAL_NOTICE.four".t()}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: "row",
                                                    paddingVertical: 5
                                                }}>
                                                    <Text style={[styles.textMain, Platform.OS === "ios" ? { fontSize: 12 } : { marginTop: 3, fontSize: 9, }]}>&#9679; </Text>
                                                    <Text style={[styles.textWhite]}>
                                                        <Text style={{
                                                            color: "#FFC200"
                                                        }}>{"REFERRAL_NOTICE.ImportantNotice".t()}</Text>
                                                        {"REFERRAL_NOTICE.five".t()}
                                                    </Text>
                                                </View>


                                            </View>}
                                            isTooltip={this.state.isTooltip}
                                            onClose={() => this.setState({
                                                isTooltip: false
                                            })} />
                                    </View>

                                    <FlatList
                                        data={['1']}
                                        renderItem={() => (
                                            <View style={stylest.security}>
                                                <Button iconLeft light style={[stylest.referral, style.buttonHeight, styles.bgSub]} disabled>
                                                    <Image source={require('../../assets/img/referral_1.png')}
                                                        style={{ width: 25, height: 25, marginRight: 10 }} />
                                                    <Text style={styles.textWhite}>1.{'TAKE_THE_LINK'.t()}</Text>
                                                </Button>
                                                <Button iconLeft light style={[stylest.referral, style.buttonHeight, styles.bgSub]} disabled>
                                                    <Image source={require('../../assets/img/referral_2.png')}
                                                        style={{ width: 25, height: 25, marginRight: 10 }} />
                                                    <Text style={styles.textWhite}>2.{'INTRODUCE_FRIEND'.t()}</Text>
                                                </Button>
                                                <Button iconLeft light style={[stylest.referral, style.buttonHeight, { marginRight: 0 }, styles.bgSub]} disabled>
                                                    <Image source={require('../../assets/img/referral_3.png')}
                                                        style={{ width: 35, height: 25, marginRight: 10 }} />
                                                    <Text style={styles.textWhite}>3.{'GET_REWARD'.t()}</Text>
                                                </Button>
                                            </View>
                                        )}
                                        horizontal={true}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                    <View style={[stylest.introduce, styles.bgSub]}>
                                        <Text style={[{ marginLeft: 10, fontWeight: "bold", fontSize: 15, paddingTop: 5, paddingBottom: 10 }, styles.textWhite]}>{"REFERRAL_ID".t()}</Text>
                                        <ListItem thumbnail>
                                            <Left style={{ marginLeft: -7.5, borderWidth: 1, borderColor: '#fff' }}>
                                                <QRCode
                                                    value={userCommissionSummary.referralUrl}
                                                    // logo={{uri: `data:image/png;base64,${userCommissionSummary.qrCode}`}}
                                                    logoSize={30}
                                                    logoBackgroundColor='transparent'
                                                />
                                            </Left>
                                            <Body style={{ justifyContent: 'space-between', borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15 }}>
                                                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: -15 }}>
                                                    <Text style={styles.textMain}>{'MY_REFERRAL_ID'.t()}</Text>
                                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-start', marginTop: 5 }}>
                                                        <Text style={[styles.textWhite]} note
                                                            numberOfLines={1}>{userCommissionSummary.referralId}</Text>
                                                        <TouchableOpacityFnx style={[style.buttonHeight, { backgroundColor: 'transparent', alignItems: 'center' }]}
                                                            onPress={() => this.copyClipboard(userCommissionSummary.referralId)}>
                                                            <Icon name={"copy"} style={{ paddingLeft: 8, marginVertical: 0 }} color={styles.textWhite.color} size={15} />
                                                        </TouchableOpacityFnx>
                                                    </View>
                                                </View>
                                                <View style={[{ justifyContent: 'flex-end', marginTop: -10 }]}>
                                                    <Text style={[styles.textMain, {}]}>{'SHARE'.t()}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                        <TouchableOpacityFnx
                                                            style={{ marginRight: 5, marginBottom: 0 }}
                                                            onPress={() => Linking.openURL(constant.SHARE.TWITTER)}
                                                        >
                                                            <Icon name={'twitter'} color={'#4a6cb4'} size={22} />
                                                        </TouchableOpacityFnx>
                                                        <TouchableOpacityFnx
                                                            style={{ marginLeft: 5, marginBottom: 0 }}
                                                            onPress={() => Linking.openURL(constant.SHARE.FACEBOOK)}
                                                        >
                                                            <Icon name={'facebook'} color={'#4a6cb4'} size={22} />
                                                        </TouchableOpacityFnx>
                                                    </View>
                                                </View>
                                            </Body>
                                            {/*<Right style={stylest.item}/>*/}
                                        </ListItem>
                                        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                                            <Text style={[styles.textMain, {}]}>{'LINK_INTRODUCE'.t()}</Text>
                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                <Text style={[{ width: "92%", color: styles.txtHl.color }]}
                                                    numberOfLines={1}>{userCommissionSummary.referralUrl}</Text>
                                                <TouchableOpacityFnx style={[style.buttonHeight, { width: '8%', justifyContent: 'center', backgroundColor: 'transparent', marginVertical: 0, alignItems: 'center' }]}
                                                    onPress={() => this.copyClipboard(userCommissionSummary.referralUrl)}>
                                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.textWhite.color} size={15} />
                                                </TouchableOpacityFnx>
                                            </View>
                                        </View>
                                        <Text style={[styles.textMain, { marginHorizontal: 10 }]}>
                                            {"ESTIMATED_COMMISSION".t()}
                                        </Text>
                                        <FlatList
                                            data={["1"]}
                                            renderItem={() => (
                                                <View style={stylest.security}>
                                                    <FlatList
                                                        style={{ flexDirection: 'row' }}
                                                        renderItem={({ item, index }) => (
                                                            <View style={[stylest.borderRight, { paddingHorizontal: 20 }]}>

                                                                <Text
                                                                    style={styles.textWhite}>{formatTrunc(currencyList, item.amount, item.paymentUnit)}{" "}({item.paymentUnit})</Text>
                                                            </View>
                                                        )}
                                                        data={userCommissionSummary.commissionAmounts}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        horizontal={true}
                                                    />
                                                </View>
                                            )}
                                            horizontal={true}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View>
                                    <View style={[stylest.referralFriend, styles.bgSub]}>
                                        <TouchableOpacityFnx
                                            onPress={() => {
                                                navigation.navigate("ReferralFriends", {
                                                    data: referral
                                                })
                                            }}
                                            style={[stylest.item, { paddingTop: 5, paddingBottom: 5, justifyContent: "space-between", flexDirection: "row" }]}>
                                            <Left><Text style={[{ fontWeight: "bold", fontSize: 15 }, styles.textWhite]}>{'REFERRAL_FRIENDS'.t()}{": "}{userCommissionSummary.totalShared}</Text></Left>
                                            <Right>
                                                <Icon name={'arrow-right'} size={15} color={'#c9c9c9'} />
                                            </Right>
                                        </TouchableOpacityFnx>
                                    </View>
                                    <View style={[stylest.commission, styles.bgSub]}>

                                        <TouchableOpacityFnx
                                            onPress={() => {
                                                navigation.navigate("Commission", {
                                                    data: userCommission,
                                                    currencyList
                                                })
                                            }}
                                            style={[stylest.item, { paddingTop: 5, paddingBottom: 5, justifyContent: "space-between", flexDirection: "row" }]}>
                                            <Left><Text style={[{ fontWeight: "bold", fontSize: 15, }, styles.textWhite]}>{'COMMISSION_DETAILS'.t()}</Text></Left>
                                            <Right>
                                                <Icon name={'arrow-right'} size={15} color={'#c9c9c9'} />
                                            </Right>
                                        </TouchableOpacityFnx>
                                    </View>
                                    <Text style={[styles.textWhite, { marginVertical: 10, fontWeight: '600' }, style.fontSize16]}>{'GIFT_CODE'.t()}</Text>
                                    <View style={[stylest.commission, styles.bgSub]}>

                                        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                            <Input
                                                allowFontScaling={false}
                                                style={[styles.textWhite, stylest.input, { fontSize: 14 / PixelRatio.getFontScale(), paddingLeft: 10, backgroundColor: styles.bgMain.color }]} value={code}
                                                placeholder={'Enter your gift code'.t()}
                                                placeholderTextColor={styles.txtPh.color}
                                                onChangeText={(code) => this.setState({ code })} />
                                            <TouchableOpacityFnx
                                                style={[style.buttonNext, {
                                                    width: '30%',
                                                    justifyContent: 'center',
                                                    height: 40,
                                                    alignItems: 'center',
                                                    borderTopRightRadius: 3,
                                                    borderBottomRightRadius: 0,
                                                    backgroundColor: styles.bgButton.color
                                                }]}
                                                onPress={this.applyPromotion}
                                            >
                                                <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
                                            </TouchableOpacityFnx>
                                        </View>
                                    </View>
                                </Content>
                                :
                                loading ?
                                    <ActivityIndicator color={"#06ffff"} animating={loading} />
                                    :
                                    <View>
                                    </View>

                        }
                        <ConfirmModal
                            visible={is_confirm}
                            title={title}
                            content={content}
                            onClose={() => this.setState({
                                is_confirm: false,
                                resultType: "",
                                resultText: ""
                            })}
                            onOK={() => this.setState({
                                is_confirm: false
                            })}
                            resultText={this.state.resultText}
                            resultType={this.state.resultType}
                            ButtonOKText={ButtonOKText}
                            ButtonCloseText={"CLOSE".t()}
                        />
                        <ModalCopy visible={isCopy} />
                    </Container>
                ) : (
                        <Setup
                            navigation={navigation}
                        />

                    )}
            </React.Fragment>

        );
    }
}

const stylest = StyleSheet.create({
    item: {
        borderBottomWidth: 0,
        paddingBottom: 10
    },
    security: {
        flexDirection: 'row',
        // marginTop: 10
    },
    setting: {
        width: width / 1.4,
        //margin: 5,
        backgroundColor: '#192240',
        padding: 10,
    },
    referral: {
        padding: 10,
        marginRight: 7.5,
        justifyContent: 'center',
        backgroundColor: '#192240',
        borderRadius: 0
    },
    introduce: {
        paddingVertical: 5,
        backgroundColor: '#192240',
        marginBottom: 10,
        marginTop: 10
    },
    commission: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#192240',
    },
    referralFriend: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#192240',
        marginBottom: 10
    },
    share: {
        flexDirection: 'row'
    },
    borderRight: {
        borderRightWidth: 0.5,
        borderRightColor: '#4a6cb4',
        padding: 5,
        margin: 5
    },
    input: {
        backgroundColor: '#1a2236',
        borderRadius: 2,
        height: 40,
        paddingHorizontal: 10,
    }
})

const mapStateToProps = state => {
    return {
        logged: state.commonReducer.logged,
        currencyList: state.commonReducer.currencyList,
        colorStatusBar: state.commonReducer.statusBar
    }
}
export default connect(mapStateToProps, { checkLogin, setStatusBar,offEvent, getListenEvent })(Account);
