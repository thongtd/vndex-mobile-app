import React, { PureComponent } from 'react';
import {createStackNavigator} from 'react-navigation';
import {StatusBar} from 'react-native';
import {TabBar} from "./TabBar";
import WalletInfo from "../components/Wallet/WalletInfo";
import Setup from "../components/Account/Setup";
import Login from "../components/Auth/Login";
import ResetPassword from "../components/Auth/ResetPassword";
import VerifyCode from "../components/Auth/VerifyCode";
import VerifyReset from "../components/Auth/VerifyReset";
import Register from "../components/Auth/Register";
import FormRegister from "../components/Auth/FormRegister";
import AccountVerification from "../components/Account/AccountVerification";
import TwoFactor from "../components/Account/TwoFactor";
import EmailVerification from "../components/Account/EmailVerification";
import HistoryCoin from "../components/Wallet/History/HistoryCoin";
import HistoryCash from "../components/Wallet/History/HistoryCash";
import WalletInfoCash from "../components/Wallet/WalletInfoCash";
import VerifyEmailCode from "../components/Auth/VerifyEmailCode";
import ChangePassword from "../components/Account/ChangePassword";
import KYCFrontSide from "../components/Account/KYCFrontSide";
import KYCBackSide from "../components/Account/KYCBackSide";
import KYCSelfie from "../components/Account/KYCSelfie";
import OrderDetail from "../components/Order/OrderDetail";
import GuideGoogleAuth1 from "../components/Account/GuideGoogleAuth1";
import BackUpKey from "../components/Account/BackUpKey";
import EnableTwoFactor from "../components/Account/EnableTwoFactor";
import MarketWatchSelect from "../components/Trade/MarketWatchSelect";
import SetupCode from "../components/Account/SetupCode";
import HomeSearch from "../components/Home/HomeSearch";
import HistoryWithdrawCoin from "../components/Wallet/History/HistoryWithdrawCoin";
import WithdrawCast from "../components/Wallet/Withdraw/WithdrawCast";
import WithdrawCoin from "../components/Wallet/Withdraw/WithdrawCoin";
import HistoryDepositCoin from "../components/Wallet/History/HistoryDepositCoin";
import DepositCoin from "../components/Wallet/Deposit/DepositCoin";
import DepositCast from "../components/Wallet/Deposit/DepositCast";
import { View } from 'native-base';
// import ChartFullScreen from '../components/Trade/ChartFullScreen';
import NotifyRegister from '../components/Auth/NotifyRegister';
import { fromLeft,fromRight } from 'react-navigation-transitions';
import { checkLogin ,getLanguage} from "../redux/action/common.action";
import {connect} from 'react-redux'
import {authService} from "../services/authenticate.service"
import {commonService} from "../services/common.service"
import I18n from 'react-native-i18n'
import ReferralFriends from '../components/Account/ReferralFriends';
import Commission from '../components/Account/Commission';
import ChartFnxFullScreen from '../components/Shared/StockChartFullScreen';
import SplashScreen from '../../SplashScreen';

