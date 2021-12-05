import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    Alert,
    Keyboard,
    TextInput, PixelRatio,
    StyleSheet
} from 'react-native';
import {
    Body,
    Button,
    Container,
    Content,
    Header,
    Left,
    Right,
    Item,
    Label,
    Input,
    Card,
    CardItem,
    Picker,
} from 'native-base';
import { style } from "../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { convertDate, convertTimeStamp, convertUTC, dimensions, jwtDecode, to_UTCDate } from "../../config/utilities";
import DateTimePicker from "react-native-modal-datetime-picker";
import { authService } from "../../services/authenticate.service";
import DropdownAlert from "react-native-dropdownalert";
import ConfirmModal from "../Shared/ConfirmModal";
import { EXCHANGE_API } from "../../config/API";
import { storageService } from "../../services/storage.service";
import TextField from "../Shared/TextField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomPicker from '../Shared/customPicker'
import LabelField from './components/LabelField';
import ViewSpecial from './components/ViewSpecial';
import connect from "react-redux/es/connect/connect";
import { NavigationEvents } from "react-navigation"
import { setStatusBar } from "../../redux/action/common.action"
import ContainerFnx from '../Shared/ContainerFnx';
import TextInputFnx from '../Shared/TextInputFnx';
import {styles} from "react-native-theme";
// import ModalAlert from '../Shared/ModalAlert';
class AccountVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: "",
            isDateTimeToPickerVisible: false,
            birthDate: null,
            countryCode: null,
            countryName: null,
            country_list: [],
            firstName: null,
            lastName: null,
            identityUserId: null,
            identityCard: null,
            postalCode: null,
            city: null,
            success: false,
            require: false,
            loading: false,
            is_confirm: false,
            title: null,
            content: null,
            isDisabled: false,
            backIdentityCard: null,
            frontIdentityCard: null,
            selfie: null,
            ButtonOKText: null
        }
    }

    async componentDidMount() {
        this._getCountry();
        const { keepLogin } = this.props.navigation.state.params;
        if (keepLogin.isKycUpdated && keepLogin.verified) {
            this.setState({ isDisabled: true })
        } else {
            this.setState({ isDisabled: false })
        }
        let user = await jwtDecode();
        this.setState({ identityUserId: user.id })
        this.getUserInfo(user.id)
    }

    getUserInfo = async (id) => {
        try {
            this.setState({ loading: true })
            let userInfo = await authService.getUserInfo(id);
            if (userInfo) {
                this.state.country_list.map(e => {
                    if (e.code === userInfo.countryCode) {
                        this.setState({ countryName: e.name })
                    }
                })
                this.setState({
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    sex: userInfo.sex,
                    birthDate: to_UTCDate(userInfo.birthDate, "MM-DD-YYYY"),
                    postalCode: userInfo.postalCode,
                    countryCode: userInfo.countryCode,
                    identityCard: userInfo.identityCard,
                    city: userInfo.city,
                    loading: false,
                    backIdentityCard: userInfo.backIdentityCard,
                    frontIdentityCard: userInfo.frontIdentityCard,
                    selfie: userInfo.selfie
                })
            } else {
                this.setState({ loading: false })
            }
        } catch (e) {
            this.setState({ loading: false })
            console.log(e, "err")
        }
    }

    _getCountry = () => {
        authService.getCountry().then(res => {
            this.setState({ country_list: res })
        }).catch(err => this.setState({ is_confirm: true, title: 'WARNING'.t(), content: "UNKNOWN_ERROR".t(), ButtonOKText: null }))
    }

    onSelectSex = (sex) => {
        this.setState({ sex })
    }

    onSelectCountry = (countryCode) => {
        this.setState({ countryCode })
    }

    _showDateTimeToPicker = () => this.setState({ isDateTimeToPickerVisible: true });

    _handleDateToPicked = (date) => {
        let _date = convertTimeStamp(date);
        let dateHuman = convertDate(_date);
        this.setState({ birthDate: dateHuman })
        this._hideDateTimeToPicker();
    };

    _hideDateTimeToPicker = () => this.setState({ isDateTimeToPickerVisible: false });

    handleNext = async () => {
        let { birthDate, city, countryCode, firstName, lastName, identityCard, postalCode, sex, identityUserId, isDisabled } = this.state;
        const data = { birthDate, city, countryCode, firstName, lastName, identityCard, postalCode, sex, identityUserId };
        if (!isDisabled) {
            if (birthDate && city && countryCode && firstName && lastName && identityCard && postalCode && (sex != null)) {
                // let token = await storageService.getItem('auth_token');
                try {
                    let res = await authService.updateUserInfo(data);
                    console.log(res, "Resss")
                    // let response = await res.json();
                    if (res.status) {
                        // this.dropdown.alertWithType('success', 'SUCCESS'.t(), `${response.message}`.t());
                        this.setState({ is_confirm: true, title: 'SUCCESS'.t(), content: `${res.message}`.t(), ButtonOKText: "NEXT".t() })
                    } else {
                        // this.dropdown.alertWithType('warn', 'WARNING'.t(), `${response.message}`.t());
                        this.setState({ is_confirm: true, title: 'WARNING'.t(), content: `${res.message}`.t(), ButtonOKText: null })

                    }
                } catch (error) {
                    this.setState({ is_confirm: true, title: 'WARNING'.t(), content: "UNKNOWN_ERROR".t(), ButtonOKText: null })
                }

            } else {
                this.setState({ is_confirm: true, title: 'WARNING'.t(), content: "Please enter all fields".t(), ButtonOKText: null })
            }
        } else {
            this.props.navigation.navigate('KYCFrontSide', { info: this.state })
        }

    }
    onCloseAlert = () => {
        if (this.state.success) {
            this.props.navigation.navigate('KYCFrontSide', { info: this.state })
        }
    }

    render() {
        const { sex, countryCode, birthDate, country_list, firstName, lastName, city, identityCard, postalCode, success, require, loading, is_confirm, title, content, isDisabled, countryName,
            ButtonOKText } = this.state;
        const { navigation } = this.props;
        const gender = [
            { label: 'MALE'.t(), value: "1" },
            { label: 'FEMALE'.t(), value: "0" }
        ]
        return (

            <ContainerFnx
                navigation={navigation}
                title={'USER_INFORMATION'.t()}
                hasBack
                colorStatus={style.colorWithdraw}
            >
                {
                    loading ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator animating={loading} />
                        </View>
                        :
                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                            onPress={Keyboard.dismiss}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View>
                                <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
                                 
                                    <ViewSpecial>
                                    <TextInputFnx
                                        label
                                        placeholder={'FIRST_NAME'.t()}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.lastName.focus(); }}
                                        blurOnSubmit={false}
                                        value={firstName}
                                        onChangeText={(firstName) => this.setState({ firstName })} editable={!isDisabled}

                                    />
                                    </ViewSpecial>
                                    

                                </Item>
                                <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
                                <ViewSpecial>
                                <TextInputFnx
                                        label
                                        placeholder={'LAST_NAME'.t()}
                                        value={lastName}
                                        onChangeText={(lastName) => this.setState({ lastName })} editable={!isDisabled}
                                        returnKeyType={"next"}
                                        ref={input => this.lastName = input}
                                    />
                                </ViewSpecial>
                                
                                </Item>
                                {
                                    isDisabled ?
                                        <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
                                           
                                            <ViewSpecial>
                                                <TextInputFnx
                                                    label
                                                    placeholder={'SEX'.t()}
                                                    value={sex === 1 ? 'MALE'.t() : 'FEMALE'.t()} editable={!isDisabled}
                                                />
                                            </ViewSpecial>

                                        </Item>
                                        :
                                        <View>
                                          
                                            <ViewSpecial>
                                                <LabelField label={'SEX'.t()} />
                                                <View style={[stylest.picker,styles.bgMain]}>
                                                    <CustomPicker
                                                        style={[{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 10 }]}
                                                        listData={gender}
                                                        fieldValue={"value"}
                                                        fieldLabel={"label"}
                                                        defaultValue={sex}
                                                        formatLabelFunc={(text) => { return text }}
                                                        isObjectItem={true}
                                                        onSelectedChange={this.onSelectSex}
                                                        type={"dialog"}
                                                        placeholder={'CHOOSE_YOUR_SEX'.t()}
                                                    />
                                                </View>
                                            </ViewSpecial>
                                        </View>
                                }

                                <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
                                
                                    <ViewSpecial>
                                    <TextInputFnx
                                        label
                                        placeholder={'IDENTITY_PASSPORT'.t()}
                                        value={identityCard}
                                        onChangeText={(identityCard) => this.setState({ identityCard })} editable={!isDisabled}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => { this.postalCode.focus(); }}
                                        blurOnSubmit={false}
                                    />

                                    </ViewSpecial>
                                   
                                </Item>
                                <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
