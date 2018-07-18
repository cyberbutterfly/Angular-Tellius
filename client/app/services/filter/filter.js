import angular from 'angular';
import { FilterService } from './filter.service';

export default angular
  .module('Tellius.services.filter', [])
  .service('FilterService', FilterService);
