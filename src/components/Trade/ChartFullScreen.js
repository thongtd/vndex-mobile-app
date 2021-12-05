import React, {Component} from 'react';
import {View} from 'react-native';
import {Container, Content} from 'native-base'
import Chart from '../Shared/Chart'
import Orientation from 'react-native-orientation';
import StockChartScreen from "../Shared/StockChart";
import StockChartFullScreen from "../Shared/StockChartFullScreen";
import {dimensions} from "../../config/utilities";

export default class ChartFullScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        const initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            // do something
        } else {
            // do something else
        }
    }

    componentDidMount() {
        Orientation.lockToLandscape();
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
        } else {
            // do something with portrait layout
        }
    }

    componentWillUnmount() {
        Orientation.getOrientation((err, orientation) => {
            console.log(`Current Device Orientation: ${orientation}`);
        });
        Orientation.lockToPortrait();

        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    render() {
        const {pair, currencyList, selectedSolution} = this.props.navigation.state.params;
        return (
            <Container style={{width: dimensions.height, height: dimensions.width}}>
                <StockChartFullScreen
                    pair={pair}
                    currencyList={currencyList}
                    navigation={this.props.navigation}
                    selectedSolution={selectedSolution}
                />
            </Container>
        )
    }
}