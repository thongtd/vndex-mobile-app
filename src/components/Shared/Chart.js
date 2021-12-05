import {ActivityIndicator, FlatList, PixelRatio, StyleSheet, Text, TouchableOpacity, View, WebView} from "react-native";
import {style} from "../../config/style";
import DepthChart from "./DepthChart";
import React, {Component} from "react";
import StockChartScreen from "./StockChart";
import ChartFnx from "../Trade/Chart/ChartTest";
import Orientation from "react-native-orientation"
import Icon from "react-native-vector-icons/FontAwesome";
import {styles} from "react-native-theme";
import TouchableOpacityFnx from "./TouchableOpacityFnx";
export default class Chart extends  Component{
    constructor(props) {
        super(props);
        this.state = {
            activeChart: 0
        }
    }

    render(){
        const {activeChart} = this.state;
        const {selectedPair, currencyList, navigation, onRefresh} = this.props;
        return (
            <View>
                <View style={[stylest.listCoin,{marginHorizontal:10,marginBottom:5}]}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <FlatList
                            data={["Line", "Depth"]}
                            renderItem={({item, index}) => (
                                <TouchableOpacityFnx
                                    style={[stylest.coin, {
                                        borderBottomColor: index === this.state.activeChart ? '#4972f3' : styles.txtButtonTabMainTitle.color,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 30,
                                        borderBottomWidth: index === this.state.activeChart ? 2 : 1,
                                        paddingHorizontal: 20
                                    }]}
                                    onPress={() => this.setState({activeChart: index})}>
                                    <Text
                                        style={[style.textWhite, {
                                            color: index == this.state.activeChart ? '#77b0ff' : styles.txtMainTitle.color,
                                            fontSize: index == this.state.activeChart ? 14 : 12
                                        }]}>{item}</Text>
                                </TouchableOpacityFnx>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            maxToRenderPerBatch={5}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacityFnx style={{
                            alignItems:"center",
                            paddingTop:4,paddingLeft:35
                        }} onPress={() => {
                                    Orientation.getOrientation((err, orientation) => {
                                        if (orientation === 'PORTRAIT') {
                                            navigation.navigate("ChartFullScreen",{
                                                pair:selectedPair && selectedPair.replace("-","_")
                                            });
                                            Orientation.lockToLandscape();
                                        } else {
                                            Orientation.lockToPortrait();
                                            navigation.goBack()
                                        }
                                    });
                                }}>
                                    <Icon name="arrows-alt" color={styles.textWhite.color} size={16} />
                                </TouchableOpacityFnx>
                    </View>
                </View>
                {activeChart === 0 &&
                <View style={[stylest.chart,styles.bgMain]}>
                     <ChartFnx pair={selectedPair && selectedPair.replace("-","_")} />
             
                </View>
                }
                {activeChart === 1 &&
                <View style={[stylest.chart,{overflow:'hidden'},styles.bgMain]}>
                    <DepthChart
                        pair={selectedPair}
                        title={""}
                    />
                </View>}
            </View>
        )
    }
}

const stylest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c2840',
        height: '100%'
    },
    header: {
        backgroundColor: "#1c2840",
        borderBottomWidth: 0,
        alignItems: 'center',
        paddingTop: 0
    },
    headerItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 10
    },
    marketData: {
        backgroundColor: "#1c2840",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#1c2840",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    content: {
        backgroundColor: "#151d30",
        flex: 1
    },
    chart: {
        height:300,
        // backgroundColor: "#151d30"
    },
    order: {
        flexDirection: 'row',
        // height: height/3
    },
    item: {
        borderBottomWidth: 0,
        // paddingLeft: 5,
        paddingRight: 5,
    },
    btnOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#00000040'
    },
    btnBuy: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#00d154',
        marginBottom: 10,
        borderRadius: 2
    },
    btnSell: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#ff315d',
        marginBottom: 10,
        borderRadius: 2
    },
    lastPrice: {
        fontWeight: '600',
        fontSize: 12,
        color: '#44a250'
    },
    currencyVolume: {
        color: '#343f85',
        fontSize: 10
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#00000040'
    },
    input: {
        backgroundColor: '#1d314a',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5

    },
    fontSize: {
        fontSize: 10,
    },
    listCoin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    coin: {
        borderColor: '#343f85',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // paddingHorizontal: 20,
        // paddingVertical: 15
    },
});