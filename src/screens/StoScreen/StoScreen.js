import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import Container from '../../components/Container';

const url = 'https://dicvietnam.vn/services.html#issues';
const DicWebview = () => {
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
const StoScreen = ({componentId}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  if (isLoaded) {
    return <DicWebview />;
  }
  return (
    <Container
      componentId={componentId}
      title="Smart Issues"
      isTopBar
      isLoadding={isLoaded}>
      <WebView
        source={{uri: url}}
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
    </Container>
  );
};

export default StoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
