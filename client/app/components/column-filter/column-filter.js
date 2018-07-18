import angular from 'angular';
import {
  ColumnFilterController,
}
from './column-filter.controller';
import template from './column-filter.jade';

export default angular
  .module('Tellius.components.columnFilter', [])
  .component('columnFilter', {
    bindings: {
      columnName: '<',
      columnType: '<',
      showCondition: '<',
      condition: '=',
    },
    controller: ColumnFilterController,
    template: template(),
  });
