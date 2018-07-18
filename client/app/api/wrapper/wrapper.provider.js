class ApiWrapper {
  constructor() {
    this.baseUrl = '';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  makeRequest({
    verb,
    url,
    data,
    headers,
    spinner = true,
  }) {
    const promise = new Promise((resolve, reject) => {
      const requestURL = url.charAt(0) === '/' ? url : this.baseUrl + url;
      const httpArgs = {
        url: requestURL,
        method: verb.toUpperCase(),
        spinner,
        headers: {
          ...this.headers,
            ...headers,
        },
      };

      if (verb.match(/post|put/)) {
        httpArgs.data = data;
      }

      this.$http.call(null, httpArgs)
      .success((res, status) => {
        resolve(res, status);
      })
      .error((res, status) => {
        reject(res, status);
      });
    });

    return promise;
  }

  get(url, headers, spinner) {
    return this.makeRequest({
      verb: 'get',
      url,
      headers,
      spinner,
    });
  }

  post(url, data, headers, spinner) {
    return this.makeRequest({
      verb: 'post',
      url,
      data,
      headers,
      spinner,
    });
  }

  put(url, data, headers) {
    return this.makeRequest({
      verb: 'put',
      url,
      data,
      headers,
    });
  }

  delete(url, headers) {
    return this.makeRequest({
      verb: 'delete',
      url,
      headers,
    });
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    return this.baseUrl;
  }

  setHeaders(headers) {
    this.headers = Object.assign({}, this.headers, headers);
  }

  getHeaders() {
    return this.headers;
  }

  uploadFile({
    url = `load/file`,
      payload,
  }) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open('POST', this.baseUrl + url);
      request.upload.onprogress = event => {
        this.progress = {
          loaded: event.loaded,
          total: event.total,
        };
      };

      request.onreadystatechange = function onreadystatechange() {
        if (request.readyState === 4) {
          if (request.status === 200) {
            try {
              resolve(JSON.parse(request.responseText));
            } catch (e) {
              reject(request.responseText);
            }
          } else {
            reject(request.responseText);
          }
        }
      };
      request.send(payload);
    });
  }

  getProgress() {
    return this.progress;
  }

  /*@ngInject*/
  $get($http) {
    let that = this;

    this.$http = $http;

    return {
      get: this.get.bind(that),
      post: this.post.bind(that),
      put: this.put.bind(that),
      delete: this.delete.bind(that),
      getHeaders: this.getHeaders.bind(that),
      setHeaders: this.setHeaders.bind(that),
      uploadFile: this.uploadFile.bind(that),
      getProgress: this.getProgress.bind(that),
    };
  }
}

export default ApiWrapper;
