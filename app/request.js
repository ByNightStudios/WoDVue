/* eslint-disable no-undef */
/* eslint-disable camelcase */
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import localforage from 'localforage';
// eslint-disable-next-line no-unused-vars
import { isEmpty, get } from 'lodash';
import { message } from 'antd';

export const axiosInstance = axios.create({
  baseURL: config.baseURL,
  responseType: 'json',
});

/* eslint no-param-reassign:0 */
axiosInstance.interceptors.request.use(config => config);

axiosInstance.interceptors.response.use(
  response => response,
  err => {
    message.error('Something went wrong');
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
