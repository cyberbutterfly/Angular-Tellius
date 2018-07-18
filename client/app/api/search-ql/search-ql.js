import angular from 'angular';
import {
  SearchQLModel,
}
from './search-ql.model';

const module = angular.module('Tellius.api.SearchQL', []);
module.service('SearchQLModel', SearchQLModel);

export default module;
