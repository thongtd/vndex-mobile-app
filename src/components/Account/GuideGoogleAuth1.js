import React from 'react';
import { Modal, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { style } from "../../config/style";
import DropdownAlert from "react-native-dropdownalert";
import { Button, Container, Content, Header, Input, Item, Label, Left, Right } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { constant } from "../../config/constants";
import { dimensions } from "../../config/utilities";
import ContainerFnx from '../Shared/ContainerFnx';
import {styles} from "react-native-theme";
class GuideGoogleAuth1 extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        const { navigation } = this.props;
        return (
            <ContainerFnx
                title={'DOWNLOAD_AND_INSTALL'.t()}
                navigation={navigation}
                hasRight={
                    <Button transparent onPress={() => navigation.navigate('Account')}>
                        <Text style={[styles.textWhite, { fontSize: 14, marginLeft: 10, paddingLeft: 10 }]}>{'SKIP'.t()}</Text>
                    </Button>}
            >
                <DropdownAlert ref={ref => this.dropdown = ref} elevation={10} zIndex={Platform.OS === 'ios' ? 10 : 0} onClose={this.onCloseAlert} closeInterval={2000} errorImageSrc={null} successImageSrc={null} />
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20, }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.textWhite, { textAlign: 'center',marginBottom:15 }]}>{"GUIDE_INSTALL".t()}</Text>
                        <Image source={require('../../assets/img/google-1.png')} style={{ width: 150, height: 100, marginBottom: 20 }} resizeMode={'contain'} />
                        <Text style={[styles.textMain, { marginBottom: 10 }]}>{"GOOGLE_AUTHENTICATION".t()}</Text>
                    </View>
                    <Button block style={[style.buttonNext, style.buttonHeight, { marginBottom: 20,backgroundColor:styles.bgButton.color }]}
                        onPress={() => navigation.navigate('BackUpKey')}
                    >
                        <Text style={style.textWhite}>{'NEXT'.t()}</Text>
                    </Button>
                </View>
            </ContainerFnx>
        );
    }
}

export default GuideGoogleAuth1;
