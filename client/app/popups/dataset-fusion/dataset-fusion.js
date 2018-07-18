import angular from 'angular';
import 'checklist-model';
import {
  DatasetFusionController,
}
from './dataset-fusion.controller';
import template from './dataset-fusion.jade';
import State from './dataset-fusion.state';

const module = angular.module('Tellius.viewModels.transform.datasetFusion', [
  'checklist-model',
]);

module.config(State);
module.component('datasetFusionPopup', {
  bindings: {
    currentDataset: '<',
    datasets: '<',
    closeThisDialog: '&',
  },
  controller: DatasetFusionController,
  template: template(),
});

export default module;
