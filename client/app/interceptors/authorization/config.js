const Config = /*@ngInject*/ $httpProvider => {
  $httpProvider.interceptors.push('AuthorizationInterceptor');
};

export default Config;
