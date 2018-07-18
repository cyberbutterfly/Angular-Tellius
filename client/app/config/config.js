import angular from 'angular';

import WrapperConfig from './wrapper.config';
import StateConfig from './state.config';
import LocationConfig from './location.config';
import ngDialog from './ngDialog.config';

import AuthConfig from './auth.config';
import SizeFilter from './sizeFilter.config';

const module = angular.module('Tellius.config', [
  WrapperConfig.name,
  StateConfig.name,
  LocationConfig.name,
  ngDialog.name,
  AuthConfig.name,
  SizeFilter.name,
]);

export default module;
