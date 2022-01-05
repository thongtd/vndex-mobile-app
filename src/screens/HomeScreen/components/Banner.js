import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import Images from '../../../components/Image/Image';
import colors from '../../../configs/styles/colors';
import { fullWidth } from '../../../configs/utils';
const Banner = () => {
  return (
    <View style={{
        height:210
    }}>
        <Swiper
      dot={
        <View
          style={styles.dot}
        />
      }
      activeDot={
        <View
          style={styles.activeDot}
        />
      }
      style={styles.wrapper}>
        <Images 
        source={{
            uri:"https://mona.media/wp-content/uploads/2021/06/banner-website.png"
        }}
        style={{
            height:160,
            with:fullWidth
        }}
        resizeMode={FastImage.resizeMode.cover}
        />
         <Images 
        source={{
            uri:"https://i.pinimg.com/originals/30/5c/5a/305c5a457807ba421ed67495c93198d3.jpg"
        }}
        style={{
            height:160,
            with:fullWidth
        }}
        resizeMode={FastImage.resizeMode.cover}
        />
         <Images 
        source={{
            uri:"https://khunganhonline.com/uploads/worigin/2019/07/02/anh-bia-thang-7-hello-july-85d1aafa4abe5e_f9f446b34edfc32b105ac840ac04eb94.jpg"
        }}
        style={{
            height:160,
            with:fullWidth
        }}
        resizeMode={FastImage.resizeMode.cover}
        />
    </Swiper>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide1: {
    //   flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    height: 161,
  },
  slide2: {
    //   flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
    height: 161,
  },
  slide3: {
    //   flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    height: 161,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  dot:{
    backgroundColor: colors.app.dotBanner,
    width: 20,
    height: 2,
    margin: 4,
  },
  activeDot:{
    backgroundColor: colors.app.yellowHightlight,
    width: 20,
    height: 2,
    margin: 4,
  }
});
