import angular from 'angular';

import {
  SearchQLDatasetController,
}
from './search-ql-dataset.controller';
import template from './search-ql-dataset.jade';
import './search-ql-dataset.scss';

const module = angular.module('Tellius.components.searchQLDataset', []);

module.component('searchQlDataset', {
  bindings: {
    datasets: '<',
    onChangeDataset: '&',
  },
  controller: SearchQLDatasetController,
  template: template(),
});

export default module;
