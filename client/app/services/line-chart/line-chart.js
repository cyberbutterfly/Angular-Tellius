import angular from 'angular';
import LineChartService from './line-chart.service';

const module = angular.module('Tellius.services.LineChart', []);

module.service('LineChartService', LineChartService);

export default module;
