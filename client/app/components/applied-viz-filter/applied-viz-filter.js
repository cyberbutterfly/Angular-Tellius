import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AppliedVizFilterComponent from './applied-viz-filter.component';

const AppliedVizFilterModule = angular.module('Tellius.viewModels.appliedVizFilter', [
  uiRouter,
])

.directive('appliedVizFilter', () => new AppliedVizFilterComponent);

export default AppliedVizFilterModule;