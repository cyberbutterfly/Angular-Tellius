import angular from 'angular';
import {
  ModelTypeSelectorController,
}
from './model-type-selector.controller';
import template from './model-type-selector.jade';

const module = angular.module('Tellius.viewModels.ml.wizard.modelTypeSelector', []);
module.component('modelTypeSelector', {
  bindings: {
    modelType: '<',
  },
  controller: ModelTypeSelectorController,
  template: template(),
});

export default module;
