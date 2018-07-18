import angular from 'angular';
import controller from './controller';
import template from './template.jade';

const module = angular.module('Tellius.popups.handleColumns', []);

module.component('handleColumnsPopup', {
  bindings: {
    columnName: '<',
    columnType: '<',
    closeThisDialog: '&',
  },
  controller,
  template: template(),
});

export default module;
