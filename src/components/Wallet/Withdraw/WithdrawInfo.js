import {Item, Left, Right} from "native-base";
import {style} from "../../../config/style";
import {Text, View, StyleSheet} from "react-native";
import {formatSCurrency} from "../../../config/utilities";
import React from "react";
import {styles} from "react-native-theme";
type Props = {
    currentRequest: any,
    request: any,
    selectedUnit: String,
    currencyList: Array
}
export default class WithdrawInfo extends React.Component<Props>{
    render() {
        const {currentRequest, request, selectedUnit, currencyList} = this.props;
        console.log(request,currentRequest,"request");
        return (
            <View style={{marginTop: 20}}>
                <View style={stylest.row}>
                    <View
                        numberOfLines={1}
                        style={stylest.colTitle}>
                        <Text style={[styles.txtMainTitle, ]}>{'BANK_NAME'.t()}</Text>
                    </View>
                    <View
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={stylest.colText}>
                        <Text style={[styles.textWhite, ]}>{currentRequest.data ? currentRequest.data.bankName : (request ? request.currentBank.name : '')}</Text>
                    </View>
                </View>
                {selectedUnit !== "IDR" && (
                    <View style={stylest.row}>
                    <View
                        numberOfLines={1}
                        style={stylest.colTitle}>
                        <Text style={[styles.txtMainTitle, ]}>{'BRANCH_NAME'.t()}</Text>
                    </View>
                    <View
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={stylest.colText}>
                        <Text style={[styles.textWhite, ]}>{currentRequest.data ? currentRequest.data.bankBranchName : (request ? request.currentBranch.name : '')}</Text>
                    </View>
                </View>
                )}
                
                <View style={stylest.row}>
                    <View
                        numberOfLines={1}
                        style={stylest.colTitle}>
                        <Text style={[styles.txtMainTitle, ]}>{'ACCOUNT_NAME'.t()}</Text>
                    </View>
                    <View
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={stylest.colText}>
                        <Text style={[styles.textWhite, ]}>{currentRequest.data ? currentRequest.data.bankAccountName : (request ? request.receiveBankAccountName:'')}</Text>
                    </View>
                </View>
                <View style={stylest.row}>
                    <View
                        numberOfLines={1}
                        style={stylest.colTitle}>
                        <Text style={[styles.txtMainTitle, ]}>{'ACCOUNT_NUMBER'.t()}</Text>
                    </View>
                    <View
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={stylest.colText}>
                        <Text style={[styles.textWhite, ]}>{currentRequest.data ? currentRequest.data.bankAccountNo :  (request ? request.receiveBankAccountNo:'')}</Text>
                    </View>
                </View>
                <View style={stylest.row}>
                    <View
                        numberOfLines={1}
                        style={stylest.colTitle}>
                        <Text style={[styles.txtMainTitle]}>{'WITHDRAWAL_AMOUNT'.t()}</Text>
                    </View>
                    <View
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={stylest.colText}>
                        <Text style={[styles.textWhite]}>{formatSCurrency(currencyList, currentRequest.amount ? currentRequest.amount : (request ? request.amount.str2Number() : 0), selectedUnit)} ({selectedUnit})</Text>
                    </View>
                </View>
               
            </View>
        );
    }
}

const stylest = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        marginTop: 5,
        alignItems: 'center',
    },
    colTitle: {
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    colText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});