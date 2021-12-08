import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../Layout/Layout';
import TextFnx from './TextFnx';
import colors from '../../configs/styles/colors';

const Label = ({
    title,
    value,
    colorValue=colors.tabbarActive,
    colorTitle=colors.subText
}) => (
        <Layout space={5} type="column">
            <TextFnx color={colorTitle} value={title} />
            <TextFnx space={10} color={colorValue} value={value} />
        </Layout>
    );
export default Label;
