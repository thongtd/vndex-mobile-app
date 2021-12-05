import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { style } from '../../config/style'
import PropTypes from 'prop-types';
import {styles} from "react-native-theme";

const propTypes = {
    // id: PropTypes.number.isRequired,
    // url: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChangeText: PropTypes.func
};

const defaultProps = {
    bgIcon: "",
    value: "",
    placeholder: "",
    editable: true
};


class TextField extends TextInput {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let props = this.props;
        return (
            <TextInput
                // maxFontSizeMultiplier={10}
                allowFontScaling={true}
                {...props}
                style={[style.fontSize14,{ flex: 1, padding: 5, color: style.textMain }, this.props.style]}
                onChangeText={(text) => this.props.onChangeText(text)}
                value={this.props.value}
                placeholder={this.props.placeholder}
                placeholderTextColor={styles.textPlaceHolder.color}
                autoCapitalize="none"
                editable={this.props.editable}
                underlineColorAndroid="transparent"
                returnKeyType={this.props.returnKeyType}
                secureTextEntry={this.props.secureTextEntry}
                onSubmitEditing={this.props.onEnter}
                focus={this.props.focus}
                ref={this.props.ref}
            />
        );
    }
}


export default TextField;

TextField.defaultProps = defaultProps
TextField.propTypes = propTypes
