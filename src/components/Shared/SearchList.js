import React, { Component } from 'react'
import { Text, FlatList, View, Modal, TouchableOpacity, BackHandler,Platform } from 'react-native'
import ContainerApp from "./ContainerApp";
import SearchBar from './SearchBar';
import { style } from "../../config/style"
import MyStatusBar from './MyStatusBar';
import {styles} from "react-native-theme";
export default class SearchList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            text: null,
            data: [],
            selectedAside: null,
            itemObj: null,
            name: null,
            hasAcc: false
        }
        this.dataRoot = [];
        this.contriesSearch = [];
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            itemObj: nextProps.itemObj,
            name: nextProps.name,
            hasAcc: nextProps.hasAcc
        })
        this.dataRoot = nextProps.data;
        console.log(nextProps, "next");
    }
    handleSelectd = (data, name) => {
        this.props.selected(data, name);
    }
    renderItem = ({
        item, index
    }) => {
        var { itemObj, name } = this.state;
        var { hasAcc } = this.state;
        if (hasAcc === true) {
            console.log(item, "item has acc")
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.handleSelectd(item, name)}
                >
                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: style.bgHeader.backgroundColor,
                        paddingBottom: 10
                        // height: 35,

                    }}>
                        <Text style={{
                            color: styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 25
                        }}>{item && item.bankAccountName}
                        </Text>
                        <Text style={{
                            color: styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 25
                        }}>{item && item.bank.name}
                        </Text>
                        <Text style={{
                            color: styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 25
                        }}>{item && item.bankBranch.name}
                        </Text>
                        <Text style={{
                            color: styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 25
                        }}>{item && item.bankAccountNo}
                        </Text>
                    </View>

                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => this.handleSelectd(item, name)}
                >
                    <View style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: style.bgHeader.backgroundColor,
                        height: 35,

                    }}>
                        <Text style={{
                            color: styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 35
                        }}>{itemObj.length > 0 ? itemObj.map((o, i) => `${item[o]} ${itemObj.length - 1 !== i ? " - " : ''}`) : item[itemObj]}
                        </Text>
                    </View>

                </TouchableOpacity>
            )
        }

    }
    handleSearch = (text) => {
        let { itemObj, hasAcc } = this.state;
        if (hasAcc === true) {
            if (this.dataRoot.length > 0) {
                const newData = this.dataRoot.filter(item => {
                    let itemData = `${item.bankAccountName} ${item.bank.name} ${item.bankBranch.name} ${item.bankAccountNo}`;
                    let item2Data = itemData.toUpperCase();
                    const textData = text.toUpperCase();
                    console.log(item2Data, textData, "test Data")
                    return item2Data.indexOf(textData) > -1;
                });
                this.setState({ data: newData });
            }
        } else {
            if (this.dataRoot.length > 0) {
                const newData = this.dataRoot.filter(item => {
                    let itemData = `${itemObj.length > 0 ? itemObj.map((o, i) => `${item[o]} ${itemObj.length - 1 !== i ? " - " : ''}`) : item[itemObj]}`;
                    let item2Data = itemData.toUpperCase();
                    const textData = text.toUpperCase();
                    console.log(item2Data, textData, "test Data")
                    return item2Data.indexOf(textData) > -1;
                });
                this.setState({ data: newData });
            }
        }


    }
    render() {
        const { text, data } = this.state;
        const { visibleModal, handleBack, countryList, placeholderSearchBar } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visibleModal}
                onRequestClose={handleBack}
            >
                <View style={{
                    height: "100%",
                    backgroundColor: styles.bgMain.color
                }}>
                   {Platform.OS === "ios" && <MyStatusBar  backgroundColor={style.colorWithdraw} barStyle="light-content"  />} 
                    <SearchBar
                        text={text}
                        onChangeText={this.handleSearch}
                        handleBack={handleBack}
                        placeholderSearchBar={placeholderSearchBar}
                    />
                    <View style={{
                        paddingHorizontal: 10
                    }}>
                    {this.props.hasFirst && (
                        <TouchableOpacity
                            onPress={() => this.handleSelectd({
                                name:"ALL".t(),
                                value:""
                            }, "all")}
                        >
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderBottomColor: style.bgHeader.backgroundColor,
                                height: 45,

                            }}>
                                <Text style={{
                                    color: styles.textWhite.color,
                                    fontSize: 15,
                                    paddingLeft: 15,
                                    lineHeight: 45
                                }}>{"ALL".t()}
                                </Text>
                            </View>

                        </TouchableOpacity>
                    )}
                        
                        <FlatList
                            data={data}
                            renderItem={this.renderItem}
                            keyExtractor={(e, i) => i.toString()}
                        />
                    </View>

                </View>
            </Modal>
        )
    }
}