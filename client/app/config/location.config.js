import angular from 'angular';

const module = angular.module('Tellius.config.location', []);

module.config( /*@ngInject*/ $locationProvider => {
  $locationProvider.html5Mode(true);
});

export default module;
