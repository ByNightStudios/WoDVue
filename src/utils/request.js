/* eslint-disable camelcase */
import axios from 'axios';
import { isEmpty, get } from 'lodash';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import { store } from '../store/store';

export const axiosInstance = axios.create({
  baseURL: config.BASEURL,
  responseType: 'json',
});

const {
  user
} = store.getState();

/* eslint no-param-reassign:0 */
axiosInstance.interceptors.request.use(config => {
  const {
    user
  } = store.getState();
  if (!isEmpty(get(user, 'user.access_token'))) {
    config.headers.Authorization = `Bearer ${get(user, 'user.access_token')}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  err => {
    new Noty({
      text: 'Something went wrong',
      type: 'error',
      timeout: 5000,
    }).show();

    return Promise.reject(err);
  },
);

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(options) {
  return axiosInstance(options);
}
