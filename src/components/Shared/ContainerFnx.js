import React, { Component, Fragment } from 'react'
import { Text, View } from 'react-native'
import { Container } from 'native-base';
import { style } from '../../config/style';
import HeaderFnx from './Header';
import { NavigationEvents } from "react-navigation"
import SignalrService from '../../services/signalr.service';
import Spiner from './Spiner';
import {styles} from "react-native-theme";
const ContainerFnx = ({
    title,
    hasBack,
    navigation,
    backgroundColor = styles.bgMain.color,
    backgroundHeader = styles.backgroundSub.color,
    onWillFocus,
    onWillBlur,
    colorStatus = style.colorWithdraw,
    hasRight=false,
    onPress,
    isbtnSpecial,
    listen_event=[],
    spaceTop=15,
    getWalletBalanceChange,
    isSpinner=false,
    ...props
}) => (
        <Fragment>
            <HeaderFnx
                title={title}
                hasBack
                navigation={navigation}
                backgroundHeader={backgroundHeader}
                colorStatus={colorStatus}
                hasRight={hasRight}
                onPress={onPress}
                isbtnSpecial={isbtnSpecial}
            />

            <Container style={{
                paddingHorizontal: 10,
                backgroundColor: backgroundColor,
                paddingTop:spaceTop
            }}>
                <Spiner isVisible={isSpinner}/>
            {/* <SignalrService 
            getWalletBalanceChange={getWalletBalanceChange}
            listen_event={listen_event} 
            /> */}
                <NavigationEvents
                    onWillFocus={onWillFocus}
                    onWillBlur={onWillBlur}
                />
                
                {props.children}
            </Container>
        </Fragment>
    );

export default ContainerFnx;
