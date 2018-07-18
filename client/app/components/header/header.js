import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {
  HeaderController,
} from './header.controller';
import template from './header.jade';
import './header.scss';

const module = angular.module('Tellius.header', [
  uiRouter,
]);

module.component('header', {
  controller: HeaderController,
  template: template(),
});

export default module;
