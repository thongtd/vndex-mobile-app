import React from 'react';
import RN,{ Text, View } from 'react-native';
import FastImage from 'react-native-fast-image'
import icons from '../../configs/icons';
import { isObject } from "lodash"
import { get } from '../../configs/utils';
const Image = ({
    style,
    source,
    resizeMode=FastImage.resizeMode.contain
}) => {
    return (
        <>
            {isObject(source) && get(source,"uri") ? <FastImage
                style={style}
                source={{
                    priority: FastImage.priority.high,
                    ...source
                }}
                resizeMode={resizeMode}
            /> : <RN.Image source={source} style={style} resizeMode={"contain"} />}
        </>
    );
}

export default Image;
