import angular from 'angular';
import UploadService from './upload.service';

const module = angular.module('Tellius.services.upload', []);

module.service('UploadService', UploadService);

export default module;
