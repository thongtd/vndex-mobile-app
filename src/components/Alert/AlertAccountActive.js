import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../configs/styles/colors';
import TextDot from '../Text/TextDot';
import AlertAuth from './AlertAuth';
import TextFnx from '../Text/TextFnx';
import Input from '../Input';
import Button from '../Button/Button';

const AlertAccountActive = ({
    componentId,
    email = "fnx@gmail.com"
}) => {
    return (
        <AlertAuth
            componentId={componentId}
            title={"Your account has not been actived".t()}
            customView={
                <>
                    <TextFnx
                        color={colors.text}
                        value={`${"OTP code has been sent to".t()} ${email}`}
                    />
                    <Input
                     isIconLeft
                     nameIconLeft={"key"}
                    isPaste
                    spaceVertical={20}
                    isResend
                    isCircle
                    placeholder={"OTP_CODE".t()}
                    />
                    <Button isButtonCircle isSubmit />
                </>
            }
        />

    );
}
export default AlertAccountActive;
