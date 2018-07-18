import angular from 'angular';
import SearchqlService from './search-ql.service';
import {
	SearchQLStrategy,
} from './search-ql.strategy';

const module = angular.module('Tellius.services.Searchql', [

]);

module.service('SearchqlService', SearchqlService);
module.service('SearchQLStrategy', SearchQLStrategy);

export default module;
