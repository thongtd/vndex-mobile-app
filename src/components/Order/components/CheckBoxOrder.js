import React from 'react';
import { Text, View,TouchableOpacity,Platform } from 'react-native';
// import styles from "../styles";
import { Item, Left, Right, Button, Switch } from 'native-base';
import {style} from "../../../config/style";
import {styles} from "react-native-theme";
const CheckBoxOrder = ({
    onCheckB,
    activeTab,
    onCheckS,
    onCancelAll,
    isSwitch,
    handleSwitch
}) => (
        <Item style={{
            borderBottomWidth:0,
            paddingBottom:10
        }}>
            <Left style={{ flex: 3 }}>
                <View style={[style.row, { justifyContent: 'center', alignItems: 'center', }]}>
                    <TouchableOpacity onPress={onCheckB}
                        style={[style.tabOrderHeading,
                        {
                            borderBottomWidth: activeTab === "O" ? 2 : 1,
                            borderBottomColor: activeTab === "O" ? '#4272ec' : styles.txtButtonTabMainTitle.color
                        }]}>
                        <Text style={activeTab === 'O' ? {
                            color: '#78afff',
                            fontSize: 13
                        } : styles.txtMainTitle}>{'OPEN_ORDERS'.t()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCheckS}
                        style={[style.tabOrderHeading,
                        {
                            borderBottomWidth: activeTab === "R" ? 2 : 1,
                            borderBottomColor: activeTab === "R" ? '#4272ec' : styles.txtButtonTabMainTitle.color
                        }]}>
                        <Text style={activeTab === 'R' ? {
                            color: '#78afff',
                            fontSize: 13
                        } : styles.txtMainTitle}>{'ORDER_HISTORY'.t()}</Text>
                    </TouchableOpacity>
                </View>
            </Left>
            <Right style={{ flex: 1.5 }}>
                {activeTab === 'O' ?
                    <TouchableOpacity onPress={onCancelAll} style={[style.btnCancelAll, { height: null,paddingHorizontal:20 }]}>
                        <Text style={[styles.bgSellOldNew, { fontSize: 14 }]}>{'CANCEL_ALL'.t()}</Text>
                    </TouchableOpacity>
                    :
                    <Switch style={Platform.OS==="ios"?{
                        transform: [{ scaleX: .7 }, { scaleY: .7 }],
                        marginTop:5
                    }:{}} value={isSwitch} onValueChange={handleSwitch} />
                }
            </Right>
        </Item>
    );

export default CheckBoxOrder;
