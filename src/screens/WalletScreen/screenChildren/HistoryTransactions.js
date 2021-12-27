import React, { useState, useEffect } from 'react';
import LayoutInfoWallet from '../components/LayoutInfoWallet';
const HistoryTransactions = ({
    componentId,
}) => {
    return (
        <LayoutInfoWallet
            componentId={componentId}
            isHistoryTransaction
            title={"History".t()}
        />
    );
}

export default HistoryTransactions;
