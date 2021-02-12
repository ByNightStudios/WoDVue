import * as firebase from "firebase/app";
import {firebaseConfig} from './firebaseConfig'
import "firebase/messaging";

let messaging = null;
if(firebase.messaging.isSupported()) {


const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
  "BGSM4mIzgSRoLgg2xas-ufjh-6EX15KFL7aBijBbMGkX-dQHjw0dvtL5sOuQRHHxcguxbX-x7yi6koP3OLVsS5s"
);

}
export { messaging };
