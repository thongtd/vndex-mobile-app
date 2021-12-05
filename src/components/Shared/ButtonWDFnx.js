import React from 'react';
import { Text, View, StyleSheet,TouchableOpacity,Image } from 'react-native';
import { style } from '../../config/style'
const ButtonWDFnx = ({
    onDeposit,
    onWithDraw
}) => (
        <View
            style={{ marginTop: -20, }}
        >
            <View style={styles.fund}>

                <TouchableOpacity
                    onPress={onDeposit}
                    style={{
                        width: "46%",
                    }}
                >
                    <View style={{
                        backgroundColor: "#4272ec",
                        width: "100%",
                        marginLeft: 10,
                        borderRadius: 2.5,
                        justifyContent: "center",
                        // alignItems:"center",
                        height: 45
                    }}>
                        {/* <View> */}
                        <Image
                            style={styles.img}
                            source={require('../../assets/img/Asset39.png')}
                            resizeMode="contain"
                        />
                        <View style={{
                            position: "absolute",
                            // left: "30%"
                            alignSelf:"center"
                        }}>
                            <Text style={style.textWhite}>{'DEPOSITS'.t().toUpperCase()}</Text>
                        </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={onWithDraw}
                    // disabled={loading}
                    style={{
                        width: "46%",
                        marginRight: 10,
                    }}
                >
                    <View style={{
                        backgroundColor: "#4272ec",
                        width: "100%",

                        borderRadius: 2.5,
                        justifyContent: "center",
                        // alignItems:"center",
                        height: 45
                    }}>
                        {/* <View> */}
                        <Image
                            style={styles.img}
                            source={require('../../assets/img/Asset40.png')}
                            resizeMode="contain"
                        />
                        <View style={{
                            position: "absolute",
                            alignSelf:"center"
                        }}>
                            <Text style={style.textWhite}>{'WITHDRAWALS'.t().toUpperCase()}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            </View>
        </View>
    );

export default ButtonWDFnx;

const styles = StyleSheet.create({
    info: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        marginBottom: 5
    },
    fund: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2.5,
        height: 60,
        width: "50%"
    },
    history: {
        paddingHorizontal: 10,
        marginBottom: 5,
        marginTop: 10
        //flex: 1,
    },
    item: {
        borderBottomWidth: 0,
        padding: 5,
        flex: 1,
        backgroundColor: '#1c2840',
        margin: 5
    },
    rowBack: {
        width: 70,
        backgroundColor: '#c5321e'
    },
    tradeCoin: {
        padding: 10,
        flex: 1
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#0e1021',
    },
    img: {
        height: "120%",
        width: 50,
        opacity: 0.2,
        marginTop: 13,
        marginLeft: 5
    }
})