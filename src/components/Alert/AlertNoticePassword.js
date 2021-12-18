import React, { useEffect } from 'react';
import colors from '../../configs/styles/colors';
import TextDot from '../Text/TextDot';
import AlertAuth from './AlertAuth';

const AlertNoticePassword = ({
    componentId,
}) => {
    return (
        <AlertAuth
            componentId={componentId}
            title={"Your password must have:".t()}
            customView={
                <>
                    <TextDot color={colors.black} value={"8 or more characters".t()} />
                    <TextDot color={colors.black} value={"Uppercase & Lower letters".t()} />
                    <TextDot color={colors.black} value={"At least one number & special character".t()} />
                    <TextDot color={colors.black} value={"Uppercase & Lower letters".t()} />
                </>
            }
        />

    );
}
export default AlertNoticePassword;
