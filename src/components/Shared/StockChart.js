import React from 'react';
import {
    View, processColor, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Modal, PixelRatio
} from 'react-native';
import {Container, Content, ListItem} from 'native-base'
import moment from 'moment'

import {BarChart, CombinedChart} from 'react-native-charts-wrapper';
import {marketService} from "../../services/market.service";
import {
    convertTimestampToDatetime,
    dimensions,
    formatSolution,
    formatTrunc,
    get_past_date,
    splitPair,
    timeStampToDateFomat
} from "../../config/utilities";
import {style} from '../../config/style'
import {Picker, Input} from "native-base";
import Orientation from 'react-native-orientation';
import Icon from "react-native-vector-icons/FontAwesome";
import CustomPicker from "./customPicker";
import ModalFrameTimer from './ModalFrameTimer';
import InputFieldFnx from './InputFieldFnx';

//const era = moment('2019-01-01', 'YYYY-MM-DD')
const pageSize = 60

type Props = {
    pair: string,
    currencyList: Array,
    navigation: any
}

class StockChartScreen extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.isLoading = false
        this.xMin = 0
        this.xMax = 0
        this.picker = React.createRef()
        this.state = {
            priceXAxis: {
                drawLabels: false,
                granularity: 1,
                granularityEnabled: true,
                valueFormatter: 'date',
                valueFormatterPattern: 'dd-MM-yyyy',
                since: 0,
                timeUnit: 'DAYS',
                drawGridLines: false,
                drawGridBackground: false,
                drawAxisLine: false
            },
            volumeXAxis: {
                drawLabels: false,
                position: 'BOTTOM',
                granularity: 1,
                granularityEnabled: true,
                valueFormatter: 'date',
                valueFormatterPattern: 'dd-MM-yyyy',
                since: 0,
                timeUnit: 'DAYS',
                textColor: processColor('#fff'),
                drawGridLines: false,
                drawGridBackground: false,

            },
            marker: {
                enabled: true,
                markerColor: processColor('#F0C0FF8C'),
                textColor: processColor('white'),
                markerFontSize: 14
            },
            visibleRange: {x: {min: 1, max: 30}},
            selectedChartData: {
                close: 0,
                date: moment().format('DD/MM/YYYY'),
                open: 0,
                shadowH: 0,
                shadowL: 0,
                vol: 0
            },
            pData: [],
            vData: [],
            highlights: [],
            chartConfig: {
                supported_resolutions: [
                    "1", "5", "15", "30", "60", "120", "240", "D", "W", "M"
                ]
            },
            selectedSolution: "D",
            solutionMode: 'D',
            dateFormatMode: 'YYYY-MM-DD',
            displayDateFormatMode: 'DD/MM/YYYY',
            showPicker: false
        }
    }

    getIndexOfDay(day, era) {
        let {selectedSolution} = this.state;
        let range = 1;
        console.log(selectedSolution);
        switch (selectedSolution) {
            case "D":
                range = 1
            case "W":
                range = 7
            case "M":
                range = 30
        }
        return moment(day, 'YYYY-MM-DD').diff(era, 'days')
    }

    getIndexOfMinute(day, era) {
        let {selectedSolution} = this.state;
        let range = selectedSolution;
        return moment(day, 'YYYY-MM-DD HH:mm').diff(era, 'minutes') / range
    }

    getIndexOfHour(day) {
        return moment(day, 'YYYY-MM-DD HH:mm').diff(era, 'hours')
    }

    getChartData(pair, solution) {
        return new Promise((resolve, reject) => {
            marketService.get_chart_data(pair, solution).then((res) => {
                // console.log(res,"stock kaka");
                if (res.status === "OK") {
                    let data = res.data;
                    let high = data.h;
                    let low = data.l;
                    let open = data.o;
                    let close = data.c;
                    let times = data.t;
                    let volume = data.v;

                    let length = close.length;
                    let dataSource = [];

                    let selectedChartData = {
                        close: close[length - 1],
                        date: timeStampToDateFomat(times[length - 1], this.state.dateFormatMode),
                        open: open[length - 1],
                        shadowH: high[length - 1],
                        shadowL: low[length - 1],
                        vol: volume[length - 1]
                    };
                    this.setState({
                        selectedChartData
                    })

                    for (let i = 0; i < length; i++) {
                        dataSource.push(
                            {
                                close: close[i],
                                date: timeStampToDateFomat(times[i], this.state.dateFormatMode),
                                ma5: 225.0559726957382,
                                ma15: 205.0559726957382,
                                open: open[i],
                                shadowH: high[i],
                                shadowL: low[i],
                                volume: volume[i]
                            }
                        )
                    }
                    resolve(dataSource)
                }
                else {
                    resolve([])
                }
            })
                .catch((err) => {
                    console.log(err,"get_chart_data")
                    reject(err);
                })
        })

    }


    generateNewData(from, to, data) {
        let {solutionMode, selectedSolution} = this.state;
        let era =data && data[0].date;
        console.log(data,from,to,"getIndexOfDay");
        console.log(this.getIndexOfDay(data[0].date, era),"getIndexOfDay")
        let priceData = data.map(e => ({
            x: solutionMode === 'D' ? this.getIndexOfDay(e.date, era) : this.getIndexOfMinute(e.date, era),
            shadowH: e.shadowH,
            shadowL: e.shadowL,
            open: e.open,
            close: e.close,
            date: e.date,
            vol: e.volume
        }))

        // console.log(priceData);

        let volumeData = data.map(e => ({
            values: [{
                x: solutionMode !== 'M' ? this.getIndexOfDay(e.date, era) : this.getIndexOfMinute(e.date, era),
                y: e.volume,
                marker: `${moment(e.date, this.state.dateFormatMode).format(this.state.displayDateFormatMode)} - ${e.volume}`
            }],
            label: 'volume',
            config: {
                drawValues: false,
                color: e.open - e.close < 0 ? processColor('#0c380e') : processColor("#650b0e")
            }
        }))

        // this.setState({...this.state, highlights: volumeData})

        this.setState({
            pData: priceData,
            vData: volumeData
        })

        //console.log('volumeData', volumeData)
        return {
            combinedData: {
                candleData: {
                    dataSets: [{
                        values: priceData,
                        label: 'price',
                        config: {
                            drawValues: false,
                            highlightColor: processColor('darkgray'),
                            shadowColor: processColor('black'),
                            shadowWidth: 1,
                            shadowColorSameAsCandle: true,
                            increasingColor: processColor(style.colorGreen),
                            increasingPaintStyle: 'FILL',
                            decreasingColor: processColor(style.colorRed)
                        }
                    }],
                }
            },
            volumeData: {
                dataSets: volumeData
            },
        }

    }

    componentDidMount() {
        this.getChartConfig(this.props.pair);
        this.loadData(this.props.pair, this.state.selectedSolution);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pair !== this.props.pair) {
            this.loadData(nextProps.pair, this.state.selectedSolution);
        }
        if (nextProps.onRefresh === true && nextProps.onRefresh !== this.props.onRefresh) {
            this.loadData(nextProps.pair, this.state.selectedSolution);
        }
    }

    loadData(pair, solution) {
        let today = moment().format(this.state.dateFormatMode)
        let start = moment().add(-2 * pageSize, 'days').format(this.state.dateFormatMode)
console.log(start,today,"get chartjs")
        this.setState({
            loading: true,
            selectedChartData: {
                close: 0,
                date: moment().format(this.state.dateFormatMode),
                open: 0,
                shadowH: 0,
                shadowL: 0,
                vol: 0
            },
        })
        // console.log(pair, solution,"pair and solution");
        this.getChartData(pair, solution).then(data => {
            // console.log(data,"data test date day");
            let lastData = data[data.length - 1];
            let firstData = data[0];
            let axisMinimum = -0.5;
            let axisMaximum = this.state.solutionMode !== 'M' ? this.getIndexOfDay(today, firstData.date) + 0.5 : this.getIndexOfMinute(today, firstData.date);
            this.setState({
                ...this.generateNewData(start, today, data),
                zoom: {
                    scaleX: 1,
                    scaleY: 1,
                    xValue: this.state.solutionMode !== 'M' ? this.getIndexOfDay(today, firstData.date) + 1 : this.getIndexOfMinute(today, firstData.date) + 60,
                    yValue: 0,
                    axisDependency: 'RIGHT'
                },
                volumeZoom: {
                    scaleX: 1,
                    scaleY: 1,
                    xValue: this.state.solutionMode !== 'M' ? this.getIndexOfDay(today, firstData.date) - 5 : this.getIndexOfMinute(today, firstData.date) - 300,
                    yValue: 0,
                    axisDependency: 'RIGHT'
                },
                priceXAxis: {...this.state.priceXAxis, axisMinimum: axisMinimum, axisMaximum: axisMaximum},
                volumeXAxis: {...this.state.volumeXAxis, axisMinimum: axisMinimum, axisMaximum: axisMaximum},
                loading: false
            })
        })
            .catch(err => {
                console.log(err);
            })

    }


    handleSelect(event) {
        let data = event.nativeEvent.data;
        if (data) {
            // console.log(this.state.pData);
            let vol = 0;
            let volume = this.state.pData.filter(o => o.x === data.x);
            if (volume.length > 0) {
                vol = volume[0].vol
            }
            data.vol = vol;
            this.setState({
                selectedChartData: data
            })
        }
    }

    handleVolumeSelect(event) {
        // console.log('select volume', event.nativeEvent)
        let vol = event.nativeEvent;
        let data = this.state.pData.filter(o => o.x === vol.x);
        if (data.length > 0) {
            let selectedData = data[0];
            // console.log(selectedData)
            this.setState({
                selectedChartData: selectedData
            })
        }
    }

    // handleChange(event){
    //     this.refs.priceChart.setDataAndLockIndex(this.state.combinedData)
    //     this.refs.volumeChart.setDataAndLockIndex(this.state.volumeData)
    // }

    processChartColor(e) {
        return e.open - e.close < 0 ? style.textGreen : (e.open - e.close === 0 ? style.textAddress : style.textRed)
    }

    getChartConfig(symbol) {
        marketService.get_chart_config(symbol).then(res => {
            // console.log(res);
            if (res) {
                this.setState({
                    chartConfig: res
                })
            }
        }).catch(err=>console.log(err,"get_chart_config"))
    }

    onSolutionValueChange = (text) => {
        // console.log("text",text);
        this.setState({
            selectedSolution: text
        })
        if (text !== 'D' && text !== 'W' && text !== 'M') {
            this.setState({
                solutionMode: 'M',
                dateFormatMode: 'YYYY-MM-DD HH:mm',
                displayDateFormatMode: 'DD-MM-YYYY HH:mm',
                priceXAxis: {
                    ...this.state.priceXAxis,
                    valueFormatterPattern: 'HH:mm',
                    timeUnit: 'MINUTES'
                }
            })
        }
        else {
            this.setState({
                solutionMode: 'D',
                dateFormatMode: 'YYYY-MM-DD',
                displayDateFormatMode: 'DD-MM-YYYY',
                priceXAxis: {
                    ...this.state.priceXAxis,
                    valueFormatterPattern: 'dd-MM-yyyy',
                    timeUnit: 'DAYS'
                }
            })
        }
        this.loadData(this.props.pair, text);
    }

    handleRotate = () => {
        const {pair, currencyList, navigation} = this.props
        Orientation.getOrientation((err, orientation) => {
            if (orientation === 'PORTRAIT') {
                navigation.navigate('ChartFullScreen', {
                    pair,
                    currencyList,
                    selectedSolution: this.state.selectedSolution
                });
            } else {
                Orientation.lockToPortrait();
                navigation.goBack()
            }
        });
    }

    showSolutionPicker() {
        this.setState({showPicker: true})
    }

    render() {
        let {selectedChartData, chartConfig, selectedSolution, displayDateFormatMode, dateFormatMode} = this.state;
        let {currencyList, navigation, pair} = this.props;
        let {symbol, unit} = splitPair(this.props.pair);
        // console.log(this.state.chartConfig.supported_resolutions,"combine data");
        // console.log(this.state.priceXAxis,"xAxis data");
        return (
            <Container style={style.container}>
                <Content>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',paddingTop: 10,}}>
                        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[style.textMain, {paddingLeft: 15}]}>{'CHART_MODE'.t()} </Text>
                            <CustomPicker
                                style={[style.btnCancel, { flexDirection: 'row', borderRadius: 10, justifyContent: 'space-around' }]}
                                listData={chartConfig.supported_resolutions}
                                fieldValue={""}
                                fieldLabel={""}
                                defaultValue={selectedSolution}
                                formatLabelFunc={formatSolution}
                                isObjectItem={false}
                                onSelectedChange = {this.onSolutionValueChange}
                                type={"dialog"}
                            />
                            {/* <InputFieldFnx 
                                hasDropdown
                                onPress={()=>this.setState({
                                    visible:true
                                })}
                            />
                            <ModalFrameTimer 
                            
                            /> */}
                        </View>
                        <TouchableOpacity style={{marginRight: 15, flex: 1}}
                                          onPress={this.handleRotate}
                        >
                            <Icon name={"arrows-alt"} size={20} color='#fff' style={{textAlign: 'right'}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 15,
                        marginVertical: 5
                    }}>
                        <Text
                            style={[style.textAddress, {fontSize: 10}]}>Date: {moment(selectedChartData.date, dateFormatMode).format(displayDateFormatMode)}</Text>
                        <Text
                            style={[style.textAddress, {fontSize: 10}]}>Vol: {formatTrunc(currencyList, selectedChartData.vol, symbol)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
                        <Text
                            style={[this.processChartColor(selectedChartData), {fontSize: 10}]}>L: {formatTrunc(currencyList, selectedChartData.shadowL, unit)}</Text>
                        <Text
                            style={[this.processChartColor(selectedChartData), {fontSize: 10}]}>H: {formatTrunc(currencyList, selectedChartData.shadowH, unit)}</Text>
                        <Text
                            style={[this.processChartColor(selectedChartData), {fontSize: 10}]}>O: {formatTrunc(currencyList, selectedChartData.open, unit)}</Text>
                        <Text
                            style={[this.processChartColor(selectedChartData), {fontSize: 10}]}>C: {formatTrunc(currencyList, selectedChartData.close, unit)}</Text>
                    </View>
                    {this.state.loading ? (
                            <View style={[style.activityIndicator, {height: 220}]}>
                                <ActivityIndicator animating={true} color={style.colorHighLight}/>
                            </View>
                        ) :
                        <View>
                            <CombinedChart
                                // autoScaleMinMaxEnabled={true}
                                data={this.state.combinedData}
                                scaleXEnabled={true}
                                xAxis={this.state.priceXAxis}
                                //onChange={(event)=> this.handleChange(event)}
                                onSelect={(event) => this.handleSelect(event)}
                                visibleRange={this.state.visibleRange}
                                zoom={this.state.zoom}
                                group="stock"
                                identifier="price"
                                syncX={true}
                                syncY={false}
                                dragDecelerationEnabled={false}
                                yAxis={
                                    {
                                        left: {enabled: false},
                                        right: {
                                            enabled: false,
                                            position: 'INSIDE_CHART',
                                            textColor: processColor('#fff'),
                                            gridLineWidth: 0
                                        },
                                        textColor: processColor('#fff'),
                                        drawGridLines: true,
                                        drawGridBackground: false,
                                    }
                                }
                                ref="priceChart"
                                doubleTapToZoomEnabled={false}  // it has to be false!!
                                chartDescription={{text: ""}}
                                legend={{enabled: false, verticalAlignment: "TOP"}}
                                drawGridBackground={true}
                                gridBackgroundColor={processColor("#141d30")}
                                style={styles.price}/>

                            <BarChart
                                data={this.state.volumeData}
                                xAxis={this.state.volumeXAxis}
                                onSelect={(event) => this.handleVolumeSelect(event)}
                                visibleRange={this.state.visibleRange}
                                zoom={this.state.volumeZoom}
                                marker={this.state.marker}
                                group="stock"
                                identifier="volume"
                                syncX={true}
                                syncY={false}
                                legend={{enabled: false, verticalAlignment: "TOP"}}
                                dragDecelerationEnabled={false}
                                yAxis={{left: {enabled: false}, right: {enabled: false}}}
                                ref="volumeChart"
                                doubleTapToZoomEnabled={false}  // it has to be false!!
                                chartDescription={{text: ""}}
                                chartBackgroundColor={processColor('transparent')}
                                autoScaleMinMaxEnabled={true}
                                style={styles.volume}/>
                        </View>
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#151d30",
    },
    price: {
        height: 220,
        borderWidth: 0
    },
    volume: {
        height: 80,
        backgroundColor: 'transparent',
        position: 'absolute',
        width: dimensions.width,
        bottom: 0,
        left: 0,
        elevation: 9999
    },
    solutionPicker: {
        width: 0,
        color: "#fff",
        fontSize: 14 / PixelRatio.getFontScale(),
        fontWeight: 'bold'
    }
});

export default StockChartScreen;
