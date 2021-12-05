import React, { PureComponent } from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { style } from "../../config/style";
import { dimensions } from '../../config/utilities';
import { Button } from 'native-base';
import {styles} from "react-native-theme";
export default class SubmitButton extends PureComponent {
    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }

    render() {
        return (
            <View style={[this.props.style, { justifyContent: 'center' }]} >
                {this.props.is_submit ?
                    <View style={{ marginLeft: dimensions.width / 3 - 20, position: 'absolute' }}>
                        <ActivityIndicator color={style.colorHighLight} style={{ marginRight: 5 }} size={"small"} />
                    </View>
                    : null}
                <Button onPress={this.props.onSubmit} block warning
                    style={{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        elevation: 0, backgroundColor: styles.bgButton.color,
                        borderColor: '#19386f'
                    }}
                    disabled={this.props.is_submit}>

                    <Text style={[this.props.labelStyle, { marginLeft: 5 }]}>{this.props.label}</Text>
                </Button>
            </View>
        )
    }
}
