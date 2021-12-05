import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, Platform } from 'react-native'
import ContainerApp from '../../Shared/ContainerApp';
import stylest from "../styles"
import { style } from "../../../config/style"
import Icon from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Picker, CheckBox } from 'native-base';
import PickerSearch from '../../Shared/PickerSearch';
import { styles } from "react-native-theme"
const { width, height } = Dimensions.get('window')
const TableOrder = ({
    startDate,
    endDate,
    ...rest
}) => {
    return (
        <ContainerApp styledRoot={{
            height: 155,
            backgroundColor: styles.backgroundSub.color
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15
            }}>
                <TouchableOpacity style={[stylest.date, {
                    marginRight: 2, backgroundColor: styles.bgInputWhite.color,
                    borderWidth: 0.5,
                    borderColor: style.textMain.color
                }]}
                    onPress={rest._showDateTimePicker}
                >
                    <Text style={[startDate ? styles.textWhite : styles.txtMainTitle, {
                        marginLeft: 10,
                        fontSize: 15
                    }]}>{startDate ? startDate : 'DATE_FROM'.t()}</Text>
                    <Icon name={'calendar'} color={style.colorIcon} style={{ marginRight: 10 }} />
                    <DateTimePicker
                        isVisible={rest.isDateTimePickerVisible}
                        onConfirm={rest._handleDatePicked}
                        onCancel={rest._hideDateTimePicker}
                        maximumDate={new Date()}
                        date={rest.fromDate}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[stylest.date, {
                    marginLeft: 2, backgroundColor: styles.bgInputWhite.color,
                    borderWidth: 0.5,
                    borderColor: style.textMain.color,
                }]}
                    onPress={rest._showDateTimeToPicker}>
                    <Text style={[endDate ? styles.textWhite : styles.txtMainTitle, {
                        marginLeft: 10,
                        fontSize: 15
                    }]}>{endDate ? endDate : 'DATE_TO'.t()}</Text>
                    <Icon name={'calendar'} color={style.colorIcon} style={{ marginRight: 10 }} />
                    <DateTimePicker
                        isVisible={rest.isDateTimeToPickerVisible}
                        onConfirm={rest._handleDateToPicked}
                        onCancel={rest._hideDateTimeToPicker}
                        maximumDate={new Date()}
                    />
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={[stylest.boxFilter, {
                    backgroundColor: styles.bgInputWhite.color,
                    borderWidth: 0.5,
                    borderColor: style.textMain.color
                }]}>
                    <PickerSearch
                        textCenter={" - "}
                        headerItem={{ value: "ALL".t() }}
                        label={["value"]}
                        value={"value"}
                        onValueChange={rest.onChangeSymbol}
                        selectedValue={rest.symbol}
                        source={rest.symbolCoin}
                        placeholder={'ALL'.t()}
                        textStyle={styles.textWhite}
                        caretStyle={{
                            color: style.textMain.color,
                            fontSize: 18
                        }}
                        hasNested={Platform.OS === "ios" ? true : false}
                        onPressChange={rest.onPressChange}
                        isNested={rest.isNested}
                    />
                </View>
                <View style={[stylest.boxFilter, {
                    backgroundColor: styles.bgInputWhite.color,
                    borderWidth: 0.5,
                    borderColor: style.textMain.color
                }]}>

                    <PickerSearch
                        textCenter={" - "}
                        headerItem={{ value: "ALL".t() }}
                        label={["value"]}
                        value={"value"}
                        onValueChange={rest.onChangeCurrency}
                        selectedValue={rest.paymentUnit}
                        source={rest.currency}
                        placeholder={'ALL'.t()}
                        textStyle={styles.textWhite}
                        caretStyle={{
                            color: style.textMain.color,
                            fontSize: 18
                        }}
                        hasNested={Platform.OS === "ios" ? true : false}
                        onPressChange={rest.onPressChange2}
                        isNested={rest.isNested}
                    />
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <TouchableOpacity style={[stylest.date, {
                        marginRight: 2,
                        justifyContent: 'center'
                    }, rest.isCheckBuy && style.buttonNext, {
                        backgroundColor: styles.bgButton.color
                    }]}
                        onPress={rest.handleCheckBuy}>
                        <CheckBox checked={rest.isCheckBuy} color={'#44a250'}
                            onPress={rest.handleCheckBuy}
                            style={{ borderRadius: 0, left: 0, marginRight: 5 }} />
                        <Text style={[rest.isCheckBuy === true ? {
                            color: '#fff',
                            paddingTop: 0,
                            marginLeft: 5,
                        } : { color: '#fff', }, { paddingTop: 0, marginLeft: 5, }]}>{'BUY'.t()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[stylest.date, {
                        marginLeft: 2,
                        justifyContent: 'center',

                    }, rest.isCheckSell && style.buttonNext, {
                        backgroundColor: styles.bgButton.color
                    }]}
                        onPress={rest.handleCheckSell}>
                        <CheckBox checked={rest.isCheckSell} color={'#ff315d'}
                            onPress={rest.handleCheckSell}
                            style={{ borderRadius: 0, left: 0, marginRight: 5 }} />
                        <Text style={[rest.isCheckSell === true ? {
                            color: '#fff',
                            paddingTop: 0,
                            marginLeft: 5,
                        } : { color: '#fff', }, { paddingTop: 0, marginLeft: 5, }]}>{'SELL'.t()}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[stylest.btnSearch, {
                    backgroundColor: styles.bgButton.color
                }]}
                    onPress={rest.handleSearch}
                >
                    <Text style={style.textWhite}>{'SEARCH'.t()}</Text>
                </TouchableOpacity>
            </View>
        </ContainerApp>
    )
}
export default TableOrder