import angular from 'angular';
import {
  ColStatsController,
}
from './col-stats.controller';
import template from './col-stats.jade';
import './col-stats.scss';

const module = angular.module('Tellius.viewModels.transform.colStats', []);
module.component('colStats', {
  bindings: {
      selectedStatsColumn: '=',
  },
  controller: ColStatsController,
  template: template(),
});

export default module;
