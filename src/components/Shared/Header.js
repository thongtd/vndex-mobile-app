import React, { Component, Fragment } from 'react'
import {
    Header,
    Item,
    Left,
    Right
} from 'native-base';

import {
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import { style } from "../../config/style";
import StatusBarFnx from './StatusBar';
import Logout from './Logout';
import Icon from "react-native-vector-icons/FontAwesome5";
import {styles} from "react-native-theme"
import {connect} from "react-redux";
const HeaderFnx = ({
    title = "finaceX",
    hasBack,
    isbtnSpecial,
    onPress,
    colorStatus = style.container.backgroundColor,
    hasView,
    backgroundHeader=styles.backgroundSub.color,
    hasRight,
    ...rest
}) => {
    return (
        <Fragment>
            <StatusBarFnx
                color={colorStatus}
            />
            <Logout
                navigation={rest.navigation}
            />
            {hasView ? hasView : (
                <Item style={[{ marginLeft: 0, height: 50, paddingHorizontal: 10, borderBottomWidth:rest.theme === "light"?0.5:0, backgroundColor: backgroundHeader }, rest.style]}>
                    {hasBack ?
                        (<React.Fragment>
                            <Left style={{
                                flex: 2,
                            }}>
                                <TouchableOpacity transparent onPress={isbtnSpecial ? onPress : () => rest.navigation.goBack()} style={{
                                    alignItems: 'center'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{
                                            paddingRight: 10
                                        }}>
                                            <Icon name={"chevron-left"} size={17} color={styles.textWhite.color} />
                                        </View>
                                        {rest.isIcon ? rest.icon : null}
                                        <Text style={[styles.textWhite, style.splitHeader,{
                                            borderLeftColor:styles.txtSplitHeader.color,
                                            borderLeftWidth:1
                                        }]}>{title}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Left>
                            <Right style={{
                                flex: 1
                            }}>
                                {hasRight && hasRight}
                            </Right>
                        </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                <Left style={{
                                    flex: 2,
                                }}>
                                    <Text style={[styles.textWhite, style.splitHeader,{borderLeftWidth:0}, rest.styledText]}>{title}</Text>
                                </Left>
                                <Right style={{
                                    flex: 1
                                }}>
                                    {hasRight && hasRight}
                                </Right>

                            </React.Fragment>
                        )
                    }
                </Item>
            )}

        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        theme:state.commonReducer.theme
    }
}

export default connect(mapStateToProps)(HeaderFnx);