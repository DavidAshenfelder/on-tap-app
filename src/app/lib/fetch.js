import 'whatwg-fetch';

const parseJSON = (response) => {
  // if a response is not returned from the api,
  // this will bomb out and give you an error.
  // SyntaxError: Unexpected end of JSON input
  if (response.statusText === 'No Content' || (response.statusText === 'OK' && !response.body)) {
    return response;
  }
  return response.json();
};

const Service = {
  get: (url) => {
    return fetch(url).then(function(response) {
      return response.json();
    });
  },
  post: (url = '', options = {}) => {
    const postOptions = {
      method: 'POST',
      body: JSON.stringify(options),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetch(url, postOptions).then(function(response) {
      return response.json();
    });
  },
  delete: (url = '', options = {}) => {
    const postOptions = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: options,
    };
    return fetch(url, postOptions).then(function(response) {
      return response.json();
    });
  },
};

export default Service;
