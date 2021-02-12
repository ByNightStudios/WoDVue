import uuid from 'uuid/v4';
import axios from 'axios';
import { FCM_DATA_URL } from './backendConstants';

const firebaseDataInit = (fcm_token, user, round = 1) => {
  const device_id = document.cookie.replace(
    /(?:(?:^|.*;\s*)device_id\s*\=\s*([^;]*).*$)|^.*$/,
    '$1',
  );
  const fcmTokenCookie = document.cookie.replace(
    /(?:(?:^|.*;\s*)fcm_token\s*\=\s*([^;]*).*$)|^.*$/,
    '$1',
  );

  if (device_id && device_id.length) {
    if (fcmTokenCookie && fcmTokenCookie.length) {
      if (fcmTokenCookie === fcm_token) {
        return createOrUpdateFCMData(device_id, fcm_token, user, round);
      }
      document.cookie = `fcm_token=${fcm_token}`;
      return createOrUpdateFCMData(device_id, fcm_token, user, round);
    }
    document.cookie = `fcm_token=${fcm_token}`;
    return createOrUpdateFCMData(device_id, fcm_token, user, round);
  }
  document.cookie = `device_id=${uuid()}`;
  firebaseDataInit(fcm_token, user);
};

const createOrUpdateFCMData = (device_id, fcm_token, user, round) => {
  const instance = axios.create({
    BASEURL: config.BASEURL,
    headers: {
      common: {
        Authorization: `Bearer ${user.access_token}`,
      },
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers':
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      'X-Device-ID': device_id,
      'X-FCM-Token': fcm_token,
    },
  });

  instance
    .post(FCM_DATA_URL, {})
    .then(res => {})
    .catch(error => {
      if (round < 4) firebaseDataInit(fcm_token, user, round + 1);
      else return;
    });
};

export { firebaseDataInit };
