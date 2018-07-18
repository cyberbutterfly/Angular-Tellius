import angular from 'angular';
import DecisionTreeClassifier from
  './decisiontreeclassifier/decisiontreeclassifier';
import RandomForestClassifier from './randomforestclassifier';
import GBTClassifier from './gbtclassifier';
import {
  ClassificationModelsController,
}
from './classification-models.controller';
import template from './classification-models.jade';

const module = angular.module('Tellius.viewModels.ml.models.classification', [
  RandomForestClassifier.name,
  DecisionTreeClassifier.name,
  GBTClassifier.name,
]);
module.component('classificationModels', {
  bindings: {
    selectedModels: '<',
    targetVariable: '<',
  },
  controller: ClassificationModelsController,
  template: template(),
});

export default module;
