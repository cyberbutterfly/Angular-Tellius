import angular from 'angular';

const module = angular.module('Tellius.config.SizeFilter', []);

module.config( /*@ngInject*/ SizeFilterConfigProvider => {
  SizeFilterConfigProvider.setDefaultUnit('b');
});

export default module;
