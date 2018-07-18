import angular from 'angular';
import SetupVizService from './setup-viz.service';

const module = angular.module('Tellius.services.SetupViz', []);

module.service('SetupVizService', SetupVizService);

export default module;
