import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= name %>Component from './<%= name %>.component';

/**
 * @ngdoc module
 * @name <%= name %>
 * @public
 */
let <%= name %>Module = angular.module('Tellius.<%= name %>', [
  uiRouter,
])

.directive('<%= name %>', <%= name %>Component);

export default <%= name %>Module;
