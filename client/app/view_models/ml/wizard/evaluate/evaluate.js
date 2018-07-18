import angular from 'angular';
import evaluateRegression from './regression';
import evaluateClassification from './classification/classification';
import {
  EvaluateController,
}
from './evaluate.controller';
import template from './evaluate.jade';
import State from './evaluate.state';

import './evaluate.scss';

const module = angular.module('Tellius.viewModels.ml.evaluate', [
  evaluateClassification.name,
  evaluateRegression.name,
]);
module.config(State);
module.component('mlEvaluateViewModel', {
  bindings: {
    options: '<',
    formState: '<',
    modelList: '<',
    measuresData: '<',
  },
  controller: EvaluateController,
  template: template(),
});

export default module;
