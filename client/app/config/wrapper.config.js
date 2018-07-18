import angular from 'angular';
import Constants from '../constants';

const module = angular.module('Tellius.config.wrapper', [
  Constants.name,
]);

module.config( /*@ngInject*/ (ApiWrapperProvider, BASE_URL) => {
  ApiWrapperProvider.setBaseUrl(BASE_URL);
});

export default module;
