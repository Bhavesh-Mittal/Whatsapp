import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ChatsDisplayScreen from './components/ChatsDisplayScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sign Up" component={SignUp} />
      <Tab.Screen name="Sign In" component={SignIn} />
    </Tab.Navigator>
  );
};

const ChatsNavigator = ({ user }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats">
        { props => <ChatsDisplayScreen { ...props } user={ user } /> }
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const Navigator = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser('');
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {user ? <ChatsNavigator user={ user }  /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Navigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});