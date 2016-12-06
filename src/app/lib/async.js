import fetch from './superagent';
import { GLOBAL_SEARCH_GLOBAL } from '../lib/globalSearchGlobal';

const defaultGetOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Access-Token': GLOBAL_SEARCH_GLOBAL ? `${GLOBAL_SEARCH_GLOBAL.BTApiAccessToken}` : '',
  },
};

const defaultPutOptions = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Access-Token': GLOBAL_SEARCH_GLOBAL ? `${GLOBAL_SEARCH_GLOBAL.BTApiAccessToken}` : '',
  },
};

const defaultPostOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Token': GLOBAL_SEARCH_GLOBAL ? `${GLOBAL_SEARCH_GLOBAL.BTApiAccessToken}` : '',
  },
};

const defaultDeleteOptions = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'text/plain',
    'Access-Token': GLOBAL_SEARCH_GLOBAL ? `${GLOBAL_SEARCH_GLOBAL.BTApiAccessToken}` : '',
  },
};

export default {
  // @param jsonp is a bool. true means you want to send a jsonp request
  get: (url = '', options = {}, jsonp = false) => {
    const getOptions = {
      ...defaultGetOptions,
      ...options,
    };

    return fetch.go(url, getOptions, jsonp);
  },

  simpleGet: (url = '', options) => {
    const getOptions = {
      ...defaultGetOptions,
      ...options,
      mode: 'no-cors',
    };
    return fetch.go(url, getOptions);
  },

  put: (url = '', options = {}) => {
    const putOptions = {
      ...defaultPutOptions,
      body: options,
    };
    return fetch.go(url, putOptions);
  },

  post: (url = '', options = {}) => {
    const postOptions = {
      ...defaultPostOptions,
      body: options,
    };
    return fetch.go(url, postOptions);
  },

  delete: (url = '') => {
    const deleteOptions = {
      ...defaultDeleteOptions,
    };
    return fetch.go(url, deleteOptions);
  },
};
