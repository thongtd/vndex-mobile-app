import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import {  StyleSheet, View, } from 'react-native';

// TODO: support web
// @ts-ignore
import Lightbox from 'react-native-lightbox';
import { StylePropType } from './utils';
const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"center",
        alignItems:"center"
    },
    image: {
        width: 70,
        height: 50,
        borderRadius: 3,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});
export default class MessageImage extends Component {
    render() {
        const { containerStyle, lightboxProps, imageProps, imageStyle, currentMessage, } = this.props;
        if (!!currentMessage) {
            return (<View style={[styles.container, containerStyle]}>
          {get(currentMessage,"image").map((item,index) => (
            <Lightbox activeProps={{
                style: styles.imageActive,
            }} {...lightboxProps}>
            <FastImage {...imageProps} style={[styles.image,size(get(currentMessage,"image")) == 1?{
                width:150,
                height:100
            }:{}, imageStyle]} source={{ uri: get(item,"link") }} />
          </Lightbox>
          ))}          
        </View>);
        }
        return null;
    }
}
MessageImage.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
};
MessageImage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    imageStyle: StylePropType,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
//# sourceMappingURL=MessageImage.js.map