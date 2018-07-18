export default class AuthorizationInterceptor {
  /*@ngInject*/
  constructor() {
  }
  responseError(response) {
    if (response.status === 401) {
      window.location = '/log';
    }

    return Promise.reject(response);
  }
}
