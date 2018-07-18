import angular from 'angular';
import {
  ColStatsChartController,
  }
from './col-stats-chart.controller';
import template from './col-stats-chart.jade';

const module = angular.module('Tellius.viewModels.transform.colStatsChart', []);
module.component('colStatsChart', {
    bindings: {
        colStatsChartData: '<',
        selectedStatsColumn: '<',
    },
    controller: ColStatsChartController,
    template: template(),
});

export default module;
