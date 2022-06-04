import Realm from 'realm';
import {REALM_APP_ID} from '@env';

const app = new Realm.App({id: REALM_APP_ID});

export default app;
