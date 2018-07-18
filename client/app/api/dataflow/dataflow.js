import angular from 'angular';

import {
  DataflowAPI,
  }
from './dataflow.service';
import {
  DataflowAPIMock,
}
from './dataflow.mock';

const module = angular.module('Tellius.api.dataflow', []);
module.service('DataflowAPI', DataflowAPI);
module.service('DataflowAPIMock', DataflowAPIMock);

export default module;
