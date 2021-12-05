import ChartView from 'react-native-highcharts';
import React, {Component} from 'react'
import {dimensions, splitPair} from "../../config/utilities";
import {marketService} from "../../services/market.service";
import {styles} from "react-native-theme";

export default class DepthChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: {bids: [], asks: []}
        }
    }

    componentDidMount() {
        let {symbol, unit} = splitPair(this.props.pair)
        this.getDepthData(symbol, unit);
    }


    shouldComponentUpdate(prevProps) {
        if(prevProps.pair && prevProps.pair !== this.props.pair){
            let {symbol, unit} = splitPair(this.props.pair)
            this.getDepthData(symbol, unit);
        }
        return true;
    }

    getDepthData(symbol, unit){
        marketService.get_depth_data(symbol, unit).then(res => {
            if (res.status === "OK") {
                this.setState({
                    dataSource: res.data
                })
            }
            else {
                this.setState({dataSource: {bids: [], asks: []}})
            }
        })
    }

    render() {
        let data = this.state.dataSource;

        let askData = data.asks;
        let bidData = data.bids;
        let askDepthTotal = 0;
        let bidDepthTotal = 0;


        for (let i = 0; i < askData.length; i++) {
            askData[i][0] = Number(askData[i][0])
            askDepthTotal += askData[i][1];
            askData[i][1] = askDepthTotal;
        }

        for (let i = 0; i < bidData.length; i++) {
            bidData[i][0] = Number(bidData[i][0])
            bidDepthTotal += bidData[i][1];
            bidData[i][1] = bidDepthTotal;
        }

        let conf = {
            chart: {
                type: 'area',
                zoomType: 'xy',
                backgroundColor: styles.bgMain.color
            },
            title: {
                text: this.props.title,
                style: {
                    color: "#fff"
                }
            },
            exporting: {
                enabled: false
            },
            xAxis: [
                {
                    type: 'logarithmic',
                    lineColor: "#2b313f",
                    width: '50%',
                    labels: {
                        style: {
                            color: 'green'
                        }
                    }
                }, {
                    type: 'logarithmic',
                    lineColor: "#2b313f",
                    labels: {
                        style: {
                            color: 'red'
                        }
                    },
                    offset: 0,
                    left: '50%',
                    width: '50%'
                }],
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    align: 'left',
                    x: -30
                },
                title: {
                    text: '',
                    align: 'left',
                    x: -30,
                    style: {
                        color: '#000000'
                    }
                },
                lineColor: "#2b313f",
                offset: 0,
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    softThreshold: true,
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 3
                        }
                    },
                    threshold: null
                },
            },

            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><td>Price:</td><td style="text-align: right;">{point.x}</td></tr><tr><td>Sum:</td><td style="text-align: right;">{point.y}</td></tr>',
                footerFormat: '</table>',
                valueDecimals: 2
            },

            series: [{
                name: 'Bids',
                data: bidData,
                color: '#01ff9d',
                fillColor: '#133131',
                xAxis: 0,
            }, {
                name: 'Asks',
                data: askData,
                color: '#ff325d',
                fillColor: '#291a2d',
                xAxis: 1,
            }]
        };
        let options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };
        return (
            <ChartView style={{height: 330, backgroundColor: styles.bgMain.color}}
                       config={conf}
                       options={options}
                       originWhitelist={['']}
            />
        );
    }
}
