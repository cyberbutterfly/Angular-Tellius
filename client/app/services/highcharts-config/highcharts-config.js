import angular from 'angular';
import HighchartsConfigService from './highcharts-config.service';
import apiWrapper from '../../api/wrapper/wrapper';

const module = angular.module('Tellius.services.HighchartsConfig', [
	apiWrapper.name,
]);

module.service('HighchartsConfigService', HighchartsConfigService);

export default module;
