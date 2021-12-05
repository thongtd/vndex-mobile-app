
import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Linking,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    Platform
} from 'react-native'
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Tab, Button, Input, Item } from 'native-base';
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome5';
class SortMatket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLastestPrice: "empty",
            isChange: "empty",
            isPair: "empty",
            isVol: false,
        }
    }

    render() {
        return (
            <View
                style={{ backgroundColor: '#152032', paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: 'row', borderRadius: 2.5 }}
            >
                <Left style={{ flex: 1.4 }}>
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.isPair !== "empty") {
                                    this.setState({
                                        isPair: !this.state.isPair,
                                        isLastestPrice: "empty",
                                        isChange: "empty",
                                        isVol: "empty",
                                    })
                                    this.props.onPair(this.state.isPair)
                                } else {
                                    this.setState({
                                        isPair: false,
                                        isLastestPrice: "empty",
                                        isChange: "empty",
                                        isVol: "empty",
                                    })
                                    this.props.onPair(this.state.isPair)
                                }
                            }}
                        >
                            <Text style={this.state.isPair !== "empty" ? { color: '#77b0ff' } : style.textMain}>
                                {"PAIR".t()}{" "}
                                {this.state.isPair !== "empty" && <Icon name={this.state.isPair ? "arrow-up" : "arrow-down"} size={12} color={this.state.isPair !== "empty" ? '#77b0ff' : style.textMain.color} />}
                            </Text>
                        </TouchableOpacity>
                        <Text style={style.textMain}>
                            {" "}{"/"}{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.isVol !== "empty") {
                                    this.props.onVol(this.state.isVol)
                                    this.setState({
                                        isVol: !this.state.isVol,
                                        isLastestPrice: "empty",
                                        isChange: "empty",
                                        isPair: "empty",
                                    })
                                } else {
                                    this.setState({
                                        isVol: false,
                                        isLastestPrice: "empty",
                                        isChange: "empty",
                                        isPair: "empty",
                                    })
                                    this.props.onVol(this.state.isVol)
                                }
                            }}
                        >
                            <Text style={this.state.isVol !== "empty" ? { color: '#77b0ff' } : style.textMain}>
                                {"VOL".t()}{" "}
                                {this.state.isVol !== "empty" && <Icon name={this.state.isVol ? "arrow-up" : "arrow-down"} size={12} color={this.state.isVol !== "empty" ? '#77b0ff' : style.textMain.color} />}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Left>
                <View style={{ borderBottomWidth: 0, flex: 0.4 }}>

                </View>
                <View style={{ borderBottomWidth: 0, flex: 1.6 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.isLastestPrice !== "empty") {
                                this.props.onLastest(this.state.isLastestPrice)
                                this.setState({
                                    isLastestPrice: !this.state.isLastestPrice,
                                    isVol: "empty",
                                    isChange: "empty",
                                    isPair: "empty",
                                })
                            } else {
                                this.props.onLastest(this.state.isLastestPrice)
                                this.setState({
                                    isLastestPrice: false,
                                    isVol: "empty",
                                    isChange: "empty",
                                    isPair: "empty",
                                })
                            }
                        }}
                    >
                        <Text style={this.state.isLastestPrice !== "empty" ? { color: '#77b0ff' } : style.textMain}>{"LAST_PRICE".t()}
                            {" "}
                            {this.state.isLastestPrice !== "empty" && <Icon name={this.state.isLastestPrice ? "arrow-up" : "arrow-down"} size={12} color={this.state.isLastestPrice !== "empty" ? '#77b0ff' : style.textMain.color} />}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Right style={{ borderBottomWidth: 0, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.isChange !== "empty") {
                                this.props.onChange(this.state.isChange)
                                this.setState({
                                    isChange: !this.state.isChange,
                                    isVol: "empty",
                                    isLastestPrice: "empty",
                                    isPair: "empty",
                                })
                            } else {
                                this.props.onChange(this.state.isChange)
                                this.setState({
                                    isChange: false,
                                    isVol: "empty",
                                    isLastestPrice: "empty",
                                    isPair: "empty",
                                })
                            }
                        }}
                    >
                        <Text style={this.state.isChange !== "empty" ? { color: '#77b0ff' } : style.textMain}>{"PERCENT_CHANGE".t()}{" "}
                            {this.state.isChange !== "empty" && <Icon name={this.state.isChange ? "arrow-up" : "arrow-down"} size={12} color={this.state.isChange !== "empty" ? '#77b0ff' : style.textMain.color} />}
                        </Text>
                    </TouchableOpacity>
                </Right>
            </View>
        )
    }
}


export default SortMatket;
