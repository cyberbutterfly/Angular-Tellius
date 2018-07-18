import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AppliedVizpadFilterComponent from './applied-vizpad-filter.component';

const AppliedVizpadFilterModule = angular.module('Tellius.viewModels.appliedVizpadFilter', [
  uiRouter,
])

.directive('appliedVizpadFilter', () => new AppliedVizpadFilterComponent);

export default AppliedVizpadFilterModule;