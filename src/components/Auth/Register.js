import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Container, Content, Item, Input, Button, Picker, Right, Left } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { style } from "../../config/style";
import { Dropdown } from 'react-native-material-dropdown';
import { authService } from '../../services/authenticate.service'
import TextField from '../Shared/TextField'
import SubmitButton from "../Shared/SubmitButton";
import { dimensions } from '../../config/utilities';
import { Spiner } from "../Shared";
import ModalAlert from "../Shared/ModalAlert";
import RegisterField from './components/RegisterField';
import EmailField from './components/EmailField';
import ModalSearchList from './components/ModalSeachList';
import HaveAccountField from './components/HaveAccountField';
import {styles} from "react-native-theme";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            country: "",
            country_list: [],
            is_error: false,
            email_error: "",
            isLoading: false,
            visible: false,
            content: null,
            visibleModal: false,
            nameCountry: null
        }
    }

    componentDidMount() {
        this._getCountry();
    }
    _validate() {
        let { email, country } = this.state;
        let emailRegex = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')
        if (!email) {
            this.setState({
                visible: true,
                content: "Please enter email".t()
            })
            return false;
        } else if (!emailRegex.test(email)) {
            this.setState({
                visible: true,
                content: "PLEASE_INPUT_A_VALID_EMAIL".t()
            })
            return false;
        } else if (!country || country === null) {
            this.setState({
                visible: true,
                content: 'PLEASE_SELECT_COUNTRY'.t()
            })
            return false
        }
        return true;
    }

    _getCountry = () => {
        this.setState({
            isLoading:true
        })
        authService.getCountry().then(res => {
            this.setState({ 
                country_list: res,
                isLoading:false
             })
        })
            .catch(err => this.setState({
                isLoading:false
            }))
    }

    onNext = () => {
        let isValid = this._validate();
        if (!isValid) {
            return;
        }
        else {
            this.checkRegister()
            // let { country, email } = this.state;
            // authService.checkRegister(email).then(res => console.log(res,"email"))
            // this.props.navigation.navigate('FormRegister', { data: { country, email } })
        }
    }
    checkRegister = async () => {
        let { country, email } = this.state;
        this.setState({
            isLoading: true
        })
        try {
            let res = await authService.checkRegister(email)
            if (res) {
                this.setState({
                    isLoading: false
                })
                if (res.code === 7) {
                    this.setState({
                        visible: true,
                        content: `${res.message}`.t()
                    })
                } else {
                    this.props.navigation.navigate('FormRegister', { data: { country, email } })
                }
            } else {
                this.setState({
                    isLoading: false
                })
            }

        } catch (error) {
            // console.log(error)
            this.setState({
                isLoading: false
            })
        }

    }
    render() {
        const { navigation } = this.props;
        const { visible, content, email, country, country_list, is_error, email_error, isLoading, visibleModal, nameCountry } = this.state;
        
        return (
            <Container style={{backgroundColor:styles.backgroundMain.color}}>
                <Spiner isVisible={isLoading} />
                <ModalAlert
                    visible={visible}
                    content={content}
                    onClose={() => this.setState({
                        visible: false
                    })}
                />
                <View style={styles.RG_content}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                        >
                            <Text style={[styles.textMain, { textAlign: 'right' }]}>{"CANCEL".t()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[style.textTitle, {
                            marginBottom: 30
                        }]}>{"REGISTER_TEXT".t()}</Text>
                        <Text style={{paddingBottom: 12, fontWeight: '600', color: styles.textWhite.color }}>{"COUNTRY".t()}</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({
                                visibleModal: true
                            })}
                        >

                            <RegisterField country={country} nameCountry={nameCountry} />
                        </TouchableOpacity>
                        <EmailField
                            onChangeText={(text) => this.setState({ email: text })}
                            onNext={() => {
                                this.onNext()
                            }}
                            email={email}
                        />
                        <SubmitButton
                            label={'NEXT'.t()}
                            style={[style.btnSubmit, style.buttonHeight,{elevation:0}]}
                            onSubmit={this.onNext}
                            is_submit={false}
                            labelStyle={style.textWhite}
                        />
                        <HaveAccountField 
                        navigation={navigation}
                        />
                        <ModalSearchList
                            selected={(data) => this.setState({
                                country: data.code,
                                nameCountry: data.name,
                                visibleModal: false
                            })}
                            getCode={country}
                            visibleModal={visibleModal}
                            handleBack={() => this.setState({
                                visibleModal: false
                            })}
                            countryList={country_list}
                        />
                    </View>
                </View>

            </Container >
        );
    }
}

// const styles = StyleSheet.create({
//     content: {
//         flex: 1,
//         paddingVertical: 20,
//         marginLeft: 20,
//         marginRight: 20
//     },
//     inputStyle: {
//         color: "#ffffff",
//         borderBottomWidth: 1,
//         borderBottomColor: '#44588c'
//     }
// })

export default Register;
