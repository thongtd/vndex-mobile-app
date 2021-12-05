import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Item, Left, Button } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from '../../../../config/style'
import {styles} from "react-native-theme";
export default class NoteCast extends Component {
    render() {
        const {noteFirst, noteSecond, styled } = this.props;
        return (
            <View style={styled}>
                <Item style={[{ borderBottomWidth: 0, paddingTop: 10, }]}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon name={'thumbs-up'} size={16} color={'orange'} />
                        <Text style={[styles.textWhite, { fontStyle: "italic", fontSize: 12 }, { marginLeft: 10 }]}>{'RECOMMENDED'.t()}</Text>
                    </Left>
                </Item>
                <Item style={[{ borderBottomWidth: 0, paddingTop: 10, paddingBottom: 10 }]}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon name={'warning'} size={16} color={'orange'} />
                        <Text style={[styles.textWhite, { marginLeft: 10, fontSize: 12 }]}>{'IMPORTANT_NOTE'.t()}</Text>
                    </Left>
                </Item>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={[styles.txtMainSub, { fontSize: 8, marginTop: 2 }]}>&#9679; </Text>
                    <Text style={[styles.txtMainSub, {
                        fontSize: 12,
                        marginRight: 10
                    }]}>{noteFirst?noteFirst:'MONEY_DEPOSITS_NOTE'.t()}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.txtMainSub, { fontSize: 8, marginTop: 2 }]}>&#9679; </Text>
                    <Text
                        style={[styles.txtMainSub, { fontSize: 12, marginRight: 10 }]}>{noteSecond ? noteSecond : 'CLICK_CONFIRM_NOTE'.t()}</Text>
                </View>
            </View>
        )
    }
}
