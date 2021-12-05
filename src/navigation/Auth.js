import {createSwitchNavigator} from 'react-navigation';
import Login from "../components/Auth/Login";
import ResetPassword from "../components/Auth/ResetPassword";
import VerifyCode from "../components/Auth/VerifyCode";
import VerifyReset from "../components/Auth/VerifyReset";
import Register from "../components/Auth/Register";
import FormRegister from "../components/Auth/FormRegister";
import {Stack} from "./Stack";
import AuthLoading from "../components/Auth/AuthLoading";
import Order from "../components/Order/Order";

export const Auth = createSwitchNavigator({

    AuthLoading: {
        screen: AuthLoading
    },
    Order: {
        screen: Order
    },
    Login: {
        screen: Login
    },
    ResetPassword: {
        screen: ResetPassword
    },
    VerifyCode: {
        screen: VerifyCode
    },
    VerifyReset: {
        screen: VerifyReset
    },
    Register: {
        screen: Register
    },
    FormRegister: {
        screen: FormRegister
    },
},{
    initialRoute: 'AuthLoading'
})
