import angular from 'angular';
import {
  AdvancedFiltersPopupController,
}
from './advanced-filters.controller';
import template from './advanced-filters.jade';
import State from './advanced-filters.state';

const module = angular.module('Tellius.viewModels.transform.advancedFilters', []);

module.config(State);
module.component('advancedFiltersPopup', {
  bindings: {
    closeThisDialog: '&',
  },
  controller: AdvancedFiltersPopupController,
  template: template(),
});

export default module;
