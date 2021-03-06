import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import Container from '../../components/Container';
import Button from '../../components/Button/Button';
import { fullHeight, checkFullHeight } from '../../configs/utils';
import icons from '../../configs/icons';
import { pushTabBasedApp, pushSingleScreenApp, ENABLE_2FA_GG } from '../../navigation';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
const SetupCodeScreen = ({
    componentId,
    SecretKey
}) => {
    const images = [
        { url: icons.ggAuthenL, text: "SET_UP_CODE_1".t() },
        { url: icons.ggAuthenL2, text: "SET_UP_CODE_2".t() }
    ]
    return (
        <Container
            title={'SETUP_CODE'.t()}
            hasBack
            componentId={componentId}
            onClickRight={() => pushTabBasedApp(3)}
            textRight={"SKIP".t()}
            style={{
                flex: 1
            }}
        >
            <View style={stylest.container}>
                <Swiper autoplay={false}
                    loop={false}
                    autoplayDirection={true}
                    key={images.length}
                    removeClippedSubviews={false}
                    dotStyle={stylest.dotStyle}
                    activeDotStyle={stylest.activeDot}

                >
                    {
                        images.map((e, index) => {
                            return (
                                <View
                                    style={{
                                        // flex:1
                                    }}
                                    key={`key-check-${index}`}>
                                    <TextFnx space={20} align="center" color={colors.text} value={e.text} />
                                    <Image source={e.url}
                                        style={stylest.image}
                                        resizeMode={'contain'} />

                                </View>
                            )
                        })
                    }
                </Swiper>
                <Button
                    isButtonCircle={false}
                    isSubmit
                    textSubmit={'NEXT'.t()}
                    onSubmit={()=>pushSingleScreenApp(componentId,ENABLE_2FA_GG,{
                        SecretKey,
                        enable:true
                    })}
                />

            </View>

        </Container>
    );
}
const stylest = StyleSheet.create({
    container: {
        height: "93%",
        justifyContent: "space-between",
        flexDirection: "column"
    },
    dotStyle: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 20,
        height: 4,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    activeDot: {
        backgroundColor: '#3a4d92',
        width: 20,
        height: 4,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    image: {
        width: '100%',
        height: "75%",
        marginVertical: 10
    }
})
export default SetupCodeScreen;
