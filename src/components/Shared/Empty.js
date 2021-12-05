import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {styles} from "react-native-theme";
const Empty = ({
    style
}) => (
        <View style={style}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={'file'} size={30} color={styles.txtBlackTitle.color} />
                <Text style={{ color:styles.txtBlackTitle.color }}>{'NO_DATA_TO_EXPORT'.t()}</Text>
            </View>
        </View>

    );

export default Empty;
