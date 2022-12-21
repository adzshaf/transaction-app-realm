import * as React from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {logout, isLoggedIn} from '../store/auth';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import app from '../shared/realmApp';
import {useApp} from '@realm/react';

function CustomNavigationBar({navigation, back}) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const dispatch = useDispatch();
  const loggedIn = useSelector(isLoggedIn);
  const app = useApp();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await app.currentUser.logOut();
      dispatch(logout());
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Transaction App" />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" onPress={openMenu} />}>
        {app.currentUser ? (
          <Menu.Item title="Sync" />
        ) : (
          <Menu.Item
            onPress={() => {
              navigation.navigate('SignIn');
            }}
            title="Sign in"
          />
        )}
        {app.currentUser && (
          <Menu.Item title="Sign out" onPress={() => signOut()} />
        )}
      </Menu>
    </Appbar.Header>
  );
}

export default CustomNavigationBar;
