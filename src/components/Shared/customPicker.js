import React from 'react'
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import { ListItem, Item, InputGroup, Input } from 'native-base'
import { dimensions, formatSolution } from "../../config/utilities";
import { style } from '../../config/style'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-navigation';
import {styles} from "react-native-theme";
type Props = {
    listData: Array<any>,
    fieldValue: string,
    fieldLabel: string,
    defaultValue: string,
    onSelectedChange: any,
    formatLabelFunc: any,
    isObjectItem: boolean,
    type: string
}
export default class CustomPicker extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue,
            searchKey: "",
            visible: false,
            allItems: [],
            listItems: [],
            defaultLable: ''
        }
    }
    items = []

    componentDidMount() {
        this.items = this.props.listData;
        this.setState({
            listItems: this.props.listData || [],
        })
        
        if (this.props.fieldLabel) {
            let label = this.items.filter(e => e[this.props.fieldValue] == this.props.defaultValue);
            console.log(this.props.fieldLabel, this.props.defaultValue);
            if (label.length > 0) {
                this.setState({ defaultLable: label[0][this.props.fieldLabel] })
            }
            else {
                this.setState({ defaultLable: this.props.placeholder })
            }
        }
        else {
            let label = this.items.filter(e => e == this.props.defaultValue);

            if (label.length > 0) {
                this.setState({ defaultLable: label[0] })
            }
            else {
                this.setState({ defaultLable: this.props.placeholder })
            }
        }
    }

    onSearch = (text) => {
        const { fieldLabel, fieldValue, formatLabelFunc } = this.props;
        this.setState({ searchKey: text });
        let x = [];
        if (text.length > 0) {
            this.items.forEach(e => {
                if (fieldLabel) {
                    if (formatLabelFunc(e[fieldLabel]).toUpperCase().indexOf(text.toUpperCase()) > -1) {
                        x.push(e)
                    }
                }
                else {
                    if (formatLabelFunc(e).toUpperCase().indexOf(text.toUpperCase()) > -1) {
                        x.push(e)
                    }
                }
            })
            this.setState({ listItems: x })
        } else {
            this.setState({ listItems: this.items })
        }
    }

    renderItem = (item, index) => {
        let { defaultValue } = this.state;
        const { fieldValue, fieldLabel, isObjectItem } = this.props;
        let value = isObjectItem ? item[fieldValue] : item;
        let label = isObjectItem ? item[fieldLabel] : item;

        return (
            <ListItem bordered>
                <TouchableOpacity
                    onPress={() => this.onSelectedChange(value, index)}
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                        style={{ color: defaultValue === (fieldValue ? item[fieldValue] : item) ? style.textAddress.color : styles.textWhite.color }}>
                        {this.props.formatLabelFunc(label)}
                    </Text>
                    {
                        fieldValue ?
                            (defaultValue === item[fieldValue] ?
                                <Icon name='check' color={style.textAddress.color} />
                                :
                                null) : (defaultValue === item ?
                                    <Icon name='check' color={style.textAddress.color} />
                                    :
                                    null)
                    }
                </TouchableOpacity>
            </ListItem>
        )
    }

    onSelectedChange(text, index) {
        this.setState({
            defaultValue: text,
            visible: false,
            defaultLable: this.props.fieldLabel ? this.items[index][this.props.fieldLabel] : text
        })
        this.props.onSelectedChange(text)
    }

    showPicker() {
        this.setState({ visible: true })
    }

    render() {
        let { listItems, searchKey, visible, defaultValue, defaultLable } = this.state;
        let { placeholder } = this.props;
        return (
            <View flex={1}>
                <TouchableOpacity style={this.props.style} onPress={() => this.showPicker()}>
                    {
                        defaultValue ?
                            <Text style={styles.textWhite}>{this.props.formatLabelFunc(defaultLable)}</Text>
                            :
                            <Text note style={styles.textWhite}>{placeholder}</Text>
                    }
                    <Icon name="caret-down" size={20} color={style.colorMain} />
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={visible}
                    onRequestClose={() => {
                        this.setState({ visible: false })
                    }}>
                    <View style={stylest.modalBackground}>
                        <View style={[stylest.activityIndicatorWrapper]}>
                            <Item style={{ justifyContent: 'space-between', padding: 5, backgroundColor: '#fff', paddingTop: 20, borderBottomWidth: 0.5, borderBottomColor: '#cdcdcd' }}>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                    <TouchableOpacity
                                        style={{ paddingVertical: 15, paddingHorizontal: 10 }}
                                        onPress={() => this.setState({ visible: false })}
                                    >
                                        <View style={[style.btnArrowLeft.dash, { backgroundColor: '#000' }]}>
                                            <View style={[style.btnArrowLeft.arrow, { borderColor: '#000' }]}>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <InputGroup rounded style={{ height: 40, paddingHorizontal: 20, backgroundColor: "#f7f7f7", flex: 1 }}>
                                        <Icon name='search' />
                                        <TextInput
                                        allowFontScaling={false}
                                            placeholder={'SEARCH'.t()}
                                            placeholderTextColor={'#9C9C9C'}
                                            style={{ flex: 1, marginLeft: 10 }}
                                            value={searchKey}
                                            onChangeText={text => this.onSearch(text)}
                                        />
                                        {
                                            searchKey ?
                                                <TouchableOpacity
                                                    style={stylest.buttonDel}
                                                    onPress={() => this.setState({ searchKey: '', listItems: this.items })}
                                                >
                                                    <Icon name={'times'} color={'#000'} />
                                                </TouchableOpacity>
                                                :
                                                null
                                        }
                                    </InputGroup>

                                </View>
                            </Item>
                            <FlatList
                                data={listItems}
                                renderItem={({ item, index }) => this.renderItem(item, index)}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const stylest = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#fafafa',
        width: dimensions.width,
        height: dimensions.height,
        display: 'flex'
    },
    item: {
        borderBottomWidth: 0,
        marginLeft: -1
    },
    input: {
        backgroundColor: '#F7F7F7',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5
    }
})
