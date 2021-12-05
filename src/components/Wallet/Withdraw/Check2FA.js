import React from 'react';
import { View, Modal, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { dimensions } from "../../../config/utilities";
import { Button, Right } from "native-base";
import { style } from "../../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'

class Check2FA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheck: false
        }
    }

    async componentDidMount() {
        this.setState({ isCheck: this.props.isCheck })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isCheck) {
            this.setState({ isCheck: nextProps.isCheck })
        }
    }

    render() {
        const { isCheck } = this.state;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={isCheck}
                onRequestClose={() => {
                    this.setState({ isCheck: false })
                }}>
                <View style={styles.modalBackground}>
                    <View style={[styles.activityIndicatorWrapper]}>
                        <View style={{ alignItems: 'flex-end', marginBottom: 10, marginTop: 10 }}>
                            <TouchableOpacity style={style.btnCloseModal} onPress={() => {
                                this.setState({ isCheck: false })
                                this.props.onClose();
                            }}>
                                <Icon name={"times"} color={style.textWhite.color} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={[style.textWhite, { paddingBottom: 20, fontWeight: 'bold' }]}>{'2FA_REQUIRED'.t()}</Text>
                            <Text style={[style.textWhite, { paddingBottom: 20 }]}>{'2FA_REQUIRED_CONTENT'.t()}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 5, marginBottom: 10 }}>
                                <TouchableOpacity block style={[style.buttonNext, style.buttonHeight, { width: '50%', margin: 5, justifyContent: 'center', alignItems: 'center' }]}
                                    onPress={() => {
                                        this.setState({ isCheck: false })
                                        this.props.onClose();
                                        this.props.navigation.navigate('Account')
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16 }}>{'Enable 2FA'.t()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity block style={{ height: 40, width: '50%', margin: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 2.5, borderWidth: 1, borderColor: '#162034' }}
                                    onPress={() => {
                                        this.setState({ isCheck: false })
                                        this.props.onClose();
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 18 }}>{'CLOSE'.t()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000060',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#192240',
        width: dimensions.width - 20,
        paddingHorizontal: 15,
        display: 'flex',
    },
})

export default Check2FA;
