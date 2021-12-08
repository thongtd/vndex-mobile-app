import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import AlertAuth from './AlertAuth';
import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';
import Input from '../Input';
import Button from '../Button/Button';

const ModalAlert = ({
    top,
    onChangeText,
    onResend,
    maxLength = 6,
    componentId,
    title = "this is title",
    email = "your email",
    onSubmit,
    placeholder = "OTP_CODE".t(),
    isResend = true,
    isIconLeft = true,
    textFirst = `${"OTP code has been sent to".t()} ${email}`,
    isTitle,
    customView = <>
        <TextFnx
            color={colors.text}
            value={textFirst}
        />
        <Input
            onChangeText={onChangeText}
            handleResend={onResend}
            maxLength={maxLength}
            isIconLeft={isIconLeft}
            nameIconLeft={"key"}
            isPaste
            spaceVertical={20}
            isResend={isResend}
            isCircle
            placeholder={placeholder}
        />
        <Button isButtonCircle onSubmit={onSubmit} isSubmit />
    </>
}) => {
    useEffect(() => {
        if (onResend && typeof onResend === "function") {
            onResend();
        }
    }, [onResend])
    return (
        <AlertAuth
            top={top}
            isTitle={isTitle}
            componentId={componentId}
            title={title}
            customView={
                customView
            }
        />
    );
}

export default ModalAlert;
