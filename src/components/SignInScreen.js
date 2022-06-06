import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {login} from '../store/auth';
import {useDispatch} from 'react-redux';
// import app from '../shared/realmApp';
import Realm from 'realm';
import {useApp} from '@realm/react';

const SignInScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  // const dispatch = useDispatch();
  const app = useApp();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {user, serverAuthCode} = userInfo;
      const {accessToken, idToken} = await GoogleSignin.getTokens();

      const credentials = Realm.Credentials.google(userInfo.serverAuthCode);
      const userData = await app.logIn(credentials);

      // dispatch(
      //   login({
      //     token: idToken,
      //     email: user.email,
      //     accessToken: accessToken,
      //     serverAuthCode: serverAuthCode,
      //     userId: userData.id,
      //   }),
      // );

      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
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
