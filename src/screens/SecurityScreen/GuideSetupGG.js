import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Container from '../../components/Container';
import { pushTabBasedApp, pushSingleScreenApp, BACK_UP_KEY } from '../../navigation';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import icons from '../../configs/icons';
import LayoutCenter from '../../components/Layout/LayoutCenter';
import Button from '../../components/Button/Button';
import { fullHeight, checkFullHeight } from '../../configs/utils';

const GuideSetupGG = ({
    componentId,
}) => (
        <Container
            hasBack
            componentId={componentId}
            title={"DOWNLOAD_AND_INSTALL".t()}
            onClickRight={() => pushTabBasedApp(3)}
            textRight={"SKIP".t()}
            style={{
                flex: 1,
                zIndex: 0,

            }}
        >
            <View style={stylest.container}>
                <LayoutCenter>
                    <TextFnx space={20} value={"GUIDE_INSTALL".t()} align="center" color={colors.text} />
                    <Image source={icons.gg2fa} style={{
                        width: 150,
                        height: 100
                    }} resizeMode="contain" />
                    <TextFnx space={10} color={colors.description} value={"Google Authentication".t()} />
                </LayoutCenter>
                <Button
                    textSubmit={"NEXT".t()}
                    onSubmit={()=>pushSingleScreenApp(componentId,BACK_UP_KEY)}
                    isSubmit
                    isButtonCircle={false}
                />
            </View>
        </Container>
    );
const stylest = StyleSheet.create({
    container: {
        height: "93%",
        justifyContent: "space-between",
        flexDirection: "column"
    }
})
export default GuideSetupGG;
