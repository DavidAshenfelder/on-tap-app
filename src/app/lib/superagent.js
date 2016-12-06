import request from 'superagent';
import jsonp from 'superagent-jsonp';

const checkStatus = (response) => {
  // new api gives us response.status
  // suggest api gives us response.body.Status.Code
  if (
    (response.status >= 200 && response.status < 300) ||
    (response.body && response.body.Status && response.body.Status.Code >= 200 && response.body.Status.Code < 300)
  ) {
    return response.body;
  }


  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

// for non jsonp requests, just pass an empty function
const jsonPWrapper = (isJsonp) => {
  return isJsonp ? jsonp({ timeout: 10000 }) : () => {};
};

export default {
  go: (url = '', options = {}, isJsonp = false) => {
    /* eslint dot-notation: 0 */
    return request(options.method, url)
      .set(options.headers)
      .send(options.body)
      .use(jsonPWrapper(isJsonp))
      .then(checkStatus)
      .then(data => data)
      ['catch'](error => error);
  },
};
