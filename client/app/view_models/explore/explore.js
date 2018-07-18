import angular from 'angular';
import uiRouter from 'angular-ui-router';

import controller from './explore.controller';
import template from './explore.jade';
import './explore.styl';

const module = angular.module('Tellius.viewModels.explore', [
  uiRouter,
]);

class Controller {
  /*@ngInject*/
  constructor($state, $rootScope, $dataset, DatasetStorageService) {
    this.DatasetStorageService = DatasetStorageService;

    DatasetStorageService.on('ROOT_DATASET_CHANGED', this._handler, this);
    this.$state = $state;
    const listener = $rootScope.$on('$stateChangeStart', (event, toState) => {
        if (toState.name.indexOf('app.dashboard') === -1) {
          DatasetStorageService.removeListener('ROOT_DATASET_CHANGED', this._handler);
          listener();
        }
      });
  }

  _handler({
    dataset,
  }) {
    if (dataset.id !== this.DatasetStorageService.getCurrent()) {
      this.DatasetStorageService.setCurrent(this.DatasetStorageService.__rootDataset.datasetId, {
        schema: true,
      });
      this.$state.reload(this.$state.current.name);
    }
  }
}

module.config(/*@ngInject*/ ($stateProvider) => {
    $stateProvider
      .state('app.explore', {
        url: 'explore',
        template: `<explore-view-model></explore-view-model>`,
        controller: Controller,
        resolve: {
          $dataset: /*@ngInject*/ datasetResolve => {
            return datasetResolve.getPromise({
              schema: true,
              typeStats: true,
              featurestats: true,
            });
          },
        },
      });
  });

module.component('exploreViewModel', {
  controller,
  template: template(),
});

export default module;
