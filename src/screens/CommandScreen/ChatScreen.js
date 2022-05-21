import {get, isEmpty} from 'lodash';
import React, {useState, useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Composer, GiftedChat} from 'react-native-gifted-chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ButtonIcon from '../../components/Button/ButtonIcon';
import ComposerVndex from '../../components/ComposerVndex';
import Container from '../../components/Container';
import Icon from '../../components/Icon';
import Image from '../../components/Image/Image';
import Send from '../../components/SendVndex';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import {isArray, size, toast} from '../../configs/utils';
import {useActionsP2p} from '../../redux';
import SignalRService from '../../services/signalr.service';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel,
  HttpTransportType,
} from '@aspnet/signalr';
import {SOCKET_URL} from '../../configs/api';
import MessageImage from '../../components/MessageImage';
import InputToolbar from '../../components/InputToolbar';

export default function ChatScreen({componentId, orderId, email = ''}) {
  const infoChat = useSelector(state => state.p2p.chatInfoP2p);
  const chatHistory = useSelector(state => state.p2p.chatHistory);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const [messages, setMessages] = useState([]);
  const dispatcher = useDispatch();
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  useEffect(() => {
    useActionsP2p(dispatcher).handleGetChatHistory({
      orderId: orderId,
      data: {
        skip: skip,
        take: 10,
      },
      isLoadmore:false
    });
    useActionsP2p(dispatcher).handleGetChatInfoP2p(orderId);
     
    return () => {
      
    };
  }, []);
  useEffect(() => {
    let dataInterval = setInterval(() => {
      useActionsP2p(dispatcher).handleGetChatHistory({
        orderId: orderId,
        data: {
          skip: 0,
          take: 10,
        },
        isLoadmore:true
      });
    }, 2000);


    return () => {
      clearInterval(dataInterval);
    };
  }, [skip, orderId]);
useEffect(() => {
  useActionsP2p(dispatcher).handleGetChatHistory({
    orderId: orderId,
    data: {
      skip: skip,
      take: 10,
    },
    isLoadmore:false
  });
  
  return () => {
    
  };
}, [skip]);

  useEffect(() => {
    let url = `${SOCKET_URL}${get(UserInfo, 'id')}`;
    const hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.None)
      .withUrl(url)
      .withHubProtocol(new JsonHubProtocol())
      .build();
    console.log(hubConnection, url, 'hubConnection');
    hubConnection
      .start()
      .then(res => {
        hubConnection.on('newMessage', data => {
          console.log(data, 'daaat');
        });
      })
      .catch(err => console.log('err: ', err));
    if (size(get(chatHistory, 'source')) > 0) {
      let historyData = handleFormatData(
        chatHistory.source,
        get(UserInfo, 'id'),
      );
      console.log(historyData, 'historyData');
      setMessages([...historyData]);
    } else {
      setMessages([]);
    }
    return () => {
      setMessages([]);
    };
  }, [chatHistory, UserInfo]);

  const onSend = useCallback(
    (messages = []) => {
      console.log(messages, 'messages');
      var formdataReal = new FormData();
      if (!isEmpty(get(messages[0], 'text'))) {
        formdataReal.append('MessageContent', get(messages[0], 'text'));
      }
      if (size(images) > 0) {
        for (let i = 0; i < images.length; i++) {
          const eleImage = images[i];
          if (get(eleImage, 'fileSize') > 5000000) {
            return toast('FILE_SIZE'.t());
          } else {
            messages[0].image = [{link: get(eleImage, 'uri')}];
            formdataReal.append('AttachImages', {
              uri: get(eleImage, 'uri'),
              type: get(eleImage, 'type'),
              name: get(eleImage, 'fileName'),
            });
          }
        }
      }

      useActionsP2p(dispatcher).handleSendChatMessage({
        formData: formdataReal,
        orderId: orderId,
      });

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      setTimeout(() => {
        setImages([]);
      }, 300);
    },
    [images, orderId],
  );
  const handleSelfieSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 0,
    }).then(res => {
      setImages([...res.assets]);
    });
  }
    ;
  // const {bottom} = useSafeAreaInsets();
  return (
     
    // <SafeAreaView>
    <Container isNotTranslateTitle componentId={componentId} isTopBar isFlex title={get(infoChat, "offerIdentityUser.id") == get(UserInfo, "id") ? `${get(infoChat, "provideIdentityUser.email")}` : `${get(infoChat, "offerIdentityUser.email")}`}>
      
        
        <GiftedChat
          bottomOffset={34}
        renderLoading={() => <ActivityIndicator />}
        scrollToBottom
        scrollToBottomComponent={() => (
          <Icon
            name="arrow-circle-down"
            size={30}
            color={colors.app.yellowHightlight}
          />
        )}
        renderMessageImage={data => <MessageImage {...data} />}
        renderComposer={data => {
          console.log('data: ', data);
          return (
            <View
              style={{
                flex: 1,
              }}>
              {isArray(images) && size(images) > 0 && (
                <ScrollView
                  horizontal
                  style={{
                    flex: 1,
                  }}>
                  {images.map((item, index) => (
                    <View key={index.toString()}>
                      <View
                        style={{
                          position: 'relative',
                          width: 70,
                          height: 70,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{
                            height: 50,
                            width: 50,
                          }}
                          source={{
                            uri: get(item, 'uri'),
                          }}
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          setImages(
                            images.filter((_, index) => _.uri != item.uri),
                          )
                        }
                        style={{
                          position: 'absolute',
                          backgroundColor: colors.black,
                          right: 0,
                          top: 2,
                          width: 20,
                          height: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 20,
                        }}>
                        <Icon size={14} name="times" color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              <Composer textInputStyle={{color:"#000"}} {...data} />
            </View>
          );
        }}
        placeholder={'Nhập tin nhắn của bạn'}
        messages={messages}
        onSend={messages => onSend(messages)}
        
        alwaysShowSend
        renderUsernameOnMessage
        loadEarlier={get(chatHistory, 'totalRecords') > skip ? true : false}
        onLoadEarlier={() => setSkip(skip + 10)}
        isLoadingEarlier={true}
        renderSend={data => <Send {...data} />}
        onPressActionButton={handleSelfieSide}
        user={{
          _id: get(UserInfo, 'id'),
        }}
        renderInputToolbar={data => <InputToolbar {...data} />}
        // renderMessageImage={data => {
        //   console.log('data: ', data);

        //   return (
        //     <View>
        //       <Image source={{
        //         uri:get(data,"uri")
        //       }} />
        //     </View>
        //   )
        // }}
        infiniteScroll={true}
        />
      </Container>
  );
}
const handleFormatData = (data, accId) => {
  data.map((item, index) => {
    item._id = get(item, 'id');
    item.image = get(item, 'p2PConversationMessageImages');
    item.text = get(item, 'messageContent');
    item.createdAt = get(item, 'createdDate');
    item.user = {
      _id: get(item, 'createdByAccount.id'),
      name: get(item, 'createdByAccount.userName'),
    };
  });
  return data;
};
