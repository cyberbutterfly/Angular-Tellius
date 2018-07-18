import angular from 'angular';

import Controller from './settings-groups-add-datasets.controller';
import template from './settings-groups-add-datasets.jade';
import State from './settings-groups-add-datasets.state';
import './settings-groups-add-datasets.scss';

const module = angular.module('Tellius.popups.settingsGroupsAddDatasets', []);

module.config(State);
module.component('settingsGroupsAddDatasetsPopup', {
  bindings: {
    candidateDatasets: '<',
    submitSelectedDatasets: '&',
  },
  controller: Controller,
  template: template(),
});

export default module;
