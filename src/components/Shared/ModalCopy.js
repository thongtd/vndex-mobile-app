import React from 'react'
import { View, Text, Modal, StyleSheet} from "react-native";

type Props = {
    visible: boolean
}
export default class ModalCopy extends React.Component<Props>{
    render() {
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.props.visible}
                onRequestClose={()=>{}}>
                <View style={styles.modalBackground}>
                    <View style={[styles.activityIndicatorWrapper]}>
                        <Text>{'COPIED'.t()}</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#fff',
        // width: dimensions.width - 20,
        //height: dimensions.height / 3,
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        borderBottomWidth: 0,
        marginLeft: -1
    },
    input: {
        backgroundColor: '#1d314a',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5
    }
})
