import angular from 'angular';
import {
  DecisionTreeClassifierController,
}
from './decisiontreeclassifier.controller';
import template from './decisiontreeclassifier.jade';

const module = angular.module(
  'Tellius.viewModels.ml.models.decisiontreeclassifier', []);
module.component('decisionTreeClassifierModel', {
  bindings: {
    targetVariable: '<',
  },
  controller: DecisionTreeClassifierController,
  template: template(),
});

export default module;
