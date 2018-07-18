import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'javascript-detect-element-resize';

import Ctrl from './vizpad.controller';
import template from './vizpad.jade';

import Chartview from './chartview/chartview';
import VizpadView from './vizpad-view/vizpad-view';
import VizLibrary from './viz-library/viz-library';
import Viz from './viz/viz';

const module = angular.module('Tellius.viewModels.vizpad', [
  uiRouter,
  Chartview.name,
  VizpadView.name,
  VizLibrary.name,
  Viz.name,
]);

class Controller {
  /*@ngInject*/
  constructor($state, $rootScope, $dataset, DatasetStorageService) {
    this.DatasetStorageService = DatasetStorageService;

    DatasetStorageService.on('ROOT_DATASET_CHANGED', this._handler, this);
    this.$state = $state;
    const listener = $rootScope.$on('$stateChangeStart', (event, toState) => {
        if (toState.name.indexOf('app.vizpad') === -1) {
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
        featurestats: true,
      });
      this.$state.reload(this.$state.current.name);
    }
  }
}

module
  .config( /*@ngInject*/ $stateProvider => {
    $stateProvider
      .state('app.vizpad', {
        url: 'viz-pad',
        abstract: true,
        template: `<vizpad-view-model></vizpad-view-model>`,
        parent: 'app',
        controller: Controller,
        resolve: {
          $dataset: /*@ngInject*/ datasetResolve => {
            return datasetResolve.getPromise({
              schema: true,
              featurestats: true,
            });
          },
        },
      });
  });

class Component {
  constructor() {
    this.restrict = 'AE';
    this.scope = {};
    this.template = template;
    this.controller = Ctrl;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}

/**
 * @ngdoc directive
 * @name datasetViewModel
 * @public
 */
module.directive('vizpadViewModel', () => new Component);

export default module;
