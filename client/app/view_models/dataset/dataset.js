import angular from 'angular';
import uiRouter from 'angular-ui-router';
import State from './dataset.state';
import template from './dataset.jade';

import Create from './create/create';
import List from './list/list';
import Wizard from './wizard/wizard';

const module = angular.module('Tellius.viewModels.dataset', [
  uiRouter,
  Create.name,
  List.name,
  Wizard.name,
]);

module.config(State);
module.component('datasetViewModel', {
  template: template(),
});

export default module;
