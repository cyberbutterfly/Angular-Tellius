import angular from 'angular';
import State from './mongodb.state';
import {
  MongoDBController,
}
from './mongodb.controller';
import template from './mongodb.jade';

const module = angular.module('Tellius.dataset.create.mongodb', []);

module.config(State);
module.component('mongodbViewModel', {
  bindings: {
    options: '<',
  },
  controller: MongoDBController,
  template: template(),
});

export default module;
