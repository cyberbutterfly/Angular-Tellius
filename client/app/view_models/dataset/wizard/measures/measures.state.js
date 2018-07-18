import {
  isNull,
}
from 'lodash/lang';

class Controller {
  /*@ngInject*/
  constructor($scope, $columns, $columnTypes, $state, $stateParams) {
    $scope.sourceId = $stateParams.sourceId;
    $scope.options = $stateParams.options;
    $scope.columnTypes = $columnTypes;
    $scope.columns = $columns;
  }
}

/*@ngInject*/
const $columns = ($q, $state, $stateParams, $timeout, DatasetAPI) => {
  const dfd = $q.defer();

  $timeout(() => {
    if (isNull($stateParams.options)) {
      $state.go('app.dataset.create');
      dfd.reject();
    } else {
      const {
        sourceId,
      } = $stateParams.options;

      return DatasetAPI.getDataset({
          sourceId: sourceId,
          schema: true,
        })
        .then(dataset => {
          return dataset.columns;
        })
        .then(res => dfd.resolve(res));
    }
  });

  return dfd.promise;
};

/*@ngInject*/
const $columnTypes = ($q, $state, $timeout, DatasetAPI, $stateParams) => {
  const dfd = $q.defer();

  $timeout(() => {
    if (isNull($stateParams.options)) {
      $state.go('app.dataset.create');
      dfd.reject();
    } else {
      return DatasetAPI.getDataset({
          sourceId: $stateParams.options.sourceId,
          featureStats: true,
        })
        .then(dataset => {
          return dataset.featurestats
            .map(i => {
              return {
                type: i.featureType,
                name: i.columnName,
              };
            })
            .reduce((prev, i) => {
              if (prev[i.type] && prev[i.type].length) {
                prev[i.type].push(i.name);
              } else {
                prev[i.type] = [i.name];
              }
              return prev;
            }, {});
        })
        .then(res => {
          dfd.resolve(res);
        });
    }
  });

  return dfd.promise;
};

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset.wizard.measures', {
      url: '/measures',
      template: `<dataset-measures-view-model
      source-id='sourceId'
      column-types='columnTypes'
      columns='columns'
      options='options'></dataset-measures-view-model>`,
      params: {
        options: null,
      },
      controller: Controller,
      resolve: {
        $columns,
        $columnTypes,
      },
    });
};

export default State;
