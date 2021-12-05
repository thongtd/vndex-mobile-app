import React, { Component } from 'react'
import { Text, FlatList, View, Modal, TouchableOpacity, BackHandler } from 'react-native'
import ContainerApp from "../../Shared/ContainerApp";
import SearchBar from '../../Shared/SearchBar';
import { style } from "../../../config/style"
import MyStatusBar from '../../Shared/MyStatusBar';
import {styles} from 'react-native-theme';
export default class ModalSearchList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            text: null,
            data: [],
            selectedAside: null
        }
        this.contriesCurrent = [];
        this.contriesSearch = [];
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.countryList
        })
        this.contriesCurrent = nextProps.countryList;
        console.log(nextProps, "next");
    }
    handleSelectd = (data) => {
        this.props.selected(data);
        // this.setState({
        //     selectedAside:data.code
        // })
    }
    renderCountry = ({
        item, index
    }) => {
        return (
            <TouchableOpacity
                onPress={(he) => this.handleSelectd(item)}
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
                    }}>{item.name}
                    </Text>
                </View>

            </TouchableOpacity>
        )
    }
    handleSearch = (text) => {
        if (this.contriesCurrent.length > 0) {
            const newData = this.contriesCurrent.filter(item => {
                const itemData = `${item.name.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            this.setState({ data: newData });
        }

    }
    render() {
        const { text, data } = this.state;
        const { visibleModal, handleBack, countryList } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visibleModal}
                onRequestClose={handleBack}
            >
                <View style={{
                    height: "100%",
                    backgroundColor: styles.backgroundMain.color
                }}>
                    <MyStatusBar backgroundColor={style.colorWithdraw} barStyle="light-content"  />
                    <SearchBar
                        text={text}
                        onChangeText={this.handleSearch}
                        handleBack={handleBack}
                    />
                    <View style={{
                        paddingHorizontal: 10
                    }}>
                        <FlatList
                            data={data}
                            renderItem={this.renderCountry}
                            keyExtractor={(e, i) => i.toString()}
                        />
                    </View>

                </View>
            </Modal>
        )
    }
}