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
        autoplay
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
            uri:"https://serving.photos.photobox.com/54018733882965b7e4e3d22ca4be74d7d103fa5f0b284dd3983249bf4e41dca7fb8ba232.jpg"
        }}
        style={{
            height:160,
            with:fullWidth
        }}
        resizeMode={FastImage.resizeMode.cover}
        />
         <Images 
        source={{
            uri:"https://serving.photos.photobox.com/97306829287e44cda1dba5a843490f9af41e5ea28d22949863e4d26c557b463e9cac6e21.jpg"
        }}
        style={{
            height:160,
            with:fullWidth
        }}
        resizeMode={FastImage.resizeMode.cover}
        />
         <Images 
        source={{
            uri:"https://serving.photos.photobox.com/69987212250d7e88782fd863f7472470fee5ff2d238ba145af54eb5b2d5ab0d6163df13b.jpg"
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
