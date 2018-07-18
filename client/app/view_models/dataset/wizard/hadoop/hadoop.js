import angular from 'angular';
import State from './hadoop.state';
import {
  HadoopController,
}
from './hadoop.controller';
import template from './hadoop.jade';

const module = angular.module('Tellius.dataset.create.hadoop', []);

module.config(State);
module.component('hadoopComponent', {
  bindings: {
    options: '<',
  },
  controller: HadoopController,
  template: template(),
});

export default module;
