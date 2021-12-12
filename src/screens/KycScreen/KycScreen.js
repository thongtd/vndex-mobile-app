import React from 'react';
import { Text, View } from 'react-native';
import Container from '../../components/Container';
import { constant } from '../../configs/constant';

const KycScreen = ({
    componentId,
}) => (
        <Container
            title={"Thông tin cá nhân"}
            // nameRight={"search"}
            // nameLeft={"bars"}
            // typeLeft={constant.TYPE_ICON.AntDesign}
            // sizeIconLeft={19}
            // onClickRight={() => alert("kaka")}
            // onClickLeft={() => alert("left")}
            componentId={componentId}
            hasBack
        >
            <Text>
                This is Screen Dapp
        </Text>
        </Container>
    );

export default KycScreen;
