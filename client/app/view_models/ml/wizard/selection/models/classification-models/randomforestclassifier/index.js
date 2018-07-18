import angular from 'angular';
import controller from './controller';
import template from './template.jade';

const module = angular.module(
  'Tellius.viewModels.ml.models.randomforestclassifier', []);
module.component('randomForestClassifierModel', {
  bindings: {
    targetVariable: '<',
  },
  controller,
  template: template(),
});

export default module;
