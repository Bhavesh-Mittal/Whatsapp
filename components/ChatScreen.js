import { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;

  const getAllMessages = async () => {
    const docId = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const querySnap = await firestore().collection('chatrooms')
    .doc(docId)
    .collection('messages')
    .createdAt('createdAt', 'desc')
    .get();
    const allMessages = querySnap.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      }
    });
    setMessages(allMessages);
  }

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}