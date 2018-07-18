import angular from 'angular';
import { MLStorageService } from './ml-storage.service';

const module = angular.module('Tellius.services.MLStorageService', []);
module.service('MLStorageService', () => new MLStorageService);

export default module;
