import React from 'react';
import { Text, View } from 'react-native';
import {style} from "../../../../config/style"
const Complete = ({
}) => (
    <Text style={[style.textGreen, { textAlign: 'center' }]}>{'WITHDRAWAL_SUCCESS'.t()}</Text>
);

export default Complete;
