import React from 'react';
import { Text, View } from 'react-native';
import { Container, Content, Item, Button, Left, Right, Header } from "native-base";
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {styles} from "react-native-theme";
const Note = ({
    title = 'WARNING'.t(),
    contentFirst,
    contentSecond,
    hasContentSecond,
    hasContentFirst = true
}) => (
        <React.Fragment>
            <Item style={[{ borderBottomWidth: 0, paddingTop: 40, paddingBottom: 10 }]}>
                <Left style={{ flexDirection: 'row' }}>
                    <Icon name={'warning'} size={16} color={'orange'} />
                    <Text style={[styles.textWhite, { marginLeft: 10, fontSize: 12 }]}>{title}</Text>
                </Left>
            </Item>
            {hasContentFirst ? (
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={[styles.txtMainSub, { fontSize: 8, marginTop: 2 }]}>&#9679; </Text>
                    <Text style={[styles.txtMainSub, {
                        fontSize: 12,
                        marginRight: 10
                    }]}>{contentFirst}</Text>
                </View>
            ) : null}
            {hasContentSecond ? (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.txtMainSub, { fontSize: 8, marginTop: 2 }]}>&#9679; </Text>
                    <Text
                        style={[styles.txtMainSub, { fontSize: 12, marginRight: 10 }]}>{contentSecond}</Text>
                </View>
            ) : null}
        </React.Fragment>
    );

export default Note;
