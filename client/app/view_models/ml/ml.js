import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Create from './create/create';
import Wizard from './wizard/wizard';
import State from './ml.state';
import template from './ml.jade';

const module = angular.module('Tellius.viewModels.ML', [
  uiRouter,
  Create.name,
  Wizard.name,
]);

module.config(State);
module.component('mlViewModel', {
  template: template(),
  controller: angular.noop,
});

export default module;
