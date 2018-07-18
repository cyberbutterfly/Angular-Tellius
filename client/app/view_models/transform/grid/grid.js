import angular from 'angular';
import uiRouter from 'angular-ui-router';

import ColumnType from './column-type/column-type';
import ColumnHeader from './column-header/column-header';
import ColStats from './col-stats/col-stats';
import ColStatsChart from './col-stats-chart/col-stats-chart';

import {
  GridController,
}
from './grid.controller';
import template from './grid.jade';
import State from './grid.state';

import './grid.scss';

const module = angular.module('Tellius.viewModels.transform.grid', [
  uiRouter,
  ColumnType.name,
  ColumnHeader.name,
  ColStats.name,
  ColStatsChart.name,
]);

module.config(State);
module.component('transformGrid', {
  bindings: {
    dataset: '<',
    selectedColumns: '=',
  },
  controller: GridController,
  template: template(),
});

export default module;
