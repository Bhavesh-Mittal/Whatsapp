import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RecentChatsDisplayScreen({ user, navigation }) {
  const [users, setUsers] = useState([]);

  const renderItem = ({ item, navigation }) => {
    return (
      <TouchableOpacity onPress={ () => navigation.navigate("ChatScreen", {name: item.username, uid: item.uid}) }>
        <View style={ styles.chatContainer }>
          <Image style={ styles.profilePic } source={{ uri: item.image }} />
          <Text style={ styles.usernameText }>{ item.username }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const getDetails = async () => {
    let recentUsers = [];
    const querySnap = await firestore().collection('users').where('uid', '!=', user.uid).get();
    const allUsers = querySnap.docs.map((docSnap) => docSnap.data());
    for (let i = 0; i < allUsers.length; i++) {
        const docId  = allUsers[i]['uid'] > user.uid ? user.uid + "-" + allUsers[i]['uid'] : allUsers[i]['uid'] + "-" + user.uid;
        const chats = await firestore().collection('chatRooms').doc(docId).collection('messages').get();
        const allMessages = chats.docs.map(docSnap => docSnap.data());
        if (allMessages.length > 0) {
            recentUsers.push(allUsers[i]);
        }
    }
    setUsers(recentUsers);
  };

  useEffect(() => {
    getDetails();
  }, [users]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d6d4d4',
    alignItems: 'center',
    padding: 5,
  },
  profilePic: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  usernameText: {
    fontSize: 25,
    color: 'black',
    paddingLeft: 20,
  },
  btn: {
    alignSelf: 'center',
  },
});