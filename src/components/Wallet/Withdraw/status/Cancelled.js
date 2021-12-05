import React from 'react';
import { Text, View } from 'react-native';
import {style} from "../../../../config/style"
import {styles} from "react-native-theme"
const Cancelled = ({
}) => (
    <Text style={[styles.bgSellOldNew, { textAlign: 'center' }]}>{'WITHDRAWAL_CANCEL'.t()}</Text>
);

export default Cancelled;
