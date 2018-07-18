class Controller {
  /*@ngInject*/
  constructor($scope, $rootScope, $dataset, DatasetStorageService) {
    this.DatasetStorageService = DatasetStorageService;

    DatasetStorageService.on('ROOT_DATASET_CHANGED', this._handler, this);
    $scope.dataset = $dataset;
    const listener = $rootScope.$on('$stateChangeStart', (event, toState) => {
        if (toState.name.indexOf('app.transform') === -1) {
          DatasetStorageService.removeListener('ROOT_DATASET_CHANGED', this._handler);
          listener();
        }
      });
  }

  _handler({
    dataset,
  }) {
    if (dataset.id !== this.DatasetStorageService.getCurrent()) {
      this.DatasetStorageService.setCurrent(dataset.datasetId, {
        typeStats: true,
        data: true,
        metadata: true,
        schema: true,
      });
    }
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.transform', {
      url: 'transform',
      redirectTo: 'app.transform.grid',
      template: `<transform-view-model dataset="dataset"></transform-view-model>`,
      controller: Controller,
      resolve: {
        $dataset: /*@ngInject*/ datasetResolve => {
          return datasetResolve.getPromise({
            data: true,
            metadata: true,
            schema: true,
            typeStats: true,
          });
        },
      },
    });
};

export default State;
