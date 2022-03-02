import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Input from '../../../components/Input';
import colors from '../../../configs/styles/colors';
import TextFnx from '../../../components/Text/TextFnx';
import Button from '../../../components/Button/Button';
import {IdNavigation} from '../../../configs/constant';
import Container from '../../../components/Container';
import {pop, pushSingleHiddenTopBarApp, pushTabBasedApp} from '../../../navigation/Navigation';
import {Rating} from 'react-native-ratings';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_RATING_COMMENT} from '../../../redux/modules/p2p/actions';
import {createAction, listenerEventEmitter} from '../../../configs/utils';
import {HOME_SCREEN} from '../../../navigation';
import { get } from 'lodash';
import { useCallback } from 'react';

const RatingBuySellScreen = ({componentId, onCancel=()=>{}}) => {
  const [content, setContent] = useState('');
  const [ratingStar, setRatingStar] = useState(5);
  const dispatcher = useDispatch();
  // const accountId = useSelector(state => state.authentication.userInfo.id);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  useEffect(() => {
    const ev = listenerEventEmitter('successCreateCommentRating', () => {
      // console.log("kkakkaka");
      // pushSingleHiddenTopBarApp(componentId, HOME_SCREEN);
      pushTabBasedApp();
      
    });
    return () => {
      ev.remove();
    };
  }, [componentId]);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const onRatingComment = useCallback(() => {
    dispatcher(
      createAction(CREATE_RATING_COMMENT, {
        content: content,
        ratingStar: ratingStar,
        accountId: get(UserInfo,"id") == get(offerOrder,"ownerIdentityUser.identityUserId")? get(offerOrder,"offerIdentityUser.identityUserId"): get(offerOrder,"ownerIdentityUser.identityUserId"),
      }),
    );
  },[offerOrder,content,ratingStar])

  return (
    <Container
      spaceHorizontal={20}
      componentId={componentId}
      isTopBar
      isScroll
      title="Đánh giá">
      <View>
        <TextFnx>Độ hài lòng</TextFnx>
        <Rating
          ratingCount={5}
          startingValue={ratingStar}
          tintColor={colors.app.backgroundLevel1}
          onFinishRating={setRatingStar}
          style={{paddingVertical: 2}}
        />
      </View>
      <Input
        label="Ghi chú *"
        styleBorder={{height: 'auto'}}
        placeholder="Nhập nội dung"
        style={styles.textArea}
        hasValue
        isLabel
        value={content}
        onChangeText={text => setContent(text)}
        isInputTop
        restInput={{
          numberOfLines: 10,
          multiline: true,
        }}
      />

      <Button
        spaceVertical={20}
        isSubmit
        isClose
        onSubmit={onRatingComment}
        colorTitle={colors.text}
        weightTitle={'700'}
        onClose={() => onCancel()}
        textClose="Hủy bỏ"
        textSubmit="Gửi"
        colorTitleClose={colors.description}
        //   te={'MUA USDT'}
      />
    </Container>
  );
};

export default RatingBuySellScreen;

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize: 16,
    position: 'relative',
    marginTop: -10,
    marginBottom: 10,
    width: '100%',
  },
  noteForText: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    zIndex: 100,
    height: 'auto',
  },
});
