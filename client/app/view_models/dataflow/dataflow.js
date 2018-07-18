import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './dataflow.state';

import DataflowController from './dataflow.controller';
import template from './dataflow.jade';
import './dataflow.scss';

const module = angular.module('Tellius.viewModels.dataflow', [
  uiRouter,
  '$jsPlumb',
]);
module.config(State);

module.component('dataflowView', {
    bindings: {
        data: '<',
    },
    controller: DataflowController,
    controllerAs: 'vm',
    template: template(),
});

module.directive('default', /*@ngInject*/ function jsPlumbNodeTemplate(jsPlumbFactory) {
    return jsPlumbFactory.node({
      inherit: ['deleteNode', 'exploreNode', 'editNodeText'],
      templateUrl: 'default_template.tpl',
    });
});

export default module;
