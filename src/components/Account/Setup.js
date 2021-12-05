import React, { Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Container, Button, ListItem, Left, Right, Body, Thumbnail, Item, Switch, Picker, Form } from 'native-base';
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { getLanguage, checkLogin,changeTheme } from "../../redux/action/common.action";
import { storageService } from "../../services/storage.service";
import { constant } from "../../config/constants";
import I18n from 'react-native-i18n'
import { commonService } from "../../services/common.service";
import { dimensions, jwtDecode, replaceLang } from "../../config/utilities";
// import DeviceInfo from 'react-native-device-info';
import { HeaderFnx } from '../Shared';
import PickerSearch from '../Shared/PickerSearch';
import { styles } from "react-native-theme";
import AsyncStorage from '@react-native-community/async-storage';
import theme from 'react-native-theme';
class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSwitch: false,
            langSelected: "en-US",
            email: '',
            source: [{ name: "Tiếng Việt", value: "vi-VN" }, { name: "English", value: "en-US" }]
        };
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {

        let user = await jwtDecode();
        this.setState({ email: user.sub, langSelected: this.props.language });
    }
    componentWillMount = () => {
        
        let { language } = this.props;
        this.setState({
            langSelected: language
        })
        storageService.getItem("theme").then(val =>{
            console.log(val,"val kka");
            if(val === "light"){
                this.setState({
                    isSwitch:true
                })
            }else{
                this.setState({
                    isSwitch:false
                })
            }
        })
    };


    logout() {
        AsyncStorage.removeItem('auth_token')
        this.props.checkLogin(false)
        this.props.navigation.navigate('Home')
    }
    onLanguageValueChange = (lang) => {
        this.setState({ langSelected: lang })
        storageService.setItem(constant.STORAGEKEY.LANGUAGE, lang).then(val => {
            if (val) {
                this.props.getLanguage(lang);
            }
        })
        I18n.locale = lang;
    }
    handleSwitch = () => {
        this.setState({
            isSwitch: !this.state.isSwitch
        }, () => {
            if (this.state.isSwitch === true) {
                storageService.setItem("theme", "light");
                theme.active('light');
                this.props.changeTheme("light");
                setTimeout(()=>{
                    this.setState({
                        isSwitch:true
                    })
                },0)
            } else {
                storageService.setItem("theme", "default");
                this.props.changeTheme("default");
                theme.active();
                setTimeout(()=>{
                    this.setState({
                        isSwitch:false
                    })
                },0)
            }
        })


        // let isSwitch = !this.state.isSwitch;
        // this.setState({ isSwitch },()=>{
        //     if(this.state.isSwitch){
        //         storageService.setItem("theme","default");
        //         theme.active();
        //     }else{
        //         storageService.setItem("theme","light");
        //         theme.active('light');

        //     }
        // });
    }
    render() {
        console.log(this.state.langSelected, "langselected");
        const { navigation, logged } = this.props;
        const { email, source, isSwitch } = this.state;
        return (
            <Fragment>
                <HeaderFnx
                    hasBack={logged ? true : false}
                    title={'SET_UP'.t()}
                    navigation={navigation}
                    backgroundHeader={styles.backgroundMain.color}
                    styledText={{
                        paddingLeft: 0,
                    }}
                />
                <Container style={[{ paddingHorizontal: 10, backgroundColor: styles.backgroundMain.color }]}>

                    <ListItem thumbnail style={{
                        marginVertical: 10,
                        marginLeft: 0
                    }}>
                        <Left>
                            <Thumbnail large source={require('../../assets/img/ava.jpg')} />
                        </Left>
                        <Body style={{ borderBottomWidth: 0 }}>
                            {logged ? (
                                <View style={{
                                    marginVertical: -5
                                }}>
                                    <Text style={[styles.textWhite, { marginBottom: 15 }]}>{email}</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: styles.bgButton.color, paddingHorizontal: 15, borderRadius: 15, height: 35, width: "70%",alignItems:"center",justifyContent:"center" }}
                                        onPress={() => navigation.navigate('ChangePassword')}
                                    >
                                        <Text style={style.textWhite}>{'CHANGE_PASSWORD'.t()}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (<View style={{
                                flexDirection: "row"
                            }}>
                                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                    <Text style={styles.textWhite}>{`${"LOGIN".t()} ${"OR".t()} ${"REGISTER_TEXT".t()}`}</Text>
                                </TouchableOpacity>
                            </View>)}
                        </Body>
                    </ListItem>

                    <View>
                        <Item style={[styles.SU_item, { paddingHorizontal: 0, flexDirection: 'row',borderBottomColor: styles.borderBottomItem.color }]}>
                            <View style={{ flex: 1.5 }}>
                                <Text style={style.textMain}>{"LANGUAGES".t()}</Text>
                            </View>
                            <View style={{ alignSelf: 'flex-start', flex: 2 }}>
                                <PickerSearch
                                    selectedValue={this.state.langSelected}
                                    onValueChange={this.onLanguageValueChange}
                                    source={source}
                                    label={["name"]}
                                    value={"value"}
                                    width={"60%"}
                                    textCenter={" - "}
                                />
                            </View>
                            <View style={{ flex: 0.5 }}></View>
                        </Item>
                        <Item style={[styles.SU_item, {borderBottomColor: styles.borderBottomItem.color, paddingVertical: 10, flexDirection: 'row' }]}>
                            <View style={{
                                flex: 1.5
                            }}>
                                <Text style={style.textMain}>{"ABOUT".t()}</Text>
                            </View>
                            <View style={{ flex: 2, alignSelf: 'flex-start' }}><Text style={styles.textWhite}>{"1.3.5"}</Text></View>
                            <View style={{ flex: 0.5 }}></View>

                        </Item>
                        <Item style={[styles.SU_item, {borderBottomColor: styles.borderBottomItem.color, paddingVertical: 10, flexDirection: 'row' }]}>
                            <View style={{
                                flex: 1.5
                            }}>
                                <Text style={style.textMain}>{"THEME".t()}</Text>
                            </View>
                            <View style={{ flex: 2, }}>
                                <Text style={styles.textWhite}>{"LIGHT".t()}</Text>

                            </View>
                            <View style={{
                                flex: 0.5
                            }}>
                                <Switch style={Platform.OS === "ios" ? {
                                    transform: [{ scaleX: .7 }, { scaleY: .7 }],
                                    
                                } : {}} value={isSwitch} onValueChange={this.handleSwitch} />
                            </View>

                        </Item>

                        {
                            logged &&
                            <Item style={{ paddingVertical: 10, borderBottomWidth: 0 }}>
                                <Right>
                                    <TouchableOpacity onPress={this.logout}>
                                        <Text style={styles.textWhite}>{'LOG_OUT'.t()}</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Item>
                        }
                    </View>
                </Container>
            </Fragment>

        )
    }
}
// const styles = StyleSheet.create({
//     item: {
//         borderBottomWidth: 0.5,
//         borderBottomColor: '#0e1021'
//     }
// })

const mapStateToProps = (state) => {
    return {
        language: state.commonReducer.language,
        logged: state.commonReducer.logged,
        theme:state.commonReducer.theme
    }
}

export default connect(mapStateToProps, { getLanguage, checkLogin,changeTheme })(Setup);
