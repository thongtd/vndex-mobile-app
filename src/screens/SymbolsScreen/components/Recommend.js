import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
import TextFnx from '../../../components/Text/TextFnx';

const Recommended = ({
}) => (
        <Layout space={10}>
            <Icon name={"thumbs-up"} color={colors.yellow} size={17} style={{ width: 25 }} />
            <TextFnx style={{
                width: "98%",
                fontStyle:"italic"
            }} value={"RECOMMENDED".t()} isDart />
        </Layout>
    );

export default Recommended;
