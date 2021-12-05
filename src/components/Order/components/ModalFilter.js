import React from 'react';
import { Text, View,Modal,Platform } from 'react-native';
import MyStatusBar from '../../Shared/MyStatusBar';
import { style } from '../../../config/style';

const ModalFilter = ({
    onRequestClose,
    visible,
    children,
    isView,
    onDismiss,
    ...rest
}) => (
    <Modal
    onRequestClose={onRequestClose}
    visible={visible}
    transparent={true}
    animationType={"fade"}
    onDismiss={onDismiss}
    >
        {Platform.OS ==="ios" && (
             <MyStatusBar backgroundColor={style.colorWithdraw} barStyle="light-content"  />
        ) }
        {isView && isView}
    </Modal>
);

export default ModalFilter;
