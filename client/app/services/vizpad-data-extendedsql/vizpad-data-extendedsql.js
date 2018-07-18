import angular from 'angular';
import VizpadDataExtendedSqlService from './vizpad-data-extendedsql.service';

const module = angular.module('Tellius.services.VizpadDataExtendedSql', []);

module.service('VizpadDataExtendedSqlService', VizpadDataExtendedSqlService);

export default module;
