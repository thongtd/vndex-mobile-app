import React,{useEffect} from 'react';
import { Text, View, StyleSheet,RefreshControl } from 'react-native';
import TopBarView from './TopBarView';
import SafeAreaViewFnx from './SafeAreaView';
import PropTypes from 'prop-types';
import { constant, spacingApp } from '../configs/constant';
import Spinner from './Layout/Spinner';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LayoutSplashScreen from './Layout/LayoutSplashScreen';
import TaskBackground from '../redux/Provider/TaskBackground';
import { StatusBar } from 'react-native';
import colors from '../configs/styles/colors';
import { Navigation } from 'react-native-navigation';

const Container = ({
    children,
    isTopBar = true,
    title = "Title",
    onClickRight,
    onClickLeft,
    nameLeft,
    nameRight,
    sizeIconLeft = 15,
    sizeIconRight = 15,
    colorLeft,
    colorRight,
    textLeft = "",
    textRight = "",
    typeRight = constant.TYPE_ICON.FontAwesome,
    typeLeft = constant.TYPE_ICON.FontAwesome,
    customTopBar = null,
    space = 0,
    hasBack,
    componentId,
    isLayoutAuth = false,
    isSplashScreen,
    isLoadding,
    isScroll,
    isFlex = true,
    style,
    refreshing=false,
    onRefresh,
    isFilter
}) => {
    useEffect(() => {
        if(isTopBar){
            Navigation.mergeOptions(componentId,{
                topBar:{
                    animate: true,
                    title:{
                        text:title.t()
                    }
                }
            })
        }else{
            Navigation.mergeOptions(componentId,{
                topBar:{
                    animate: true,
                    visible:false
                }
            })
        }
        
        return () => {
            
        }
    }, [isTopBar,componentId])
    return (
        <>
        {/* <StatusBar barStyle="light-content" /> */}
            <TaskBackground
                componentId={componentId}
            />
            {isLayoutAuth ? (
                <LayoutSplashScreen
                    isSplashScreen={isSplashScreen}
                    isLoadding={isLoadding}
                >
                    {children}
                </LayoutSplashScreen>
            ) : (
                    <>
                        {/* {isTopBar && <TopBarView
                            title={title}
                            onClickRight={onClickRight}
                            onClickLeft={onClickLeft}
                            nameLeft={nameLeft}
                            nameRight={nameRight}
                            sizeIconLeft={sizeIconLeft}
                            sizeIconRight={sizeIconRight}
                            colorLeft={colorLeft}
                            colorRight={colorRight}
                            textLeft={textLeft}
                            textRight={textRight}
                            typeRight={typeRight}
                            typeLeft={typeLeft}
                            hasBack={hasBack}
                            componentId={componentId}
                            isFilter={isFilter}
                        />} */}
                        {customTopBar && customTopBar}
                        <View style={[stylest.container, { paddingTop: space, backgroundColor:colors.baseBg }, isFlex && { flex: 1 }, style]}>
                            <Spinner visible={isLoadding} />
                            {isScroll ? (
                                <KeyboardAwareScrollView
                                    refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    {children}
                                </KeyboardAwareScrollView>
                            ) : children}


                        </View>
                    </>
                )}
        </>

    );
}
Container.propTypes = {
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
    title: PropTypes.string,
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
    customTopBar: PropTypes.element
}
const stylest = StyleSheet.create({
    container: {
        paddingHorizontal: spacingApp,
        zIndex: 1,
        
    }
});
export default Container;
