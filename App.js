import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/components/HomeScreen';
import Form from './src/components/CreateScreen';
import EditForm from './src/components/EditScreen';
import CustomNavigationBar from './src/components/CustomNavigationBar';
import SignIn from './src/components/SignInScreen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import TransactionContext from './src/repository/shared';
import {useApp, useUser} from '@realm/react';
import {ActivityIndicator} from 'react-native-paper';

const Stack = createNativeStackNavigator();

GoogleSignin.configure({
  webClientId:
    '206501523456-m5oaas54eetl0c261rb3srbm7vug13dj.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

function App() {
  const {RealmProvider} = TransactionContext;
  const app = useApp();
  const user = useUser();

  const OpenRealmBehaviorConfiguration = {
    type: 'downloadBeforeOpen',
  };

  const syncConfig = {
    user: app?.currentUser,
    partitionValue: user?.id,
    newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
  };

  return (
    <>
      <RealmProvider sync={syncConfig} fallback={<ActivityIndicator />}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: props => <CustomNavigationBar {...props} />,
            }}>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{title: 'Home'}}
            />
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
      </RealmProvider>
    </>
  );
}

export default App;
