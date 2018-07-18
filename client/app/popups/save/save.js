import angular from 'angular';
import {
  Controller,
}
from './save.controller';
import template from './save.jade';

const module = angular.module('Tellius.popups.save', []);

module.component('savePopup', {
  bindings: {
    closeThisDialog: '&',
  },
  controller: Controller,
  template: template(),
});

export default module;
