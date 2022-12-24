import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchCamera } from 'react-native-image-picker';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  const openCamera = async () => {
    await launchCamera({ quality: 0.5 }, (result) => {
      if (result.errorCode) {
        console.log(result.errorCode);
      }

      const img = result.assets[0];
      const uploadTask = storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(img.uri);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) {
            Alert.alert('Uploaded Image');
          }
        },
        (error) => {
          console.log(error);
          Alert.alert('Something went wrong. Please try again later.');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setImage(downloadURL);
          });
        }
      );
    });
  };

  const userSignUp = async () => {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      firestore().collection('users').doc(result.user.uid).set({
        email: email,
        username: username,
        image: image,
        uid: result.user.uid,
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Username"
        onChangeText={(txt) => setUsername(txt)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Email"
        onChangeText={(txt) => setEmail(txt)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Password"
        secureTextEntry={true}
        onChangeText={(txt) => setPassword(txt)}
      />
      <Button
        mode="contained"
        onPress={() => userSignUp()}
        disabled={username && email && password && image ? false : true}
        style={styles.btn}>
        Sign Up
      </Button>
      <Button
        mode="contained"
        onPress={() => openCamera()}
        style={styles.btn}>
        Upload Profile Pic
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  input: {
    height: 35,
    marginBottom: 10,
  },
  btn: {
    alignSelf: 'center',
    marginBottom: 10,
  },
});