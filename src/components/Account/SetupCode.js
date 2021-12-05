import React from 'react';
import { Text, View, Alert, Clipboard, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { style } from "../../config/style";
import { Button, Container, Header, Left, Right } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { dimensions, jwtDecode } from "../../config/utilities";
import Swiper from 'react-native-swiper';
import ContainerFnx from '../Shared/ContainerFnx';
import {styles} from "react-native-theme";
import {connect} from "react-redux";
class SetupCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: null
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        setTimeout(() => this.setState({ key: Math.random() }), 200)
    }

    render() {
        const images = [
            { url:this.props.theme==="light"?require('../../assets/img/gg_authen_l.png'): require('../../assets/img/Asset1.png'), text: "SET_UP_CODE_1".t() },
            { url:this.props.theme==="light"?require('../../assets/img/gg_authen2_l.png'): require('../../assets/img/Asset2.png'), text: "SET_UP_CODE_2".t() }
        ]
        let index = 0

        const { navigation } = this.props;
        const { manualEntryKey } = this.state;
        return (
            <ContainerFnx 
            navigation={navigation}
            title={'SETUP_CODE'.t()}
            hasRight={
                <Button transparent onPress={() => navigation.navigate('Account')}>
                    <Text style={[styles.textWhite, { fontSize: 14, marginLeft: 10, paddingLeft: 10 }]}>{'SKIP'.t()}</Text>
                </Button>}
            >
 <View
                    key={this.state.key}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                    }}>
                    <Swiper autoplay={false}
                        loop={false}
                        autoplayDirection={true}
                        key={images.length}
                        removeClippedSubviews={false}
                        dotStyle={{
                            backgroundColor: 'rgba(0,0,0,.2)',
                            width: 20,
                            height: 4,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3,
                        }}
                        activeDotStyle={{
                            backgroundColor: '#3a4d92',
                            width: 20,
                            height: 4,
                            borderRadius: 4,
                            marginLeft: 3,
                            marginRight: 3,
                            marginTop: 3,
                            marginBottom: 3,
                        }}
                        containerStyle={{ alignSelf: 'stretch' }}
                    >
                        {
                            images.map((e) => {
                                ++index
                                return (
                                    <View
                                        key={index}>
                                        <Text style={[styles.textWhite, { textAlign: 'center' }]}>{e.text}</Text>
                                        <Image source={e.url}
                                            style={{
                                                width: '100%',
                                                height: dimensions.height / 2,
                                                borderRadius: 10,
                                                marginVertical: 10
                                            }}
                                            resizeMode={'contain'} />
                                        
                                    </View>
                                )
                            })
                        }
                    </Swiper>
                    <Button block style={[style.buttonNext, style.buttonHeight, { marginBottom: 20,backgroundColor:styles.bgButton.color }]}
                        onPress={() => navigation.navigate('EnableTwoFactor', { secretKey: navigation.state.params.secretKey })}
                    >
                        <Text style={style.textWhite}>{'NEXT'.t()}</Text>
                    </Button>
                </View>
            </ContainerFnx>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        theme: state.commonReducer.theme
    }
}
export default connect(mapStateToProps)(SetupCode);
