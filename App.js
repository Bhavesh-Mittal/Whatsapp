import { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ChatsDisplayScreen from './components/ChatsDisplayScreen';
import RecentChatsDisplayScreen from './components/RecentChatsDisplayScreen';
import ChatScreen from './components/ChatScreen';
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

const AllChatsNavigator = ({ user }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AChats" options={{ title: "" }}>
        { props => <ChatsDisplayScreen { ...props } user={ user } /> }
      </Stack.Screen>
      <Stack.Screen name="ChatScreen" options={{ title: "" }}>
        { props => <ChatScreen { ...props } user={ user } /> }
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const RecentChatsNavigator = ({ user }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RChats" options={{ title: "" }}>
        { props => <RecentChatsDisplayScreen { ...props } user={ user } /> }
      </Stack.Screen>
      <Stack.Screen name="ChatScreen" options={{ title: "" }}>
        { props => <ChatScreen { ...props } user={ user } /> }
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const ChatsNavigator = ({ user }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="All Chats">
        { props => <AllChatsNavigator { ...props } user={ user } /> }
      </Tab.Screen>
      <Tab.Screen name="Recent Chats">
        { props => <RecentChatsNavigator { ...props } user={ user } /> }
      </Tab.Screen>
    </Tab.Navigator>
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