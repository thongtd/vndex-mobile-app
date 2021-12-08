import React from 'react';
import { Text, View } from 'react-native';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';

const TitleHistory = ({
}) => (
        <Layout>
            <TextFnx
                style={title(1.2)}
                value={"Time".t()}
            />
            <TextFnx style={title()} value={"You Pay".t()} />
            <TextFnx style={[title(), { textAlign: "right" }]} value={"You Get".t()} />
        </Layout>
    );
const title = (flex = 1) => {
    return {
        flex: flex,
        color: colors.title
    }
}

export default TitleHistory;
