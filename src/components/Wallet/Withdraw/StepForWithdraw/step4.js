/**
 * Withdraw Step 4
 * QuyetHS edited at 22-01-2019
 *
 * @format
 * @flow
 */
import { Text, View } from "react-native";
import { style } from "../../../../config/style";
import React from "react";
import { Item, Left, Right } from "native-base";
import { dimensions, formatTrunc } from "../../../../config/utilities";
import WithdrawInfo from "../WithdrawInfo";
import Icon from "react-native-vector-icons/FontAwesome";
import {styles} from "react-native-theme";
type Props = {
    currentRequest: any,
    request: any,
    currencyList: Array,
    selectedUnit: String,
    messageType: String,
    messageText: String,
}

export default class Step4 extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            messageText: "",
            contact: false
        }
    }

    render() {
        let { currentRequest, request, selectedUnit, messageType, messageText, currencyList } = this.props;
        const msgType = currentRequest ? currentRequest.messageType : messageType;
        const msgText = currentRequest ? currentRequest.messageText : messageText;
        return (
            <View>
                <View style={{
                    backgroundColor: '#1c2840',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    borderWidth: 0.5,
                    borderColor: style.colorBorderBox,
                    borderRadius: 2.5
                }}>
                    <Text style={[msgType === 'E' ? styles.bgSellOldNew :styles.bgBuyOldNew, {
                        marginVertical: 5,
                        justifyContent: 'center',
                        fontSize: 14
                    }]}>{msgText}</Text>
                </View>
                <WithdrawInfo
                    currentRequest={currentRequest}
                    request={request}
                    selectedUnit={selectedUnit}
                    currencyList={currencyList}
                />
                <Item style={[style.item, { marginTop: 20, marginBottom: 10 }]}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon name={'warning'} size={16} color={'orange'} />
                        <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                    </Left>
                </Item>
                <Text style={[styles.bgSellOldNew]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
            </View>
        );
    }
}
