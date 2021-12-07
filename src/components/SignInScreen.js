import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {login} from '../store/auth';
import {useDispatch} from 'react-redux';
import app from '../shared/realmApp';
import Realm from 'realm';

const SignInScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const dispatch = useDispatch();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {user, serverAuthCode} = userInfo;
      const {accessToken, idToken} = await GoogleSignin.getTokens();
      dispatch(
        login({
          token: idToken,
          email: user.email,
          accessToken: accessToken,
          serverAuthCode: serverAuthCode,
        }),
      );

      const credentials = Realm.Credentials.google(userInfo.serverAuthCode);
      await app.logIn(credentials);

      navigation.navigate('Home', {});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width: 240, height: 80}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />
    </View>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default SignInScreen;
