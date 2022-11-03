import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider} from 'react-native-paper';
import * as React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import store from './src/store/store';
import {AppProvider, UserProvider} from '@realm/react';
import {REALM_APP_ID} from '@env';
import SignInScreen from './src/components/SignInScreen';

let persistor = persistStore(store);

export default function Main() {
  return (
    <AppProvider id={'transaction-realm-vyllp'}>
      <UserProvider fallback={<SignInScreen />}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider>
              <App />
            </PaperProvider>
          </PersistGate>
        </Provider>
      </UserProvider>
    </AppProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
