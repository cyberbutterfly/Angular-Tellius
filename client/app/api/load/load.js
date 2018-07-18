import angular from 'angular';

import Service from './load.service';

const module = angular.module('Tellius.api.load', []);

module.service('LoadAPI', Service);

export default module;