const StackApp = createStackNavigator({
    Stack: {
        screen: TabBar,
        navigationOptions:{
            header: null
        }
    },
    ReferralFriends:{
        screen: ReferralFriends,
        navigationOptions: {
            header: null
        }
    },
    Commission:{
        screen: Commission,
        navigationOptions: {
            header: null
        }
    },
    WalletInfo: {
        screen: WalletInfo,
        navigationOptions: {
            header: null
        }
    },
    OrderDetail: {
        screen: OrderDetail,
        navigationOptions: {
            header: null
        }
    },
    WalletInfoCash: {
        screen: WalletInfoCash,
        navigationOptions: {
            header: null
        }
    },
    Setup: {
        screen: Setup,
        navigationOptions: {
            header: null
        }
    },
    ChangePassword: {
        screen: ChangePassword,
        navigationOptions: {
            header: null
        }
    },
    AccountVerification: {
        screen: AccountVerification,
        navigationOptions: {
            header: null
        }
    },
    KYCFrontSide: {
        screen: KYCFrontSide,
        navigationOptions: {
            header: null
        }
    },
    KYCBackSide: {
        screen: KYCBackSide,
        navigationOptions: {
            header: null
        }
    },
    KYCSelfie: {
        screen: KYCSelfie,
        navigationOptions: {
            header: null
        }
    },
    TwoFactor: {
        screen: TwoFactor,
        navigationOptions: {
            header: null
        }
    },
    EmailVerification: {
        screen: EmailVerification,
        navigationOptions: {
            header: null
        }
    },
    HistoryCoin: {
        screen: HistoryCoin,
        navigationOptions: {
            header: null
        }
    },
    HistoryCash: {
        screen: HistoryCash,
        navigationOptions: {
            header: null
        }
    },

    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    ResetPassword: {
        screen: ResetPassword,
        navigationOptions: {
            header: null
        }
    },
    VerifyCode: {
        screen: VerifyCode,
        navigationOptions: {
            header: null
        }
    },
    VerifyEmailCode: {
        screen: VerifyEmailCode,
        navigationOptions: {
            header: null
        }
    },
    VerifyReset: {
        screen: VerifyReset,
        navigationOptions: {
            header: null
        }
    },
    Register: {
        screen: Register,
        navigationOptions: {
            header: null
        }
    },
    FormRegister: {
        screen: FormRegister,
        navigationOptions: {
            header: null
        }
    },
    NotifyRegister:{
        screen: NotifyRegister,
        navigationOptions: {
            header: null
        }
    },
    GuideGoogleAuth1: {
        screen: GuideGoogleAuth1,
        navigationOptions: {
            header: null
        }
    },
    BackUpKey: {
        screen: BackUpKey,
        navigationOptions: {
            header: null
        }
    },
    SetupCode: {
        screen: SetupCode,
        navigationOptions: {
            header: null
        }
    },
    EnableTwoFactor: {
        screen: EnableTwoFactor,
        navigationOptions: {
            header: null
        }
    },
    MarketWatchSelect:{
        screen: MarketWatchSelect,
        navigationOptions: {
            header: null
        }
    },
    HomeSearch:{
        screen: HomeSearch,
        navigationOptions: {
            header: null
        }
    },
    HistoryWithdrawCoin:{
        screen: HistoryWithdrawCoin,
        navigationOptions:{
            header: null
        }
    },
    WithdrawCoin: {
        screen: WithdrawCoin,
        navigationOptions:{
            header: null
        }
    },
    WithdrawCast:{
        screen: WithdrawCast,
        navigationOptions:{
            header: null
        }
    },
    HistoryDepositCoin:{
        screen: HistoryDepositCoin,
        navigationOptions:{
            header: null
        }
    },
    DepositCoin:{
        screen: DepositCoin,
        navigationOptions:{
            header: null
        }
    },
    FiatDeposit:{
        screen: DepositCast,
        navigationOptions:{
            header: null
        }
    },
    ChartFullScreen: {
        screen: ChartFnxFullScreen,
        navigationOptions: {
            header: null,
            
        }
    },
    SplashScreen: {
        screen: SplashScreen,
        navigationOptions: {
            header: null,
        }
    },
    
},{
    initialRoute: 'Stack',
    transitionConfig: () => fromRight(200),
})
class Stack extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            theme:"default"
        }
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('light-content')
        // StatusBar.setBackgroundColor('transparent')
        commonService.getLanguage().then(lang => {
            if (lang) {
                I18n.locale = lang;
            }
            else {
                commonService.setLanguage(I18n.locale == "en"?"en-US":"vi-VN");
            }
        })
    }
    componentDidMount() {
        this.checkLogIn();
        this.props.getLanguage(I18n.locale == "en"?"en-US":"vi-VN");
    }
   
    checkLogIn = async () => {
        let res = await authService.checkLogged();
        // let userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        if (res) {
            this.props.checkLogin(true);
        } else {
            this.props.checkLogin(false);
        }
    }
    render  () {
        return(
            <View style={{flex: 1}}>
                <StackApp/>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        logged: state.commonReducer.logged,
        theme:state.commonReducer.theme
    }
}
export default connect(mapStateToProps, { checkLogin,getLanguage })(Stack);