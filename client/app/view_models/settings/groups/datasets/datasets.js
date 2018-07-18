import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsGroupsDatasetsController from './datasets.controller';
import State from './datasets.state';
import template from './datasets.jade';

const module = angular.module('Tellius.viewModels.settings.groups.datasets', [
  uiRouter,
]);
module.config(State);
module.component('settingsGroupsDatasetsViewModel', {
  controller: SettingsGroupsDatasetsController,
  template: template(),
});

export default module;
