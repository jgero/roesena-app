/**
 * provide uri with a leading "/"
 * @returns promise that resolves with the requested data and rejects with an error object
 */
function get(URI, headers) {
  return new Promise((resolve, reject) => {
    // create the request
    const request = new XMLHttpRequest();
    request.open("GET", "http://" + location.host + URI);
    // go through all the keys of the headers
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        request.setRequestHeader(key, headers[key]);
      }
    }
    request.send();
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (request.status === 200) {
          resolve(request.responseText);
        } else {
          reject({
            code: request.status,
            error: request.responseText
          });
        }
      }
    };
    request.onerror = function (_, ev) {
      reject({
        code: request.status,
        error: ev
      });
    }
  });
}

/**
 * provide uri with a leading "/"
 * @returns promise that resolves with the response data and rejects with an error object
 */
function post(URI, headers, body) {
  return new Promise((resolve, reject) => {
    // create the request
    const request = new XMLHttpRequest();
    request.open("POST", "http://" + location.host + URI);
    // go through all the keys of the headers
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        request.setRequestHeader(key, headers[key]);
      }
    }
    request.send(body);
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (request.status === 200 || request.status == 201) {
          resolve(request.responseText);

        } else {
          reject({
            code: request.status,
            error: request.responseText
          });
        }
      }
    };
    request.onerror = function (_, ev) {

      reject({
        code: request.status,
        error: ev
      });
    }
  });
}

export {
  get,
  post
};