<ViewSpecial>
<TextInputFnx
                                        label
                                        placeholder={'POSTAL_CODE'.t()}
                                        value={postalCode} onChangeText={(postalCode) => this.setState({ postalCode })} editable={!isDisabled}
                                        returnKeyType={"next"}
                                        ref={input => this.postalCode = input}
                                        onSubmitEditing={() => { this.city.focus(); }}
                                        blurOnSubmit={false}
                                    />
</ViewSpecial>
                                    
                                </Item>
                                <Item stackedLabel style={[style.item, { marginLeft: 0 }]}>
                                   
                                    <ViewSpecial>
                                       
                                        <TextInputFnx
                                        label
                                        placeholder={'CITY'.t()}
                                        value={city} 
                                        onChangeText={(city) => this.setState({ city })} editable={!isDisabled}
                                        returnKeyType={"next"}
                                        ref={input => this.city = input}
                                    />
                                    </ViewSpecial>
                                    
                                </Item>
                                {
                                    countryCode && isDisabled ?
                                        <Item stackedLabel style={[style.item, { marginLeft: 0, flex: 1 }]}>
                                           
                                            <ViewSpecial>
                                            <TextInputFnx
                                                label
                                                placeholder={'COUNTRY'.t()}
                                                value={countryCode}
                                                editable={!isDisabled}
                                            />
                                            </ViewSpecial>
                                            
                                        </Item>
                                        :
                                        <View>
                                          
                                            <ViewSpecial>
                                                <LabelField label={'COUNTRY'.t()} />
                                                <View style={[stylest.picker,styles.bgMain]}>
                                                    <CustomPicker
                                                        style={[{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 10 }]}
                                                        listData={country_list}
                                                        fieldValue={"code"}
                                                        fieldLabel={"name"}
                                                        defaultValue={countryCode}
                                                        formatLabelFunc={(text) => { return text }}
                                                        isObjectItem={true}
                                                        onSelectedChange={this.onSelectCountry}
                                                        type={"dialog"}
                                                        placeholder={'CHOOSE_YOUR_COUNTRY'.t()}
                                                    />
                                                </View>
                                            </ViewSpecial>

                                        </View>
                                }

                                <Item stackedLabel style={[style.item, { marginLeft: 0, }]} onPress={this._showDateTimeToPicker} disabled={isDisabled}>
                                <ViewSpecial>
                                            <TextInputFnx
                                                label
                                                placeholder={'BIRTH_DATE'.t()}
                                                value={birthDate}
                                                editable={!isDisabled}
                                                onFocus={this._showDateTimeToPicker}
                                                onChangeText={
                                                    (birthDate) => this.setState({ birthDate })
                                                }
                                            />
                                            </ViewSpecial>
                                  
                                    <DateTimePicker
                                            isVisible={this.state.isDateTimeToPickerVisible}
                                            onConfirm={this._handleDateToPicked}
                                            onCancel={this._hideDateTimeToPicker}
                                            style={{ width: dimensions.width - 40 }}
                                            disabled={isDisabled}
                                        />
                                </Item>
                                <View style={{ marginVertical: 10 }}>
                                    <Button block primary style={[style.btnSubmit, style.buttonHeight,{backgroundColor:styles.bgButton.color}]} onPress={this.handleNext}>
                                        <Text style={style.textWhite}>{'NEXT'.t()}</Text>
                                    </Button>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>

                }

                <ConfirmModal visible={is_confirm} title={title} content={content}
                    onClose={() => {
                        if (title === "WARNING".t()) {
                            this.setState({ is_confirm: false, resultType: "", resultText: "" })
                        } else {
                            this.setState({ is_confirm: false }, () => { navigation.goBack() })
                        }
                    }}
                    onOK={() => {
                        if (title === "WARNING".t()) {
                            this.setState({ is_confirm: false })
                        } else {
                            this.setState({ is_confirm: false }, () => {
                                this.props.navigation.navigate('KYCFrontSide', { info: this.state })
                            })
                        }
                    }}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}
                />
            </ContainerFnx>

            // </Container >
        );
    }
}
const stylest = StyleSheet.create({
    picker:{ marginTop: 5, height: 40, backgroundColor: '#141d30', justifyContent: 'center', marginBottom: 10,
    borderWidth:0.5,
    borderColor:style.colorBorderBox,borderRadius:2.5     }
})
export default connect(null, { setStatusBar })(AccountVerification);
