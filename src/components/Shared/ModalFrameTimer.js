import React from 'react';
import { Text, View } from 'react-native';

const ModalFrameTimer = ({
    listData,
    visible
}) => {visible?null:(
    <View>
        <View opacity={0} style={{position:"absolute",width:"100%",height:"100%"}}>
        </View>
        <View>
            <Text>
                hiihi
            </Text>
        </View>
    </View>
)}

export default ModalFrameTimer;
