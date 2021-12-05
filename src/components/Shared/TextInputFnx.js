import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import { style } from '../../config/style';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import LabelField from '../Account/components/LabelField';
import {styles} from "react-native-theme";
export default class TextInputFnx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secureTextEntry: true
        }
    }

    render() {
        const {
            placeholder,
            placeholderTextColor,
            value,
            onChangeText,
            styled,
            onSecure,
            secureText,
            secureTextEntry,
            hasSecure,
            label
        } = this.props;
        const props = this.props;
        const secureTextEntryState = this.state.secureTextEntry;
        return (
            <React.Fragment>
            {label && (
                <LabelField
                    label={placeholder}
                />
            )}

                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Input
                        {...props}
                        placeholder={label?"":placeholder}
                        placeholderTextColor={placeholderTextColor || styles.txtMainTitle.color} allowFontScaling={false}
                        style={styled || [style.inputView2, { borderRadius: 3 },styles.textWhite]}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={hasSecure ? secureTextEntryState : secureTextEntry}
                    />
                    {hasSecure && (
                        <TouchableOpacity style={{
                            padding: 10,
                            position: "absolute",
                            right: 5,
                            marginBottom: 3
                        }} onPress={() => this.setState({
                            secureTextEntry: !this.state.secureTextEntry
                        })}>
                            <IconFontAwesome name={secureTextEntryState ? 'eye' : 'eye-slash'} color={style.textMain.color} size={16} />
                        </TouchableOpacity>
                    )}

                </View>
            </React.Fragment>

        )
    }
}
TextInputFnx.defaultProps = {
    // styled: [style.inputView2, { borderRadius: 3 }],
    // placeholderTextColor: "#486db5"
}