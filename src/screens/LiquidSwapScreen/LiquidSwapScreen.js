import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../components/Button/Button';
import {LOGIN_SCREEN, pushSingleScreenApp} from '../../navigation';
import WebView from 'react-native-webview';
import Container from '../../components/Container';
const url = 'https://dicvietnam.vn/services.html#issues';
const DicWebview = ({componentId}) => {
  return (
    <WebView
      source={{uri: url}}
      style={{flex: 1}}
      scalesPageToFit={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};
const LiquidSwapScreen = ({componentId}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  if (isLoaded) {
    return <DicWebview />;
  }
  return (
    <Container
      isLoadding={isLoaded}
      componentId={componentId}
      title="AMM"
      isTopBar>
      <WebView
        source={{uri: url}}
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
    </Container>
  );
};

export default LiquidSwapScreen;

const styles = StyleSheet.create({});
