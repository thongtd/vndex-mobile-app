import React from 'react';
import { Text, View } from 'react-native';
import {style} from '../../config/style';
const NoteNoticeBlockAcc = ({
    styled={ fontSize: 12, marginRight: 10 }
    }) => (
<View style={{ flexDirection: 'row' }}>
    <Text style={[style.textMain, { fontSize: 8, marginTop: 2 }]}></Text>
    <Text
        style={[style.textMain,styled ]}>{"NoteChangePass".t()}</Text>
</View>
);

export default NoteNoticeBlockAcc;
