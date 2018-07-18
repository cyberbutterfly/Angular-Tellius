import angular from 'angular';
import {
  AdvancedFiltersController,
}
from './advanced-filters.controller';
import template from './advanced-filters.jade';

export default angular
  .module('Tellius.components.advancedFilters', [])
  .component('advancedFilters', {
    bindings: {
      advancedCondition: '=',
    },
    controller: AdvancedFiltersController,
    template: template(),
  });
