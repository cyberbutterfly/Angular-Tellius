import angular from 'angular';
import 'checklist-model';
import MLPredictController from './mlpredict.controller';
import template from './mlpredict.jade';
import State from './mlpredict.state';
import {
  MLPredictService,
}
from './mlpredict.state';

const module = angular.module('Tellius.viewModels.analytics.predict', [
  'checklist-model',
]);

module.config(State);
module.service('MLPredictService', MLPredictService);
module.component('mlPredictPopup', {
  controller: MLPredictController,
  template: template(),
  bindings: {
    model: '<',
    closeThisDialog: '&',
  },
});

export default module;
