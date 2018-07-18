import angular from 'angular';

import SearchQLSearch from './search-ql-search/search-ql-search';
import SearchQLDataset from './search-ql-dataset/search-ql-dataset';

import {
  SearchQLController,
}
from './search-ql.controller';
import template from './search-ql.jade';
import './search-ql.scss';

const module = angular.module('Tellius.components.SearchQL', [
  SearchQLSearch.name,
  SearchQLDataset.name,
]);

module.component('searchQl', {
  controller: SearchQLController,
  template: template(),
});

export default module;
