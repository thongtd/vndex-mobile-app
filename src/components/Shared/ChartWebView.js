import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Button,
    View,
    processColor
} from 'react-native';
import update from 'immutability-helper';

import _ from 'lodash';
import {CandleStickChart} from 'react-native-charts-wrapper';
import {convertDatetime, dimensions} from "../../config/utilities";
import {marketService} from "../../services/market.service";

class CandleStickChartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            legend: {
                enabled: true,
                textSize: 14,
                form: 'CIRCLE',
                wordWrapEnabled: true
            },
            data: {
                dataSets: [{
                    values: [
                        {shadowH: 0, shadowL: 0, open: 0, close: 0}
                    ],
                    label: this.props.pair,
                    config: {
                        highlightColor: processColor('darkgray'),

                        shadowColor: processColor('black'),
                        shadowWidth: 1,
                        shadowColorSameAsCandle: true,
                        increasingColor: processColor('#71BD6A'),
                        increasingPaintStyle: 'FILL',
                        decreasingColor: processColor('#D14B5A')
                    },
                    xAxis: {},
                    yAxis: {}
                }],
            },
            marker: {
                enabled: true,
                markerColor: processColor('#2c3e50'),
                textColor: processColor('white'),
            },
            zoomXValue: 0
        };

        this.x = 0;
    }

    componentDidMount() {
        this.getChartData(this.props.pair)
        this.setState(
            update(this.state, {
                    xAxis: {
                        $set: {
                            drawLabels: true,
                            drawGridLines: true,
                            position: 'BOTTOM',
                            yOffset: 5,

                            limitLines: _.times(this.state.data.dataSets[0].values.length / 5, (i) => {
                                return {
                                    limit: 5 * (i + 1) + 0.5,
                                    lineColor: processColor('darkgray'),
                                    lineWidth: 1,
                                    label: (i + 1).toString()
                                };
                            })
                        }
                    },
                    yAxis: {
                        $set: {
                            left: {
                                valueFormatter: '$ #',
                                limitLines: [{
                                    limit: 112.4,
                                    lineColor: processColor('red'),
                                    lineDashPhase: 2,
                                    lineDashLengths: [10, 20]
                                }, {
                                    limit: 89.47,
                                    lineColor: processColor('red'),
                                    lineDashPhase: 2,
                                    lineDashLengths: [10, 20]
                                }]
                            },
                            right: {
                                enabled: false
                            },

                        }
                    },
                    zoomXValue: {
                        $set: 99999
                    }
                }
            ));
    }

    getChartData(symbol) {
        let {selectedSolution} = this.props;
        this.setState({chart_data: [], loading: true})
        marketService.get_chart_data(symbol, selectedSolution).then((res) => {
            if (res.status === "OK") {
                console.log(res.data);
                let data = this.parseChartData(symbol, res.data).dataSource;
                console.log(data);
                let volume = this.parseChartData(symbol, res.data).vols;
                this.setState({
                    data,
                    volume,
                    loading: false
                })
            }
            else {
                this.setState({chart_data: [], loading: false})
            }
        })
            .catch((err) => {
                this.setState({chart_data: [], loading: false})
            })
    }

    parseChartData(pair, data) {
        let high = data.h;
        let low = data.l;
        let open = data.o;
        let close = data.c;
        let times = data.t;
        let volume = data.v;

        let length = close.length;

        let dataSource = [];
        let vols = [];
        for (let i = 0; i < length; i++) {

            dataSource.push({shadowH: high[i], shadowL: low[i], open: open[i], close: close[i]})

            vols.push({
                x: times[i],
                y: parseFloat(volume[i]),
                color: open[i] > close[i] ? '#ff325d' : '#01ff9d'
            })
        }

        return {
            dataSource: {
                dataSets: [{
                    values: dataSource,
                    label: this.props.pair,
                    config: {
                        highlightColor: processColor('darkgray'),

                        shadowColor: processColor('black'),
                        shadowWidth: 1,
                        shadowColorSameAsCandle: true,
                        increasingColor: processColor('#71BD6A'),
                        increasingPaintStyle: 'FILL',
                        decreasingColor: processColor('#D14B5A')
                    },
                    xAxis: {},
                    yAxis: {}
                }]
            },
            volume: vols
        }
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({...this.state, selectedEntry: null})
        } else {
            this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
        }

        console.log(event.nativeEvent)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pair !== this.props.pair) {
            this.getChartData(nextProps.pair);
        }
    }

    render() {
        return (

            <View style={{flex: 1}}>

                <View style={{height: 80}}>
                    <Text> selected entry</Text>
                    <Text> {this.state.selectedEntry}</Text>
                </View>

                <View style={styles.container}>
                    <CandleStickChart
                        style={styles.chart}
                        data={this.state.data}
                        marker={this.state.marker}
                        chartDescription={{text: 'CandleStick'}}
                        legend={this.state.legend}
                        xAxis={this.state.xAxis}
                        yAxis={this.state.yAxis}
                        maxVisibleValueCount={16}
                        autoScaleMinMaxEnabled={true}
                        // zoom={{scaleX: 2, scaleY: 1, xValue:  400000, yValue: 1}}
                        zoom={{scaleX: 15.41, scaleY: 1, xValue: 40, yValue: 916, axisDependency: 'LEFT'}}
                        onSelect={this.handleSelect.bind(this)}
                        ref="chart"
                        onChange={(event) => console.log(event.nativeEvent)}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    chart: {
        flex: 1,
        height: dimensions.height * 2 / 5,
        backgroundColor: "#151d30"
    },
});

export default CandleStickChartScreen;