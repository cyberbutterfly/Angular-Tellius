import angular from 'angular';
import uiRouter from 'angular-ui-router';

import {
  createDatasetXMLController,
}
from './xml.controller';
import template from './xml.jade';
import State from './xml.state';

const module = angular.module('Tellius.viewModel.create.xml', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetXml', {
  bindings: {
    options: '<',
  },
  controller: createDatasetXMLController,
  template: template(),
});

export default module;
