import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngDialog from 'ng-dialog';
import 'ng-dialog/css/ngDialog.css';
import 'ng-dialog/css/ngDialog-theme-default.css';

import {
  ColumnTypeCtrl,
}
from './column-type.controller';
import template from './column-type.jade';

const module = angular.module('Tellius.viewModels.transform.grid.columnType', [
  uiRouter,
  ngDialog,
]);

module.component('gridColumnType', {
  bindings: {
    columnName: '<',
    fileType: '<',
  },
  controller: ColumnTypeCtrl,
  template: template(),
});

export default module;
