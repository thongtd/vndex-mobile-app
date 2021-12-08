import React from 'react';
import { Text, View } from 'react-native';

const RenderItem = ({
    children,
}) => (
        <React.Fragment>
            {children}
        </React.Fragment>
    );

export default RenderItem;
