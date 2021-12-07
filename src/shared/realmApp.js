import Realm from 'realm';
import {REALM_APP_ID} from '@env';

// Invokes the shared instance of the Realm app.
const app = new Realm.App({id: REALM_APP_ID});
export default app;
