import React, { Component } from 'react'
import { Text, View, TouchableOpacity,Platform,StyleSheet } from 'react-native'
import { Thumbnail } from "native-base";
import { style } from "../../../config/style";
import { formatSCurrency } from "../../../config/utilities"
import {styles} from "react-native-theme";
const ItemWallet = ({
    onNavigation,
    e,
    ...rest
}) => {
    return (
        <TouchableOpacity style={[{
            borderBottomWidth: 0,
            borderRadius: 2.5, backgroundColor: styles.bgSub.color, marginBottom: 5, padding: 10
        }]}
            onPress={onNavigation}
            key={rest.key}
        >
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center',height:30}}>
                <View style={{
                    flexDirection: "row",
                    width: "53%"
                }}>
                    <View style={{
                        // flex: rest.hasIcon?0.8:0.2,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        {rest.hasIcon && <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor:"transparent", justifyContent: 'center', alignItems: 'center', marginRight: 7.5 }}>
                            <Thumbnail small source={{ uri: e.images }}
                                style={{ width: 18, height: 18 }} square />
                        </View>}

                        <View style={{
                            flexDirection:"row"
                        }}>
                           <View>
                           <Text style={[styles.textWhite, { fontWeight: 'bold' }]}>
                                {rest.symbol}

                            </Text>
                           </View>
                           <View style={{
                               paddingLeft:10
                           }}>
                           <Text style={{
                                color: styles.txtMainSub.color,
                                fontSize: 12,
                            }}>
                                ({rest.name})
                        </Text>
                           </View>
                        </View>
                    </View>
                </View>
                <View style={{  }}>
                    <Text style={[styles.textWhite, { fontSize: 14 }]}>{rest.available}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
// const styles =StyleSheet.create({
//     fontIOS:{
//         fontFamily:"Roboto"
//     }
// })
export default ItemWallet;
