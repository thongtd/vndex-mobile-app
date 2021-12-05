import React, { Component, Fragment } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, StyleSheet, FlatList } from 'react-native';
import { style } from '../../config/style';
import SearchBar from './SearchBar';
import MyStatusBar from './MyStatusBar';
import Icon from 'react-native-vector-icons/FontAwesome'
import {styles} from "react-native-theme";
export default class PickerSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false,
            text: null,
            data: [],
            selectedAside: null,
            placeholder: ""
        };
        this.contriesCurrent = [];
        this.contriesSearch = [];
    }
    componentDidMount() {
        this.setState({
            data: this.props.source
        })
        this.contriesCurrent = this.props.source;
        console.log(this.props.autoEnable,"autoEnable")
        if(this.props.autoEnable){
            this.setState({
                visibleModal:true
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps, "isNested")
        // if (nextProps.autoEnable) {
        //     this.setState({
        //         visibleModal: nextProps.autoEnable
        //     })
        // }
        if (nextProps.source && nextProps.source !== this.props.source && !nextProps.headerItem) {
            this.setState({
                data: nextProps.source,
            })
            this.contriesCurrent = nextProps.source;
        } else if (nextProps.source && nextProps.source !== this.props.source && nextProps.headerItem && nextProps.headerItem !== this.props.headerItem) {

            nextProps.source.unshift(nextProps.headerItem);
            this.setState({
                data: nextProps.source,
            })
            this.contriesCurrent = nextProps.source;
            // console.log(nextProps.source, "source");
        }

        // console.log(nextProps, "next");
        if (nextProps.placeholder !== this.props.placeholder) {
            this.setState({
                placeholder: nextProps.placeholder
            })
        }
        if (nextProps.isNested !== this.props.isNested) {
            this.setState({
                visibleModal: nextProps.isNested
            })
        }
    }
    handleSearch = (text) => {
        let { label, textCenter } = this.props;
        if (this.contriesCurrent.length > 0) {
            const newData = this.contriesCurrent.filter(item => {
                const itemData = `${this.textLabel(item, label, textCenter).toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            this.setState({ data: newData });
        }

    }
    handleBack = () => {
        let { hasNested } = this.props;
        if (hasNested) {
            this.setState({
                visibleModal: false
            })
            setTimeout(() => {
                this.props.onBackChange(true)
            }, 10)

        } else {
            this.setState({
                visibleModal: false
            })
        }

    }
    handleSelectd = (data) => {
        setTimeout(() => {
            this.props.onValueChange(data);
        }, 10)

        this.setState({
            visibleModal: false
        })
    }
    textLabel = (data, label, textCenter) => {
        if (label.length > 0) {
            console.log(label,data,"label kaka")
            let convertStr = "";
            label.map((o, i) => {
                if(data[o] ==="ALL".t() ){
                    convertStr = "ALL".t()
                }else{
                    convertStr = convertStr + data[o] + ((label.length - 1) !== i ? textCenter : "")
                }
                
            })
            return convertStr;
        }
    }
    renderItem = ({
        item, index
    }) => {
        const { label, value, textCenter } = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.handleSelectd(item[value])}
            >
                {this.props.renderItem ? this.props.renderItem(item) : (
                    <View style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: styles.borderBottomItem.color,
                        height: 45,
                    }}>
                        <Text style={{
                            color:styles.textWhite.color,
                            fontSize: 15,
                            paddingLeft: 15,
                            lineHeight: 45
                        }}>{this.textLabel(item, label, textCenter)}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        )
    }
    handleLabel = (data, selectedValue, value, label, textCenter) => {
        console.log(data, selectedValue, value, label, "fulldata setup")
        let labelData;
        if (data.length > 0) {
            data.map((e, i) => {
                if (e[value] == selectedValue) {
                    labelData = this.textLabel(e, label, textCenter)
                }
            })
            return labelData;
        }
    }

    render() {
        const { visibleModal, data, text } = this.state;
        const { textStyle, hasNested, selectedValue, value, label, source, width, placeholder, btnStyle, caretStyle, isNested, hiddenBtn, onDismiss, headerItem, textCenter, hasBtn, stylePlaceholder, placeholderColor } = this.props;

        return (
            <Fragment>
                {hiddenBtn ? null : (
                    <TouchableOpacity onPress={() => {

                        if (hasNested) {
                            this.props.onPressChange(false);
                        } else {
                            this.setState({
                                visibleModal: true
                            })
                        }

                    }}>{hasBtn ? hasBtn : (
                        <View style={btnStyle ? btnStyle : [stylest.btnPicker, { width: width ? width : "100%" }]}>
                                {this.handleLabel(data, selectedValue, value, label, textCenter) ? (
                                    <Text style={textStyle ? textStyle : styles.textWhite}>{this.handleLabel(source, selectedValue, value, label, textCenter)}</Text>) : (<Text style={stylePlaceholder ? stylePlaceholder : { color: placeholderColor ? placeholderColor : styles.txtMainTitle.color }}>
                                        {placeholder}
                                    </Text>)
                                }

                                <Icon name="caret-down" style={caretStyle ? caretStyle : { fontSize: 20, color: styles.textWhite.color }} />

                        </View>
                    )}

                    </TouchableOpacity>
                )}

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={visibleModal}
                    onRequestClose={this.handleBack}
                    onDismiss={onDismiss}
                >
                    <View style={{
                        height: "100%",
                        backgroundColor: styles.bgMain.color
                    }}>
                        {Platform.OS === "ios" && (<MyStatusBar backgroundColor={style.colorWithdraw} barStyle="light-content" />)}
                        <SearchBar
                            text={text}
                            onChangeText={this.handleSearch}
                            handleBack={this.handleBack}
                        />
                        <FlatList
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                            data={data}
                            renderItem={this.renderItem}
                            keyExtractor={(e, i) => i.toString()}
                        />
                    </View>

                </Modal>
            </Fragment>
        );
    }
}

const stylest = StyleSheet.create({
    textSelected: {
        color: style.colorWhite
    },
    btnPicker: {
        alignItems: "center",
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    width: {
        width: "100%",
    }
})
