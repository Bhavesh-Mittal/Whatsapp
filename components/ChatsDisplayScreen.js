import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function ChatsDisplayScreen() {
  const userSignOut = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      console.log(err);
      Alert.alert('Something went wrong. Please try again later.');
    }
  }

  return (
    <View>
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
  btn: {
    alignSelf: 'center',
  },
});