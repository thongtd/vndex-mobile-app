import React from 'react';
import {Text, View} from 'react-native';
import Container from '../../components/Container';
import {constant} from '../../configs/constant';

const RefScreen = ({componentId}) => (
  <Container
    componentId={componentId}
    hasBack
    title={'Refferal'}
    // nameRight={"search"}
    // nameLeft={"bars"}
    // typeLeft={constant.TYPE_ICON.AntDesign}
    // sizeIconLeft={19}
    // onClickRight={() => alert("kaka")}
    // onClickLeft={() => alert("left")}
  >
    <Text>This is Screen Dapp</Text>
  </Container>
);

export default RefScreen;
