import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/components/HomeScreen';
import Form from './src/components/CreateScreen';
import EditForm from './src/components/EditScreen';
import CustomNavigationBar from './src/components/CustomNavigationBar';
import SignIn from './src/components/SignInScreen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CLIENT_ID} from '@env';

const Stack = createNativeStackNavigator();

GoogleSignin.configure({
  webClientId: CLIENT_ID,
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: props => <CustomNavigationBar {...props} />,
        }}>
        <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
        <Stack.Screen
          name="Create"
          component={Form}
          options={{title: 'Create Transaction'}}
        />
        <Stack.Screen
          name="Edit"
          component={EditForm}
          options={{title: 'Edit Transaction'}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'Sign in'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
