import { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;

  useEffect(() => {
    const docId  = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const messageRef = firestore().collection('chatRooms')
    .doc(docId)
    .collection('messages')
    .orderBy('createdAt',"desc");

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allMessages = querySnap.docs.map(docSnap => {
        const data = docSnap.data();
        if (data.createdAt) {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
          }
        } else {
          return {
            ...docSnap.data(),
            createdAt: new Date(),
          }
        }  
      });
      setMessages(allMessages)
    });
    return () => {
      unSubscribe()
    }
  }, [uid]);

  const onSend = (messages) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const docId = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    firestore()
    .collection('chatRooms')
    .doc(docId)
    .collection('messages')
    .add({
      ...myMsg,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: user.uid,
      }}
    />
  );
}