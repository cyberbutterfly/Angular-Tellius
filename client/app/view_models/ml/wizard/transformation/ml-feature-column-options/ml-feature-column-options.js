import angular from 'angular';
import {
  FeatureColumnOptionController,
}
from './ml-feature-column-options.controller';
import template from './ml-feature-column-options.jade';

const module = angular.module('Tellius.ml.mlFeatureColumnOptions', []);
module.component('mlFeatureColumnOptions', {
  bindings: {
    column: '<',
    onChange: '&',
  },
  controller: FeatureColumnOptionController,
  template: template(),
});

export default module;
