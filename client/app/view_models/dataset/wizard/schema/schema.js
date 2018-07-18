import angular from 'angular';
import treeControl from 'angular-tree-control';
import 'angular-tree-control/css/tree-control.css';
import State from './schema.state';
import {
  SchemaController,
}
from './schema.controller';
import template from './schema.jade';
import './schema.scss';

const module = angular.module('Tellius.viewModels.create.schema', [
  treeControl,
]);

module.config(State);
module.component('datasetSchema', {
  bindings: {
    options: '<',
    schema: '<',
    columns: '<',
  },
  controller: SchemaController,
  template: template(),
});

export default module;
