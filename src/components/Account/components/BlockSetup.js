import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Container, Button, ListItem, Left, Right, Body, Thumbnail, Item, Switch, Picker, Form } from 'native-base';
import { style } from "../../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
// import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import TouchableOpacityFnx from '../../Shared/TouchableOpacityFnx';
const BlockSetup = ({
    logged,
    navigation,
    langSelected,
    onLanguageValueChange,
    logout
}) => (
        <View>
            {
                logged &&
                <ListItem thumbnail>
                    <Left>
                        <Thumbnail source={require('../../../assets/img/ava.jpg')} />
                    </Left>
                    <Body style={styles.item}>
                        <Text style={style.textWhite}>{email}</Text>
                        <Button
                            style={{ marginTop: 5, backgroundColor: '#193870', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, height: null }}
                            onPress={() => navigation.navigate('ChangePassword')}
                        >
                            <Text style={{ color: '#c9c9c9' }}>{'CHANGE_PASSWORD'.t()}</Text>
                        </Button>
                    </Body>
                </ListItem>
            }
            <View style={{ marginTop: 20 }}>
                <Item style={[styles.item, { paddingHorizontal: 0, flexDirection: 'row' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={style.textMain}>{"LANGUAGES".t()}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', flex: 2 }}>
                        <Picker
                            note
                            mode="dropdown"
                            style={{
                                width: 200,
                                color: '#fff',
                            }}
                            selectedValue={langSelected}
                            onValueChange={onLanguageValueChange}
                            iosIcon={<Icon name="caret-down" style={{ fontSize: 20, color: 'white' }} />} textStyle={{ color: '#fff' }}
                        >
                            <Picker.Item label="English" value="en" />
                            <Picker.Item label="Tiếng Việt" value="vi" />
                        </Picker>
                    </View>
                </Item>
                <Item style={[styles.item, { paddingVertical: 10, }]}>
                    <Left>
                        <Text style={style.textMain}>{"ABOUT".t()}</Text>
                    </Left>
                    <View style={{ flex: 1, marginLeft: Platform.OS === 'ios' ? 25 : 10 }}><Text style={{ color: '#fff' }}>{"1.3.3"}</Text></View>
                    <Right />
                </Item>
                {
                    logged &&
                    <Item style={{ paddingVertical: 10, borderBottomWidth: 0 }}>
                        <Right>
                            <TouchableOpacityFnx onPress={logout}>
                                <Text style={{ color: '#fff' }}>{'LOG_OUT'.t()}</Text>
                            </TouchableOpacityFnx>
                        </Right>
                    </Item>
                }
            </View>
        </View>
    );

export default BlockSetup;
