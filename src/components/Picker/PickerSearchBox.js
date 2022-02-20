import React, {useState, useEffect} from 'react';
import {Text, View, StatusBar, FlatList} from 'react-native';
import Container from '../Container';
import TopBarView from '../TopBarView';
import Input from '../Input';
import SafeAreaViewFnx from '../SafeAreaView';
import LayoutSpaceHorizontal from '../Layout/LayoutSpaceHorizontal';
import colors from '../../configs/styles/colors';
import {Navigation} from 'react-native-navigation';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import {isAndroid} from '../../configs/utils';
import Empty from '../Item/Empty';
import {dismissAllModal} from '../../navigation/Navigation';
import Layout from '../Layout/Layout';
let hasNotch = DeviceInfo.hasNotch();
const PickerSearchBox = ({
  componentId,
  keywords,
  renderItem,
  selected,
  data,
  ...rest
}) => {
  const [source, setSource] = useState(data || []);
  var arrayholder = data || [];
  const handleClose = () => {
    if (componentId) {
      Navigation.dismissModal(componentId);
    } else {
      dismissAllModal();
    }

    // Navigation.dismissModal(componentId);
  };
  const searchFilterFunction = text => {
    const newData = arrayholder.filter(item => {
      let keyMaped = '';
      keywords.map((key, i) => {
        let getKey = _.get(item, key);
        keyMaped += ` ${getKey}`;
      });
      const itemData = `${keyMaped.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSource(newData);
  };
  return (
    <Container
      isScroll
      isTopBar={false}
      customTopBar={
        <TopBarView
          style={{
            height: hasNotch ? 115 : StatusBar.currentHeight > 24 ? 110 : 90,
            paddingTop: isAndroid() && StatusBar.currentHeight > 24 ? 35 : 25,
          }}>
          <SafeAreaViewFnx>
            <LayoutSpaceHorizontal space={15}>
              <Input
                styleBtnRight={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                nameIconLeft="search"
                isIconLeft
                isCircle
                placeholder={'Please input Keywords'.t()}
                isButtonRight
                nameIconRight="times"
                colorRight={colors.iconButton}
                onPressButtonRight={handleClose}
                onChangeText={text => searchFilterFunction(text)}
              />
            </LayoutSpaceHorizontal>
          </SafeAreaViewFnx>
        </TopBarView>
      }>
      <FlatList
        ListEmptyComponent={<Empty />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // paddingBottom: '40%',
          height: '100%',
        }}
        keyboardShouldPersistTaps="handled"
        data={source || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Container>
  );
};

export default PickerSearchBox;
