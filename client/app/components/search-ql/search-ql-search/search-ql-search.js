import angular from 'angular';
import {
  SearchQLSearchController,
}
from './search-ql-search.controller';
import template from './search-ql-search.jade';
import './search-ql-search.scss';

const module = angular.module('Tellius.intelliquery-search', []);

module.component('searchQlSearch', {
  bindings: {
    isActive: '&',
  },
  controller: SearchQLSearchController,
  template: template(),
});

export default module;
