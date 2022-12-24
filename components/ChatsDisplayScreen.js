import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ChatsDisplayScreen({ user, navigation }) {
  const [users, setUsers] = useState('');

  const renderItem = ({ item , navigation}) => {
    return (
      <TouchableOpacity onPress={ () => navigation.navigate("ChatScreen", {name: item.username, uid: user.uid}) }>
        <View style={ styles.chatContainer }>
          <Image style={ styles.profilePic } source={{ uri: item.image }} />
          <Text style={ styles.usernameText }>{ item.username }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const getDetails = async () => {
    const querySnap = await firestore().collection('users').where('uid', '!=', user.uid).get();
    const result = querySnap.docs.map((docSnap) => docSnap.data());
    setUsers(result);
  };

  useEffect(() => {
    getDetails();
  });

  const userSignOut = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      console.log(err);
      Alert.alert('Something went wrong. Please try again later.');
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={(item) => item.username}
      />
      <Button
        mode="contained"
        onPress={() => userSignOut()}
        style={styles.btn}>
        Sign Out
      </Button>
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