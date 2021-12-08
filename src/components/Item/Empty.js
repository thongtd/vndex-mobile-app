import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../Layout/Layout';
import Icon from '../Icon';
import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';
import { fullHeight, fullWidth } from '../../configs/utils';

const Empty = ({

}) => (
        <Layout
            type={"column"}
            isCenter
            style={{
                height: fullHeight/2,
                width:fullWidth
            }}
        >
            <Icon name="file" size={40} color={colors.description} />
            <TextFnx space={10} color={colors.description} value={"NO_DATA_TO_EXPORT".t()} />
        </Layout>
    );

export default Empty;
