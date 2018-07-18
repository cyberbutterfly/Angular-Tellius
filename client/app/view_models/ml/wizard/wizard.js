import angular from 'angular';
import Selection from './selection/selection';
import Transformation from './transformation/transformation';
import Evaluate from './evaluate/evaluate';
import Charts from './charts/charts';
import Use from './use/use';
import ModelTypeSelector from './model-type-selector/model-type-selector';
import State from './wizard.state';
import template from './wizard.jade';
import MLWizard from './wizard.class';

import './wizard.scss';

const module = angular.module('Tellius.viewModels.ml.wizard', [
  Selection.name,
  Transformation.name,
  Evaluate.name,
  Use.name,
  Charts.name,
  ModelTypeSelector.name,
]);

module.config(State);
module.component('mlWizardViewModel', {
  template: template(),
  controller: angular.noop,
});
module.service('MLWizard', MLWizard);

export default module;
