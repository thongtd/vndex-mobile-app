import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../configs/styles/colors';
import icons from '../configs/icons';
import ButtonIcon from './Button/ButtonIcon';
import RenderItem from './RenderItem';
import PropTypes from 'prop-types';
import TextWhite from './Text/TextWhite';
import { constant } from '../configs/constant';

const TopBarWallet = ({
    renderItem,
    onClickRight,
    onClickLeft,
    nameLeft = "arrow-left",
    nameRight = "arrow-right",
    sizeIconLeft = 15,
    sizeIconRight = 15,
    colorLeft = "#fff",
    colorRight = "#fff",
    textLeft = "",
    textRight = "",
    typeRight = constant.TYPE_ICON.FontAwesome,
    typeLeft = constant.TYPE_ICON.FontAwesome,
    children,
    styleLeft,
    styleRight,
    styleCenter
}) => (
        <LinearGradient
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={[colors.gradientFrom, colors.gradientTo]}
            style={stylest.container}
        >
            <View>
                <View style={stylest.blockWallet}>
                    <Image source={icons.bgTopbar} resizeMode={"contain"} style={stylest.bgTopBar} />
                </View>
                <View style={stylest.blockFeature}>
                    <ButtonIcon
                        style={styleLeft}
                        styleBlockIcon={{ alignItems: 'flex-start' }}
                        name={nameLeft}
                        onPress={onClickLeft}
                        size={sizeIconLeft}
                        color={colorLeft}
                        titleIcon={textLeft}
                        type={typeLeft}
                        isHidden={onClickLeft ? false : true}
                    />
                    <RenderItem>
                        <View style={[stylest.viewFake,styleCenter]}>
                            {renderItem}
                        </View>
                    </RenderItem>
                    <ButtonIcon
                        style={styleRight}
                        styleBlockIcon={{ alignItems: 'flex-end' }}
                        name={nameRight}
                        onPress={onClickRight}
                        size={sizeIconRight}
                        color={colorRight}
                        titleIcon={textRight}
                        type={typeRight}
                        isHidden={onClickRight ? false : true}
                    />
                </View>
            </View>

            {children}
        </LinearGradient>
    );
const stylest = StyleSheet.create({
    bgTopBar: {
        width: 240,
    },
    blockWallet: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    container: {
        height: 170,
        overflow: "hidden"
    },
    blockFeature: {
        flexDirection: "row",
        height: "100%",
        position: "absolute",
        top: 30
    },
    viewFake: { width: "60%", justifyContent: "center", alignItems: "center" }
})
TopBarWallet.propTypes = {
    renderItem: PropTypes.element,
    onClickRight: PropTypes.func,
    onClickLeft: PropTypes.func,
    nameRight: PropTypes.string,
    nameLeft: PropTypes.string,
    sizeIconLeft: PropTypes.number,
    sizeIconRight: PropTypes.number,
    colorRight: PropTypes.string,
    colorLeft: PropTypes.string,
    textLeft: PropTypes.string,
    textRight: PropTypes.string,
    typeRight: PropTypes.oneOf([
        constant.TYPE_ICON.FontAwesome,
        constant.TYPE_ICON.AntDesign,
        constant.TYPE_ICON.Ionicons,
        constant.TYPE_ICON.MaterialIcons,
        constant.TYPE_ICON.MaterialCommunityIcons,
        constant.TYPE_ICON.Foundation,
        constant.TYPE_ICON.Octicons,
        constant.TYPE_ICON.Zocial,
        constant.TYPE_ICON.Entypo,
        constant.TYPE_ICON.EvilIcons,
        constant.TYPE_ICON.Feather,
        constant.TYPE_ICON.Fontisto
    ]),
    typeLeft: PropTypes.oneOf([
        constant.TYPE_ICON.FontAwesome,
        constant.TYPE_ICON.AntDesign,
        constant.TYPE_ICON.Ionicons,
        constant.TYPE_ICON.MaterialIcons,
        constant.TYPE_ICON.MaterialCommunityIcons,
        constant.TYPE_ICON.Foundation,
        constant.TYPE_ICON.Octicons,
        constant.TYPE_ICON.Zocial,
        constant.TYPE_ICON.Entypo,
        constant.TYPE_ICON.EvilIcons,
        constant.TYPE_ICON.Feather,
        constant.TYPE_ICON.Fontisto
    ]),
}
export default TopBarWallet;
