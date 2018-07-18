import angular from 'angular';
import { FusionAPI } from './fusion.service';

export default angular
  .module('Tellius.api.fusion', [])
  .service('FusionAPI', FusionAPI);
