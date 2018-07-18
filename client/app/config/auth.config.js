import angular from 'angular';

const module = angular.module('Tellius.config.login', []);

module.config(/*@ngInject*/ $authProvider => {
  $authProvider.loginUrl = '/api/login';
});

export default module;
